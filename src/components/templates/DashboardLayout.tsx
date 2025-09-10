'use client';

import { ReactNode, useState } from 'react';
import { useAuth } from '@/containers/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  Upload, 
  CreditCard, 
  Settings, 
  LogOut,
  Sparkles,
  MessageCircle,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Vista general'
    },
    {
      name: 'Crear con IA',
      href: '/ai-chat',
      icon: Sparkles,
      description: 'Chat con inteligencia artificial',
      badge: 'Nuevo'
    },
    {
      name: 'Subir Archivo',
      href: '/create',
      icon: Upload,
      description: 'Convertir CSV/Excel'
    },
    {
      name: 'Mis Formularios',
      href: '/dashboard/forms',
      icon: FileText,
      description: 'Gestionar formularios'
    },
    {
      name: 'Créditos',
      href: '/dashboard/credits',
      icon: CreditCard,
      description: 'Comprar créditos'
    },
    {
      name: 'Configuración',
      href: '/dashboard/settings',
      icon: Settings,
      description: 'Preferencias'
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className={cn(
          "hidden md:flex flex-col bg-card border-r transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}>
          <div className="flex-1 space-y-4 py-4">
            {/* Logo */}
            <div className="px-3 py-2">
              <div className="flex items-center space-x-2">
                <Logo className="w-8 h-8" />
                {!isCollapsed && (
                  <span className="text-lg font-bold">FastForm</span>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="px-3 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left",
                      isCollapsed && "justify-center"
                    )}
                    onClick={() => router.push(item.href)}
                  >
                    <item.icon className={cn(
                      "h-4 w-4",
                      !isCollapsed && "mr-3"
                    )} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* User Section */}
          <div className="border-t p-3">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.displayName || 'Usuario'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full mt-2",
                isCollapsed && "justify-center"
              )}
              onClick={handleSignOut}
            >
              <LogOut className={cn(
                "h-4 w-4",
                !isCollapsed && "mr-2"
              )} />
              {!isCollapsed && "Cerrar sesión"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Home className="h-4 w-4" />
      </Button>
    </div>
  );
}