'use client'

import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: false,
        },
    },
}

interface MonthlyViewsChartProps {
    data: any // 실제 데이터 타입에 맞게 수정 가능
}

export default function MonthlyViewsChart({ data }: MonthlyViewsChartProps) {
    return <Bar options={options} data={data} height={250} />
}
