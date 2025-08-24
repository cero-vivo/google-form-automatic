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
  }>;
}

export default function FileImportPage({ searchParams }: FileImportPageProps) {
  const [resolvedSearchParams, setResolvedSearchParams] = useState<{ onFormCreated?: string }>({});
  const router = useRouter();
  const { currentCredits } = useCredits();

  React.useEffect(() => {
    searchParams.then(setResolvedSearchParams);
  }, [searchParams]);
  
  const handleFormCreated = (formData: any) => {
    if (resolvedSearchParams.onFormCreated) {
      router.push(resolvedSearchParams.onFormCreated);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Logo className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold text-primary">File Form Creator</h1>
                <p className="text-sm text-muted-foreground">Import questions from files</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium">File Upload</p>
              <p className="text-xs text-muted-foreground">{currentCredits} credits available</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <FileImportFormCreator 
          onFormCreated={handleFormCreated} 
          currentCredits={currentCredits} 
        />
      </main>
    </div>
  );
}