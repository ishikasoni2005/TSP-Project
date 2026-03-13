import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { useTsp } from "../context/TspContext";


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


function PerformanceChart({ results }) {
  const { theme } = useTsp();
  const successfulResults = results.filter((result) => !result.error);

  if (!successfulResults.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Run a comparison to populate the performance chart.
      </div>
    );
  }

  const chartData = {
    labels: successfulResults.map((result) => result.label || result.algorithm),
    datasets: [
      {
        label: "Distance (km)",
        data: successfulResults.map((result) => Number(result.distance).toFixed(2)),
        backgroundColor: theme === "dark" ? "rgba(103, 232, 249, 0.7)" : "rgba(8, 145, 178, 0.75)",
        borderRadius: 14,
        yAxisID: "distance",
      },
      {
        label: "Execution Time (ms)",
        data: successfulResults.map((result) => Number(result.time_ms).toFixed(2)),
        backgroundColor: theme === "dark" ? "rgba(251, 146, 60, 0.72)" : "rgba(249, 115, 22, 0.75)",
        borderRadius: 14,
        yAxisID: "time",
      },
    ],
  };

  const axisColor = theme === "dark" ? "#cbd5e1" : "#334155";
  const gridColor = theme === "dark" ? "rgba(148, 163, 184, 0.18)" : "rgba(148, 163, 184, 0.22)";

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: axisColor,
          font: {
            family: "Manrope",
            weight: "600",
          },
        },
      },
    },
    scales: {
      distance: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: axisColor,
        },
      },
      time: {
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        position: "right",
        ticks: {
          color: axisColor,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: axisColor,
        },
      },
    },
  };

  return (
    <div className="h-[360px]">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default PerformanceChart;
