# 🚀 Netlify Deployment Guide - FastForm

This guide provides step-by-step instructions to deploy FastForm on Netlify, focusing on the required environment variables.

## 📋 Prerequisites

Before deploying, ensure you have:
- A Netlify account (https://netlify.com)
- All required API keys and credentials
- The project cloned locally

## 🔑 Required Environment Variables

### Critical Variables (Must Have)
These variables are required for the application to function:

1. **OpenAI Configuration**
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

2. **Moonshot AI Configuration** (Alternative to OpenAI)
   ```
   MOONSHOT_API_KEY=your_moonshot_api_key_here
   ```

3. **Firebase Configuration**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Google OAuth**
   ```
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

5. **MercadoPago** (for payments)
   ```
   MERCADOPAGO_ACCESS_TOKEN=your-access-token
   MERCADOPAGO_PUBLIC_KEY=your-public-key
   ```

## 🚀 Deployment Steps

### Step 1: Prepare Environment Variables

1. **Copy the example file**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Fill in your actual values**
   Edit `.env.local` with your real API keys and credentials.

### Step 2: Deploy to Netlify

#### Option A: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to [Netlify Dashboard](https://app.netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build Command**: `npm ci --legacy-peer-deps && npm run build`
   - **Publish Directory**: `.next`

#### Option B: Manual Upload
1. Build locally: `npm run build`
2. Drag and drop the `.next` folder to Netlify

### Step 3: Configure Environment Variables in Netlify

#### Method 1: Netlify Dashboard
1. Go to **Site Settings > Environment Variables**
2. Click "Add environment variable"
3. Add each variable from your `.env.local` file
4. Click "Deploy site"

#### Method 2: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Set environment variables
netlify env:set OPENAI_API_KEY "your_openai_key"
netlify env:set MOONSHOT_API_KEY "your_moonshot_key"
netlify env:set NEXT_PUBLIC_FIREBASE_API_KEY "your_firebase_key"
netlify env:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN "your-project.firebaseapp.com"
netlify env:set NEXT_PUBLIC_FIREBASE_PROJECT_ID "your-project-id"
netlify env:set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET "your-project.appspot.com"
netlify env:set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID "your-sender-id"
netlify env:set NEXT_PUBLIC_FIREBASE_APP_ID "your-app-id"
netlify env:set GOOGLE_CLIENT_SECRET "your-client-secret"
netlify env:set NEXT_PUBLIC_GOOGLE_CLIENT_ID "your-client-id.apps.googleusercontent.com"
netlify env:set MERCADOPAGO_ACCESS_TOKEN "your-access-token"
netlify env:set MERCADOPAGO_PUBLIC_KEY "your-public-key"

# Deploy
netlify deploy --prod
```

### Step 4: Verify Deployment

1. **Check build logs** in Netlify dashboard
2. **Test the live site** to ensure all features work
3. **Verify environment variables** are set correctly

## 🔍 Troubleshooting

### Common Issues

#### "OPENAI_API_KEY environment variable is missing"
- Ensure `OPENAI_API_KEY` is set in Netlify environment variables
- Check spelling and that there are no extra spaces
- Verify the key is valid and has credits

#### Build fails with "MOONSHOT_API_KEY not configured"
- Add `MOONSHOT_API_KEY` as an environment variable
- This serves as a fallback for OpenAI

#### Firebase errors
- Verify all Firebase variables are correctly set
- Check Firebase project settings and permissions

### Debug Commands
```bash
# Check if all variables are set
netlify env:list

# View build logs
netlify logs

# Test build locally
npm run build
```

## 📋 API Setup Guides

### Getting OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add payment method and ensure you have credits

### Getting Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing
3. Go to Project Settings > General > Your apps
4. Get configuration values for web app

### Getting Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs including your Netlify domain

## 🎯 Quick Checklist

- [ ] All required environment variables added to Netlify
- [ ] API keys are valid and have credits
- [ ] Firebase project is properly configured
- [ ] Google OAuth redirect URIs include Netlify domain
- [ ] Build completes successfully
- [ ] All features work on the live site

## 📞 Support

If you encounter issues:
1. Check the build logs in Netlify
2. Verify all environment variables are set
3. Test with `npm run build` locally
4. Create an issue in the GitHub repository