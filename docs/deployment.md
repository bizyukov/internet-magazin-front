# Deployment Guide

This guide covers deploying the full‑stack e‑commerce application to production.

## Architecture Overview
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Vercel (FE) │────▶│ Railway (BE) │────▶│ PostgreSQL │
│ Angular 20 │ │ NestJS 11 │ │ (Railway DB) │
└─────────────────┘ └─────────────────┘ └─────────────────┘


## Prerequisites

- GitHub account
- [Vercel](https://vercel.com) account (free tier)
- [Railway](https://railway.com) account (free tier with $5 credit)
- PostgreSQL database (provided automatically by Railway)

---

## Backend Deployment (NestJS + PostgreSQL on Railway)

### Step 1: Prepare the Backend

Ensure your `src/app.module.ts` uses environment variables:

```typescript
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadModels: true,
        synchronize: process.env.NODE_ENV !== 'production',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

Create a Procfile in the root (optional but recommended):
```Procfile
web: npm run start:prod
```

## Step 2: Deploy to Railway

- [ ] **Sign in to [Railway](https://railway.app)**
- [ ] Click **New Project** → **Deploy from GitHub repo**
- [ ] Select your `internet-magazin-back` repository
- [ ] Railway automatically detects **NestJS** and starts the build

## Step 3: Add PostgreSQL Database

- [ ] In your Railway project dashboard, click **Create** → **Database** → **Add PostgreSQL**
- [ ] Railway creates the database and automatically injects connection variables into the backend service

## Step 4: Configure Environment Variables

Add these variables in **Railway** → **backend service** → **Variables** tab:


| Variable | Value | Notes |
| :--- | :--- | :--- |
| `JWT_SECRET` | `your_strong_secret_key` | Generate a strong random string |
| `JWT_EXPIRES_IN` | `7d` | Optional, default 1h |
| `NODE_ENV` | `production` | |
| `PORT` | `3000` | Railway uses this internally |

> [!IMPORTANT]
> Railway automatically provides `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` from the attached PostgreSQL service. **Do not override them.**

## Step 5: Deploy

- Railway triggers a deployment on **every push** to the connected branch. 
- You can also manually deploy from the dashboard.

After deployment, Railway provides a URL like:  
`https://internet-magazin-back.up.railway.app`

### Accessing your API
Your API will be available at:  
`https://<your-railway-url>/api`

### Testing
- Test the health endpoint (if you have one)
- Visit **Swagger** documentation: `https://<your-railway-url>/swagger`

## Frontend Deployment (Angular on Vercel)

### Step 1: Prepare the Frontend for Production
Create a `vercel.json` file in the frontend project root to ensure proper routing for a Single Page Application (SPA):

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

> **Note:** This configuration is required to prevent 404 errors when refreshing the page or accessing routes directly, as it redirects all requests to `index.html` and lets Angular handle the routing.

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/internet-magazin-front",
  "devCommand": "npm start",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Update src/environments/environment.prod.ts:
```typescript
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://your-backend.railway.app/api'
};
```

### Step 2: Deploy to Vercel (GitHub Integration)

- [ ] **Sign in to [Vercel](https://vercel.com)**
- [ ] Click **Add New** → **Project**
- [ ] Import your `internet-magazin-front` repository
- [ ] Vercel auto-detects **Angular**. Keep the default build settings.

#### Environment Variables
Add the following variable in the **Environment Variables** section:


| Name | Value |
| :--- | :--- |
| `API_URL` | `https://your-backend.railway.app/api` (use your actual Railway URL) |

- [ ] Click **Deploy**

> **Note:** Ensure that your Angular application is configured to use `process.env.API_URL` or an equivalent mechanism to fetch this value during the build process.

### Step 3: Custom Domain (Optional)

- [ ] Go to **Vercel project dashboard** → **Settings** → **Domains**.
- [ ] Add your domain name and follow the DNS instructions.
- [ ] Typically, you need to add a **CNAME** record pointing to `cname.vercel-dns.com` in your domain registrar's panel.

> **Note:** SSL certificates are automatically generated and renewed by Vercel once the domain is successfully connected.

---

## CI/CD Pipeline with GitHub Actions

Create `.github/workflows/deploy.yml` in each repository (frontend and backend) to automate deployment.

### Backend Workflow (`.github/workflows/deploy-backend.yml`)

```yaml
name: Deploy Backend to Railway

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        uses: railway/actions/deploy@v2
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE_ID }}
```

> **Note:** You need to configure the following GitHub Secrets in your repository:
> - `RAILWAY_TOKEN`: Your Railway API token.
> - `RAILWAY_SERVICE_ID`: The specific ID of the backend service in your Railway project.

### Frontend Workflow (`.github/workflows/deploy-frontend.yml`)

```yaml
name: Deploy Frontend to Vercel

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

> **Note:** To enable this automation, ensure the following secrets are added to your GitHub repository:
> - `VERCEL_TOKEN`: Your Vercel Personal Access Token.
> - `VERCEL_ORG_ID`: Found in your Vercel account settings (Team ID or User ID).
> - `VERCEL_PROJECT_ID`: Found in your Vercel project settings.

---

### Setting Up Secrets

#### For Railway:
1.  **Install Railway CLI**: `npm i -g @railway/cli`
2.  **Login**: Run `railway login`
3.  **Link your project**: Run `railway link`
4.  **Generate a token**: Run `railway token --name github-actions`
5.  **GitHub Config**: Copy the generated token and add it as `RAILWAY_TOKEN` in your GitHub repository secrets.
6.  **Find Service ID**: Run `railway status` to copy your Service ID, then add it as `RAILWAY_SERVICE_ID` in GitHub secrets.

#### For Vercel:
1.  **Create Token**: Go to **Vercel** → **Settings** → **Tokens** and create a new token.
2.  **GitHub Config**: Add this token as `VERCEL_TOKEN` in your GitHub repository secrets.
3.  **Find IDs**: To get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`:
    *   Run `npx vercel link` in the frontend project root.
    *   Once linked, check the `.vercel/project.json` file to find both IDs.

> **Note:** Never commit the `.vercel` folder or any files containing tokens to your public repository.

---

### Environment Variables Summary

#### Backend (Railway)


| Variable | Source | Example |
| :--- | :--- | :--- |
| `DB_HOST` | Auto from PostgreSQL | `containers-us-west-xxx.railway.app` |
| `DB_PORT` | Auto | `5432` |
| `DB_USERNAME` | Auto | `postgres` |
| `DB_PASSWORD` | Auto | `xxx` |
| `DB_NAME` | Auto | `railway` |
| `JWT_SECRET` | Manual | `your-secret-key-min-32-chars` |
| `JWT_EXPIRES_IN` | Manual | `7d` |
| `NODE_ENV` | Manual | `production` |
| `PORT` | Manual | `3000` |

> **Note:** Railway automatically injects database credentials if the PostgreSQL service is connected to your backend service. Manual variables must be added in the **Variables** tab of your service.

#### Frontend (Vercel)


| Variable | Value |
| :--- | :--- |
| `API_URL` | `https://your-backend.railway.app/api` |

> **Note:** The `API_URL` should point to your deployed backend on Railway. Make sure to include the `/api` suffix if your backend routes are prefixed.

## Post-Deployment Checklist

- [ ] **Backend Swagger UI loads**: Check if documentation is accessible at `https://your-backend.railway.app/swagger`
- [ ] **CORS Check**: Ensure the Frontend loads without CORS errors (verify that CORS is enabled in backend `main.ts`).
- [ ] **Auth Flow**: Confirm that User registration and login work as expected.
- [ ] **Catalog**: Verify that the Product list displays correctly.
- [ ] **Shopping Cart**: Test if adding/removing items from the cart works.
- [ ] **Checkout**: Ensure that entering address and payment method works.
- [ ] **Order Success**: Confirm that order creation completes successfully.
- [ ] **User History**: Check if the user can view their order history.
- [ ] **Security**: Verify that environment variables are not exposed in client-side code (ensure proper use of Angular `environment.ts`).

> **Note:** If you encounter CORS issues, make sure your backend `main.ts` includes `app.enableCors({ origin: 'https://vercel.app' })`.

## Troubleshooting

### CORS Errors
If you encounter CORS issues, ensure your backend `main.ts` is properly configured:

```typescript
const app = await NestFactory.create(AppModule, { cors: true });
// or with specific origin for better security:
app.enableCors({ 
  origin: process.env.FRONTEND_URL || 'https://your-frontend.vercel.app' 
});
```

### Database Connection Issues
Check that Railway PostgreSQL is correctly linked to the backend service. If it is not linked automatically, you can manually add the connection string in the backend's **Variables** tab:

```text
DATABASE_URL=postgresql://user:pass@host:port/database
```

> **Note:** When using the automatic Railway link, the individual variables (`DB_HOST`, `DB_PORT`, etc.) are usually sufficient for TypeORM or Prisma.

### Build Fails on Railway
Railway usually detects **NestJS** automatically. If the build fails, add a `railway.json` file to your backend project root:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  }
}
```

> **Note:** Ensure that your `package.json` contains a `build` script (typically `nest build`) and that you are not excluding necessary files in `.gitignore`.

---

## Additional Resources

*   [Railway NestJS Guide](https://railway.app) — Official documentation for deploying NestJS on Railway.
*   [Vercel Angular Guide](https://vercel.com) — Official guide for deploying Angular applications on Vercel.
*   [GitHub Actions for Railway](https://github.com) — Documentation for the Railway deploy action in the GitHub Marketplace.
