import { useState, useEffect, useCallback } from 'react';

interface FormStats {
  formId: string;
  totalLeads: number;
  leadsToday: number;
}

interface FormStatsResponse {
  stats: FormStats[];
}

export function useFormStats(formIds: string[]) {
  const [stats, setStats] = useState<Record<string, FormStats>>({});
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (formIds.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/forms/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formIds }),
      });

      if (response.ok) {
        const data: FormStatsResponse = await response.json();
        const statsMap: Record<string, FormStats> = {};
        
        data.stats.forEach(stat => {
          statsMap[stat.formId] = stat;
        });
        
        setStats(statsMap);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos formulários:', error);
    } finally {
      setLoading(false);
    }
  }, [formIds]);

  useEffect(() => {
    if (formIds.length > 0) {
      fetchStats();
    }
  }, [formIds]);

  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  const getFormStats = useCallback((formId: string) => {
    return stats[formId] || { formId, totalLeads: 0, leadsToday: 0 };
  }, [stats]);

  return {
    stats,
    loading,
    getFormStats,
    refreshStats,
  };
}
