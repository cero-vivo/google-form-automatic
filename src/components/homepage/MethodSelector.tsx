'use client';

import React from 'react';

export interface Method {
  id: 'ai' | 'upload' | 'visual';
  title: string;
  subtitle: string;
  description: string;
  desktopGif: string;
  mobileGif: string;
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'purple';
  symbol: string;
}

interface MethodSelectorProps {
  methods: Record<'ai' | 'upload' | 'visual', Method>;
  selectedMethod: 'ai' | 'upload' | 'visual';
  setSelectedMethod: (method: 'ai' | 'upload' | 'visual') => void;
  currentMethod: Method;
}

export const MethodSelector = ({ 
  methods, 
  selectedMethod, 
  setSelectedMethod, 
  currentMethod 
}: MethodSelectorProps) => {
  return (
    <div>
      {/* Interactive Method Selector - Periodic Table Style */}
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-6 sm:mb-8">
        {Object.values(methods).map((method) => {
          const IconComponent = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <div key={method.id} className="relative">
              <button
                onClick={() => setSelectedMethod(method.id)}
                className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isSelected 
                    ? `bg-white` 
                    : `border-gray-200 bg-white hover:border-${method.color}-300`
                }`}
                style={{
                  width: '120px',
                  height: '120px',
                  ...(isSelected && {
                    borderColor: method.color === 'blue' ? '#3b82f6' : method.color === 'purple' ? '#a855f7' : '#10b981',
                    backgroundColor: 'white'
                  })
                }}
              >
                {/* Atomic Symbol Style */}
                <div className={`absolute top-2 left-2 text-xs font-mono transition-colors duration-300 ${
                  isSelected 
                    ? (method.color === 'blue' ? 'text-blue-500' : method.color === 'purple' ? 'text-purple-500' : 'text-green-500')
                    : 'text-gray-400'
                }`}>
                  {Object.keys(methods).indexOf(method.id) + 1}
                </div>
                
                {/* Main Content */}
                <div className="flex flex-col items-center justify-center h-full p-3">
                  <IconComponent 
                    className={`h-8 w-8 mb-2 transition-colors duration-300 ${
                      isSelected 
                        ? (method.color === 'blue' ? 'text-blue-500' : method.color === 'purple' ? 'text-purple-500' : 'text-green-500')
                        : 'text-gray-600 group-hover:text-' + method.color + '-500'
                    }`} 
                  />
                  <div className={`text-lg font-bold mb-1 transition-colors duration-300 ${
                    isSelected 
                      ? (method.color === 'blue' ? 'text-blue-600' : method.color === 'purple' ? 'text-purple-600' : 'text-green-600')
                      : 'text-gray-800'
                  }`}>
                    {method.symbol}
                  </div>
                  <div className={`text-xs text-center leading-tight transition-colors duration-300 ${
                    isSelected 
                      ? (method.color === 'blue' ? 'text-blue-500' : method.color === 'purple' ? 'text-purple-500' : 'text-green-500')
                      : 'text-gray-500'
                  }`}>
                    {method.title}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-white to-transparent transition-opacity duration-300" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Method Description */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-200/50">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            style={{
              backgroundColor: currentMethod.color === 'blue' ? '#3b82f6' : currentMethod.color === 'purple' ? '#a855f7' : '#10b981'
            }}
          >
            <currentMethod.icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-primary">{currentMethod.subtitle}</h4>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{currentMethod.description}</p>
      </div>
    </div>
  );
};