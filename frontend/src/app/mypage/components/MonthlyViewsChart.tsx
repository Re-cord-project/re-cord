"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
    },
  },
};

const labels = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

export const data = {
  labels,
  datasets: [
    {
      label: "월간 조회수",
      data: [65, 102, 84, 156, 132, 168, 210, 192, 234, 252, 267, 312],
      backgroundColor: "#60a5fa",
    },
  ],
};

export default function MonthlyViewsChart() {
  return <Bar options={options} data={data} height={250} />;
}
