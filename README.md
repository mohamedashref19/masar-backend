# Masar 🚀

**AI-Powered Freelancing Platform for the Arab Market**

Masar is a full-stack freelancing marketplace designed to connect clients with skilled freelancers through intelligent matching, portfolio analysis, secure milestone-based payments, and real-time collaboration.

The platform combines traditional freelancing workflows with AI-powered services to improve hiring quality, reduce spam, and help clients discover the most suitable freelancers for their projects.

**Live Platform**

Masar Platform

**API Documentation**

Masar API Documentation

---

# ✨ Key Features

## Authentication & User Management

- JWT Authentication
    
- Role-based Access Control (Client / Freelancer / Admin)
    
- Email Verification with OTP
    
- Password Reset via Email
    
- Secure Password Hashing
    
- Profile Management
    
- CV Upload Support
    

---

## Freelancer Features

- Create and manage freelancer profiles
    
- Upload CVs and portfolio links
    
- Add GitHub repositories
    
- Receive AI-powered portfolio analysis
    
- Receive AI-generated skill extraction
    
- Experience level detection
    
- Portfolio quality scoring
    
- AI-generated freelancer embeddings
    
- Smart project recommendations
    

---

## Client Features

- Create and manage projects
    
- Define required skills and experience
    
- Receive AI-generated freelancer recommendations
    
- Review proposals
    
- Accept or reject proposals
    
- Manage project milestones
    
- Fund milestones securely
    

---

## AI Features 🤖

Masar integrates a dedicated AI service built with FastAPI and NLP pipelines.

### Portfolio Analysis

The AI service can analyze:

- CV PDFs
    
- Portfolio descriptions
    
- GitHub profiles
    
- GitHub repositories
    
- Portfolio websites
    

It extracts:

- Technical skills
    
- Verified skills
    
- Experience level
    
- Project complexity
    
- Portfolio quality score
    
- Technical depth score
    
- Project realism score
    
- Spam detection signals
    

---

### Smart Matching System

Masar uses semantic embeddings and AI ranking to match projects with freelancers.

Matching combines:

- Skill overlap
    
- Experience compatibility
    
- Portfolio quality
    
- Semantic similarity
    
- Client ratings
    
- Response time
    
- Spam detection
    

The system returns ranked freelancer recommendations for every newly created project.

---

## Proposal System

Freelancers can:

- Submit proposals
    
- Define price and duration
    
- Write cover letters
    

Clients can:

- Review proposals
    
- Accept proposals
    
- Reject proposals
    

Once accepted:

- Project status changes to **In Progress**
    
- Freelancer is assigned automatically
    
- Remaining proposals are rejected
    

---

## Milestone System

Projects are divided into milestones.

Supported workflow:

```
Create Milestone      ↓Fund Milestone      ↓Freelancer Works      ↓Submit Milestone      ↓Client Approves      ↓Release Payment
```

---

## Payment System 💳

Built with Stripe.

Features:

- Stripe Checkout
    
- Escrow-style workflow
    
- Milestone funding
    
- Secure payment releases
    
- Freelancer payouts through Stripe Connect
    
- Webhook processing
    
- Payment tracking
    

---

## Notifications System 🔔

In-app notification center supporting:

### Proposals

- New proposal received
    
- Proposal accepted
    
- Proposal rejected
    

### Projects

- Project started
    
- Project completed
    
- Project cancelled
    

### Milestones

- Milestone created
    
- Milestone funded
    
- Milestone submitted
    
- Milestone approved
    

### Payments

- Payment released
    
- Future support for disputes and refunds
    

### AI

- Portfolio analysis completed
    
- Project recommendation notifications
    

### Messaging

- New message notifications
    

---

## Messaging System 💬

- Project-based conversations
    
- Client ↔ Freelancer chat
    
- Message history
    
- Read tracking
    
- Conversation management
    

---

# 🏗 Architecture

```
Frontend (React + Vite)        │        ▼Backend API (Node.js + Express)        │ ┌──────┴─────────┐ │                │ ▼                ▼MongoDB       AI Service              (FastAPI)                    │                    ▼            NLP + Embeddings                    │                    ▼                 FAISS
```

---

# 🛠 Tech Stack

### Frontend

- React
    
- Vite
    
- React Router
    
- React Query
    
- Tailwind CSS
    

### Backend

- Node.js
    
- Express.js
    
- MongoDB
    
- Mongoose
    
- JWT Authentication
    
- Multer
    
- Nodemailer
    
- Stripe
    

### AI Service

- Python
    
- FastAPI
    
- NLP Pipelines
    
- Sentence Transformers
    
- FAISS
    
- GitHub API
    
- OCR
    
- PDF Processing
    

### Dev Tools

- Git
    
- GitHub
    
- Postman
    
- Stripe CLI
    

---

# 📂 Major Modules

```
AuthenticationUsersProjectsProposalsMilestonesPaymentsNotificationsMessagingPortfolio AnalysisFreelancer MatchingEmbeddingsStripe Integration
```

---

# 🚀 Getting Started

## Clone Repository

```
git clone https://github.com/ahmed-selim80/Masar.gitcd Masar
```

## Backend

```
cd backendnpm installnpm run dev
```

## Frontend

```
cd frontendnpm installnpm run dev
```

---

# 🔐 Environment Variables

Example:

```
DATABASE=JWT_SECRET=JWT_EXPIRES_IN=EMAIL_FROM=MAILTRAP_HOST=MAILTRAP_PORT=MAILTRAP_USERNAME=MAILTRAP_PASSWORD=STRIPE_SECRET_KEY=STRIPE_WEBHOOK_SECRET=AI_SERVICE_URL=
```

---

# 👥 Team

### Backend Development

- Ahmed Selim
    
- Mohamed Ashref
    

### Frontend Development

- Project Team Members
    

### AI Development

- Project Team Members
    

---

# 🎓 Graduation Project

Masar was developed as a graduation project focused on solving common problems in freelance marketplaces through:

- AI-powered talent matching
    
- Portfolio intelligence
    
- Secure milestone payments
    
- Smart recommendations
    
- Arabic-first freelancing experience
    

---

# 📜 License

This project was developed for educational and academic purposes as a graduation project.







