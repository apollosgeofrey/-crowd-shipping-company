// hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from 'react';
import { dashboardApi, type DashboardSummary } from '../services/dashboardApi';

export function useDashboardData() {
    const [data, setData] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const dashboardData = await dashboardApi.getSummary();
            setData(dashboardData);
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
        data, 
        loading, 
        error,
        refetch: fetchDashboardData
    };
}