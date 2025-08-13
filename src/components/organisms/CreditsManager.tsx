'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Plus, 
  FileText, 
  TrendingUp, 
  Calendar,
  ShoppingCart,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

import { CreditTransaction } from '@/types/credits';

interface CreditsManagerProps {
  currentCredits: number;
  totalCreditsPurchased: number;
  totalCreditsUsed: number;
  transactions: CreditTransaction[];
}

interface CreditsManagerProps {
  currentCredits: number;
  totalCreditsPurchased: number;
  totalCreditsUsed: number;
  transactions: CreditTransaction[];
}

export default function CreditsManager({
  currentCredits,
  totalCreditsPurchased,
  totalCreditsUsed,
  transactions
}: CreditsManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [visibleTransactions, setVisibleTransactions] = useState(10);

  // Calcular estadísticas
  const usagePercentage = totalCreditsPurchased > 0 ? (totalCreditsUsed / totalCreditsPurchased) * 100 : 0;
  const remainingCredits = currentCredits;

  // Formatear fecha
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Obtener icono según el tipo de transacción
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'use':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  // Filtrar transacciones para mostrar solo las completadas
  const completedTransactions = transactions.filter(t => t.status === 'completed');

  // Obtener color del badge según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header de créditos */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Créditos</h2>
          <p className="text-muted-foreground">
            Administra tu saldo y compra más créditos cuando los necesites
          </p>
        </div>
        
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link href="/pricing">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Comprar Más Créditos
          </Link>
        </Button>
      </div>

      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Créditos actuales */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-primary" />
              Créditos Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">
              {remainingCredits}
            </div>
            <p className="text-sm text-muted-foreground">
              Listos para crear formularios
            </p>
          </CardContent>
        </Card>

        {/* Total comprado */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Total Comprado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {totalCreditsPurchased}
            </div>
            <p className="text-sm text-muted-foreground">
              Créditos adquiridos en total
            </p>
          </CardContent>
        </Card>

        {/* Total usado */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Total Usado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {totalCreditsUsed}
            </div>
            <p className="text-sm text-muted-foreground">
              Formularios creados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de progreso de uso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Uso de Créditos</CardTitle>
          <CardDescription>
            Progreso de utilización de tus créditos comprados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso de uso</span>
            <span className="font-medium">{Math.round(usagePercentage)}%</span>
          </div>
          
          <Progress value={usagePercentage} className="h-3" />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>0 créditos</span>
            <span>{totalCreditsPurchased} créditos</span>
          </div>
        </CardContent>
      </Card>

{/* Historial de transacciones */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-lg">Historial de Transacciones</CardTitle>
            <CardDescription>
              Registro de compras y uso de créditos
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {completedTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay transacciones aún</p>
              <p className="text-sm">Las compras y usos aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedTransactions.slice(0, visibleTransactions).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      transaction.type === 'purchase' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {transaction.type === 'purchase' ? '+' : '-'}{transaction.amount}
                    </span>
                    <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status === 'completed' ? 'Completado' : 
                       transaction.status === 'pending' ? 'Pendiente' : 'Fallido'}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {completedTransactions.length > visibleTransactions && (
                <div className="text-center pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setVisibleTransactions(prev => prev + 10)}
                  >
                    Cargar más
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CTA para comprar más créditos */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">¿Necesitas más créditos?</h3>
            <p className="text-muted-foreground mb-4">
              Compra la cantidad exacta que necesites con descuentos especiales en packs grandes
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/pricing">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Ver Planes y Precios
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}