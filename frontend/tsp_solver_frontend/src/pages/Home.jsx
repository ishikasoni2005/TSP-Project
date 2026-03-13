import {
  Activity,
  ArrowRight,
  Database,
  Map,
  Sparkles,
  TimerReset,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useTsp } from "../context/TspContext";
import { ALGORITHM_OPTIONS } from "../utils/tsp";


const highlights = [
  {
    title: "Dual visualization surfaces",
    description: "Switch between a real-world Leaflet map and a canvas-focused animation board.",
    icon: Map,
  },
  {
    title: "Live solver telemetry",
    description: "Django Channels streams progress events so long-running heuristics can animate in real time.",
    icon: Activity,
  },
  {
    title: "Reusable datasets",
    description: "Import, export, save, and reload city collections without losing your working set.",
    icon: Database,
  },
  {
    title: "Performance comparisons",
    description: "Compare distance and runtime across all supported algorithms with Chart.js.",
    icon: TimerReset,
  },
];


function Home() {
  const { activeDataset, cities, comparisonResults, datasets, lastResult } = useTsp();

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="section-card relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-cyan-300 to-ember-400" />
          <p className="metric-chip">
            <Sparkles className="h-3.5 w-3.5" />
            Production-ready React + Django architecture
          </p>

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Explore Travelling Salesman routes with live algorithms, maps, and comparison charts.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
            This workspace modernizes the original single-page prototype into a full-stack application with
            reusable datasets, real-time progress streaming, and separate views for solving, comparing, and
            managing input data.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/visualizer">
              Open Visualizer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link className="btn-secondary" to="/datasets">
              Manage Datasets
            </Link>
            <Link className="btn-secondary" to="/comparison">
              Compare Algorithms
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="section-card">
            <p className="control-label">Workspace Snapshot</p>
            <div className="mt-2 grid gap-3">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Active dataset</p>
                <p className="mt-1 font-display text-2xl font-bold">{activeDataset?.name || "Unsaved"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Cities ready to solve</p>
                <p className="mt-1 font-display text-3xl font-bold">{cities.length}</p>
              </div>
            </div>
          </div>

          <div className="section-card">
            <p className="control-label">Recent activity</p>
            <div className="mt-2 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>Saved datasets: {datasets.length}</p>
              <p>Comparison runs: {comparisonResults.length}</p>
              <p>Last algorithm: {lastResult?.algorithm || "No solver runs yet"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <article className="section-card" key={item.title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-700 dark:text-brand-200">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="section-card">
          <p className="control-label">Workflow</p>
          <h2 className="font-display text-2xl font-bold">How teams use the solver</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            <p>1. Add cities on the map or import a saved JSON dataset.</p>
            <p>2. Tune solver parameters based on exact or heuristic search requirements.</p>
            <p>3. Watch route construction update live through WebSocket events.</p>
            <p>4. Replay the history, then compare all algorithms on the same dataset.</p>
          </div>
        </div>

        <div className="section-card">
          <p className="control-label">Algorithms</p>
          <div className="grid gap-4 md:grid-cols-2">
            {ALGORITHM_OPTIONS.map((algorithm) => (
              <article className="rounded-[28px] border border-slate-200/70 bg-white/65 p-5 dark:border-slate-700 dark:bg-slate-950/35" key={algorithm.value}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-xl font-bold">{algorithm.label}</h3>
                  <span className="metric-chip">{algorithm.complexity}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{algorithm.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
