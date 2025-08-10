import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
  deleteUser,
  User as FirebaseUser,
  UserCredential,
  Auth
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, COLLECTIONS } from './config';
import { UserEntity } from '@/domain/entities/user';

export interface AuthService {
  signInWithEmail(email: string, password: string): Promise<FirebaseUser>;
  signUpWithEmail(email: string, password: string, displayName: string): Promise<FirebaseUser>;
  signInWithGoogle(): Promise<FirebaseUser>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  updateUserProfile(displayName?: string, photoURL?: string): Promise<void>;
  updateUserPassword(currentPassword: string, newPassword: string): Promise<void>;
  deleteUserAccount(): Promise<void>;
  getCurrentUser(): FirebaseUser | null;
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void;
}

class FirebaseAuthService implements AuthService {
  private auth: Auth;
  private googleProvider: GoogleAuthProvider;

  constructor() {
    this.auth = auth;
    this.googleProvider = new GoogleAuthProvider();
    
    // Configurar Google Provider
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');
    // Agregar scopes específicos para Google Forms API
    this.googleProvider.addScope('https://www.googleapis.com/auth/forms');
    this.googleProvider.addScope('https://www.googleapis.com/auth/drive');
    this.googleProvider.setCustomParameters({
      prompt: 'select_account',
      access_type: 'offline'
    });

    // Verificar configuración básica
    this.validateFirebaseSetup();
  }

  private validateFirebaseSetup() {
    if (!this.auth.app.options.apiKey || this.auth.app.options.apiKey === 'demo-api-key') {
      console.warn('⚠️ Firebase no está configurado correctamente. Verifica las variables de entorno.');
    }
  }

