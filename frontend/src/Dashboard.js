import React, { useState, useEffect } from 'react';
import TransactionTable from './TransactionTable';
import Statistics from './Statistics';
import BarChartComponent from './BarChart';
import PieChartComponent from './PieChart';
import './Dashboard.css';
import axios from 'axios';

const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

const Dashboard = () => {
    const [month, setMonth] = useState('March');
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('https://thingproxy.freeboard.io/fetch/https://s3.amazonaws.com/roxiler.com/product_transaction.json');
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    const filterTransactionsByMonth = (month) => {
        const monthIndex = months.indexOf(month) + 1;
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.dateOfSale);
            return transactionDate.getMonth() + 1 === monthIndex;
        });
    };

    const filteredTransactions = filterTransactionsByMonth(month);

    return (
        <div className="dashboard-container">
            <h1>Transaction Dashboard</h1>
            <div className="month-selector">
                <label htmlFor="month">Select Month: </label>
                <select id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
                    {months.map((month) => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
            </div>
            <div className="dashboard-content">
                <div className="charts-container">
                    <div className="chart-container">
                        <Statistics month={month} />
                    </div>
                    <div className="chart-container">
                        <BarChartComponent data={filteredTransactions} />
                    </div>
                    <div className="chart-container">
                        <PieChartComponent data={filteredTransactions} />
                    </div>
                </div>
                <TransactionTable 
                    transactions={filteredTransactions}
                    search={search} 
                    setSearch={setSearch} 
                    page={page} 
                    setPage={setPage} 
                    setTotalPages={setTotalPages} 
                />
            </div>
        </div>
    );
};

export default Dashboard;
