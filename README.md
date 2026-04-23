# Angular E‑commerce – Modern Online Store Frontend

[![Angular](https://img.shields.io/badge/Angular-20-red.svg)](https://angular.io/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952b3.svg)](https://getbootstrap.com/)
[![Status: Active](https://img.shields.io/badge/status-active-brightgreen.svg)](https://github.com/yourusername/angular-ecommerce)

> 🛍️ A fully‑featured **e‑commerce frontend** built with **Angular 20**, showcasing modern best practices and a smooth user experience.

## 📖 Overview

This project is a complete online store interface, including:

- **Product browsing** with detailed views.
- **Shopping cart** with quantity management and promo codes.
- **Wishlist** for saving favourite products.
- **User authentication** (login/register).
- **Checkout flow** (shipping address, payment method, order confirmation).
- **User profile** with order history and password change.

The application is designed with **scalability** and **maintainability** in mind, using **standalone components**, **signals**, and **lazy loading**.

## 🛠️ Technology Stack

- **Framework**: Angular 20
- **UI Components**: Ng Bootstrap
- **Styling**: Bootstrap 5 + custom SCSS
- **State Management**: Services + RxJS (BehaviourSubject)
- **Forms**: Reactive Forms
- **Icons**: Bootstrap Icons (via `@ng-icons/bootstrap-icons`)

## 📁 Project Structure (Simplified)
```bash
src/app/
├── core/ # Singleton services, guards, interceptors
├── shared/ # Reusable components (product card, password strength...)
├── auth/ # Login/register pages and auth service
├── public/ # Public pages (home, product detail, search)
├── user/ # User dashboard (profile, orders, cart, wishlist, checkout)
├── admin/ # Admin area (if implemented)
├── app.config.ts # Application providers
├── app.routes.ts # Route definitions
└── app.component.ts # Root component
```

## ✅ Implemented Features

- **Authentication**: JWT token handling with HTTP interceptor, refresh token logic.
- **Product Catalog**: display products, search, detail page.
- **Cart**: add/remove items, update quantities, promo code support.
- **Wishlist**: add/remove products.
- **Checkout**: multi‑step form (address, payment, confirmation).
- **User Profile**: update name/email/phone, change password with strength meter.
- **Orders**: list past orders, view order details.
- **Responsive design** with Bootstrap 5.

## 🔧 How to Run

```bash
npm install
ng serve
```
Navigate to http://localhost:4200/. The app expects a backend API (not included in this repo). You can easily mock responses or connect it to a real backend by updating the service URLs.

## 📚 Educational Value
This project demonstrates:

Angular 20 modern features: @if, @for, @let, signals, inject().

Standalone components and lazy‑loaded routes.

Reactive forms with custom validation.

HTTP interceptors for authentication.

Clean separation of concerns (core/shared/feature modules).

RxJS patterns for state management.

It serves as an excellent reference for building scalable Angular applications and can be compared with my earlier Angular projects to illustrate professional growth.

## 📄 License
MIT – use freely for learning and as a foundation for your own projects.

## 👤 Author & EB‑1A Context
GitHub: @bizyukov
This repository is part of a curated portfolio documenting 15+ years of software development, supporting an EB‑1A extraordinary ability visa petition under the original contributions criterion.

“The best way to predict the future is to implement it.” – Alan Kay