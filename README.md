# 🛠️ Get Service

> A full-stack client-server marketplace web application connecting service seekers with professionals and task-solvers. 
> Developed as part of a joint Client-Server Architecture workshop by the Open University and Microsoft.

## 📖 Overview

ServiceMatch is a platform designed to simplify the process of finding and providing professional and casual services (e.g., plumbing, handyman tasks, or light errands). Similar to on-demand service apps like "Gett", users can post tasks they need help with, and available professionals or capable individuals can accept these tasks for payment. 

The system features role-based access control, ensuring a tailored experience for clients, service providers, and system administrators.

## ✨ Features

* **Client Interface:** Users can easily request professional services, describe the task, and track the status of their request.
* **Provider Interface:** Professionals and gig workers can browse available tasks in their area of expertise, accept jobs, and manage their workload.
* **Admin Dashboard:** A comprehensive management screen for administrators to oversee the platform, manage user accounts (clients and providers), and monitor system activity.
* **Role-Based Access Control (RBAC):** Secure routing and data access depending on user type (Admin, Client, Provider).

## 💻 Tech Stack

This project serves as a practical demonstration of integrating a modern React framework with a robust, traditional Java-based web server and a relational database:

* **Frontend:** [Next.js](https://nextjs.org/) (React)
* **Backend:** Java / [Apache Tomcat](https://tomcat.apache.org/)
* **Database:** [PostgreSQL](https://www.postgresql.org/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [Java JDK](https://www.oracle.com/java/technologies/downloads/) (v11 or higher)
* [Apache Tomcat](https://tomcat.apache.org/) (v9 or higher)
* [PostgreSQL](https://www.postgresql.org/) (v13 or higher)

### 1. Database Setup

1. Open your PostgreSQL terminal or pgAdmin.
2. Create a new database for the project:
   ```sql
   CREATE DATABASE servicematch_db;
