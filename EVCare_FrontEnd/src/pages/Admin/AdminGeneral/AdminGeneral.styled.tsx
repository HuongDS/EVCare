import styled from "styled-components";

export const AdminGeneralStyled = styled.div`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Outfit', sans-serif;
        background: #f1f1f1;
        display: flex;
        min-height: 100vh;
    }

    .sidebar {
        width: 280px;
        background: #fff;
        border-right: 1px solid #e0e0e0;
        padding: 30px 0;
        position: fixed;
        height: 100vh;
        overflow-y: auto;
    }

    .logo-section {
        padding: 0 30px 30px;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .logo-icon {
        width: 45px;
        height: 45px;
        background: #00ad4e;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 24px;
        font-weight: 700;
    }

    .logo-text {
        font-size: 24px;
        font-weight: 700;
        color: #00ad4e;
    }

    .nav-menu {
        list-style: none;
    }

    .nav-item {
        padding: 12px 30px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 12px;
        color: #666;
        font-size: 15px;
        font-weight: 500;
    }

    .nav-item:hover {
        background: #f9f9f9;
        color: #333;
    }

    .nav-item.active {
        background: #f0f9f4;
        color: #00ad4e;
        border-left: 3px solid #00ad4e;
    }

    .nav-icon {
        font-size: 20px;
        width: 24px;
    }

    .nav-section {
        margin-top: 20px;
    }

    .nav-submenu {
        list-style: none;
        padding-left: 66px;
    }

    .nav-submenu .nav-item {
        padding: 8px 0;
        font-size: 14px;
    }

    .sidebar-footer {
        margin-top: 40px;
        border-top: 1px solid #e0e0e0;
        padding-top: 20px;
    }

    .main-content {
        margin-left: 280px;
        flex: 1;
        padding: 30px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }

    .date-display {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        color: #333;
        font-weight: 500;
    }

    .user-section {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .notification-icon {
        position: relative;
        width: 40px;
        height: 40px;
        background: #fff;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid #e0e0e0;
    }

    .notification-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 18px;
        height: 18px;
        background: #ff4757;
        border-radius: 50%;
        font-size: 10px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
    }

    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #00ad4e;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        cursor: pointer;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 30px;
    }

    .stat-card {
        background: #fff;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .stat-icon {
        width: 50px;
        height: 50px;
        background: #f1f1f1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
    }

    .stat-info {
        flex: 1;
    }

    .stat-label {
        font-size: 13px;
        color: #666;
        margin-bottom: 5px;
    }

    .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #00ad4e;
    }

    .chart-card {
        background: #fff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        margin-bottom: 30px;
    }

    .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
    }

    .chart-title {
        font-size: 20px;
        font-weight: 600;
        color: #333;
    }

    .date-filter {
        padding: 8px 16px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        font-family: 'Outfit', sans-serif;
        font-size: 14px;
        color: #666;
        cursor: pointer;
        background: #fff;
    }

    .orders-card {
        background: #fff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .orders-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .orders-title {
        font-size: 20px;
        font-weight: 600;
        color: #333;
    }

    .view-details {
        color: #00ad4e;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
    }

    .orders-table {
        width: 100%;
        border-collapse: collapse;
    }

    .orders-table thead {
        background: #f9f9f9;
    }

    .orders-table th {
        padding: 12px;
        text-align: left;
        font-size: 13px;
        color: #999;
        font-weight: 600;
        text-transform: uppercase;
    }

    .orders-table td {
        padding: 15px 12px;
        border-bottom: 1px solid #f1f1f1;
        font-size: 14px;
        color: #333;
    }

    .orders-table tbody tr:hover {
        background: #f9f9f9;
    }

    .order-checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: #00ad4e;
    }

    .order-number {
        font-weight: 600;
        color: #333;
    }

    .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
    }

    .status-completed {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .status-pending {
        background: #fff3e0;
        color: #e65100;
    }

    @media (max-width: 1200px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(-100%);
        }

        .main-content {
            margin-left: 0;
        }

        .stats-grid {
            grid-template-columns: 1fr;
        }
    }
`