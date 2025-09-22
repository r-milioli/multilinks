'use client';

import { useState, useEffect } from 'react';
import { Form, FormField } from '@/types/form.types';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Switch } from '@/shared/components/ui/Switch';
import { Card } from '@/shared/components/ui/Card';
import { cn } from '@/shared/utils/cn';

interface FormBuilderProps {
  form?: Form;
  onSubmit: (form: Partial<Form>) => Promise<void>;
  onCancel: () => void;
}

export function FormBuilder({ form, onSubmit, onCancel }: FormBuilderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Form>>({
    title: '',
    description: '',
    uniqueId: '',
    fields: [
      {
        id: 'name',
        type: 'name',
        label: 'Nome',
        placeholder: 'Digite seu nome',
        required: true,
        active: true,
        order: 1,
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Digite seu email',
        required: true,
        active: true,
        order: 2,
      },
      {
        id: 'whatsapp',
        type: 'whatsapp',
        label: 'WhatsApp',
        placeholder: 'Digite seu WhatsApp',
        required: false,
        active: false,
        order: 3,
      },
      {
        id: 'custom',
        type: 'custom',
        label: 'Campo Personalizado',
        placeholder: 'Digite aqui',
        required: false,
        active: false,
        order: 4,
      },
    ],
    buttonText: 'Enviar',
    buttonActive: true,
    redirectUrl: '',
    followLinkDestination: true,
    active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (form) {
      setFormData(form);
    } else {
      // Gerar uniqueId automaticamente para novos formulários
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substr(2, 5);
      const uniqueId = `form-${timestamp}-${random}`;
      
      
      setFormData(prev => ({
        ...prev,
        uniqueId: prev.uniqueId || uniqueId
      }));
    }
    
    // Reset estado de loading quando o formulário muda
    setIsSubmitting(false);
  }, [form]);

  const updateField = (fieldIndex: number, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields?.map((field, index) => 
        index === fieldIndex ? { ...field, ...updates } : field
      ),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.uniqueId?.trim()) {
      newErrors.uniqueId = 'ID único é obrigatório';
    }

    const activeFields = formData.fields?.filter(field => field.active) || [];
    if (activeFields.length === 0) {
      newErrors.fields = 'Pelo menos um campo deve estar ativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('FormBuilder: Erro ao salvar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldTypes = {
    name: { label: 'Nome', icon: '👤' },
    email: { label: 'Email', icon: '📧' },
    whatsapp: { label: 'WhatsApp', icon: '📱' },
    custom: { label: 'Personalizado', icon: '📝' },
  };

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Título do formulário"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do formulário"
            />
          </div>

          <div>
            <Label htmlFor="uniqueId">ID Único *</Label>
            <Input
              id="uniqueId"
              value={formData.uniqueId || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, uniqueId: e.target.value }))}
              placeholder="id-unico-do-formulario"
              className={errors.uniqueId ? 'border-red-500' : ''}
              readOnly={!form} // Só permite edição se estiver editando um formulário existente
            />
            {errors.uniqueId && <p className="text-red-500 text-sm mt-1">{errors.uniqueId}</p>}
            <p className="text-sm text-gray-500 mt-1">
              {form ? 'Use apenas letras, números e hífens. Exemplo: formulario-contato' : 'ID gerado automaticamente'}
            </p>
          </div>
        </div>
      </Card>

      {/* Campos do Formulário */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Campos do Formulário</h3>
        <div className="space-y-4">
          {formData.fields?.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{fieldTypes[field.type].icon}</span>
                  <span className="font-medium">{fieldTypes[field.type].label}</span>
                </div>
                <Switch
                  checked={field.active}
                  onCheckedChange={(checked) => updateField(index, { active: checked })}
                />
              </div>

              {field.active && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`field-label-${index}`}>Label do Campo</Label>
                    <Input
                      id={`field-label-${index}`}
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                      placeholder="Label do campo"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`field-placeholder-${index}`}>Placeholder</Label>
                    <Input
                      id={`field-placeholder-${index}`}
                      value={field.placeholder || ''}
                      onChange={(e) => updateField(index, { placeholder: e.target.value })}
                      placeholder="Placeholder do campo"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) => updateField(index, { required: checked })}
                      id={`field-required-${index}`}
                    />
                    <Label htmlFor={`field-required-${index}`}>Campo obrigatório</Label>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {errors.fields && <p className="text-red-500 text-sm">{errors.fields}</p>}
        </div>
      </Card>

      {/* Configurações do Botão */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Configurações do Botão</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="buttonText">Texto do Botão</Label>
            <Input
              id="buttonText"
              value={formData.buttonText || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
              placeholder="Enviar"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.buttonActive || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, buttonActive: checked }))}
              id="buttonActive"
            />
            <Label htmlFor="buttonActive">Botão ativo</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.followLinkDestination || false}
              onCheckedChange={(checked) => setFormData(prev => ({ 
                ...prev, 
                followLinkDestination: checked,
                redirectUrl: checked ? '' : prev.redirectUrl
              }))}
              id="followLinkDestination"
            />
            <Label htmlFor="followLinkDestination">Seguir para destino do link</Label>
          </div>

          {!formData.followLinkDestination && (
            <div>
              <Label htmlFor="redirectUrl">URL de Redirecionamento</Label>
              <Input
                id="redirectUrl"
                value={formData.redirectUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, redirectUrl: e.target.value }))}
                placeholder="https://exemplo.com/obrigado"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Status do Formulário */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Status</h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.active || false}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            id="active"
          />
          <Label htmlFor="active">Formulário ativo</Label>
        </div>
      </Card>

      {/* Botões de Ação */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : (form ? 'Atualizar' : 'Criar')} Formulário
        </Button>
      </div>
    </div>
  );
}
