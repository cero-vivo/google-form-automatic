'use client';

import React, { useState } from 'react';
import { FileImportFormCreator } from '@/components/organisms/FileImportFormCreator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCredits } from '@/containers/useCredits';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

interface FileImportPageProps {
  searchParams: Promise<{
    onFormCreated?: string;
    draftId?: string;
  }>;
}

export default function FileImportPage({ searchParams }: FileImportPageProps) {
  const [resolvedSearchParams, setResolvedSearchParams] = useState<{ onFormCreated?: string; draftId?: string }>({});
  const router = useRouter();
  const { currentCredits } = useCredits();

  React.useEffect(() => {
    searchParams.then(setResolvedSearchParams);
  }, [searchParams]);
  
  const handleFormCreated = (formData: any) => {
/*     if (resolvedSearchParams.onFormCreated) {
      router.push(resolvedSearchParams.onFormCreated);
    }  */
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center min-w-0">
              <Button variant="ghost" size="sm" asChild className="p-2 h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center ml-2 min-w-0">
                <Logo className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />
                <div className="ml-2 min-w-0">
                  <h1 className="text-base sm:text-lg md:text-xl font-bold text-primary truncate">
                    File Creator
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block truncate">
                    Import questions from files
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center flex-shrink-0">
              <div className="text-right">
                <p className="text-sm font-medium hidden sm:block">File Upload</p>
                <p className="text-xs text-muted-foreground">
                  {currentCredits} <span className="hidden sm:inline">credits</span>
                  <span className="sm:hidden">crd.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <FileImportFormCreator 
          onFormCreated={handleFormCreated} 
          currentCredits={currentCredits} 
          draftId={resolvedSearchParams.draftId}
        />
      </main>
    </div>
  );
}