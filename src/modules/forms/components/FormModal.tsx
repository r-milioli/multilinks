'use client';

import { useState, useEffect } from 'react';
import { Form, FormField, FormSubmission } from '@/types/form.types';
import { Modal, ModalContent } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Loading } from '@/shared/components/ui/Loading';

interface FormModalProps {
  form: Form;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (redirectUrl?: string) => void;
  linkId?: string;
  themeSettings?: any;
}

export function FormModal({ 
  form, 
  isOpen, 
  onClose, 
  onSuccess, 
  linkId, 
  themeSettings 
}: FormModalProps) {
  console.log('🎯 FormModal renderizado:', {
    isOpen,
    formId: form?.id,
    formTitle: form?.title,
    linkId,
    hasTheme: !!themeSettings
  })

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeFields = form.fields.filter(field => field.active);

  useEffect(() => {
    if (isOpen) {
      setFormData({});
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    activeFields.forEach(field => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} é obrigatório`;
      }

      // Validação específica por tipo
      if (field.type === 'email' && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = 'Email inválido';
        }
      }

      if (field.type === 'whatsapp' && formData[field.id]) {
        const whatsappRegex = /^[\d\s\(\)\+\-]+$/;
        if (!whatsappRegex.test(formData[field.id])) {
          newErrors[field.id] = 'WhatsApp inválido';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submission: FormSubmission = {
        formId: form.uniqueId,
        data: formData,
        linkId,
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar formulário');
      }

      // Sucesso
      onSuccess?.(result.redirectUrl);
      onClose();
      
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setErrors({ submit: 'Erro ao enviar formulário. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldType = (field: FormField) => {
    switch (field.type) {
      case 'email':
        return 'email';
      case 'whatsapp':
        return 'tel';
      default:
        return 'text';
    }
  };

  const getFieldPlaceholder = (field: FormField) => {
    if (field.placeholder) return field.placeholder;
    
    switch (field.type) {
      case 'name':
        return 'Digite seu nome';
      case 'email':
        return 'Digite seu email';
      case 'whatsapp':
        return 'Digite seu WhatsApp';
      default:
        return 'Digite aqui';
    }
  };

  // Aplicar tema do usuário
  const getThemeStyles = () => {
    if (!themeSettings) return {};
    
    return {
      backgroundColor: themeSettings.backgroundColor || '#ffffff',
      textColor: themeSettings.textColor || '#000000',
      primaryColor: themeSettings.primaryColor || '#3b82f6',
      borderColor: themeSettings.borderColor || '#e5e7eb',
    };
  };

  const themeStyles = getThemeStyles();

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="max-w-md">
        <div 
          className="p-6"
          style={{
            backgroundColor: themeStyles.backgroundColor,
            color: themeStyles.textColor,
          }}
        >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{form.title}</h2>
          {form.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeFields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id} className="block mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={field.id}
                type={getFieldType(field)}
                value={formData[field.id] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={getFieldPlaceholder(field)}
                className={errors[field.id] ? 'border-red-500' : ''}
                style={{
                  borderColor: errors[field.id] ? '#ef4444' : themeStyles.borderColor,
                }}
              />
              {errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !form.buttonActive}
              className="flex-1"
              style={{
                backgroundColor: themeStyles.primaryColor,
                borderColor: themeStyles.primaryColor,
              }}
            >
              {isSubmitting ? (
                <>
                  <Loading className="w-4 h-4 mr-2" />
                  Enviando...
                </>
              ) : (
                form.buttonText
              )}
            </Button>
          </div>
        </form>
        </div>
      </ModalContent>
    </Modal>
  );
}
