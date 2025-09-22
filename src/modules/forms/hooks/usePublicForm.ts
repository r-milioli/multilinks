import { useState, useCallback } from 'react';
import { Form } from '@/types/form.types';

export function usePublicForm(uniqueId: string) {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadForm = useCallback(async () => {
    console.log('🔄 usePublicForm: loadForm chamado com uniqueId:', uniqueId)
    
    if (!uniqueId || uniqueId.trim() === '') {
      console.log('❌ usePublicForm: uniqueId vazio, cancelando carregamento')
      setForm(null);
      setError(null);
      return;
    }

    try {
      console.log('⏳ usePublicForm: Iniciando carregamento...')
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/forms/by-id/${uniqueId}`);
      console.log('📡 usePublicForm: Resposta da API:', response.status, response.statusText)
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('❌ usePublicForm: Formulário não encontrado (404)')
          throw new Error('Formulário não encontrado');
        }
        console.log('❌ usePublicForm: Erro na API:', response.status)
        throw new Error('Erro ao carregar formulário');
      }
      const data = await response.json();
      console.log('✅ usePublicForm: Formulário carregado com sucesso:', data)
      setForm(data);
    } catch (err) {
      console.error('❌ usePublicForm: Erro ao carregar formulário:', err)
      const errorObj = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(errorObj);
      setForm(null);
    } finally {
      setLoading(false);
      console.log('🏁 usePublicForm: Carregamento finalizado')
    }
  }, [uniqueId]);

  const submitForm = useCallback(async (formId: string, data: Record<string, string>, linkId?: string) => {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formId,
        data,
        linkId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao enviar formulário');
    }

    return response.json();
  }, []);

  return {
    form,
    loading,
    error,
    loadForm,
    submitForm,
  };
}
