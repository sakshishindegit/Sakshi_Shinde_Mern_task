import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({ totalSale: 0, totalSoldItems: 0, totalNotSoldItems: 0 });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get('/statistics', { params: { month } });
                setStatistics(response.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };
        fetchStatistics();
    }, [month]);

    return (
        <div>
            <h2>Statistics for {month}</h2>
            <p>Total Sale: ${statistics.totalSale}</p>
            <p>Total Sold Items: {statistics.totalSoldItems}</p>
            <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
    );
};

export default Statistics;
