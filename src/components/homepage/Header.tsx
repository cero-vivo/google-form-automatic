'use client';

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/containers/useAuth";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export const Header = ({ isMenuOpen, setIsMenuOpen }: HeaderProps) => {
  const { user, loading } = useAuthContext();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const AuthArea = () => {
    if (!isMounted) {
      return <div className="w-28 h-10 bg-gray-200 rounded" />;
    }
    if (loading) {
      return <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>;
    }
    if (user) {
      return (
        <Button variant="ghost" asChild className="flex items-center space-x-2 p-2">
          <Link href="/dashboard">
            {user.photoURL ? (
              <Image src={user.photoURL} alt={user.displayName || 'Usuario'} width={32} height={32} className="w-8 h-8 rounded-full ring-2 ring-[#22A565]" />
            ) : (
              <div className="w-8 h-8 bg-velocity rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user.displayName?.charAt(0) || user.email?.charAt(0)}</span>
              </div>
            )}
            <span className="hidden sm:inline text-sm font-medium text-excel">{user.displayName}</span>
          </Link>
        </Button>
      );
    }
    return (
      <Button className="btn-modern text-white font-semibold px-6 py-2">
        <Link href="/auth/login" className="flex items-center">
          Iniciar con Google
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    );
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
          <span className="text-xl sm:text-2xl font-bold text-velocity">FastForm</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link href="#features" className="text-primary hover:text-velocity transition-all duration-300 font-medium relative group text-sm lg:text-base">
            Características
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-velocity transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/pricing" className="text-primary hover:text-velocity transition-all duration-300 font-medium relative group text-sm lg:text-base">
            Precios
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-velocity transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/docs" className="text-primary hover:text-velocity transition-all duration-300 font-medium relative group text-sm lg:text-base">
            Documentación
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-velocity transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/blog" className="text-primary hover:text-velocity transition-all duration-300 font-medium relative group text-sm lg:text-base">
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-velocity transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:block">
            <AuthArea />
          </div>
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Abrir menú"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10">
          <nav className="px-4 py-4 space-y-3">
            <Link href="#features" className="block text-primary hover:text-velocity transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              Características
            </Link>
            <Link href="/pricing" className="block text-primary hover:text-velocity transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              Precios
            </Link>
            <Link href="/docs" className="block text-primary hover:text-velocity transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              Documentación
            </Link>
            <Link href="/blog" className="block text-primary hover:text-velocity transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              Blog
            </Link>
            <div className="pt-4 border-t border-white/10">
              <AuthArea />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};