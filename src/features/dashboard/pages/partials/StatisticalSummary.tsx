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

{/* KPI Grid */}
export default function StatisticalSummary() {
    return (
        <div className="row g-2">
            <div className="col-12 col-sm-6">
                <StatCard
                    title="Total Drivers"
                    value={560}
                    delta="+12%"
                    positive
                    updatedAt="July 16, 2023"
                    icon={<Users size={15} />}
                />
            </div>
            <div className="col-12 col-sm-6">
                <StatCard
                    title="Total Trips"
                    value={1050}
                    delta="+5%"
                    positive
                    updatedAt="July 14, 2023"
                    icon={<Briefcase size={15} />}
                />
            </div>
            <div className="col-12 col-sm-6">
                <StatCard
                    title="Total Companies"
                    value={470}
                    delta="-8%"
                    positive={false}
                    updatedAt="July 14, 2023"
                    icon={<Building2 size={12} />}
                />
            </div>
            <div className="col-12 col-sm-6">
                <StatCard
                    title="Total Fleets"
                    value={250}
                    delta="+12%"
                    positive
                    updatedAt="July 10, 2023"
                    icon={<Truck size={15} />}
                />
            </div>
        </div>
    );
}
