// src/components/PriceChart.jsx
import { useEffect, useRef, useState } from "react";

export function PriceChart({ initialPrice, closingPrice }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 20;

    // Calculate price range
    const minPrice = Math.min(initialPrice, closingPrice) * 0.9;
    const maxPrice = Math.max(initialPrice, closingPrice) * 1.1;
    const priceRange = maxPrice - minPrice;

    // Draw axes
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw price labels
    ctx.fillStyle = "#64748b";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    // Min price
    ctx.fillText(`$${minPrice.toFixed(2)}`, padding - 5, height - padding);

    // Max price
    ctx.fillText(`$${maxPrice.toFixed(2)}`, padding - 5, padding);

    // Draw initial price marker
    const initialY = height - padding - ((initialPrice - minPrice) / priceRange) * (height - 2 * padding);

    ctx.beginPath();
    ctx.moveTo(padding, initialY);
    ctx.lineTo(padding + 10, initialY);
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#2563eb";
    ctx.textAlign = "left";
    ctx.fillText(`$${initialPrice.toFixed(2)}`, padding + 15, initialY);

    // Calculate current price based on progress
    const currentPrice = initialPrice + (closingPrice - initialPrice) * (progress / 100);
    const currentY = height - padding - ((currentPrice - minPrice) / priceRange) * (height - 2 * padding);

    // Draw price curve
    ctx.beginPath();
    ctx.moveTo(padding, initialY);

    // Create a smooth curve
    const controlPoints = [];
    const numPoints = 10;

    for (let i = 0; i <= numPoints; i++) {
      const x = padding + (i / numPoints) * (width - 2 * padding) * (progress / 100);

      // Add some randomness to make it look like a stock chart
      const randomFactor = Math.sin(i * 0.5) * 10;
      const ratio = i / numPoints;
      const targetY = initialY + (currentY - initialY) * ratio;
      const y = targetY + randomFactor * ratio;

      controlPoints.push({ x, y });

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fill area under the curve
    ctx.lineTo(controlPoints[controlPoints.length - 1].x, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = "rgba(37, 99, 235, 0.1)";
    ctx.fill();

    // Draw current price marker if progress is complete
    if (progress === 100) {
      const endX = width - padding;

      ctx.beginPath();
      ctx.moveTo(endX - 10, currentY);
      ctx.lineTo(endX, currentY);
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#2563eb";
      ctx.textAlign = "right";
      ctx.fillText(`$${closingPrice.toFixed(2)}`, endX - 15, currentY);
    }
  }, [initialPrice, closingPrice, progress]);

  return <canvas ref={canvasRef} width={300} height={150} className="w-full h-full" />;
}