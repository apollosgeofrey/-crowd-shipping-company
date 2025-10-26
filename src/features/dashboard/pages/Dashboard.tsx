import RevenueChart from "./partials/RevenueChart.tsx";
import BookingTrips from "./partials/BookingTrips.tsx";
import { useDashboardData } from '../hooks/useDashboardData';
import DashboardLayout from "../../../layouts/DashboardLayout";
import BookingOverviews from "./partials/BookingOverviews.tsx";
import StatisticalSummary from "./partials/StatisticalSummary.tsx";
import { StateLoading, StateError, StateEmpty } from '../../../components/StateComponents.tsx';

export default function Dashboard() {
	const { data, loading, error, refetch } = useDashboardData();

	// Render loading state
    if (loading) return <StateLoading />;

    // Render error state
    if (error) return <StateError error={error} onRetry={refetch} />;

    // Render empty state
    if (!data) return <StateEmpty onRetry={refetch} />;	

	// Render dashboard layout WITH DATA PASSED TO COMPONENTS
	return (
		<DashboardLayout>
			<div className="row mb-4">
				<div className="col-sm-12 col-md-8">
					{/* Pass stats data to StatisticalSummary */}
					<StatisticalSummary stats={data?.stats} user={data?.user} /><br />
					
					{/* Pass revenue data to RevenueChart */}
					<RevenueChart revenueData={data?.revenue} /><br />
				</div>
				<div className="col-sm-12 col-md-4">
					{/* Pass pathfinders data to BookingTrips */}
					<BookingTrips pathfinders={data?.pathfinders} /><br />
				</div>
				<div className="col-sm-12 col-md-12">
					{/* Pass bookings data to BookingOverviews */}
					<BookingOverviews bookings={data?.recentBookings} /><br />
				</div>
			</div>
		</DashboardLayout>
	);
}
