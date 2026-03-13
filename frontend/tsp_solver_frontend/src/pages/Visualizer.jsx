import {
  Activity,
  MapPinned,
  Route as RouteIcon,
  Trash2,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";

import AlgorithmSelector from "../components/AlgorithmSelector";
import ControlPanel from "../components/ControlPanel";
import MapCanvas from "../components/MapCanvas";
import RouteVisualizer from "../components/RouteVisualizer";
import { useTsp } from "../context/TspContext";
import { useSolverSocket } from "../hooks/useSolverSocket";
import { useVisualizationPlayback } from "../hooks/useVisualizationPlayback";
import { solverApi } from "../services/api";
import {
  extractApiError,
  formatDistance,
  formatDuration,
  generateSessionId,
  getDefaultParameters,
} from "../utils/tsp";


function Visualizer() {
  const {
    activeDataset,
    addCity,
    cities,
    lastResult,
    removeCity,
    setLastResult,
    theme,
    updateCity,
    visualMode,
    setVisualMode,
  } = useTsp();
  const initialAlgorithm = lastResult?.algorithm || "genetic";
  const [algorithm, setAlgorithm] = useState(initialAlgorithm);
  const [parameters, setParameters] = useState(getDefaultParameters(initialAlgorithm));
  const [history, setHistory] = useState(lastResult?.history || []);
  const [liveStep, setLiveStep] = useState(null);
  const [speed, setSpeed] = useState(620);
  const [error, setError] = useState("");
  const [solving, setSolving] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const playback = useVisualizationPlayback(history, speed);

  const { connectionState } = useSolverSocket(sessionId, {
    enabled: Boolean(sessionId),
    onMessage: (message) => {
      if (message.type === "progress") {
        setLiveStep(message.data);
      }

      if (message.type === "error") {
        setError(message.data?.message || "Live update stream failed.");
      }
    },
  });

  useEffect(() => {
    if (lastResult?.history?.length) {
      setHistory(lastResult.history);
      playback.setCurrentStepIndex(lastResult.history.length - 1);
    }
  }, []);

  function handleAlgorithmChange(nextAlgorithm) {
    setAlgorithm(nextAlgorithm);
    setParameters(getDefaultParameters(nextAlgorithm));
  }

  function handleParameterChange(key, value) {
    setParameters((currentParameters) => ({
      ...currentParameters,
      [key]: value,
    }));
  }

  function handleAddCity(lat, lng) {
    addCity(lat, lng);
  }

  async function handleRunSolver() {
    if (cities.length < 2) {
      setError("Add at least two cities before running a solver.");
      return;
    }

    const nextSessionId = generateSessionId();
    setSessionId(nextSessionId);
    setSolving(true);
    setError("");
    setHistory([]);
    setLiveStep(null);
    playback.resetPlayback();

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 150));
      const result = await solverApi.solve({
        algorithm,
        cities,
        parameters,
        session_id: nextSessionId,
      });

      setLastResult(result);
      setHistory(result.history || []);
      setLiveStep(result.history?.[result.history?.length - 1] || null);
      playback.setCurrentStepIndex(Math.max((result.history?.length || 1) - 1, 0));
    } catch (solveError) {
      setError(extractApiError(solveError));
    } finally {
      setSolving(false);
      window.setTimeout(() => setSessionId(""), 500);
    }
  }

  function handlePauseToggle() {
    if (!history.length) {
      return;
    }

    if (!playback.isPlaying && playback.currentStepIndex >= history.length - 1) {
      playback.setCurrentStepIndex(0);
    }

    playback.setIsPlaying((currentValue) => !currentValue);
  }

  function handleResetRun() {
    setHistory([]);
    setLiveStep(null);
    setError("");
    setLastResult(null);
    setSessionId("");
    playback.resetPlayback();
  }

  const displayedStep = solving
    ? liveStep
    : playback.currentStep || history[history.length - 1] || lastResult?.history?.[lastResult?.history?.length - 1];
  const displayedRoute = displayedStep?.route_indices || lastResult?.route_indices || [];
  const visibleHistory = solving && liveStep ? [liveStep] : [...history].slice(-8).reverse();

  return (
    <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
      <div className="space-y-6">
        <AlgorithmSelector
          onAlgorithmChange={handleAlgorithmChange}
          onParameterChange={handleParameterChange}
          parameters={parameters}
          value={algorithm}
        />

        <ControlPanel
          connectionState={connectionState}
          currentStepIndex={playback.currentStepIndex}
          historyLength={history.length}
          isPlaying={playback.isPlaying}
          onPauseToggle={handlePauseToggle}
          onReset={handleResetRun}
          onRun={handleRunSolver}
          onVisualModeChange={setVisualMode}
          setSpeed={setSpeed}
          solving={solving}
          speed={speed}
          visualMode={visualMode}
        />

        <section className="section-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="control-label">Workspace</p>
              <h2 className="font-display text-xl font-bold">{activeDataset?.name || "Unsaved workspace"}</h2>
            </div>
            <span className="metric-chip">
              <MapPinned className="h-3.5 w-3.5" />
              {cities.length} cities
            </span>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Click on the {visualMode === "map" ? "map" : "canvas"} to add cities. You can also rename
            or remove them below before launching a solver run.
          </p>

          <div className="mt-5 max-h-[360px] space-y-3 overflow-y-auto pr-1">
            {cities.map((city, index) => (
              <div
                className="rounded-[24px] border border-slate-200/70 bg-white/65 p-4 dark:border-slate-700 dark:bg-slate-950/35"
                key={`${city.name}-${index}`}
              >
                <div className="grid gap-3 sm:grid-cols-[1fr,110px,110px,44px]">
                  <input
                    className="input-field py-2.5"
                    onChange={(event) => updateCity(index, { name: event.target.value })}
                    value={city.name}
                  />
                  <input
                    className="input-field py-2.5"
                    onChange={(event) => {
                      if (event.target.value !== "") {
                        updateCity(index, { lat: Number(event.target.value) });
                      }
                    }}
                    step="0.0001"
                    type="number"
                    value={city.lat}
                  />
                  <input
                    className="input-field py-2.5"
                    onChange={(event) => {
                      if (event.target.value !== "") {
                        updateCity(index, { lng: Number(event.target.value) });
                      }
                    }}
                    step="0.0001"
                    type="number"
                    value={city.lng}
                  />
                  <button
                    className="btn-secondary px-0 py-0"
                    disabled={cities.length <= 2}
                    onClick={() => removeCity(index)}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="section-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="control-label">Visualization</p>
              <h1 className="font-display text-3xl font-bold">Route building workspace</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Watch the solver emit candidate routes and improvements as it works through the dataset.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="metric-chip">
                <RouteIcon className="h-3.5 w-3.5" />
                {algorithm}
              </span>
              <span className="metric-chip">
                <Waves className="h-3.5 w-3.5" />
                {visualMode}
              </span>
              <span className="metric-chip">
                <Activity className="h-3.5 w-3.5" />
                {solving ? "live stream" : "ready"}
              </span>
            </div>
          </div>

          {error ? (
            <div className="mt-5 rounded-3xl border border-rose-300/60 bg-rose-50/80 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          ) : null}

          <div className="mt-6">
            {visualMode === "map" ? (
              <MapCanvas
                cities={cities}
                interactive
                onAddCity={handleAddCity}
                routeIndices={displayedRoute}
                theme={theme}
              />
            ) : (
              <RouteVisualizer
                cities={cities}
                currentStep={displayedStep}
                interactive
                onAddCity={handleAddCity}
                routeIndices={displayedRoute}
                theme={theme}
              />
            )}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr,340px]">
          <section className="section-card">
            <p className="control-label">Current Result</p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-slate-200/80 bg-white/65 p-4 dark:border-slate-700 dark:bg-slate-950/35">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total distance</p>
                <p className="mt-2 font-display text-2xl font-bold">
                  {lastResult ? formatDistance(lastResult.distance) : "Not solved yet"}
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-200/80 bg-white/65 p-4 dark:border-slate-700 dark:bg-slate-950/35">
                <p className="text-sm text-slate-500 dark:text-slate-400">Execution time</p>
                <p className="mt-2 font-display text-2xl font-bold">
                  {lastResult ? formatDuration(lastResult.time_ms) : "Not solved yet"}
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-200/80 bg-white/65 p-4 dark:border-slate-700 dark:bg-slate-950/35">
                <p className="text-sm text-slate-500 dark:text-slate-400">History steps</p>
                <p className="mt-2 font-display text-2xl font-bold">{history.length || 0}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-slate-200/80 bg-white/65 p-5 dark:border-slate-700 dark:bg-slate-950/35">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Displayed route</p>
              <p className="mt-3 text-base leading-8 text-slate-700 dark:text-slate-100">
                {displayedStep?.route?.length
                  ? displayedStep.route.join(" → ")
                  : "Run a solver to generate route history."}
              </p>
            </div>
          </section>

          <section className="section-card">
            <p className="control-label">History Feed</p>
            <div className="space-y-3">
              {!visibleHistory.length ? (
                <p className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  No solver history yet.
                </p>
              ) : null}

              {visibleHistory.map((entry) => (
                <article
                  className="rounded-[24px] border border-slate-200/70 bg-white/65 p-4 dark:border-slate-700 dark:bg-slate-950/35"
                  key={`${entry.step}-${entry.stage}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        {entry.stage || "progress"}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-100">
                        {formatDistance(entry.distance)}
                      </p>
                    </div>
                    <span className="metric-chip">Step {entry.step + 1}</span>
                  </div>
                  {entry.temperature ? (
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      Temperature: {entry.temperature}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Visualizer;
