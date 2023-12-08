// pages/orders.js
import React from 'react';
import Layout from '../components/layout'; // Adjust the path as needed

const OrdersPage = () => {
    // Simulated order data
    const orders = [
        { id: 1, total: 35.00, address: "123 Main St", status: "paid" },
        { id: 2, total: 45.50, address: "456 Elm St", status: "pending" },
        // ... more orders ...
    ];

    return (
        <Layout>
            <h1>Your Orders</h1>
            <div>
                {orders.map(order => (
                    <div key={order.id}>
                        <p>Order ID: {order.id}</p>
                        <p>Total: ${order.total}</p>
                        <p>Address: {order.address}</p>
                        <p>Status: {order.status}</p>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default OrdersPage;
