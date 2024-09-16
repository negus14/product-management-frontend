import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/productService.js';

const ProductGraphByDate = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groupBy, setGroupBy] = useState('year');  // 'year', 'month', or 'week'

    // Fetch product data
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getProducts();
                setProducts(products);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    // Helper function to group by year (format: YYYY)
    const groupByYear = (products) => {
        const grouped = {};
        products.forEach(product => {
            const year = new Date(product.dateAdded).getFullYear();
            if (!grouped[year]) {
                grouped[year] = 0;
            }
            grouped[year] += 1;
        });
        return grouped;
    };

    // Helper function to group by month (format: YYYY-MM)
    const groupByMonth = (products) => {
        const grouped = {};
        products.forEach(product => {
            const date = new Date(product.dateAdded);
            const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;  // Format: YYYY-MM
            if (!grouped[yearMonth]) {
                grouped[yearMonth] = 0;
            }
            grouped[yearMonth] += 1;
        });
        return grouped;
    };

    // Helper function to group by week (format: YYYY-WW)
    const groupByWeek = (products) => {
        const grouped = {};
        
        products.forEach(product => {
            const date = new Date(product.dateAdded);
            const year = date.getFullYear();
            const weekNumber = getWeekNumber(date);  // Helper function to get the week number
            const yearWeek = `${year}-W${weekNumber.toString().padStart(2, '0')}`;  // Format: YYYY-WW

            if (!grouped[yearWeek]) {
                grouped[yearWeek] = 0;
            }
            grouped[yearWeek] += 1;  // Count products in the same week
        });

        return grouped;
    };

    // Helper function to calculate the week number for a given date
    const getWeekNumber = (date) => {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - startOfYear) / 86400000;  // Milliseconds in a day
        return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    };

    // Switch between group by year, month, and week
    const getGroupedData = () => {
        if (groupBy === 'year') {
            return groupByYear(products);
        } else if (groupBy === 'month') {
            return groupByMonth(products);
        } else if (groupBy === 'week') {
            return groupByWeek(products);
        }
    };

    // Get the grouped data and prepare chart data
    const groupedData = getGroupedData();
    const labels = Object.keys(groupedData);  // X-axis: year, month, or week labels
    const productCounts = Object.values(groupedData);  // Y-axis: number of products

    const data = {
        labels,
        datasets: [
            {
                label: `Number of Products Added (${groupBy})`,
                data: productCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div>
            <h2>Total Products Added by {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}</h2>
            
            {/* Buttons to switch between week, month, and year */}
            <div>
                <button onClick={() => setGroupBy('year')}>Group by Year</button>
                <button onClick={() => setGroupBy('month')}>Group by Month</button>
                <button onClick={() => setGroupBy('week')}>Group by Week</button>
            </div>
            
            {/* Render the Bar chart */}
            <Bar data={data} options={options} />
        </div>
    );
};

export default ProductGraphByDate;