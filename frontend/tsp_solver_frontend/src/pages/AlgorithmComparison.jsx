import { Gauge, Trophy } from "lucide-react";
import { useState } from "react";

import PerformanceChart from "../components/PerformanceChart";
import { useTsp } from "../context/TspContext";
import { solverApi } from "../services/api";
import {
  ALGORITHM_OPTIONS,
  extractApiError,
  formatDistance,
  formatDuration,
  getDefaultParameters,
} from "../utils/tsp";


function AlgorithmComparison() {
  const { activeDataset, cities, comparisonResults, setComparisonResults } = useTsp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const successfulResults = comparisonResults.filter((result) => result.status === "success");
  const bestDistanceResult = successfulResults.reduce(
    (best, current) => (!best || current.distance < best.distance ? current : best),
    null,
  );
  const bestTimeResult = successfulResults.reduce(
    (best, current) => (!best || current.time_ms < best.time_ms ? current : best),
    null,
  );

  async function handleCompare() {
    if (cities.length < 2) {
      setError("At least two cities are required before running a comparison.");
      return;
    }

    setLoading(true);
    setError("");

    const nextResults = [];

    for (const algorithm of ALGORITHM_OPTIONS) {
      const parameters = getDefaultParameters(algorithm.value);

      if (parameters.max_cities && cities.length > parameters.max_cities) {
        nextResults.push({
          algorithm: algorithm.value,
          error: `${algorithm.label} is limited to ${parameters.max_cities} cities in this build.`,
          label: algorithm.label,
          status: "failed",
        });
        continue;
      }

      try {
        const result = await solverApi.solve({
          algorithm: algorithm.value,
          cities,
          parameters,
        });
        nextResults.push({
          ...result,
          label: algorithm.label,
          status: "success",
        });
      } catch (compareError) {
        nextResults.push({
          algorithm: algorithm.value,
          error: extractApiError(compareError),
          label: algorithm.label,
          status: "failed",
        });
      }
    }

    setComparisonResults(nextResults);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="section-card">
          <p className="control-label">Comparison</p>
          <h1 className="font-display text-3xl font-bold">Benchmark all algorithms on one dataset</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Run the exact and heuristic solvers against the same set of coordinates to compare route quality
            and compute time side by side.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="metric-chip">{cities.length} cities</span>
            <span className="metric-chip">{activeDataset?.name || "Unsaved workspace"}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-primary" disabled={loading} onClick={handleCompare} type="button">
              <Gauge className="mr-2 h-4 w-4" />
              {loading ? "Comparing..." : "Run Comparison"}
            </button>
          </div>

          {error ? <p className="mt-4 text-sm font-medium text-rose-500">{error}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="section-card">
            <p className="control-label">Best Distance</p>
            <div className="mt-4 flex items-start gap-3">
              <div className="rounded-2xl bg-brand-500/10 p-3 text-brand-700 dark:text-brand-200">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold">
                  {bestDistanceResult ? bestDistanceResult.label : "No data yet"}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {bestDistanceResult ? formatDistance(bestDistanceResult.distance) : "Run a comparison first."}
                </p>
              </div>
            </div>
          </div>

          <div className="section-card">
            <p className="control-label">Fastest Runtime</p>
            <div className="mt-4 flex items-start gap-3">
              <div className="rounded-2xl bg-ember-400/10 p-3 text-ember-500">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold">
                  {bestTimeResult ? bestTimeResult.label : "No data yet"}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {bestTimeResult ? formatDuration(bestTimeResult.time_ms) : "Run a comparison first."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <p className="control-label">Performance Chart</p>
        <PerformanceChart results={comparisonResults} />
      </section>

      <section className="section-card">
        <p className="control-label">Results</p>
        <div className="space-y-3">
          {!comparisonResults.length ? (
            <p className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No comparison runs yet.
            </p>
          ) : null}

          {comparisonResults.map((result) => (
            <article
              className="rounded-[28px] border border-slate-200/70 bg-white/65 p-5 dark:border-slate-700 dark:bg-slate-950/35"
              key={result.label}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold">{result.label}</h2>
                  {result.status === "success" ? (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {formatDistance(result.distance)} · {formatDuration(result.time_ms)}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm font-medium text-rose-500">{result.error}</p>
                  )}
                </div>
                <span
                  className={
                    result.status === "success"
                      ? "metric-chip border-emerald-300/60 bg-emerald-50/80 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "metric-chip border-rose-300/60 bg-rose-50/80 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                  }
                >
                  {result.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AlgorithmComparison;
