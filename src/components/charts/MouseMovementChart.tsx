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

interface MouseMovement {
  timestamp: number;
  speed: number;
  acceleration: number;
}

interface Props {
  movements: MouseMovement[];
  taskType: string;
}

export function MouseMovementChart({ movements, taskType }: Props) {
  const data = {
    labels: movements.map((_, index) => `Movement ${index + 1}`),
    datasets: [
      {
        label: 'Speed (pixels/ms)',
        data: movements.map(m => m.speed),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Acceleration (pixels/ms²)',
        data: movements.map(m => m.acceleration),
        borderColor: 'rgb(54, 162, 235)',
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
        text: `Mouse Movement Patterns - ${taskType} Task`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Movement Metrics'
        }
      }
    }
  };

  return <Line data={data} options={options} />;
}