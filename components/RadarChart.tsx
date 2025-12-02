import React from 'react';
import { ReviewMetrics } from '../types';

interface RadarChartProps {
  metrics: ReviewMetrics;
}

const RadarChart: React.FC<RadarChartProps> = ({ metrics }) => {
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const levels = 5;

  // Define the 5 axes
  const axes = [
    { label: '保守性', key: 'maintainability' as keyof ReviewMetrics },
    { label: '可読性', key: 'readability' as keyof ReviewMetrics },
    { label: '効率性', key: 'efficiency' as keyof ReviewMetrics },
    { label: '安全性', key: 'robustness' as keyof ReviewMetrics },
    { label: '一貫性', key: 'consistency' as keyof ReviewMetrics },
  ];

  // Calculate coordinates for a point on the chart
  const getCoordinates = (value: number, index: number, max: number = 5) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2; // Start from top (-90deg)
    const r = (value / max) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate grid lines (pentagons)
  const gridPolygons = [];
  for (let i = 1; i <= levels; i++) {
    const points = axes.map((_, index) => {
      const { x, y } = getCoordinates(i, index, levels);
      return `${x},${y}`;
    }).join(' ');
    gridPolygons.push(
      <polygon
        key={i}
        points={points}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="1"
      />
    );
  }

  // Generate the data polygon
  const dataPoints = axes.map((axis, index) => {
    const value = metrics[axis.key];
    const { x, y } = getCoordinates(value, index, 5);
    return `${x},${y}`;
  }).join(' ');

  // Axis lines and labels
  const axisLines = axes.map((axis, index) => {
    const { x, y } = getCoordinates(5, index, 5);
    // Label position (slightly outside)
    const labelPos = getCoordinates(6.2, index, 5);
    
    return (
      <g key={axis.key}>
        <line x1={center} y1={center} x2={x} y2={y} stroke="#cbd5e1" strokeWidth="1" />
        <text
          x={labelPos.x}
          y={labelPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-semibold fill-gray-600"
          style={{ fontSize: '12px' }}
        >
          {axis.label}
        </text>
        {/* Score Badge */}
        <text
            x={labelPos.x}
            y={labelPos.y + 15}
            textAnchor="middle"
            className="text-sm font-bold fill-green-600"
        >
             {metrics[axis.key]}/5
        </text>
      </g>
    );
  });

  return (
    <div className="flex justify-center items-center py-4">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="max-w-[350px]">
        {/* Background Grid */}
        {gridPolygons}
        
        {/* Axis Lines & Labels */}
        {axisLines}

        {/* Data Polygon */}
        <polygon
          points={dataPoints}
          fill="rgba(34, 197, 94, 0.2)" // green-500 with opacity
          stroke="#16a34a" // green-600
          strokeWidth="2"
        />
        
        {/* Data Points (Dots) */}
        {axes.map((axis, index) => {
           const value = metrics[axis.key];
           const { x, y } = getCoordinates(value, index, 5);
           return (
             <circle key={index} cx={x} cy={y} r="4" fill="#16a34a" />
           );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;
