'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { FileText, CreditCard, ArrowLeft } from 'lucide-react';
import { User } from 'firebase/auth';
import { AuthUser } from '@/containers/useAuth';

interface DashboardHeaderProps {
  user: AuthUser | null | null;
  currentCredits: number;
  creditsLoading: boolean;
  isLoadingForms: boolean;
  userFormsCount: number;
  onToggleFormsList: () => void;
  onSignOut: () => void;
}

export function DashboardHeader({
  user,
  currentCredits,
  creditsLoading,
  isLoadingForms,
  userFormsCount,
  onToggleFormsList,
  onSignOut
}: DashboardHeaderProps) {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
          <div className="flex items-center space-x-2">
            <Logo className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold text-primary">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Crea y gestiona tus formularios</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleFormsList}
            disabled={isLoadingForms}
          >
            <FileText className="h-4 w-4 mr-2" />
            {isLoadingForms ? 'Cargando...' : 'Mis formularios'}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            asChild
            className="relative"
          >
            <Link href="/dashboard/credits">
              <CreditCard className="h-4 w-4 mr-2" />
              Créditos
              {creditsLoading ? (
                <div className="ml-2 h-5 w-8 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <Badge 
                  variant={currentCredits > 0 ? "secondary" : "destructive"}
                  className={`ml-2 ${
                    currentCredits > 0 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {currentCredits > 0 ? currentCredits : '0'}
                </Badge>
              )}
            </Link>
          </Button>
          
          <div className="flex items-center space-x-2">
            {user?.photoURL && (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'Usuario'}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{user?.displayName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onSignOut}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
}