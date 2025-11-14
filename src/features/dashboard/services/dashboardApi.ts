// services/dashboardApi.ts
import api from '../../../services/api';

export interface DashboardSummary {
	user: {
		fullName: string;
		userType: string;
		role: string;
	};
	stats: {
		totalDrivers: { count: number; updateDate: string };
		totalCompanies: { count: number; updateDate: string };
		totalTrips: { count: number; updateDate: string };
		totalFleets: { count: number; updateDate: string };
	};
	revenue: Array<{ name: string; amount: number }>;
	recentBookings: Array<{
		id: string;
		description: string;
		driver: string;
		route: string;
		status: string;
		progress: string;
		eta: string;
	}>;
	pathfinders: {
		maritime: any[];
		air: any[];
	};
	lastUpdated: string;
}

export const dashboardApi = {
	// Single API call to get ALL dashboard data
	getSummary: async (): Promise<DashboardSummary> => {
		const response = await api.get('v1/admin/dashboard');
		return response.data;
	}
};

export default dashboardApi;