# ULAM – Discover Hidden Local Food Gems  
A Full-Stack Web Application powered by React, Laravel, and Azure  

## ULAM - Link  
[*(Attach once uploaded)*
](https://ulam-app-h0a6a4adbebpb9d9.southeastasia-01.azurewebsites.net/)

## Project Overview

ULAM is a full-stack web application that helps users discover and share lesser-known food establishments in the Philippines. It provides a community-driven directory where users can browse by region, province, and locality, search for hidden food spots, and filter based on price preferences.

Authenticated users can contribute posts, leave comments, like entries, and help grow the catalog of hidden gems. The platform also uses structured geographic data aligned with Philippine administrative divisions for organized browsing.

### Objectives
- Provide a platform for discovering local food “hidden gems”
- Increase visibility of small and home-based food businesses
- Enable user contributions through posts, comments, and reviews
- Support structured geographic browsing (Region → Province → Locality)
- Ensure secure authentication and user management
- Deliver a responsive, interactive, and modern user experience
- Deploy a fully cloud-hosted system using Microsoft Azure

## Project Phases

### Phase 1: Planning & System Design
- Identified user needs and core features  
- Designed system architecture (React frontend + Laravel API backend)  
- Created normalized database schema for geographic and user-generated data  
- Selected Azure as the hosting and deployment platform  

### Phase 2: Backend Development (Laravel API)
- Implemented RESTful endpoints for shops, comments, locations, and likes  
- Configured Laravel Sanctum for secure token authentication  
- Developed filtering logic (search, region, province, locality, price level)  
- Created seeders for regions, provinces, localities, and sample hidden gems  
- Implemented user roles and resource transformers  

### Phase 3: Frontend Development (React + TypeScript)
- Built a responsive SPA using React Router and TailwindCSS  
- Implemented Discover Page with search and filters  
- Developed Add/Edit Shop forms with validation  
- Created animated sections using Framer Motion  
- Built reusable components (cards, headers, dropdown menus)  
- Added authentication context and protected routes  

### Phase 4: Integration, Testing & Debugging
- Ensured stable API communication using `VITE_API_BASE_URL`  
- Fixed CORS issues, deployment paths, and Nginx routing  
- Resolved GitHub Actions build directory errors  
- Debugged API failures due to hardcoded localhost URLs  
- Verified migrations, seeders, and live DB entries via Azure SSH  

### Phase 5: Deployment & Cloud Configuration
- Hosted Laravel API and React build on Azure App Service  
- Connected to Azure Database for MySQL  
- Implemented GitHub Actions CI/CD pipeline  
- Updated Nginx config and startup script for SPA compatibility  
- Verified application logs and API health in Azure environments  

## Features Implemented

### Core Application Features
- Hidden gem discovery with images and descriptions  
- Search, filters, and paginated listings  
- Detailed shop pages with comments, photos, and metadata  
- Geographic navigation (Region → Province → Locality)  
- Price-level classification (Budget, Mid, Premium)  

### User Features
- Authentication (login, registration)  
- Add, edit, delete personal posts  
- Commenting and liking  
- Profile page showing user activity (shops + reviews)  

### Frontend (React)
- Responsive UI using TailwindCSS  
- Smooth animations using Framer Motion  
- Reusable card-based components  
- Auto-closing navbar dropdown  
- AuthContext with token persistence  

### Backend (Laravel)
- RESTful API endpoints  
- Laravel Sanctum authentication  
- Shop CRUD, comments, likes, photos  
- Input validation and resource transformers  
- Geographic data relations and queries  

### Cloud & Infrastructure
- Azure App Service hosting  
- Azure MySQL Flexible Server  
- CI/CD via GitHub Actions  
- Custom Nginx rules for SPA routing  
- Manual Azure SSH configuration  
- Environment variable management through App Service  

## Testing
- Verified all API endpoints for authentication, shops, and comments  
- Ensured frontend communicates with `/api` using dynamic Vite env  
- Confirmed migrations and seeders execute correctly on Azure  
- Validated Discover Page filters (region, province, locality, price, search)  
- Debugged React build loading issue (missing dist copy step)  
- Resolved Nginx routing issues causing white screen on refresh  
- Tested profile, posting, commenting, and protected actions  

## What We Learned
- Designing a full-stack application using React + Laravel  
- Creating scalable REST APIs with filtering and pagination  
- Managing authentication using Laravel Sanctum  
- Integrating frontend and backend through shared environment variables  
- Debugging cloud deployment issues (Nginx, permissions, environment paths)  
- Working with Azure App Service and Azure MySQL  
- Setting up CI/CD pipelines through GitHub Actions  
- Troubleshooting SPA routing in cloud containers  
- Collaborating efficiently using Git and branch workflows  

## Future Enhancements
- Enable direct image uploads (local or Azure Blob Storage)  
- Implement admin moderation panel  
- Add map-based visualization for shops  
- Introduce fuzzy search or full-text indexing  
- Allow multi-photo uploads and gallery views  
- Integrate Google or Microsoft social login  
- Add ratings and bookmarking features  
- Implement caching for better performance  
- Add gamification (user badges, levels, contributions)  
