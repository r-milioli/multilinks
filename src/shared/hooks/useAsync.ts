import { useState, useEffect, useCallback, useRef } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface AsyncOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: AsyncOptions<T> = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  })

  // Usar refs para evitar dependências desnecessárias
  const onSuccessRef = useRef(options.onSuccess)
  const onErrorRef = useRef(options.onError)

  // Atualizar refs quando as funções mudarem
  useEffect(() => {
    onSuccessRef.current = options.onSuccess
    onErrorRef.current = options.onError
  })

  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const data = await asyncFunction(...args)
      setState({ data, loading: false, error: null })
      
      // Chamar callback de sucesso se existir
      if (onSuccessRef.current) {
        onSuccessRef.current(data)
      }
      
      return data
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Erro desconhecido')
      setState({ data: null, loading: false, error: errorObj })
      
      // Chamar callback de erro se existir
      if (onErrorRef.current) {
        onErrorRef.current(errorObj)
      }
      
      throw errorObj
    }
  }, [asyncFunction])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  useEffect(() => {
    if (options.immediate) {
      execute()
    }
  }, [execute, options.immediate])

  return {
    ...state,
    execute,
    reset
  }
}

