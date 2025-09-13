import DashboardLayout from "../../../layouts/DashboardLayout";
import RevenueChart from "./partials/RevenueChart.tsx";
import BookingTrips from "./partials/BookingTrips.tsx";
import BookingOverviews from "./partials/BookingOverviews.tsx";
import StatisticalSummary from "./partials/StatisticalSummary.tsx";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="row mb-4">
        <div className="col-sm-12 col-md-8">
          <StatisticalSummary /><br />
          <RevenueChart /><br />
        </div>
        <div className="col-sm-12 col-md-4">
          <BookingTrips /><br />
        </div>
        <div className="col-sm-12 col-md-12">
          <BookingOverviews /><br />
        </div>
      </div>
    </DashboardLayout>
  );
}
