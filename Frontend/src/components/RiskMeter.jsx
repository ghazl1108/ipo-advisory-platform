// src/components/RiskMeter.jsx
import { useEffect, useState } from "react";

export function RiskMeter({ value, size = 140 }) {
  const [currentValue, setCurrentValue] = useState(0);

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentValue(value);
    }, 100);

    return () => clearTimeout(timer);
  }, [value]);

  // Calculate angle for the needle (from -90 to 90 degrees)
  const angle = -90 + (currentValue / 100) * 180;

  // Calculate color based on risk level
  const getColor = (val) => {
    if (val < 30) return "#22c55e"; // Green for low risk
    if (val < 70) return "#f59e0b"; // Amber for medium risk
    return "#ef4444"; // Red for high risk
  };

  const needleColor = getColor(currentValue);

  return (
    <div className="relative" style={{ width: size, height: size / 2 + 10 }}>
      {/* Semicircle background */}
      <div
        className="absolute"
        style={{
          width: size,
          height: size / 2,
          borderTopLeftRadius: size / 2,
          borderTopRightRadius: size / 2,
          background: "linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #ef4444 100%)",
          overflow: "hidden",
          top: 0,
          left: 0,
        }}
      />

      {/* Needle */}
      <div
        className="absolute origin-bottom"
        style={{
          width: 2,
          height: size / 2 - 10,
          backgroundColor: needleColor,
          bottom: 10,
          left: size / 2,
          transform: `rotate(${angle}deg)`,
          transition: "transform 1s ease-in-out",
          transformOrigin: "bottom center",
          zIndex: 10,
        }}
      />

      {/* Needle base */}
      <div
        className="absolute rounded-full bg-slate-800"
        style={{
          width: 10,
          height: 10,
          bottom: 5,
          left: size / 2 - 5,
          zIndex: 20,
        }}
      />

      {/* Labels */}
      <div className="absolute text-xs font-medium text-slate-700" style={{ bottom: -5, left: 5 }}>
        Low
      </div>
      <div
        className="absolute text-xs font-medium text-slate-700"
        style={{ bottom: -5, left: "50%", transform: "translateX(-50%)" }}
      >
        Medium
      </div>
      <div className="absolute text-xs font-medium text-slate-700" style={{ bottom: -5, right: 5 }}>
        High
      </div>
    </div>
  );
}