import React from 'react';

interface FormPreviewProps {
  form: {
    title: string;
    questions: Array<{
      type: string;
      label: string;
      options?: string[];
      range?: [number, number];
      required?: boolean;
    }>;
  };
  className?: string;
}

export function FormPreview({ form, className }: FormPreviewProps) {
  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'texto_corto': return '📝';
      case 'texto_largo': return '📄';
      case 'opcion_multiple': return '🔘';
      case 'checkboxes': return '☑️';
      case 'dropdown': return '⬇️';
      case 'escala_lineal': return '📊';
      case 'fecha': return '📅';
      case 'hora': return '🕐';
      case 'email': return '✉️';
      case 'numero': return '🔢';
      case 'archivo': return '📎';
      case 'grid': return '📋';
      case 'escala': return '⚖️';
      case 'fecha_hora': return '📆';
      default: return '❓';
    }
  };

  const getQuestionPreview = (question: any) => {
    switch (question.type) {
      case 'texto_corto':
        return <input type="text" placeholder="Respuesta corta" disabled className="w-full p-2 border rounded-md bg-gray-50" />;
      
      case 'texto_largo':
        return <textarea placeholder="Respuesta larga" disabled rows={3} className="w-full p-2 border rounded-md bg-gray-50" />;
      
      case 'opcion_multiple':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" disabled className="mr-2" />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        );
      
      case 'checkboxes':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="checkbox" disabled className="mr-2" />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        );
      
      case 'dropdown':
        return (
          <select disabled className="w-full p-2 border rounded-md bg-gray-50">
            <option>Selecciona una opción</option>
            {question.options?.map((option: string, index: number) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        );
      
      case 'escala_lineal':
        return (
          <div className="flex items-center space-x-4">
            <span>{question.range?.[0] || 1}</span>
            <input type="range" min={question.range?.[0] || 1} max={question.range?.[1] || 10} disabled className="flex-1" />
            <span>{question.range?.[1] || 10}</span>
          </div>
        );
      
      case 'fecha':
        return <input type="date" disabled className="w-full p-2 border rounded-md bg-gray-50" />;
      
      case 'hora':
        return <input type="time" disabled className="w-full p-2 border rounded-md bg-gray-50" />;
      
      case 'email':
        return <input type="email" placeholder="email@ejemplo.com" disabled className="w-full p-2 border rounded-md bg-gray-50" />;
      
      case 'numero':
        return <input type="number" disabled className="w-full p-2 border rounded-md bg-gray-50" />;
      
      case 'archivo':
        return <input type="file" disabled className="w-full p-2 border rounded-md bg-gray-50" />;
      
      case 'grid':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b"></th>
                  {question.options?.map((option: string, index: number) => (
                    <th key={index} className="text-left p-2 border-b font-normal">
                      {option}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 font-medium">{question.label}</td>
                  {question.options?.map((_: string, index: number) => (
                    <td key={index} className="p-2">
                      <input type="radio" disabled />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      
      case 'fecha_hora':
        return <input type="datetime-local" disabled className="w-full p-2 border rounded-md bg-gray-50" />;
      
      default:
        return <input type="text" placeholder="Campo de entrada" disabled className="w-full p-2 border rounded-md bg-gray-50" />;
    }
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <h3 className="text-lg font-semibold mb-4">{form.title}</h3>
      
      {form.questions.map((question, index) => (
        <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <label className="text-sm font-medium block mb-2">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="space-y-2">
                {getQuestionPreview(question)}
              </div>
            </div>
            <span className="ml-2 text-lg">
              {getQuestionIcon(question.type)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}