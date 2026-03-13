import { Download, FolderOpen, RefreshCw, Save } from "lucide-react";
import { useEffect, useState } from "react";

import DatasetUploader from "../components/DatasetUploader";
import { useTsp } from "../context/TspContext";
import { solverApi } from "../services/api";
import { extractApiError, formatDateTime } from "../utils/tsp";


function DatasetManager() {
  const {
    activeDataset,
    cities,
    datasets,
    datasetsLoading,
    exportCities,
    importCities,
    loadDataset,
    refreshDatasets,
    resetWorkspace,
    setActiveDataset,
  } = useTsp();
  const [datasetName, setDatasetName] = useState(activeDataset?.name || "");
  const [description, setDescription] = useState(activeDataset?.description || "");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    refreshDatasets();
  }, []);

  useEffect(() => {
    setDatasetName(activeDataset?.name || "");
    setDescription(activeDataset?.description || "");
  }, [activeDataset]);

  function handleImport(payload) {
    try {
      const parsed = importCities(payload);
      setDatasetName(parsed.name);
      setDescription(parsed.description);
      setFeedback(`Imported ${parsed.cities.length} cities into the workspace.`);
      setError("");
    } catch (importError) {
      setFeedback("");
      setError(importError.message);
    }
  }

  async function handleSaveDataset() {
    if (cities.length < 2) {
      setError("Add at least two cities before saving a dataset.");
      return;
    }

    setSaving(true);
    setError("");
    setFeedback("");

    try {
      const savedDataset = await solverApi.saveDataset({
        name: datasetName || `Dataset ${new Date().toLocaleDateString()}`,
        description,
        cities,
        metadata: {
          city_count: cities.length,
        },
      });

      setActiveDataset({
        id: savedDataset.id,
        name: savedDataset.name,
        description: savedDataset.description,
      });
      await refreshDatasets();
      setFeedback(`Saved "${savedDataset.name}" to the backend store.`);
    } catch (saveError) {
      setError(extractApiError(saveError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
      <div className="space-y-6">
        <DatasetUploader onImport={handleImport} />

        <section className="section-card">
          <p className="control-label">Save</p>
          <h2 className="font-display text-2xl font-bold">Persist the current workspace</h2>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="control-label">Dataset Name</span>
              <input
                className="input-field"
                onChange={(event) => setDatasetName(event.target.value)}
                placeholder="Semester 4 Demo"
                value={datasetName}
              />
            </label>

            <label className="block">
              <span className="control-label">Description</span>
              <textarea
                className="input-field min-h-[110px]"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What makes this dataset useful?"
                value={description}
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn-primary" disabled={saving} onClick={handleSaveDataset} type="button">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Dataset"}
            </button>
            <button className="btn-secondary" onClick={() => exportCities(datasetName)} type="button">
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </button>
            <button className="btn-secondary" onClick={resetWorkspace} type="button">
              Reset Workspace
            </button>
          </div>

          {feedback ? <p className="mt-4 text-sm font-medium text-emerald-500">{feedback}</p> : null}
          {error ? <p className="mt-4 text-sm font-medium text-rose-500">{error}</p> : null}
        </section>
      </div>

      <div className="space-y-6">
        <section className="section-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="control-label">Stored Datasets</p>
              <h2 className="font-display text-2xl font-bold">Backend collection</h2>
            </div>
            <button className="btn-secondary" onClick={refreshDatasets} type="button">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {datasetsLoading ? <p className="text-sm text-slate-500 dark:text-slate-400">Loading datasets...</p> : null}
            {!datasetsLoading && !datasets.length ? (
              <p className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No datasets saved yet. Import or save one from the current workspace.
              </p>
            ) : null}

            {datasets.map((dataset) => (
              <article
                className="rounded-[28px] border border-slate-200/70 bg-white/65 p-5 dark:border-slate-700 dark:bg-slate-950/35"
                key={dataset.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold">{dataset.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{dataset.description || "No description yet."}</p>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      {dataset.cities.length} cities · Updated {formatDateTime(dataset.updated_at)}
                    </p>
                  </div>
                  <button className="btn-secondary" onClick={() => loadDataset(dataset)} type="button">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Load
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-card">
          <p className="control-label">Current Workspace</p>
          <h2 className="font-display text-2xl font-bold">{activeDataset?.name || "Unsaved workspace"}</h2>
          <div className="mt-5 max-h-[420px] overflow-y-auto rounded-[28px] border border-slate-200/80 bg-white/55 dark:border-slate-700 dark:bg-slate-950/25">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-white/90 dark:bg-slate-950/80">
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 font-semibold">City</th>
                  <th className="px-4 py-3 font-semibold">Latitude</th>
                  <th className="px-4 py-3 font-semibold">Longitude</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city, index) => (
                  <tr className="border-b border-slate-200/70 dark:border-slate-800" key={`${city.name}-${index}`}>
                    <td className="px-4 py-3">{city.name}</td>
                    <td className="px-4 py-3">{city.lat}</td>
                    <td className="px-4 py-3">{city.lng}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DatasetManager;
