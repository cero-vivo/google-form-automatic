import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/infrastructure/firebase/config';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Verificar si el email ya existe
    const q = query(
      collection(db, 'newsletter'),
      where('email', '==', normalizedEmail)
    );
    const existingSubscription = await getDocs(q);

    if (!existingSubscription.empty) {
      return NextResponse.json(
        { message: 'Ya estás suscrito a nuestro newsletter' },
        { status: 200 }
      );
    }

    // Agregar nuevo suscriptor
    await addDoc(collection(db, 'newsletter'), {
      email: normalizedEmail,
      subscribedAt: serverTimestamp(),
      active: true,
      source: 'blog',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    return NextResponse.json(
      { message: '¡Te has suscrito exitosamente!' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error al procesar suscripción:', error);
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const q = query(
      collection(db, 'newsletter'),
      where('active', '==', true)
    );
    const subscriptionsSnapshot = await getDocs(q);

    const subscriptions = subscriptionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ subscriptions }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener suscripciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener suscripciones' },
      { status: 500 }
    );
  }
}