  async signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.auth, 
        email, 
        password
      );
      
      const user = userCredential.user;
      
      // Actualizar último login
      await this.updateUserDocument(user.uid, {
        lastLoginAt: new Date(),
        updatedAt: new Date()
      });

      console.log('✅ Firebase sign in successful:', user.email);
      return user;
    } catch (error: any) {
      console.error('❌ Firebase sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  async signUpWithEmail(email: string, password: string, displayName: string): Promise<FirebaseUser> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      
      const user = userCredential.user;

      // Actualizar perfil con displayName
      await updateProfile(user, {
        displayName: displayName
      });

      // Crear documento de usuario en Firestore
      await this.createUserDocument(user, displayName);

      console.log('✅ Firebase sign up successful:', user.email);
      return user;
    } catch (error: any) {
      console.error('❌ Firebase sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  async signInWithGoogle(): Promise<FirebaseUser> {
    try {
      const userCredential: UserCredential = await signInWithPopup(
        this.auth,
        this.googleProvider
      );
      
      const user = userCredential.user;
      
      // Obtener el token de acceso de Google
      const credential = GoogleAuthProvider.credentialFromResult(userCredential);
      const accessToken = credential?.accessToken;
      
      // Verificar si es usuario nuevo o existente
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
      
      if (!userDoc.exists()) {
        // Usuario nuevo - crear documento
        await this.createUserDocument(user, user.displayName || 'Usuario', accessToken);
      } else {
        // Usuario existente - actualizar último login y tokens
        const updates: any = {
          lastLoginAt: new Date(),
          updatedAt: new Date()
        };
        
        if (accessToken) {
          updates.googleAccessToken = accessToken;
          // Los tokens de OAuth suelen expirar en 1 hora
          updates.googleTokenExpiry = new Date(Date.now() + 3600 * 1000);
        }
        
        await this.updateUserDocument(user.uid, updates);
      }

      console.log('✅ Google sign in successful:', user.email);
      return user;
    } catch (error: any) {
      console.error('❌ Google sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
      console.log('✅ Firebase sign out successful');
    } catch (error: any) {
      console.error('❌ Firebase sign out error:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('✅ Password reset email sent');
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  async updateUserProfile(displayName?: string, photoURL?: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    try {
      const updates: any = {};
      if (displayName !== undefined) updates.displayName = displayName;
      if (photoURL !== undefined) updates.photoURL = photoURL;

      await updateProfile(user, updates);

      // Actualizar también en Firestore
      await this.updateUserDocument(user.uid, {
        ...updates,
        updatedAt: new Date()
      });

      console.log('✅ Profile updated successfully');
    } catch (error: any) {
      console.error('❌ Profile update error:', error);
      throw new Error('Error al actualizar perfil');
    }
  }

  async updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user || !user.email) {
      throw new Error('No hay usuario autenticado');
    }

    try {
      // Re-autenticar usuario con contraseña actual
      await signInWithEmailAndPassword(this.auth, user.email, currentPassword);
      
      // Actualizar contraseña
      await firebaseUpdatePassword(user, newPassword);

      console.log('✅ Password updated successfully');
    } catch (error: any) {
      console.error('❌ Password update error:', error);
      throw this.handleAuthError(error);
    }
  }

  async deleteUserAccount(): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    try {
      // Eliminar documento de Firestore
      await deleteDoc(doc(db, COLLECTIONS.USERS, user.uid));
      
      // Eliminar cuenta de Authentication
      await deleteUser(user);

      console.log('✅ Account deleted successfully');
    } catch (error: any) {
      console.error('❌ Account deletion error:', error);
      throw new Error('Error al eliminar cuenta');
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return this.auth.onAuthStateChanged(callback);
  }

  // Métodos privados
  private async createUserDocument(user: FirebaseUser, displayName: string, accessToken?: string): Promise<void> {
    const userEntity = new UserEntity(
      user.uid,
      user.email || '',
      displayName,
      user.emailVerified,
      user.photoURL || undefined
    );

    // Si tenemos accessToken, agregarlo a la entidad
    if (accessToken) {
      userEntity.updateGoogleTokens(
        accessToken,
        undefined, // No tenemos refresh token desde Firebase Auth
        new Date(Date.now() + 3600 * 1000) // Expira en 1 hora
      );
    }

    // Usar toSafeJSON() para evitar datos sensibles y crear datos seguros para Firestore
    const userData = userEntity.toSafeJSON();

    // Crear datos específicos para Firestore con timestamps
    const firestoreData = {
      id: userData.id,
      email: userData.email,
      displayName: userData.displayName,
      emailVerified: userData.emailVerified,
      ...(userData.photoURL && { photoURL: userData.photoURL }),
      ...(userData.phoneNumber && { phoneNumber: userData.phoneNumber }),
      preferences: userData.preferences,
      totalForms: userData.totalForms,
      totalResponses: userData.totalResponses,
      plan: userData.plan,
      ...(userData.subscriptionId && { subscriptionId: userData.subscriptionId }),
      ...(userData.subscriptionExpiry && { subscriptionExpiry: userData.subscriptionExpiry }),
      // Agregar tokens de Google si están disponibles
      ...(accessToken && { 
        googleAccessToken: accessToken,
        googleTokenExpiry: new Date(Date.now() + 3600 * 1000)
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date()
    };

    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), firestoreData);

    console.log('✅ User document created in Firestore');
  }

  private async updateUserDocument(userId: string, updates: any): Promise<void> {
    try {
      // Crear objeto limpio solo con campos que no sean undefined
      const cleanUpdates: any = {};
      
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined && value !== null) {
          cleanUpdates[key] = value;
        }
      }
      
      // Solo actualizar si hay campos válidos
      if (Object.keys(cleanUpdates).length > 0) {
        await updateDoc(doc(db, COLLECTIONS.USERS, userId), cleanUpdates);
        console.log('✅ User document updated in Firestore');
      }
    } catch (error) {
      console.error('❌ Error updating user document:', error);
      // No lanzar error aquí para no interrumpir el flujo principal
    }
  }



  private handleAuthError(error: any): Error {
    console.error('Firebase Auth Error:', error);

    switch (error.code) {
      case 'auth/user-not-found':
        return new Error('No existe una cuenta con este email');
      case 'auth/wrong-password':
        return new Error('Contraseña incorrecta');
      case 'auth/email-already-in-use':
        return new Error('Este email ya está registrado');
      case 'auth/weak-password':
        return new Error('La contraseña debe tener al menos 6 caracteres');
      case 'auth/invalid-email':
        return new Error('Email inválido');
      case 'auth/user-disabled':
        return new Error('Esta cuenta ha sido deshabilitada');
      case 'auth/too-many-requests':
        return new Error('Demasiados intentos. Inténtalo más tarde');
      case 'auth/popup-closed-by-user':
        return new Error('Inicio de sesión cancelado');
      case 'auth/popup-blocked':
        return new Error('Popup bloqueado. Permite popups para continuar');
      case 'auth/requires-recent-login':
        return new Error('Necesitas iniciar sesión nuevamente para esta acción');
      case 'permission-denied':
      case 'auth/missing-or-insufficient-permissions':
        return new Error('Permisos insuficientes. Verifica la configuración de Firebase');
      case 'auth/configuration-not-found':
        return new Error('Firebase no está configurado correctamente');
      case 'auth/network-request-failed':
        return new Error('Error de conexión. Verifica tu internet');
      default:
        return new Error(error.message || 'Error de autenticación');
    }
  }
}

// Singleton instance
export const firebaseAuthService = new FirebaseAuthService(); 