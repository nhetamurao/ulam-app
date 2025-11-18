ULAM – Discover Hidden Local Food Gems

A community-driven platform for discovering small food businesses across the Philippines.

⭐ Overview

ULAM is a full-stack web application designed to help users discover, share, and review local “hidden gems”—small restaurants, food stalls, and home-cooked food businesses. The application provides an interactive search and filtering system, geographic navigation (Region → Province → Locality), user-generated posts, and a modern, responsive interface.

This repository contains both the Laravel API backend and the React + TypeScript frontend built with Vite.

📌 Features
Frontend (React + TypeScript)

Modern, responsive, and animated UI

Discover page with:

Search

Price-level filtering (Budget / Mid / Premium)

Pagination

Hidden Gem detail view with photos and comments

Protected routes using token-based authentication

Custom AuthContext with localStorage persistence

Smooth animations using Framer Motion

Dynamic geographic browsing

Backend (Laravel)

Fully RESTful API

Laravel Sanctum authentication

CRUD operations for shops, comments, likes, and photos

Geographic models (Region → Province → Locality)

Pagination and multi-filter search logic

Role-ready (users + roles pivot)

Resource transformers for API structure

Cloud Deployment (Azure)

Hosted on Azure App Service

Connected to Azure Database for MySQL Flexible Server

CI/CD using GitHub Actions → Azure WebApp Deploy

Custom Nginx configuration applied via startup script

🛠️ Tech Stack
Layer	Technologies
Frontend	React, TypeScript, Vite, TailwindCSS, React Router, Framer Motion
Backend	Laravel 11, PHP 8+, Laravel Sanctum
Database	MySQL (Azure Flexible Server)
Cloud Hosting	Azure App Service
CI/CD	GitHub Actions
Version Control	Git + GitHub
📁 Project Structure
ulam-webapp/
│
├── ulam-project/               # React frontend code
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
│
├── app/                        # Laravel backend code
├── public/                     # Merged frontend build artifacts
├── routes/
│   └── api.php                 # REST endpoints
│   └── web.php                 # SPA catch-all route
├── database/                   # Migrations, seeders, factories
├── storage/
├── composer.json
└── README.md

⚙️ Installation (Local Development)
1. Clone the Repository
git clone https://github.com/YOUR-ORG/ulam-webapp.git
cd ulam-webapp

Backend Setup – Laravel
2. Install Composer Dependencies
composer install

3. Create your .env
cp .env.example .env


Set local DB credentials:

DB_DATABASE=ulam_local
DB_USERNAME=root
DB_PASSWORD=

4. Generate Key
php artisan key:generate

5. Run Migrations + Seeders
php artisan migrate --seed

6. Start Laravel
php artisan serve


Backend runs at:
👉 http://127.0.0.1:8000

Frontend Setup – React + Vite
7. Navigate to the frontend
cd ulam-project

8. Install NPM dependencies
npm install

9. Create .env file
VITE_API_BASE_URL=http://127.0.0.1:8000/api

10. Run the frontend
npm run dev


Frontend runs at:
👉 http://localhost:5173

🔌 API Endpoints (Summary)
Authentication
Method	Endpoint	Description
POST	/api/register	Register a new user
POST	/api/login	Log in and return token
Geographic Data

| GET | /api/regions | List regions |
| GET | /api/provinces | List provinces |
| GET | /api/localities | List localities |

Shops

| GET | /api/shops | Paginated shop list + filters |
| GET | /api/shops/{id} | Shop details |
| POST | /api/shops (Auth) | Create new shop |
| PUT | /api/shops/{id} (Auth) | Update shop |
| DELETE | /api/shops/{id} | Delete shop |

Comments

| POST | /shops/{id}/comments | Add comment |
| PUT | /comments/{id} | Edit comment |
| DELETE | /comments/{id} | Delete |

Likes

| POST | /shops/{id}/like | Like shop |
| DELETE | /shops/{id}/like | Unlike shop |

🌐 Deployment (Azure)
Azure Resources Used

Azure App Service (Linux, PHP 8.x)

Azure Database for MySQL Flexible Server

Azure SSH Debug Console

GitHub Actions (CI/CD)

Custom Nginx configuration via startup script

1. Environment Variables on Azure

Configured under App Service > Configuration:

APP_ENV=production
APP_DEBUG=false
APP_KEY=******
DB_CONNECTION=mysql
DB_HOST=******
DB_DATABASE=******
DB_USERNAME=******
DB_PASSWORD=******
VITE_API_BASE_URL=https://yourapp.azurewebsites.net/api
VIEW_COMPILED_PATH=/home/site/wwwroot/storage/framework/views

2. Nginx Fix (SPA Routing + /public directory)

Inside /etc/nginx/sites-available/default:

root /home/site/wwwroot/public;

location / {
    try_files $uri $uri/ /index.php?$query_string;
}


Persisted using /home/site/startup.sh.

3. GitHub Actions CI/CD Workflow

Automatically:

Runs Composer

Installs Node dependencies

Builds Vite frontend

Copies /dist → Laravel /public

Deploys to Azure Web App

🧪 Running Tests

(If applicable)

php artisan test

🐞 Common Issues & Fixes
1. .env missing on Azure

Fix:

touch .env
nano .env

2. Missing storage directories

Fix:

mkdir -p storage/framework/{views,cache,sessions}
chmod -R 775 storage bootstrap/cache

3. Localhost URL errors

Always use:

import.meta.env.VITE_API_BASE_URL || "/api"

4. Nginx not loading React

Ensure /public is in the root path.

👥 Contributors

Andreas N. Luy

Kenneth Amurao
