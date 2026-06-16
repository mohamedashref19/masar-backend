# 🚀 Masar (مسار) - AI-Powered Freelancing Platform

Masar is a comprehensive platform designed to seamlessly connect clients with freelancers. Built with modern web technologies, it features an AI-powered system to optimize the freelancing experience, offering robust authentication, role-based dashboards, and a smooth user journey.

## 🏗️ Project Structure (Monorepo)

This repository is organized as a monorepo containing both the client and server applications:

- `frontend/` - The React.js frontend application.
- `backend/` - The API server and database architecture.

---

## 💻 Frontend Tech Stack

- **Core:** React.js
- **Server State Management:** TanStack Query (React Query)
- **Client State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Forms & Validation:** React Hook Form & Zod
- **Routing:** React Router v6

---

## ✨ Key Features

- **Role-Based Authentication:** Distinct registration and login flows for 'Clients' and 'Freelancers'.
- **OTP Verification:** Secure email verification system using a countdown timer and robust error handling.
- **Smart Routing:** Implementation of `GuestRoute` and `ProtectedRoute` to secure dashboards and redirect unauthenticated users seamlessly.
- **Feature-Based Architecture:** Codebase organized by features (e.g., auth slice, custom hooks, isolated components) for maximum scalability and clean code.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/](https://github.com/)[your-github-username]/masar.git
   cd masar
   ```
