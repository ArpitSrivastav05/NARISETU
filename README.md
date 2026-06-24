# 🌸 NariSetu — AI-Powered Women Entrepreneurship Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_NariSetu-success?style=for-the-badge)](https://narisetu-ten.vercel.app/)

NariSetu is a full-stack AI-powered platform designed to empower women entrepreneurs in India by providing access to government schemes, financial management tools, business visibility, and personalized support.

The platform combines **GovTech**, **FinTech**, **AI**, and **Marketplace** capabilities into a unified ecosystem that helps women discover opportunities, manage finances, and grow their businesses.

---

## 🚀 Live Demo

**Frontend:** https://narisetu-ten.vercel.app

---

# ✨ Key Features

## 🏛️ Government Scheme Eligibility Engine

NariSetu intelligently matches users with relevant government schemes based on their demographic and business profile.

### Two-Pass Matching Algorithm

#### Pass 1 — The Gatekeeper

Performs strict eligibility filtering using hard constraints:

* State
* Gender
* Income
* BPL Status

Non-matching schemes are immediately discarded.

#### Pass 2 — The Ranker

Applies weighted scoring on:

* Age Range
* Caste Category
* Employment Type
* Business Category
* Education Level
* Marital Status
* Disability Status
* Residence Type

Generates an **Eligibility Match Score (0–100%)** and ranks schemes accordingly.

---

## 🎙️ AI Voice Ledger

A voice-powered bookkeeping assistant designed for users with limited digital literacy.

### Workflow

User speaks in:

* Hindi
* Hinglish
* English

Example:

> "Aaj 500 rupaye ki silai ka kaam mila"

The system:

1. Records audio
2. Sends audio to Gemini 2.5 Flash
3. Extracts transaction details
4. Stores structured data in Firestore

Generated Output:

```json
{
  "amount": 500,
  "type": "income",
  "description": "Silai ka kaam"
}
```

---

## 🛒 Marketplace

Women entrepreneurs can showcase products and connect with customers.

Features:

* Product Listings
* Business Profiles
* Product Search
* Category Filtering
* Contact Seller Options
* Business Discovery

---

## 📊 Business Dashboard

Provides financial visibility using ledger data.

Metrics:

* Total Income
* Total Expenses
* Net Profit
* Transaction History
* Income Summary
* Expense Summary

---

## 🔐 Authentication & User Management

Secure user authentication powered by Firebase Authentication.

Supported Methods:

* Email & Password Login
* Google Sign-In

Features:

* Protected Routes
* Persistent Sessions
* User Profiles
* Ownership-Based Data Access

---

# 🏗️ System Architecture

Frontend:

* React 19
* Vite
* Tailwind CSS v4

Backend:

* Node.js
* Express.js

Database:

* Firebase Cloud Firestore

Authentication:

* Firebase Authentication

AI:

* Google Gemini 2.5 Flash

Deployment:

* Vercel (Frontend)
* Render (Backend)

---

# 🧠 Technical Highlights

### Custom Matching Engine

Designed and implemented a scalable Two-Pass Eligibility Matching Algorithm optimized for government scheme discovery.

### AI Integration

Integrated Gemini 2.5 Flash for multilingual voice-to-transaction extraction.

### Secure Authentication

Implemented Firebase Authentication with Google OAuth and protected user-specific resources.

### Scalable Firestore Design

Document-based schema designed to support:

* Dynamic Government Schemes
* User Profiles
* Businesses
* Products
* Transactions
* Scheme Match History

without requiring SQL-style migrations.

---

# 📂 Project Structure

```text
NARISETU/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│
├── routes/
├── controllers/
├── middleware/
├── utils/
├── config/
├── scripts/
└── index.js
```

# 🔥 Current Features

* Government Scheme Matching
* AI Voice Ledger
* Marketplace
* Business Profiles
* Dashboard Analytics
* Firebase Authentication
* Google OAuth
* Firestore Integration
* Cloud Deployment

---

# 🛣️ Roadmap

### Phase 7

* User Profile Management
* Saved Schemes
* Personalized Dashboard
* Data Persistence Enhancements

### Phase 8

* AI Financial Coach
* Personalized Business Guidance
* Expense Analysis
* Savings Recommendations

### Phase 9

* Multi-language Platform Support
* Hindi-First User Experience
* Regional Language Expansion

---

# 👨‍💻 Author

**Arpit Srivastav**

B.Tech Computer Science Engineering (2028)

Passionate about building AI-powered solutions that create real-world impact through technology.
