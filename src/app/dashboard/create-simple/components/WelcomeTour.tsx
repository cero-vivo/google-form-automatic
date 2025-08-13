import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sparkles, MousePointer, Type, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface WelcomeTourProps {
  onComplete: () => void;
}

const tourSteps = [
  {
    title: "¡Bienvenido a la creación simple!",
    description: "Crea formularios profesionales en minutos con nuestra interfaz intuitiva.",
    icon: Sparkles,
    position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
  },
  {
    title: "Elige un tipo de pregunta",
    description: "Haz clic en cualquier tipo de pregunta para agregarla a tu formulario.",
    icon: MousePointer,
    position: { top: '200px', left: '50px' }
  },
  {
    title: "Personaliza tu pregunta",
    description: "Edita el título, descripción y opciones directamente en la tarjeta.",
    icon: Type,
    position: { top: '300px', left: '50px' }
  },
  {
    title: "Vista previa en tiempo real",
    description: "Mira cómo se verá tu formulario mientras lo construyes.",
    icon: CheckCircle,
    position: { top: '200px', right: '50px' }
  }
];

const WelcomeTour: React.FC<WelcomeTourProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenSimpleCreatorTour');
    if (!hasSeenTour) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenSimpleCreatorTour', 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const currentStepData = tourSteps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={handleSkip}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative"
          style={currentStepData.position}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="p-6 max-w-sm bg-white shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Paso {currentStep + 1} de {tourSteps.length}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="-mt-2 -mr-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {currentStepData.description}
            </p>
            
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
              >
                Saltar tour
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {tourSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-2"
                >
                  {currentStep === tourSteps.length - 1 ? 'Comenzar' : 'Siguiente'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeTour;