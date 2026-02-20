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
    
    const formModalSettings = themeSettings.formModalSettings || {};
    
    return {
      backgroundColor: formModalSettings.backgroundColor || themeSettings.backgroundColor || '#ffffff',
      textColor: formModalSettings.textColor || themeSettings.textColor || '#000000',
      primaryColor: formModalSettings.buttonBackgroundColor || themeSettings.primaryColor || '#3b82f6',
      borderColor: formModalSettings.borderColor || themeSettings.borderColor || '#e5e7eb',
      borderRadius: formModalSettings.borderRadius || themeSettings.borderRadius || 8,
      shadow: formModalSettings.shadow || 'lg',
      backdropBlur: formModalSettings.backdropBlur !== undefined ? formModalSettings.backdropBlur : true,
      inputBackgroundColor: formModalSettings.inputBackgroundColor || '#ffffff',
      inputBorderColor: formModalSettings.inputBorderColor || '#e5e7eb',
      inputTextColor: formModalSettings.inputTextColor || '#000000',
      inputFocusBorderColor: formModalSettings.inputFocusBorderColor || '#3b82f6',
      buttonBackgroundColor: formModalSettings.buttonBackgroundColor || themeSettings.primaryColor || '#3b82f6',
      buttonTextColor: formModalSettings.buttonTextColor || '#ffffff',
      buttonHoverBackgroundColor: formModalSettings.buttonHoverBackgroundColor || themeSettings.primaryColor || '#2563eb',
      buttonHoverTextColor: formModalSettings.buttonHoverTextColor || '#ffffff',
      titleColor: formModalSettings.titleColor || themeSettings.textColor || '#000000',
      descriptionColor: formModalSettings.descriptionColor || themeSettings.secondaryColor || '#6b7280',
      errorColor: formModalSettings.errorColor || '#ef4444',
      successColor: formModalSettings.successColor || '#10b981'
    };
  };

  const themeStyles = getThemeStyles();

  const shadowMap: Record<string, string> = {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
  };
  const modalContentStyle: React.CSSProperties = {
    backgroundColor: themeStyles.backgroundColor,
    color: themeStyles.textColor,
    border: `1px solid ${themeStyles.borderColor}`,
    borderRadius: themeStyles.borderRadius != null ? `${themeStyles.borderRadius}px` : undefined,
    boxShadow: shadowMap[themeStyles.shadow as string] ?? shadowMap.lg,
    fontFamily: themeSettings?.fontFamily || 'Inter'
  };

  const overlayStyle: React.CSSProperties = themeStyles.backdropBlur
    ? { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }
    : { backdropFilter: 'none', WebkitBackdropFilter: 'none' };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent
        className="max-w-md p-0 border-0 bg-transparent border-none shadow-none"
        overlayStyle={overlayStyle}
      >
        <div
          className="p-6"
          style={{
            ...modalContentStyle,
            borderRadius: themeStyles.borderRadius != null ? `${themeStyles.borderRadius}px` : undefined,
          }}
        >
        <div className="mb-6">
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: themeStyles.titleColor }}
          >
            {form.title}
          </h2>
          {form.description && (
            <p style={{ color: themeStyles.descriptionColor }}>{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeFields.map((field) => (
            <div key={field.id}>
              <Label 
                htmlFor={field.id} 
                className="block mb-2"
                style={{ color: themeStyles.textColor }}
              >
                {field.label}
                {field.required && (
                  <span style={{ color: themeStyles.errorColor }} className="ml-1">*</span>
                )}
              </Label>
              <Input
                id={field.id}
                type={getFieldType(field)}
                value={formData[field.id] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={getFieldPlaceholder(field)}
                style={{
                  backgroundColor: themeStyles.inputBackgroundColor,
                  borderColor: errors[field.id] ? themeStyles.errorColor : themeStyles.inputBorderColor,
                  color: themeStyles.inputTextColor,
                  borderRadius: themeStyles.borderRadius ? `${Math.min(themeStyles.borderRadius, 8)}px` : undefined,
                }}
              />
              {errors[field.id] && (
                <p style={{ color: themeStyles.errorColor }} className="text-sm mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}

          {errors.submit && (
            <div 
              className="p-3 rounded-md"
              style={{
                backgroundColor: `${themeStyles.errorColor}10`,
                borderColor: themeStyles.errorColor,
                border: '1px solid'
              }}
            >
              <p style={{ color: themeStyles.errorColor }} className="text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
              style={{
                backgroundColor: 'transparent',
                borderColor: themeStyles.borderColor,
                color: themeStyles.textColor,
                borderRadius: themeStyles.borderRadius ? `${Math.min(themeStyles.borderRadius, 8)}px` : undefined,
              }}
            >
              Cancelar
            </Button>
            <div className="form-modal-submit-wrapper flex-1">
              <style>{`
                .form-modal-submit-wrapper button:hover:not(:disabled) {
                  background-color: ${themeStyles.buttonHoverBackgroundColor} !important;
                  color: ${themeStyles.buttonHoverTextColor} !important;
                }
              `}</style>
              <Button
                type="submit"
                disabled={isSubmitting || !form.buttonActive}
                className="w-full transition-colors"
                style={{
                  backgroundColor: themeStyles.buttonBackgroundColor,
                  color: themeStyles.buttonTextColor,
                  border: 'none',
                  borderRadius: themeStyles.borderRadius ? `${Math.min(themeStyles.borderRadius, 8)}px` : undefined,
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
          </div>
        </form>
        </div>
      </ModalContent>
    </Modal>
  );
}
