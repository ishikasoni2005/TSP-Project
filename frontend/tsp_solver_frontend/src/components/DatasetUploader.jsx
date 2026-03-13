import { FileJson, UploadCloud } from "lucide-react";
import { useId, useState } from "react";


function DatasetUploader({ onImport }) {
  const inputId = useId();
  const [error, setError] = useState("");

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const contents = await file.text();
      const payload = JSON.parse(contents);
      onImport(payload);
      setError("");
    } catch (readError) {
      setError(readError.message || "Unable to parse the selected JSON file.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <section className="section-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="control-label">Import</p>
          <h2 className="font-display text-xl font-bold">Dataset uploader</h2>
        </div>
        <div className="rounded-2xl bg-brand-500/10 p-3 text-brand-700 dark:text-brand-200">
          <FileJson className="h-5 w-5" />
        </div>
      </div>

      <label
        className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-brand-300 bg-brand-50/60 px-6 py-10 text-center transition hover:border-brand-400 hover:bg-brand-50 dark:border-brand-500/40 dark:bg-brand-500/5"
        htmlFor={inputId}
      >
        <UploadCloud className="h-8 w-8 text-brand-600 dark:text-brand-300" />
        <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-100">Drop in a JSON dataset</p>
        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Expected shape: {"{ name, description, cities: [{ name, lat, lng }] }"}.
        </p>
      </label>

      <input accept=".json,application/json" className="hidden" id={inputId} onChange={handleFileChange} type="file" />

      {error ? <p className="mt-4 text-sm font-medium text-rose-500">{error}</p> : null}
    </section>
  );
}

export default DatasetUploader;
