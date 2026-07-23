# Avira Sports — Modern E-Commerce Platform

Avira Sports is a full-stack, enterprise-grade e-commerce web application built for sports apparel, footwear, and equipment distribution in Egypt. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **PostgreSQL**, it features integrated Egyptian localized payment solutions (Fawry Pay-at-Fawry, Cards, Cash on Delivery), dynamic promotional offer engines, comprehensive admin capabilities, and localized shipping options across Egyptian governorates.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Folder Structure](#-architecture--folder-structure)
- [Database Schema Overview](#-database-schema-overview)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Testing](#-testing)
- [License](#-license)

---

## ✨ Features

### 🛒 Storefront & Product Exploration
- **Dynamic Homepage**: Configurable homepage sections (Featured, Best Value, Holiday Offers, Category Showcase).
- **Product Catalog**: Advanced search, filtering by brand, category, gender (Men, Women, Kids, Unisex), and price range.
- **Product Variants**: Size, color, SKU tracking, individual variant stock management, and custom pricing overrides.
- **Promotions & Offers**:
  - Percentage & Fixed Coupons with minimum order requirements and redemption caps.
  - Triggered Offer Rewards (Buy X get Y free/discounted).
  - Tiered Quantity Bundle Discounts with dynamic popups.
- **User Engagement**: Product reviews & rating summaries, wishlist management, newsletter subscriptions.

### 💳 Checkout & Egyptian Payment Localizations
- **Multi-Method Payments**:
  - Credit / Debit Cards
  - Pay at Fawry (Integrated reference code generation and callback verification)
  - Cash on Delivery (COD)
- **Egyptian Governorate Shipping**: Localized shipping cost calculations for Standard and Express delivery.
- **Order Snapshotting**: Snapshots product name, brand, image, and variant attributes at the moment of order placement to maintain historical record consistency.

### 👤 User Account & Authentication
- **NextAuth v5 (Auth.js)**: Supports Credentials provider (hashed passwords via `bcryptjs`) and extensible OAuth.
- **Security & Account Recovery**: Password reset via secure tokens and email notifications (Nodemailer).
- **Address Book**: Save and manage multiple delivery addresses with default selection.
- **Order History & Tracking**: Real-time status updates (`pending_payment`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`).

### ⚙️ Admin Dashboard & Management
- **Order Processing**: View, manage, filter, and update order fulfillment statuses.
- **Catalog Management**: CRUD operations for Categories, Brands, Products, Variants, and Images.
- **Homepage Builder**: Reorder, enable, or disable storefront sections dynamically.
- **System Settings**: Key-value JSON store for global store settings.

---

## 🛠️ Tech Stack

### Core Framework & Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, `clsx`, `tailwind-merge`, `tailwindcss-animate`
- **UI Components**: Radix UI (Primitives for Dialogs, Accordions, Popovers, Tabs, Selects, Toast)
- **State & Data Fetching**: TanStack React Query v5, Zustand
- **Icons**: Lucide React
- **Notifications & UI Helpers**: Sonner, NextJS TopLoader

### Backend, Database & Storage
- **Database**: PostgreSQL
- **ORM**: Prisma ORM v5
- **Authentication**: NextAuth.js v5 (Beta), `@auth/prisma-adapter`
- **Media Storage**: Cloudinary via `next-cloudinary`
- **Email Service**: Nodemailer

### Testing & QA
- **Unit & Integration Tests**: Vitest, React Testing Library, JSDOM
- **End-to-End (E2E) Testing**: Playwright
- **Type Checking & Linting**: TypeScript, ESLint (Next.js default rules)

---

## 📁 Architecture & Folder Structure

The project follows a modular, feature-driven domain architecture:

```
Avira Sports/
├── app/                      # Next.js App Router root
│   ├── (admin)/              # Admin layout & dashboard routes
│   ├── (store)/              # Storefront pages (Shop, Product details, Cart, Checkout, Account)
│   ├── api/                  # API routes (Auth, Fawry webhooks, Search, Products, Orders)
│   ├── auth/                 # Auth pages (Login, Register, Password Reset)
│   ├── globals.css           # Global Tailwind CSS styles
│   ├── layout.tsx            # Root layout
│   └── providers.tsx        # React Query, Theme, & Session providers
├── components/               # Shared global UI components
│   └── ui/                   # Radix UI design system primitives
├── modules/                  # Feature-based domain modules
│   ├── _shared/              # Shared helper functions, hooks, and types
│   ├── about/                # About Us page components
│   ├── account/              # User profile & address book module
│   ├── admin/                # Admin management tables & forms
│   ├── auth/                 # Authentication forms & logic
│   ├── cart/                 # Cart state (Zustand) & drawer components
│   ├── checkout/             # Checkout form, order calculation, payment forms
│   ├── feedback/             # Feedback & toast handlers
│   ├── home/                 # Hero banners, featured grids, homepage sections
│   ├── newsletter/           # Newsletter subscription widgets
│   ├── order/                # Order details, receipt generation, status badges
│   ├── product/              # Product cards, gallery, specs, variant selectors
│   ├── review/               # Product review forms & ratings
│   ├── search/               # Search bar & filter controls
│   ├── shop/                 # Category/Shop listing grids
│   └── wishlist/             # Wishlist drawer & state management
├── config/                   # Global constants, site metadata, shipping costs
├── infrastructure/           # Database client instance, Fawry API client, Mailer
├── prisma/                   # Prisma schema, migrations, and seed scripts
│   ├── schema.prisma         # Database models & enums
│   └── seed.ts               # Database seed script
├── public/                   # Static assets (Logos, icons, placeholders)
├── scripts/                  # Maintenance & deployment utility scripts
└── tests/                    # Vitest unit tests & Playwright E2E suites
```

---

## 🗄️ Database Schema Overview

The database schema (`prisma/schema.prisma`) includes the following core models:

| Category | Key Models | Description |
| :--- | :--- | :--- |
| **Auth & User** | `User`, `Account`, `Session`, `VerificationToken`, `PasswordResetToken`, `Address` | Manages customer accounts, roles (`USER`, `ADMIN`), login sessions, and address books. |
| **Catalog** | `Category`, `Brand`, `Product`, `ProductVariant`, `ProductImage` | Manages categories, brands, variants (SKU, size/color attributes, stock), and images. |
| **Offers & Reviews** | `Review`, `WishlistItem`, `Coupon`, `Offer`, `ProductQuantityOffer` | Handles customer reviews, wishlists, promo codes, trigger-based rewards, and bulk bundle pricing. |
| **Orders & Payment** | `Order`, `OrderItem`, `FawryPayment` | Orders with full historical snapshots, status tracking, and Fawry payment callback verifications. |
| **Site Config** | `HomepageSection`, `Setting`, `NewsletterSubscription` | Dynamic layout sections, key-value settings, and newsletter signups. |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your environment:
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: Local instance or remote database (e.g., Supabase, Neon)

---

### Installation Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/OmarAlsayed10/avirasports.git
   cd avirasports
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   # Database Connections
   DATABASE_URL="postgresql://user:password@localhost:5432/avirasports?schema=public"
   DIRECT_URL="postgresql://user:password@localhost:5432/avirasports?schema=public"

   # NextAuth / Auth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key"

   # Fawry Payment Gateway (Egyptian Localization)
   FAWRY_MERCHANT_CODE="YOUR_MERCHANT_CODE"
   FAWRY_SECURITY_KEY="YOUR_SECURITY_KEY"
   FAWRY_BASE_URL="https://atfawry.fawrypay.com"

   # Cloudinary Media Storage
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"

   # Mailer Settings (Password Resets & Notifications)
   SMTP_HOST="smtp.example.com"
   SMTP_PORT=587
   SMTP_USER="no-reply@avirasports.com"
   SMTP_PASS="your-smtp-password"
   FROM_EMAIL="Avira Sports <no-reply@avirasports.com>"
   ```

4. **Initialize Database**:
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run database migrations
   npm run prisma:migrate

   # Seed initial database (categories, products, demo users)
   npm run prisma:seed
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

In `package.json`, you will find scripts for development, testing, database maintenance, and production builds:

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Generates Prisma client and builds the application for production.
- `npm run start`: Runs the compiled production server.
- `npm run lint`: Runs ESLint check.
- `npm run typecheck`: Validates TypeScript types across the project.
- `npm run test:unit`: Runs unit tests using Vitest.
- `npm run test:unit:watch`: Runs Vitest in watch mode.
- `npm run test:e2e`: Runs Playwright end-to-end tests.
- `npm run prisma:generate`: Generates updated Prisma Client types.
- `npm run prisma:migrate`: Applies database migrations in development.
- `npm run prisma:seed`: Seeds initial data into the database.

---

## 🧪 Testing

### Unit Testing
Unit tests are powered by **Vitest** and **React Testing Library**:
```bash
npm run test:unit
```

### End-to-End Testing
End-to-end user flows (Cart, Checkout, User Login) are tested using **Playwright**:
```bash
npm run test:e2e
```

---

## 📄 License

Copyright © 2026 Avira Sports. All rights reserved.
