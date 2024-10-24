import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartComponent = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.title), 
        datasets: [
            {
                label: 'Sales',
                data: data.map(item => item.price), 
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div>
            <h3>Bar Chart</h3>
            <Bar data={chartData} />
        </div>
    );
};

export default BarChartComponent;





