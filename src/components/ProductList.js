// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/productService.js';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <div>
            <h1>Product List</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Category</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>SKU</th>
                        <th>Stock Quantity</th>
                        <th>Date Added</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.category}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.sku}</td>
                            <td>{product.stockQuantity}</td>
                            <td>{product.dateAdded}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default ProductList;