# Deployment Guide - Famly App

## Vercel Deployment

### Prerequisites
1. Vercel account (sign up at https://vercel.com)
2. GitHub repository connected
3. Supabase project with environment variables

### Step 1: Environment Variables

Set these environment variables in Vercel:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_APP_ENV=production
```

### Step 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### Step 3: Deploy via GitHub (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Add environment variables in the Vercel dashboard
6. Click "Deploy"

### Step 4: Configure Supabase Storage

Make sure your Supabase storage bucket `profile-photos` is configured:
- Public read access enabled
- Authenticated upload allowed
- CORS configured for your Vercel domain

### Step 5: Update Supabase Auth Settings

In Supabase Dashboard → Authentication → URL Configuration:
- Add your Vercel domain to "Site URL"
- Add your Vercel domain to "Redirect URLs"

## Mobile App Deployment

For iOS/Android deployment, use Expo Application Services (EAS):

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to App Store
eas submit --platform ios
eas submit --platform android
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `EXPO_PUBLIC_APP_ENV` | Environment (development/production) | No |

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure `babel-preset-expo` is installed
- Verify Node.js version (18+ recommended)

### Environment Variables Not Working
- Ensure variables start with `EXPO_PUBLIC_` for client-side access
- Restart Vercel deployment after adding variables
- Check Vercel function logs for errors

### Supabase Connection Issues
- Verify CORS settings in Supabase
- Check that RLS policies allow public read where needed
- Ensure storage bucket permissions are correct

