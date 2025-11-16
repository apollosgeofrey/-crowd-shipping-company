import { FaMoneyBillWave, FaExchangeAlt, FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";

interface TransactionStatsCardsProps {
    metaData?: any;
    loading?: boolean;
}

export default function TransactionStatsCards({ metaData, loading = false }: TransactionStatsCardsProps) {
    // Get stats from the meta summary
    const summary = metaData?.summary || {};
    
    // Helper function to safely get values
    const getSafeValue = (value: any, defaultValue: number = 0): number => {
        if (value === undefined || value === null) return defaultValue;
        return Number(value) || defaultValue;
    };

    // Format currency (divide by 100 since amounts are in kobo)
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount / 100);
    };

    // Format date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return "Just now";
        }
    };

    // Calculate net flow percentage
    const calculateNetFlowPercentage = () => {
        const credits = getSafeValue(summary.typeSummary?.totalCredits);
        const debits = getSafeValue(summary.typeSummary?.totalDebits);
        if (credits === 0) return 0;
        return Math.round(((credits - debits) / credits) * 100);
    };

    const statsCards = [
        { 
            id: 1, 
            title: "Total Revenue", 
            value: formatCurrency(getSafeValue(summary.totalRevenue)), 
            updated: summary.summaryUpdate ? formatDate(summary.summaryUpdate) : "Just now", 
            trend: calculateNetFlowPercentage(),
            icon: <FaMoneyBillWave className="fs-4" />, 
            bg: "bg-primary-subtle", 
            text: "text-primary",
            trendColor: calculateNetFlowPercentage() >= 0 ? "text-success" : "text-danger"
        }, { 
            id: 2, 
            title: "Total Payout", 
            value: formatCurrency(getSafeValue(summary.totalPayout)), 
            updated: summary.summaryUpdate ? formatDate(summary.summaryUpdate) : "Just now", 
            trend: 0, // You might want to calculate this based on previous data
            icon: <FaWallet className="fs-4" />, 
            bg: "bg-success-subtle", 
            text: "text-success",
            trendColor: "text-success"
        }, { 
            id: 3, 
            title: "Net Cash Flow", 
            value: formatCurrency(getSafeValue(summary.typeSummary?.netFlow)), 
            updated: summary.summaryUpdate ? formatDate(summary.summaryUpdate) : "Just now", 
            trend: calculateNetFlowPercentage(),
            icon: <FaExchangeAlt className="fs-4" />, 
            bg: "bg-info-subtle", 
            text: "text-info",
            trendColor: getSafeValue(summary.typeSummary?.netFlow) >= 0 ? "text-success" : "text-danger"
        }, { 
            id: 4, 
            title: "Completed Today", 
            value: getSafeValue(summary.completedToday).toLocaleString(), 
            updated: summary.summaryUpdate ? formatDate(summary.summaryUpdate) : "Just now", 
            trend: 0, // You might want to calculate this based on previous day
            icon: <FaMoneyBillWave className="fs-4" />, 
            bg: "bg-warning-subtle", 
            text: "text-warning",
            trendColor: getSafeValue(summary.completedToday) > 0 ? "text-success" : "text-secondary"
        },
    ];

    if (loading) {
        return (
            <div className="row g-3">
                {[1, 2, 3, 4].map((id) => (
                    <div key={id} className="col-md-6 col-lg-3">
                        <div className="card border-0 shadow-sm rounded-3 bg-light">
                            <div className="card-body d-flex justify-content-between align-items-start">
                                <div className="d-flex align-items-start gap-3 w-100">
                                    <div className="p-2 rounded-3 bg-white placeholder-glow">
                                        <div style={{ width: '24px', height: '24px' }}></div>
                                    </div>
                                    <div className="w-100">
                                        <h6 className="fw-semibold mb-2 placeholder-glow">
                                            <span className="placeholder col-8"></span>
                                        </h6>
                                        <h4 className="fw-bold placeholder-glow">
                                            <span className="placeholder col-6"></span>
                                        </h4>
                                        <small className="text-muted placeholder-glow">
                                            <span className="placeholder col-4"></span>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="row g-3">
            {statsCards.map((s) => (
                <div key={s.id} className="col-md-6 col-lg-3">
                    <div className={`card border-0 shadow-sm rounded-3 ${s.bg}`}>
                        <div className="card-body d-flex justify-content-between align-items-start">
                            {/* Left side */}
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    {s.icon}
                                    <h6 className={`fw-semibold mb-0 ${s.text}`}>{s.title}</h6>
                                </div>
                                <h4 className={`fw-bold ${s.text}`}>{s.value}</h4>
                                <small className="text-muted">Updated: {s.updated}</small>
                            </div>

                            {/* Right side trend */}
                            <div className="text-end ms-3">
                                <span className={`fw-semibold ${s.trendColor}`}>
                                    {s.trend > 0 ? (
                                        <><FaArrowUp /> {Math.abs(s.trend)}%</>
                                    ) : s.trend < 0 ? (
                                        <><FaArrowDown /> {Math.abs(s.trend)}%</>
                                    ) : (
                                        <span>0%</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}