'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, CreditCard, Menu, X } from 'lucide-react';
import { AuthUser } from '@/containers/useAuth';
import { DraftModal } from '../organisms/DraftModal';
import { FormDraft } from '@/infrastructure/services/DraftService';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Logo className="w-7 h-7 sm:w-8 sm:h-8" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-primary">Dashboard</h1>
            <p className="hidden sm:block text-sm text-muted-foreground">Crea y gestiona tus formularios</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          {/* Desktop buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFormsList}
            disabled={isLoadingForms}
            className="hidden sm:flex"
          >
            <FileText className="h-4 w-4 mr-1 sm:mr-2" />
            {isLoadingForms ? 'Cargando...' : 'Publicados'}
          </Button>

          <DraftModal
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex"
              >
                <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                Borradores
              </Button>
            }
            onSelectBuilder={(draft: FormDraft, builderType: 'ai' | 'manual' | 'file') => {
              const params = new URLSearchParams();
              params.set('draftId', draft.id);
              params.set('builder', builderType);
              
              router.push(`/create?${params.toString()}`);
            }}
          />
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="relative hidden sm:flex"
          >
            <Link href="/dashboard/credits">
              <CreditCard className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Créditos</span>
              {creditsLoading ? (
                <div className="ml-1 sm:ml-2 h-5 w-8 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <Badge
                  variant={currentCredits > 0 ? "secondary" : "destructive"}
                  className={`ml-1 sm:ml-2 px-1.5 text-xs ${currentCredits > 0
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                  {currentCredits > 0 ? currentCredits : '0'}
                </Badge>
              )}
            </Link>
          </Button>

          <div className="hidden sm:flex items-center space-x-1 sm:space-x-2">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Usuario'}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
              />
            )}
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.displayName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="px-2 sm:px-3 hidden sm:flex"
          >
            <span className="hidden sm:inline">Cerrar Sesión</span>
            <span className="sm:hidden">Salir</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t bg-white px-4 py-3">
          <div className="flex flex-col space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFormsList}
              disabled={isLoadingForms}
              className="w-full justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              {isLoadingForms ? 'Cargando...' : 'Publicados'}
            </Button>

            <DraftModal
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Borradores
                </Button>
              }
              onSelectBuilder={(draft: FormDraft, builderType: 'ai' | 'manual' | 'file') => {
                const params = new URLSearchParams();
                params.set('draftId', draft.id);
                params.set('builder', builderType);
                
                router.push(`/create?${params.toString()}`);
              }}
            />
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full justify-start"
            >
              <Link href="/dashboard/credits">
                <CreditCard className="h-4 w-4 mr-2" />
                Créditos
                {creditsLoading ? (
                  <div className="ml-2 h-5 w-8 rounded-full bg-gray-200 animate-pulse" />
                ) : (
                  <Badge
                    variant={currentCredits > 0 ? "secondary" : "destructive"}
                    className={`ml-2 px-1.5 text-xs ${currentCredits > 0
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                  >
                    {currentCredits > 0 ? currentCredits : '0'}
                  </Badge>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="w-full justify-start"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}