# 🏛️ NariSetu: Government Scheme Eligibility Engine

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-success?style=for-the-badge)](https://narisetu-ten.vercel.app/)

NariSetu is a full-stack web application designed to bridge the gap between Indian micro-entrepreneurs and government financial schemes. It uses a custom demographic matching engine to parse user profiles and instantly rank eligible grants. 

## ⚙️ The Engineering Challenge: The "Two-Pass" Algorithm

Standard database queries are insufficient for government scheme matching due to strict, knock-out eligibility constraints. To solve this, I architected a custom **Two-Pass Algorithm** in the Node.js backend:

1. **Pass 1 (The Gatekeeper - O(S)):** Performs strict boolean checks against hard constraints (`state`, `gender`, `max_income`, `is_bpl`). Schemes failing any parameter are immediately pruned to optimize processing time.
2. **Pass 2 (The Ranker):** For surviving schemes, a weighted scoring system evaluates soft filters (`business_category`, `education_level`) to calculate a final "Eligibility Match Score" (0-100%).

**Time Complexity:** `O(S)` where `S` is the number of schemes in the database. 

## 🛠️ Tech Stack & Architecture

* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** Firebase Cloud Firestore (NoSQL)
* **Deployment:** Vercel (Client), Render (API)

## 🗄️ Database Schema Design
Designed a highly scalable Document-based schema in Firestore to accommodate dynamic government parameters without rigid SQL table migrations.

```json
{
  "scheme_id": "SCH_001",
  "eligibility_criteria": {
    "gender": ["female", "all"],
    "max_income": 250000,
    "caste_category": ["sc", "st", "obc"]
  }
}
