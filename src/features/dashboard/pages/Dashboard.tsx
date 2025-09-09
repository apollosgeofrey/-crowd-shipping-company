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
          <p className=""><StatisticalSummary /></p>
          <p className=""><RevenueChart /></p>
        </div>
        <div className="col-sm-12 col-md-4">
          <p className=""><BookingTrips /></p>
        </div>
        <div className="col-sm-12 col-md-12">
          <p className=""><BookingOverviews /></p>
        </div>
      </div>
    </DashboardLayout>
  );
}
