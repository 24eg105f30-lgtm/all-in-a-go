# 📦 All in a Go — Multi-Inventory Management System

A production-ready **Multi-Vendor Inventory & Real-Time Logistics Tracking System** built for a college engineering capstone project.

- **Backend:** Java 21, Spring Boot 3, Spring Data JPA / Hibernate, H2 Database (PostgreSQL ready).
- **Frontend:** React 18, Tailwind CSS, Vite, Lucide Icons.
- **Unique Selling Point (USP):**
  1. **Automated Low-Stock Early Warning System** (`qty_on_hand <= safety_stock`).
  2. **Multi-Vendor Order Partitioning** (`Order_Splits` per seller with unique tracking IDs).
  3. **Live Customer Parcel Tracking** with status timelines.
- **Categories:** Strictly curated into the 4 college categories with Indian prices between ₹100 and ₹2,000.

---

## 🚀 Quick Start (Local Run)

### Option 1: 1-Click Launch (Windows)
Double-click:
```bat
start-all.bat
```
This automatically starts:
- The Spring Boot backend on `http://localhost:8080`
- The React Vite frontend on `http://localhost:5173`
- Opens your browser automatically!

### Option 2: Manual Terminal Commands

#### 1. Backend (Java 21 Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
*(Or use `./mvnw spring-boot:run`)*  
Backend runs on `http://localhost:8080`.  
H2 Database Web Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:allinagodb`).

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 🌐 Cloud Deployment Guide

### A. Deploy Backend to Render (Java Web Service)
1. Push this project folder to your GitHub repository.
2. Log in to [Render.com](https://render.com) and click **New + > Web Service**.
3. Connect your GitHub repository and specify:
   - **Root Directory:** `backend`
   - **Environment:** `Java` (or Docker)
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/all-in-a-go-backend-0.0.1-SNAPSHOT.jar`
4. Set Environment Variables (optional, for persistent PostgreSQL on Render):
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<render_db_host>:5432/<db_name>`
   - `SPRING_DATASOURCE_USERNAME`: `<db_user>`
   - `SPRING_DATASOURCE_PASSWORD`: `<db_password>`
5. Click **Create Web Service**. Your backend URL will be `https://<your-app>.onrender.com`.

### B. Deploy Frontend to Vercel
1. Log in to [Vercel.com](https://vercel.com) and click **Add New > Project**.
2. Import your GitHub repository.
3. Configure the build settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://<your-backend-app>.onrender.com/api` (or keep empty if using local proxy)
5. Click **Deploy**. Your frontend is live in 60 seconds!

---

## 📚 College Viva Preparation
Read [`VIVA_GUIDE.md`](./VIVA_GUIDE.md) in the project root or click the **"Viva Cheat Sheet"** button inside the web app for:
- 3-Tier Architecture explanations
- The 6 database table structures (`vendors`, `warehouses`, `products`, `product_variants`, `inventory_levels`, `order_splits`)
- 20 frequently asked Viva questions with model answers.
