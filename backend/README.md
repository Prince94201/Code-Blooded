# ♻️ ReWear – Community Clothing Exchange

## Overview

**ReWear** is a full-stack web platform designed to promote **sustainable fashion** by enabling people to exchange unused clothing within their community. The app empowers users to either **swap items directly** with others or **redeem clothes using a point-based system**, creating a circular economy around wearable garments.

## 🌟 Features

### 👤 User Authentication
- Secure signup/login using email and password
- JWT-based session management
- Profile editing with image upload

### 🛍️ Listings
- Create listings with multiple images, title, description, size, condition, and tags
- Users can browse, filter, and search listings
- All listings go through admin approval to ensure quality and trust

### 🔁 Swap & Redeem System
- **Swap Mode**: Users offer an item in exchange for another item
- **Redeem Mode**: Users use their earned points to claim an item
- Automatic point deductions, status updates, and ownership change

### 📦 User Dashboard
- See points balance and profile details
- Manage uploaded listings
- Track all ongoing and completed swaps or redemptions

### 🧑‍💼 Admin Dashboard
- Approve/reject listings based on quality and guidelines
- Remove flagged/inappropriate content
- View system metrics (total users, active swaps, etc.)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/rewear.git
cd rewear
```

2. Install dependencies:
```
cd backend
npm install
```

3. Set up environment variables:
Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rewear
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d
NODE_ENV=development
```

4. Start the development server:
```
npm run dev
```

## 📝 API Documentation

All API routes are prefixed with `/api`. For detailed documentation of all endpoints, see the [API Documentation](ReWear_API_Documentation_FULL.txt).
