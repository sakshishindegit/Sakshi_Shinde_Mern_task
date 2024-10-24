import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const PieChartComponent = ({ data }) => {
    const categoryCounts = {};
    data.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    const chartData = {
        labels: Object.keys(categoryCounts),
        datasets: [
            {
                data: Object.values(categoryCounts),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                ],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, 
    };

    return (
        <div>
            <h3>Pie Chart</h3>
            <div style={{ width: '200px', height: '200px' }}> 
                <Pie data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default PieChartComponent;
