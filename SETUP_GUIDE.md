# NariSetu CI/CD Setup Guide

This guide explains how to set up the necessary secrets and configuration for the NariSetu GitHub Actions CI/CD pipelines.

## 1. Disable Auto-Deploys on Hosting Platforms

Since GitHub Actions will now handle testing and deploying upon a successful merge to `main`, you must disable the built-in "auto-deploy on push" features in Vercel and Render to prevent duplicate deployments and untested code from reaching production.

### Vercel (Frontend)
1. Go to your NariSetu project dashboard in Vercel.
2. Navigate to **Settings** > **Git**.
3. Under **Connected Git Repository**, find the "Production Branch" or "Auto-Deploy" setting and disable it, OR disconnect the GitHub repository integration entirely so Vercel only deploys when triggered by the CLI in GitHub Actions.

### Render (Backend)
1. Go to your NariSetu Web Service dashboard in Render.
2. Navigate to **Settings**.
3. Under **Auto-Deploy**, set it to **No**.

## 2. GitHub Secrets

You need to add the following secrets to your GitHub repository by going to **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.

### Vercel Secrets (for Frontend Deployment)
To get these, you need to install Vercel CLI locally (`npm i -g vercel`), run `vercel login`, and run `vercel link` in your `client` folder.
- `VERCEL_TOKEN`: Create a token at https://vercel.com/account/tokens
- `VERCEL_ORG_ID`: Found in `.vercel/project.json` after linking.
- `VERCEL_PROJECT_ID`: Found in `.vercel/project.json` after linking.

### Frontend Build Secrets (Firebase)
These are used during the Vite build process. Use your production Firebase config.
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Render Deploy Secrets (for Backend Deployment)
- `RENDER_DEPLOY_HOOK_URL`: Go to your Render Web Service **Settings** > **Deploy Hook**. Copy the URL.
- `BACKEND_HEALTH_URL`: The public URL to your health check endpoint (e.g., `https://narisetu-api.onrender.com/api/health`).

### Backend Test Secrets (Firebase)
> [!IMPORTANT]
> Do NOT use your production Firebase project for these tests, as the tests might clear databases or perform unintended actions.

1. Create a new "NariSetu-Test" project in the Firebase Console.
2. Enable Authentication and Firestore in the test project.
3. Go to **Project Settings** > **Service accounts** > **Generate new private key**.
4. Open the downloaded JSON file and extract the following into secrets:
   - `TEST_FIREBASE_PROJECT_ID`: (e.g., `narisetu-test-1234`)
   - `TEST_FIREBASE_CLIENT_EMAIL`: (e.g., `firebase-adminsdk-xxxxx@narisetu-test.iam.gserviceaccount.com`)
   - `TEST_FIREBASE_PRIVATE_KEY`: The entire private key string, exactly as it appears in the JSON, including `-----BEGIN PRIVATE KEY-----` and `\n` characters.

## 3. Running the Pipeline

- **Pull Requests**: When a PR is created or updated, the pipeline will automatically run `npm test` and `npm run lint`. It will not deploy.
- **Merge to Main**: When code is merged to `main`, the pipeline runs tests. If they pass, it deploys the frontend to Vercel and triggers the backend deploy hook on Render. The backend workflow will poll the `/api/health` endpoint and fail if it doesn't return `200 OK` within 60 seconds.
