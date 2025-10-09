import React from "react";


const orders = [
    {id: "#00775", date: "2023-12-08", customer: "Jenny Wilson", status: "Completed", total: "$1,552.00"},
    {id: "#00779", date: "2023-12-04", customer: "Cody Fisher", status: "Pending", total: "$1,742.00"},
    {id: "#00756", date: "2023-12-14", customer: "Alex Jandar", status: "Pending", total: "$2,742.00"},
];

const OrdersTable: React.FC = () => {
    return (
        <div className="orders-card">
            <div className="orders-header">
                <h2 className="orders-title">Recent Orders</h2>
                <a href="#" className="view-details">View Details</a>
            </div>

            <table className="orders-table">
                <thead>
                <tr>
                    <th>No.</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((o, i) => (
                    <tr key={i}>
                        <td><span className="order-number">{o.id}</span></td>
                        <td>{o.date}</td>
                        <td>{o.customer}</td>
                        <td>
                <span className={`status-badge status-${o.status.toLowerCase()}`}>
                  {o.status}
                </span>
                        </td>
                        <td>{o.total}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable;
