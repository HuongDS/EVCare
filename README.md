# EVCare – Electric Vehicle Service Management Platform

EVCare is a comprehensive platform for managing electric vehicle service operations, including appointment scheduling, technician workflows, inventory management, real-time tracking, intelligent predictions, online payments, and AI-assisted interactions.

---

## Team Members

| Member                   | Role                 | Facebook Link |
| ------------------------ | -------------------- | ------------- |
| Nguyen Phuc Sanh         | Backend              |     https://www.facebook.com/nguyen.sanh.79069323          |
| Dang Song Huong          | Frontend & Backend   | https://www.facebook.com/huongds01/            |
| Ngo Chi Vy               | Frontend             |    https://www.facebook.com/ngo.tran.chi.vy           |
| Duong Nguyen Binh Phuong | Frontend             |https://www.facebook.com/Square485               |


---

## Technologies Used

### Backend

* .NET 8 Web API
* Entity Framework Core
* SQL Server on AWS RDS
* MongoDB Atlas for real-time chat
* Redis (Upstash) for OTP caching
* SignalR for real-time communication
* Hangfire for background jobs and scheduled automation
* MailKit for email sending
* NotificationAPI for email template management
* PayOS and VNPAY payment integration
* JWT Authentication and Role-based Authorization
* Code-first migrations, soft delete, audit logging

### Frontend

* React with TypeScript
* React Compiler (React 19 optimization tooling)
* Ant Design UI
* React Router
* Axios
* Sentry for error tracking and performance monitoring
* Three.js for interactive 3D visualization
* Cloudinary for image hosting
* Cloudflare R2 for static asset and 3D model storage
* Netlify for deployment

### DevOps & Deployment

* GitHub Actions CI/CD

  * Backend deploy to Azure App Service
  * Frontend deploy to Netlify
* Azure App Service for backend hosting
* AWS RDS (SQL Server)
* MongoDB Atlas for real-time chat

---

## Core Features

### Service & Appointment Management

* Appointment booking and scheduling
* Technician assignment and workflow management
* Real-time repair progress updates
* Customer–technician communication through real-time chat

### Inventory & Parts Management

* Parts and category management
* Bulk parts import using Excel files (XLSX/CSV)
* Stock-level monitoring and low-stock alerts
* Predictive inventory forecasting using AI and usage patterns
* Real-time analytics dashboards

### Payments & Billing

* Online payment integration (PayOS, VNPAY)
* Printable invoices and receipts (PDF format)
* Secure transaction logging

### AI-Assisted Operations

* AI-powered assistant for:

  * searching parts or services
  * generating repair suggestions
  * automated appointment recommendations
  * prediction analytics
* Integrated AI chat for customer and staff support

### Real-Time Features

* Real-time chat via SignalR and MongoDB
* Real-time dashboard charts for:

  * invoice statistics
  * service usage
  * appointment statistics
  * inventory changes

### General System Features

* Role-based access control (Admin, Staff, Customer)
* Email OTP verification and notifications
* 3D model visualization using Three.js
* Automated background tasks with Hangfire
* Advanced searching, filtering, and pagination

---

## System Architecture Overview

* Clean, layered backend architecture: API – Application – DataAccess
* Modular React + TypeScript frontend architecture
* Hybrid data storage: SQL Server (transactional) + MongoDB (real-time messaging)
* Cloud storage with Cloudinary and Cloudflare R2
* Realtime communication using SignalR Hubs
* Scheduled and background processing via Hangfire
* Continuous integration and deployment through GitHub Actions

---
