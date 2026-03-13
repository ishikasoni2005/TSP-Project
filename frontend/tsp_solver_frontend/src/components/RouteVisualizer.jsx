import { useEffect, useRef, useState } from "react";

import { canvasPointToGeo, projectCitiesToCanvas } from "../utils/tsp";


function RouteVisualizer({ cities, currentStep, interactive, onAddCity, routeIndices, theme }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const boundsRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 960, height: 540 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setDimensions({
        width: Math.floor(entry.contentRect.width),
        height: 540,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, dimensions.width, dimensions.height);

    context.fillStyle = theme === "dark" ? "#020617" : "#f8fafc";
    context.fillRect(0, 0, dimensions.width, dimensions.height);

    context.strokeStyle = theme === "dark" ? "rgba(148, 163, 184, 0.12)" : "rgba(148, 163, 184, 0.18)";
    for (let x = 0; x < dimensions.width; x += 40) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, dimensions.height);
      context.stroke();
    }
    for (let y = 0; y < dimensions.height; y += 40) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(dimensions.width, y);
      context.stroke();
    }

    const projection = projectCitiesToCanvas(cities, dimensions.width, dimensions.height);
    boundsRef.current = projection.bounds;

    if (!projection.points.length) {
      context.fillStyle = theme === "dark" ? "#cbd5e1" : "#475569";
      context.font = "600 20px Manrope";
      context.fillText("Add cities to begin the canvas visualization.", 42, 72);
      return;
    }

    const points = projection.points;
    const activeRoute = routeIndices.map((index) => points[index]).filter(Boolean);

    if (activeRoute.length > 1) {
      context.beginPath();
      context.strokeStyle = theme === "dark" ? "#67e8f9" : "#0891b2";
      context.lineWidth = 4;
      context.moveTo(activeRoute[0].x, activeRoute[0].y);
      activeRoute.slice(1).forEach((point) => context.lineTo(point.x, point.y));
      context.stroke();
    }

    points.forEach((point, index) => {
      context.beginPath();
      context.fillStyle = index === 0 ? "#f97316" : theme === "dark" ? "#22d3ee" : "#0f172a";
      context.arc(point.x, point.y, index === 0 ? 10 : 8, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = theme === "dark" ? "#e2e8f0" : "#0f172a";
      context.font = "600 14px Manrope";
      context.fillText(cities[index].name, point.x + 14, point.y - 10);
    });

    if (currentStep) {
      context.fillStyle = theme === "dark" ? "rgba(15, 23, 42, 0.82)" : "rgba(255, 255, 255, 0.88)";
      context.fillRect(24, 24, 250, 90);
      context.strokeStyle = theme === "dark" ? "rgba(103, 232, 249, 0.22)" : "rgba(8, 145, 178, 0.18)";
      context.strokeRect(24, 24, 250, 90);

      context.fillStyle = theme === "dark" ? "#f8fafc" : "#0f172a";
      context.font = "700 18px Space Grotesk";
      context.fillText("Current Step", 42, 52);
      context.font = "500 14px Manrope";
      context.fillText(`Stage: ${currentStep.stage || "running"}`, 42, 76);
      context.fillText(`Distance: ${Number(currentStep.distance || 0).toFixed(2)} km`, 42, 98);
    }
  }, [cities, currentStep, dimensions.height, dimensions.width, routeIndices, theme]);

  function handleCanvasClick(event) {
    if (!interactive || !onAddCity || !boundsRef.current) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const geoPoint = canvasPointToGeo(x, y, boundsRef.current);

    if (geoPoint) {
      onAddCity(geoPoint.lat, geoPoint.lng);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-slate-200/70 dark:border-slate-700/80" ref={containerRef}>
      <div className="absolute left-4 top-4 z-10 rounded-2xl bg-slate-950/75 px-3 py-2 text-xs font-medium text-white">
        Canvas mode compresses the current geography into an animation-friendly layout.
      </div>
      <canvas
        className="h-[540px] w-full cursor-crosshair bg-transparent"
        height={dimensions.height}
        onClick={handleCanvasClick}
        ref={canvasRef}
        width={dimensions.width}
      />
    </div>
  );
}

export default RouteVisualizer;
