import { Pause, Play, RotateCcw, Wifi } from "lucide-react";


const visualizationModes = [
  { value: "map", label: "Real Map" },
  { value: "canvas", label: "Canvas" },
];


function ControlPanel({
  connectionState,
  currentStepIndex,
  historyLength,
  isPlaying,
  onPauseToggle,
  onReset,
  onRun,
  onVisualModeChange,
  setSpeed,
  solving,
  speed,
  visualMode,
}) {
  return (
    <section className="section-card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="control-label">Playback</p>
          <h2 className="font-display text-xl font-bold">Live controls</h2>
        </div>
        <span className="metric-chip">
          <Wifi className="h-3.5 w-3.5" />
          {connectionState}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button className="btn-primary" disabled={solving} onClick={onRun} type="button">
          <Play className="mr-2 h-4 w-4" />
          {solving ? "Solving..." : "Start"}
        </button>
        <button
          className="btn-secondary"
          disabled={historyLength < 2 || solving}
          onClick={onPauseToggle}
          type="button"
        >
          <Pause className="mr-2 h-4 w-4" />
          {isPlaying ? "Pause" : "Resume"}
        </button>
        <button className="btn-secondary" onClick={onReset} type="button">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="control-label">Animation Speed</p>
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{speed} ms</span>
        </div>
        <input
          className="mt-1 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 dark:bg-slate-700"
          max="1400"
          min="120"
          onChange={(event) => setSpeed(Number(event.target.value))}
          step="40"
          type="range"
          value={speed}
        />
      </div>

      <div className="mt-5">
        <p className="control-label">Visualization Mode</p>
        <div className="grid grid-cols-2 gap-2">
          {visualizationModes.map((mode) => (
            <button
              key={mode.value}
              className={
                visualMode === mode.value
                  ? "rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-brand-500"
                  : "rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300"
              }
              onClick={() => onVisualModeChange(mode.value)}
              type="button"
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-200/80 bg-white/60 p-4 text-sm dark:border-slate-700 dark:bg-slate-950/30">
        <p className="font-semibold text-slate-700 dark:text-slate-200">Playback step</p>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {historyLength ? `${currentStepIndex + 1} / ${historyLength}` : "No history yet"}
        </p>
      </div>
    </section>
  );
}

export default ControlPanel;
