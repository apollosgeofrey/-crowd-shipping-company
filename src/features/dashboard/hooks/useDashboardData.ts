// hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from 'react';
import { dashboardApi, type DashboardSummary } from '../services/dashboardApi';

export function useDashboardData() {
    const [response, setResponse] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const dashboardData = await dashboardApi.getSummary();
            setResponse(dashboardData);
        } catch (err: any) {
            setError(err?.message || 'Failed to load dashboard data');
            console.error('Dashboard data error:', err);
        } finally {
            setLoading(false);
        }
    }, []);
 
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return { 
        error,
        loading, 
        response, 
        refetch: fetchDashboardData
    };
}