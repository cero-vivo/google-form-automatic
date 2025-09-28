'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  FileText, 
  Check, 
  Star, 
  Zap, 
  Users, 
  Crown,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useAuthContext } from '@/containers/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CONFIG } from '@/lib/config';
import { useBrandToast } from '@/hooks/useBrandToast';

interface PricingPack {
  packSize: number;
  discountPercent: number;
  originalPrice: number;
  discountedPrice: number;
  savings: number;
}

export default function PricingPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedPack, setSelectedPack] = useState<PricingPack | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const { user, loading: authLoading } = useAuthContext();
  const { showError } = useBrandToast();

  // Verificar si mostrar el modal de países (solo primera vez)
  useEffect(() => {
    const hasSeenCountryModal = localStorage.getItem('fastform_country_modal_seen');
    if (!hasSeenCountryModal) {
      setShowCountryModal(true);
    }
  }, []);

  // Manejar cierre del modal de países
  const handleCloseCountryModal = () => {
    setShowCountryModal(false);
    localStorage.setItem('fastform_country_modal_seen', 'true');
  };

  // Función para calcular precio con incremento acumulativo (solo para cantidad personalizada)
  const calculatePrice = (qty: number): number => {
    if (qty <= 1) return CONFIG.PRICING.unitPrice;
    
    let totalPrice = CONFIG.PRICING.unitPrice;
    for (let i = 2; i <= qty; i++) {
      const increment = CONFIG.PRICING.unitPrice * (CONFIG.PRICING.additionalIncrementPercent / 100) * (i - 1);
      totalPrice += CONFIG.PRICING.unitPrice + increment;
    }
    
    return Math.round(totalPrice);
  };

  // Función para calcular precio unitario de pack con descuento
  const calculatePackUnitPrice = (discountPercent: number): number => {
    return Math.round(CONFIG.PRICING.unitPrice * (1 - discountPercent / 100));
  };

  // Packs predefinidos con precios unitarios calculados automáticamente
  const predefinedPacks: PricingPack[] = [
    { 
      packSize: CONFIG.PRICING.packs.pack20.size, 
      discountPercent: CONFIG.PRICING.packs.pack20.discountPercent, 
      originalPrice: CONFIG.PRICING.packs.pack20.size * CONFIG.PRICING.unitPrice, // Precio sin descuento
      discountedPrice: CONFIG.PRICING.packs.pack20.size * calculatePackUnitPrice(CONFIG.PRICING.packs.pack20.discountPercent), // Precio con descuento
      savings: (CONFIG.PRICING.packs.pack20.size * CONFIG.PRICING.unitPrice) - (CONFIG.PRICING.packs.pack20.size * calculatePackUnitPrice(CONFIG.PRICING.packs.pack20.discountPercent))
    },
    { 
      packSize: CONFIG.PRICING.packs.pack50.size, 
      discountPercent: CONFIG.PRICING.packs.pack50.discountPercent, 
      originalPrice: CONFIG.PRICING.packs.pack50.size * CONFIG.PRICING.unitPrice, // Precio sin descuento
      discountedPrice: CONFIG.PRICING.packs.pack50.size * calculatePackUnitPrice(CONFIG.PRICING.packs.pack50.discountPercent), // Precio con descuento
      savings: (CONFIG.PRICING.packs.pack50.size * CONFIG.PRICING.unitPrice) - (CONFIG.PRICING.packs.pack50.size * calculatePackUnitPrice(CONFIG.PRICING.packs.pack50.discountPercent))
    },
    { 
      packSize: CONFIG.PRICING.packs.pack100.size, 
      discountPercent: CONFIG.PRICING.packs.pack100.discountPercent, 
      originalPrice: CONFIG.PRICING.packs.pack100.size * CONFIG.PRICING.unitPrice, // Precio sin descuento
      discountedPrice: CONFIG.PRICING.packs.pack100.size * calculatePackUnitPrice(CONFIG.PRICING.packs.pack100.discountPercent), // Precio con descuento
      savings: (CONFIG.PRICING.packs.pack100.size * CONFIG.PRICING.unitPrice) - (CONFIG.PRICING.packs.pack100.size * calculatePackUnitPrice(CONFIG.PRICING.packs.pack100.discountPercent))
    }
  ];

  // Calcular precio actual
  const currentPrice = selectedPack ? selectedPack.discountedPrice : calculatePrice(quantity);
  const originalPrice = selectedPack ? selectedPack.originalPrice : calculatePrice(quantity);
  const savings = selectedPack ? selectedPack.savings : 0;

  // Manejar cambio de cantidad
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      setSelectedPack(null); // Deseleccionar pack si se cambia cantidad manual
    }
  };

  // Seleccionar pack predefinido
  const selectPack = (pack: PricingPack) => {
    console.log("🚀 ~ selectPack ~ pack:", pack)
    setSelectedPack(pack);
    setQuantity(pack.packSize);
  };

  // Crear preferencia de Mercado Pago
  const handlePurchase = async () => {
    // Si no está logueado, redirigir a registro
    if (!user) {
      window.location.href = '/auth/register';
      return;
    }

    setIsLoading(true);
    try {
      // Validar datos antes de enviar
      if (!quantity || quantity < 1) {
        throw new Error('Cantidad inválida');
      }

      if (currentPrice <= 0) {
        throw new Error('Precio inválido');
      }

      const requestBody = {
        quantity: quantity,
        unitPrice: Math.round(currentPrice / quantity),
        totalPrice: currentPrice,
        packSize: selectedPack?.packSize || null,
        discountPercent: selectedPack?.discountPercent || 0,
        userId: user?.id || ''
      };

      console.log('Enviando solicitud de compra:', requestBody);

      // Guardar información de la compra para procesar después del pago
      sessionStorage.setItem('fastform_purchase', JSON.stringify(requestBody));

      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Respuesta recibida:', response.status, response.statusText);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Datos de respuesta:', responseData);
        
        if (responseData.initPoint) {
          window.location.href = responseData.initPoint;
        } else {
          throw new Error('No se recibió URL de checkout');
        }
      } else {
        const errorText = await response.text();
        console.error('Error HTTP:', response.status, errorText);
        throw new Error(`Error del servidor: ${response.status}`);
      }
    } catch (error) {
      console.error('Error en handlePurchase:', error);
      const message = error instanceof Error ? error.message : 'Intenta nuevamente en unos segundos.';
      showError('No pudimos procesar tu compra', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Precios</h1>
                <p className="text-sm text-muted-foreground">Compra créditos para crear formularios</p>
              </div>
            </div>
          </div>
          
          {!user ? (
            <Button asChild variant="outline">
              <Link href="/auth/login">
                Iniciar Sesión
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard">
                Ir al Dashboard
              </Link>
            </Button>
          )}
        </div>
      </header>

      {/* Banner Informativo de Países */}
      <div className="bg-blue-50 border-b border-blue-200 sticky top-[73px] z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center text-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              <p className="text-sm text-blue-800 font-medium">
                <span className="font-semibold">Soporte de pagos disponible solo en:</span> AR, BR, CL, CO, MX, PE, UY
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Países Soportados */}
      <Dialog open={showCountryModal} onOpenChange={setShowCountryModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-primary">
              Información Importante
            </DialogTitle>
            <DialogDescription className="text-center pt-4">
              Actualmente solo soportamos pagos en los siguientes países:
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="font-semibold text-blue-800 mb-2">Países soportados:</div>
              <div className="text-blue-700 text-sm space-y-1">
                <div>🇦🇷 Argentina (AR)</div>
                <div>🇧🇷 Brasil (BR)</div>
                <div>🇨🇱 Chile (CL)</div>
                <div>🇨🇴 Colombia (CO)</div>
                <div>🇲🇽 México (MX)</div>
                <div>🇵🇪 Perú (PE)</div>
                <div>🇺🇾 Uruguay (UY)</div>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <Button 
              onClick={handleCloseCountryModal}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Créditos de Formularios
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            <span className="inline-flex items-center bg-forms text-white px-4 py-3 rounded-full text-sm font-bold mr-3 shadow-lg hover:shadow-xl transition-shadow">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 019 18v-5H5a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              IA Inteligente: 2 créditos
            </span>
            <span className="inline-flex items-center bg-excel text-white px-4 py-3 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-shadow">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4a2 2 0 012 2v2h2a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2V4zm10 4H6v8h8V8zM6 4v2h8V4H6z" clipRule="evenodd" />
              </svg>
              Tradicional: 1 crédito
            </span>
          </p>
        </div>

        {/* Packs Predefinidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {predefinedPacks.map((pack, index) => (
            <Card 
              key={pack.packSize}
              className={`relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
                selectedPack?.packSize === pack.packSize
                  ? 'border-2 border-primary shadow-xl scale-105' 
                  : 'border hover:border-primary/50'
              }`}
              onClick={() => selectPack(pack)}
            >
              {pack.packSize === 50 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  selectedPack?.packSize === pack.packSize
                    ? 'bg-primary text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {pack.packSize === 20 && <FileText className="w-6 h-6" />}
                  {pack.packSize === 50 && <Zap className="w-6 h-6" />}
                  {pack.packSize === 100 && <Crown className="w-6 h-6" />}
                </div>
                
                <CardTitle className="text-2xl font-bold">{pack.packSize} Créditos</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-primary">
                      ${pack.discountedPrice.toLocaleString()} ARS
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <span className="line-through">${pack.originalPrice.toLocaleString()}</span>
                    <span className="text-green-600 font-semibold ml-2">
                      -{pack.discountPercent}%
                    </span>
                  </div>
                  
                  <div className="text-green-600 font-semibold">
                    Ahorras ${pack.savings.toLocaleString()}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  ${Math.round(pack.discountedPrice / pack.packSize)} por crédito
                </p>
                
                <Button 
                  className="w-full"
                  variant={selectedPack?.packSize === pack.packSize ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      window.location.href = '/auth/register';
                      return;
                    }
                    selectPack(pack);
                  }}
                >
                  {!user ? 'Empezar Gratis' : 'Seleccionar Pack'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selector de Cantidad Personalizada */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Cantidad Personalizada</CardTitle>
              <CardDescription>
                Elige exactamente cuántos créditos necesitas
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Contador de cantidad */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-12 h-12"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <div className="text-center">
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-24 text-center text-2xl font-bold border-0 bg-transparent"
                  />
                  <p className="text-sm text-muted-foreground">créditos</p>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-12 h-12"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Información de precios */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Precio base por formulario:</span>
                    <span className="font-medium">${CONFIG.PRICING.unitPrice} ARS</span>
                  </div>
                
                {quantity > 1 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Incremento acumulativo:</span>
                    <span className="font-medium">+{CONFIG.PRICING.additionalIncrementPercent}% por adicional</span>
                  </div>
                )}
                
                {selectedPack && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Descuento por pack:</span>
                    <span className="font-medium text-green-600">-{selectedPack.discountPercent}%</span>
                  </div>
                )}
              </div>

              {/* Precio final */}
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">
                  ${currentPrice.toLocaleString()} ARS
                </div>
                
                {savings > 0 && (
                  <div className="text-green-600 font-semibold">
                    ¡Ahorras ${savings.toLocaleString()} ARS!
                  </div>
                )}
                
                {!selectedPack && quantity > 1 && (
                  <div className="text-sm text-muted-foreground">
                    ${Math.round(currentPrice / quantity)} por crédito
                  </div>
                )}
              </div>

              {/* Botón de compra */}
              <Button 
                onClick={handlePurchase}
                disabled={isLoading}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : !user ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Empezar Gratis
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Comprar {quantity} Crédito{quantity !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Características incluidas */}
          <div className="bg-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-6">Sistema de Créditos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Formularios con IA</h4>
                <p className="text-3xl font-bold text-blue-600 mb-2">2 créditos</p>
                <p className="text-sm text-muted-foreground">Crea formularios inteligentes con asistencia de IA</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Formularios Tradicionales</h4>
                <p className="text-3xl font-bold text-green-600 mb-2">1 crédito</p>
                <p className="text-sm text-muted-foreground">Crea desde cero, Excel/CSV o plantillas</p>
              </div>
            </div>
          </div>

          {/* Información de pago */}
          <div className="bg-accent/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Pago Seguro con Mercado Pago</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Aceptamos todas las tarjetas, transferencias y efectivo. Pago 100% seguro y encriptado.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <CreditCard className="h-5 w-5" />
              <span>Tarjetas de crédito y débito</span>
              <span>•</span>
              <span>Transferencias bancarias</span>
              <span>•</span>
              <span>Efectivo en puntos de pago</span>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16 bg-primary/5 rounded-2xl p-12">
          <h3 className="text-3xl font-bold mb-4">
            {!user ? '¿Listo para empezar?' : '¿Listo para comprar?'}
          </h3>
          <p className="text-xl mb-8 opacity-90">
            {!user 
              ? 'Crea tu cuenta gratuita y comienza a crear formularios profesionales en minutos'
              : 'Compra tus créditos y comienza a crear formularios profesionales en minutos'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                <Link href="/auth/register">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Crear Cuenta Gratuita
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Ir al Dashboard
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
