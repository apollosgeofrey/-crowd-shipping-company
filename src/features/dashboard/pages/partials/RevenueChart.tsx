import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function RevenueChart({ revenueData }: any) {
	const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	// Ensure that revenueData is passed and is an array with 7 elements
	const data = {
		labels,
		datasets: [
			{
				label: "Revenue Generated",
				// Use revenueData here; fallback to an empty array if not passed
				data: revenueData?.length === 7 ? revenueData : [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]], // start to end interval per day bar
				// data: revenueData?.length === 7 ? revenueData : [[0, 90], [0, 85], [0, 70], [0, 95], [0, 88], [0, 75], [0, 80]],
				backgroundColor: (context: any) => {
					const value = context.raw[1];
					if (value > 85) return "rgba(255, 99, 132, 0.9)"; // red
					if (value > 70) return "rgba(255, 159, 64, 0.9)"; // orange
					return "rgba(255, 205, 86, 0.9)"; // yellow
				},
				borderRadius: 6,
				borderSkipped: false,
			},
		],
	};

	const options = {
		indexAxis: "x" as const,
		responsive: true,
		plugins: {
			legend: { display: false },
			tooltip: {
				callbacks: {
					label: (ctx: any) => `${ctx.raw}%`,
				},
			},
		},
		scales: {
			y: {
				min: 0,
				max: 100,
				ticks: {
					callback: (val: any) => `${val}%`,
				},
			},
		},
	};

	return (
		<div className="card shadow-sm border-0 rounded-3">
			<div className="card-body">
				<div className="d-flex justify-content-between align-items-center mb-3">
					<h5 className="card-title mb-0 fw-semibold">Revenue Generated</h5>
					<select className="form-select form-select-sm w-auto">
						<option>Today</option>
						<option>This Week</option>
						<option>This Month</option>
					</select>
				</div>
				<Bar data={data} options={options} height={120} />
			</div>
		</div>
	);
}
