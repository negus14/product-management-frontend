import 'chart.js/auto';  // Necessary for Chart.js
import { Bar } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/productService.js';

const ProductGraphByStock = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    
    // Preparing data for the chart
    const data = {
        labels: products.map(product => product.category),  // Product Category on the x-axis
        datasets: [
            {
                label: 'Stock Quantity',
                data: products.map(product => product.stockQuantity),  // Stock quantities on the y-axis
                backgroundColor: 'rgba(75, 192, 192, 0.6)',  // Bar color
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
            <h2>Product Stock Quantity by Category</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ProductGraphByStock;
