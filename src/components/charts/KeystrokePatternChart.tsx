import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface KeystrokePattern {
  timestamp: number;
  dwellTime: number;
  flightTime: number;
}

interface Props {
  patterns: KeystrokePattern[];
  taskType: string;
}

export function KeystrokePatternChart({ patterns, taskType }: Props) {
  const data = {
    labels: patterns.map((_, index) => `Keystroke ${index + 1}`),
    datasets: [
      {
        label: 'Dwell Time (ms)',
        data: patterns.map(p => p.dwellTime),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Flight Time (ms)',
        data: patterns.map(p => p.flightTime),
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Keystroke Patterns - ${taskType} Task`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (ms)'
        }
      }
    }
  };

  return <Line data={data} options={options} />;
}