export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  formsPerMonth: number;
  popular?: boolean;
  features: string[];
  limitations?: string[];
  ctaText: string;
  ctaVariant: 'default' | 'outline' | 'secondary';
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: 'Gratis',
    formsPerMonth: 5,
    features: [
      'Creación de formularios desde Excel/CSV',
      'Todos los tipos de preguntas',
      'Exportación directa a Google Forms',
      'Soporte básico'
    ],
    ctaText: 'Comenzar Gratis',
    ctaVariant: 'outline'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 5,
    priceLabel: '$5 USD',
    formsPerMonth: 25,
    popular: true,
    features: [
      'Creación de formularios desde Excel/CSV',
      'Todos los tipos de preguntas',
      'Exportación directa a Google Forms',
      'Soporte prioritario'
    ],
    ctaText: 'Comenzar Prueba',
    ctaVariant: 'default'
  },
  {
    id: 'business',
    name: 'Business',
    price: 15,
    priceLabel: '$15 USD',
    formsPerMonth: 100,
    features: [
      'Creación de formularios desde Excel/CSV',
      'Todos los tipos de preguntas',
      'Exportación directa a Google Forms',
      'Soporte prioritario'
    ],
    ctaText: 'Empezar Business',
    ctaVariant: 'default'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 20,
    priceLabel: '$20 USD',
    formsPerMonth: 200,
    features: [
      'Creación de formularios desde Excel/CSV',
      'Todos los tipos de preguntas',
      'Exportación directa a Google Forms',
      'Soporte prioritario'
    ],
    ctaText: 'Contactar Ventas',
    ctaVariant: 'secondary'
  }
];

export const pricingFeatures = {
  formsCreation: 'Creación de formularios',
  questionTypes: 'Tipos de preguntas',
  googleIntegration: 'Integración con Google Forms',
  support: 'Soporte técnico',
  analytics: 'Analytics y reportes',
  customization: 'Personalización',
  collaboration: 'Colaboración en equipo',
  integrations: 'Integraciones'
};

export const faqData = [
  {
    question: '¿Puedo cambiar de plan en cualquier momento?',
    answer: 'Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se reflejarán en tu próximo ciclo de facturación.'
  },
  {
    question: '¿Qué pasa si excedo mi límite mensual?',
    answer: 'Te notificaremos cuando te acerques al límite. Puedes actualizar tu plan o esperar al siguiente mes para crear más formularios.'
  },
  {
    question: '¿Hay algún compromiso a largo plazo?',
    answer: 'No, todos nuestros planes son de mes a mes. Puedes cancelar en cualquier momento sin penalizaciones.'
  },
  {
    question: '¿Los formularios creados permanecen activos si cancelo?',
    answer: 'Sí, todos los formularios que hayas creado en Google Forms permanecerán activos y bajo tu control, independientemente de tu suscripción.'
  },
  {
    question: '¿Ofrecen descuentos por pago anual?',
    answer: 'Sí, ofrecemos 2 meses gratis con el pago anual anticipado. Contáctanos para más detalles sobre precios anuales.'
  }
]; 