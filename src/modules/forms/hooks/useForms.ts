import { useState, useEffect, useCallback } from 'react';
import { Form } from '@/types/form.types';

export function useForms(shouldLoadImmediately = true) {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchForms = useCallback(async () => {
    console.log('useForms: fetchForms chamado');
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/forms');
      console.log('useForms: Response status:', response.status);
      if (!response.ok) {
        throw new Error('Erro ao buscar formulários');
      }
      const data = await response.json();
      console.log('useForms: Data recebida:', data);
      setForms(data);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Erro desconhecido');
      console.error('useForms: Erro ao buscar formulários:', errorObj);
      setError(errorObj);
    } finally {
      setLoading(false);
    }
  }, []);

  const createForm = useCallback(async (formData: Partial<Form>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar formulário');
      }

      const newForm = await response.json();
      setForms(prev => [newForm, ...prev]);
      return newForm;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateForm = useCallback(async (id: string, formData: Partial<Form>) => {
    const response = await fetch(`/api/forms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar formulário');
    }

    const updatedForm = await response.json();
    setForms(prev => prev.map(form => form.id === id ? updatedForm : form));
    return updatedForm;
  }, []);

  const deleteForm = useCallback(async (id: string) => {
    const response = await fetch(`/api/forms/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao deletar formulário');
    }

    setForms(prev => prev.filter(form => form.id !== id));
  }, []);

  const getFormById = useCallback((id: string) => {
    return forms.find(form => form.id === id);
  }, [forms]);

  const getActiveForms = useCallback(() => {
    return forms.filter(form => form.active);
  }, [forms]);

  useEffect(() => {
    console.log('useForms: useEffect executado, shouldLoadImmediately:', shouldLoadImmediately);
    if (shouldLoadImmediately && forms.length === 0 && !loading) {
      console.log('useForms: Chamando fetchForms');
      fetchForms();
    }
  }, [shouldLoadImmediately, forms.length, loading, fetchForms]);

  return {
    forms,
    loading,
    error,
    createForm,
    updateForm,
    deleteForm,
    getFormById,
    getActiveForms,
    refreshForms: fetchForms,
  };
}
