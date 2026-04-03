# Smart Inventory & Order Management System

A full-stack, enterprise-ready web application to gracefully manage your products, low-stock queues, orders, and customer workflows using **React**, **Node.js**, **Express**, and **MongoDB**, backed by **Firebase Authentication**.

## Features

- **Robust Authentication**: Email + Password sign up and login routed through Firebase. 
- **Product & Inventory Management**: Create products, monitor stock algorithms, auto-trigger "Out of Stock" notices and restock queues, and define categories dynamically.
- **Conflict Handling**: Prevents duplicate categories or checking out items that exceed standard logic boundaries directly from the backend. 
- **Streamlined Workflow Engine**: Interactive dashboard showing today's statistics, real-time revenue snapshots, logged actions tracked in DB, and interactive notifications for items running critically low.

## Tech Stack
- **Frontend**: React (Vite setup) 
- **Backend API**: Node.js + Express 
- **Database**: MongoDB 
- **User Authentication**: Firebase

---

## 🔒 Environment Setup

You need to establish the following `.env` configs to operate this package securely.

### Frontend (`stockflow/.env`)
Populate your Firebase configuration variables here:
```
VITE_apiKey="YOUR_API_KEY"
VITE_authDomain="YOUR_AUTH_DOMAIN"
VITE_projectId="YOUR_PROJECT_ID"
VITE_storageBucket="YOUR_STORAGE_BUCKET"
VITE_messagingSenderId="YOUR_SENDER_ID"
VITE_appId="YOUR_APP_ID"
```

### Backend (`stockflow-server/.env`)
Your Node server expects MongoDB configurations. Note the code accesses your cloud URI via specific Atlas shards, make sure this format correlates to your database's settings.
```
DB_USER=YOUR_MONGO_USERNAME
DB_PASS=YOUR_MONGO_PASSWORD
PORT=3000
```

---

## 🚀 Running Locally

1. **Backend Server**
   ```bash
   cd stockflow-server
   npm install
   npm start
   ```
2. **Frontend Console**
   ```bash
   cd stockflow
   npm install
   npm run dev
   ```

*(In dev mode, the frontend's `useAxiosSecure` directs data automatically to `http://localhost:3000`). Make sure your Node.js instance binds correctly to port 3000.*

---

## 🌎 Deployment Setup (Vercel Ready)

### Backend Deployment (Serverless API)
The Node/Express backend (`stockflow-server`) is packaged with a custom `vercel.json` rewrite strategy which auto-routes any external call natively to `index.js`. 
- Load it into Vercel as a standalone project.
- **Ensure you define Environment variables in the Vercel dashboard (`DB_USER`, `DB_PASS`).**
- **Important**: Grab the live Vercel URL Vercel assigns your backend.

### Frontend Deployment
The React client (`stockflow`) also has a custom `vercel.json` designed specifically to trap SPA fallback routes.
- **Before pushing to Vercel**: Modify `baseURL` inside `src/hooks/useAxiosSecure.jsx` natively from `http://localhost:3000` to whatever permanent URL Vercel gave your backend instance!
- You can configure Vercel's build scripts automatically. Note that the React footprint might be over standard size bundles: you can split chunking dynamically if performance metrics demand it.

Enjoy your Smart Dashboard!
