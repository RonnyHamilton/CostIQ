<div align="center">

<img src="https://img.shields.io/badge/Status-Public%20Beta-00E096?style=for-the-badge&labelColor=0F1115" />
<img src="https://img.shields.io/badge/Built%20With-Next.js%2016-black?style=for-the-badge&logo=next.js" />
<img src="https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase" />
<img src="https://img.shields.io/badge/Hackathon-Webify%20e--Horyzon-FF2E63?style=for-the-badge" />

# CostIQ

### Manufacturing Intelligence Platform

Stop losing money on the factory floor.

CostIQ helps manufacturers monitor production costs, predict material shortages, and optimize inventory decisions in real time.

</div>

---


# 🧠 Problem

Manufacturing teams often rely on spreadsheets or fragmented systems to track production costs and inventory.

This leads to:

- unexpected material shortages
- inaccurate cost tracking
- delayed procurement decisions
- poor visibility into production efficiency

Without real-time insights, cost overruns and supply disruptions become common.

---

# 💡 Solution

CostIQ provides a centralized platform to monitor production cost variance, predict inventory shortages, and generate intelligent reorder recommendations.

By combining real-time data with predictive analytics, CostIQ helps manufacturers make faster and more informed decisions.

---

# ✨ Features

| Feature | Description |
|---|---|
| 📦 Predictive Stockouts | Forecast material shortages before they happen |
| 📈 Real-Time Cost Variance | Compare planned vs actual costs during production |
| ⚡ Smart Reorder Lists | Generate purchase lists based on burn rate and lead time |
| 📊 Advanced Analytics | Visual breakdowns of material costs and trends |
| 🛡️ Multi-Tenant Security | Row-Level Security (RLS) ensures data isolation |
| 🌐 Cloud-Native | Access production insights from anywhere |

---

# 🏗 Architecture
Frontend
Next.js (App Router)
↓
Server Actions
↓
Supabase API
↓
PostgreSQL Database
↓
Row Level Security (RLS)

---

# 🛠 Tech Stack

Frontend  
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion

Backend  
- Supabase
- PostgreSQL
- Drizzle ORM

UI & Data  
- shadcn/ui
- Recharts
- Lucide Icons

Forms & Validation  
- React Hook Form
- Zod

Data Ingestion  
- PapaParse (CSV upload)

---

# 📁 Project Structure
dashboard/
├── app/ # Next.js App Router pages & layouts
├── components/ # Reusable UI components
├── hooks/ # Custom React hooks
├── lib/ # Server actions and database logic
├── utils/ # Supabase helpers and middleware
├── supabase/ # Database migrations & seed scripts
└── public/ # Static assets
# CostIQ

### Manufacturing Intelligence Platform

Stop losing money on the factory floor.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20App-00E096?style=for-the-badge)](https://cost-iq-chi.vercel.app/)
