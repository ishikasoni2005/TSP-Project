import { Cpu, Sigma } from "lucide-react";

import { ALGORITHM_OPTIONS, PARAMETER_FIELDS } from "../utils/tsp";


function AlgorithmSelector({ onAlgorithmChange, onParameterChange, parameters, value }) {
  const selectedAlgorithm = ALGORITHM_OPTIONS.find((algorithm) => algorithm.value === value);
  const parameterFields = PARAMETER_FIELDS[value] || [];

  return (
    <section className="section-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="control-label">Algorithm</p>
          <h2 className="font-display text-xl font-bold">Choose a solver</h2>
        </div>
        <div className="rounded-2xl bg-brand-500/10 p-3 text-brand-700 dark:text-brand-200">
          <Cpu className="h-5 w-5" />
        </div>
      </div>

      <label className="mt-4 block">
        <span className="control-label">Selected Method</span>
        <select
          className="input-field"
          onChange={(event) => onAlgorithmChange(event.target.value)}
          value={value}
        >
          {ALGORITHM_OPTIONS.map((algorithm) => (
            <option key={algorithm.value} value={algorithm.value}>
              {algorithm.label}
            </option>
          ))}
        </select>
      </label>

      {selectedAlgorithm ? (
        <div className="mt-4 rounded-3xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Sigma className="h-4 w-4" />
            {selectedAlgorithm.complexity}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {selectedAlgorithm.description}
          </p>
        </div>
      ) : null}

      <div className="mt-5">
        <p className="control-label">Parameters</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {parameterFields.map((field) => (
            <label key={field.key}>
              <span className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                {field.label}
              </span>
              <input
                className="input-field py-2.5"
                max={field.max}
                min={field.min}
                onChange={(event) => {
                  const rawValue = event.target.value;
                  const valueToStore =
                    field.type === "number" && rawValue !== "" ? Number(rawValue) : rawValue;
                  onParameterChange(field.key, valueToStore);
                }}
                step={field.step}
                type={field.type}
                value={parameters[field.key] ?? ""}
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AlgorithmSelector;
