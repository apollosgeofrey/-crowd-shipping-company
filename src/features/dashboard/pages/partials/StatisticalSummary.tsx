// partials/StatisticalSummary.tsx
import { Users, Briefcase, Building2, Truck } from "lucide-react";

type StatCardProps = {
    title: string;
    value: number | string;
    delta: string;
    positive?: boolean;
    updatedAt: string;
    icon: React.ReactNode;
};

function StatCard({ title, value, delta, positive, updatedAt, icon }: StatCardProps) {
  return (
      <div className="card shadow-sm border-0 rounded h-100">
        {/* Top Section */}
        <div className="card-body pt-0 pb-1">
            {/* Icon + Title on its own line */}
            <div className="d-flex align-items-center w-100 mt-2">
                <span className="text-primary">{icon}</span>
                <span className="mx-3">{title}</span>
            </div>
            {/* Value and Delta on its own line, delta at right end */}
            <div className="d-flex align-items-center justify-content-between w-100 mt-2">
                <span className="fs-5 fw-bold">{value}</span>
                <span className={`badge px-3 py-1 fs-6 fw-semibold ${ positive ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                    {delta}
                </span>
            </div>
        </div>

      {/* Divider */}
      <hr className="my-0" />

      {/* Footer */}
      <div className="card-footer bg-white small text-muted">
        Update: {updatedAt}
      </div>
    </div>
  );
}

interface Props {
    stats?: {
        totalDrivers: { count: number; lastUpdateDate: string };
        totalCompanies: { count: number; lastUpdateDate: string };
        totalTrips: { count: number; lastUpdateDate: string };
        totalFleets: { count: number; lastUpdateDate: string };
    };
    user?: {
        fullName: string;
        userType: string;
        role: string;
    };
}

export default function StatisticalSummary({ stats, user }: Props) {
    // Format date from "2023-07-16" to "July 16, 2023"
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    return (
        <div>
            {/* KPI Grid */}
            <div className="row g-2">
                <div className="col-12 col-sm-6">
                    <StatCard
                        title="Total Drivers"
                        value={stats?.totalDrivers?.count || '0'}
                        delta="+12%"
                        positive
                        updatedAt={stats?.totalDrivers?.lastUpdateDate ? formatDate(stats.totalDrivers.lastUpdateDate) : 'N/A'}
                        icon={<Users size={15} />}
                    />
                </div>
                <div className="col-12 col-sm-6">
                    <StatCard
                        title="Total Trips"
                        value={stats?.totalTrips?.count || '0'}
                        delta="+5%"
                        positive
                        updatedAt={stats?.totalTrips?.lastUpdateDate ? formatDate(stats.totalTrips.lastUpdateDate) : 'N/A'}
                        icon={<Briefcase size={15} />}
                    />
                </div>
                <div className="col-12 col-sm-6">
                    <StatCard
                        title="Total Companies"
                        value={stats?.totalCompanies?.count || '0'}
                        delta="-8%"
                        positive={false}
                        updatedAt={stats?.totalCompanies?.lastUpdateDate ? formatDate(stats.totalCompanies.lastUpdateDate) : 'N/A'}
                        icon={<Building2 size={12} />}
                    />
                </div>
                <div className="col-12 col-sm-6">
                    <StatCard
                        title="Total Fleets"
                        value={stats?.totalFleets?.count || '0'}
                        delta="+12%"
                        positive
                        updatedAt={stats?.totalFleets?.lastUpdateDate ? formatDate(stats.totalFleets.lastUpdateDate) : 'N/A'}
                        icon={<Truck size={15} />}
                    />
                </div>
            </div>
        </div>
    );
}