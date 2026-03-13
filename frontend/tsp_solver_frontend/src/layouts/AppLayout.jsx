import { Moon, Route as RouteIcon, Sparkles, SunMedium } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useTsp } from "../context/TspContext";


const navItems = [
  { to: "/", label: "Home" },
  { to: "/visualizer", label: "Visualizer" },
  { to: "/datasets", label: "Datasets" },
  { to: "/comparison", label: "Comparison" },
];


function AppLayout() {
  const { activeDataset, cities, comparisonResults, lastResult, theme, toggleTheme } = useTsp();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[-12rem] top-[-8rem] h-64 w-64 rounded-full bg-brand-300/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-28 h-72 w-72 rounded-full bg-ember-400/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        <header className="glass-panel sticky top-4 z-20 mb-6 px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-brand-500/15 p-3 text-brand-700 dark:text-brand-200">
                <RouteIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-lg font-bold tracking-tight">Advanced TSP Visual Solver</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  React + Django workspace for live Travelling Salesman exploration
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="metric-chip">
                <Sparkles className="h-3.5 w-3.5" />
                {cities.length} active cities
              </span>
              <span className="metric-chip">
                Dataset: {activeDataset?.name || "Unsaved workspace"}
              </span>
              <span className="metric-chip">
                Comparisons: {comparisonResults.length}
              </span>
              {lastResult ? <span className="metric-chip">Last run: {lastResult.algorithm}</span> : null}
              <button className="btn-secondary px-3 py-2" onClick={toggleTheme} type="button">
                {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <nav className="mt-4 flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                      : "bg-white/60 text-slate-600 hover:text-brand-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:text-brand-200"
                  }`
                }
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
