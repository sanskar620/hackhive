# SmartQueue - Vercel Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- ✅ A GitHub account
- ✅ A Vercel account (free tier works fine)
- ✅ Your code pushed to a GitHub repository

---

## Method 1: Deploy via Vercel Dashboard (Recommended for Beginners)

### Step 1: Push Your Code to GitHub

If you haven't already pushed your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit with build fixes"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/smartqueue.git

# Push to GitHub
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 3: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find your `smartqueue` repository in the list
3. Click **"Import"**

### Step 4: Configure Project Settings

Vercel will auto-detect your Vite project. Verify these settings:

- **Framework Preset:** Vite
- **Root Directory:** `./` (leave as default)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Step 5: Add Environment Variables (Important!)

1. Click **"Environment Variables"** section
2. Add your API key:
   - **Name:** `VITE_API_KEY`
   - **Value:** Your Google Gemini API key
   - **Environment:** Production, Preview, Development (select all)
3. Click **"Add"**

### Step 6: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Once done, you'll see: **"Congratulations! Your project has been deployed"**
4. Click **"Visit"** to see your live site

### Step 7: Get Your Deployment URL

Your app will be live at:
```
https://your-project-name.vercel.app
```

You can also add a custom domain in the Vercel dashboard.

---

## Method 2: Deploy via Vercel CLI (For Advanced Users)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy

Navigate to your project directory and run:

```bash
# For preview deployment
vercel

# For production deployment
vercel --prod
```

### Step 4: Set Environment Variables

```bash
vercel env add VITE_API_KEY
```

Enter your API key when prompted, and select the environments (production, preview, development).

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## Method 3: Deploy via Git Integration (Automatic Deployments)

Once you've connected your GitHub repository to Vercel (Method 1), every push to your repository will automatically trigger a new deployment:

```bash
# Make changes to your code
git add .
git commit -m "Update features"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your project
3. Deploy the new version
4. Provide a preview URL

---

## Troubleshooting

### Build Fails with "Cannot find module"
- **Solution:** The configuration has been fixed in `tsconfig.json` and `vite.config.ts`
- Ensure you've committed and pushed the latest changes

### Environment Variables Not Working
- **Solution:** Make sure `VITE_API_KEY` is set in Vercel dashboard
- Variable names must start with `VITE_` to be accessible in the frontend
- Redeploy after adding environment variables

### 404 Error on Page Refresh
- **Solution:** The `vercel.json` file handles this with SPA routing
- Ensure `vercel.json` is committed to your repository

### Build Takes Too Long
- **Solution:** This is normal for the first build
- Subsequent builds will be faster due to caching

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Test all features on the live site
- [ ] Verify QR code generation works
- [ ] Test student, staff, and admin views
- [ ] Check that AI features work (requires valid API key)
- [ ] Test on mobile devices
- [ ] Share the deployment URL with your team

---

## Updating Your Deployment

To update your live site:

1. Make changes locally
2. Test locally with `npm run dev`
3. Commit changes: `git commit -am "Description of changes"`
4. Push to GitHub: `git push origin main`
5. Vercel automatically deploys the update

---

## Custom Domain Setup (Optional)

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Enter your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-10 minutes)

---

## Monitoring Your Deployment

### View Deployment Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View **"Build Logs"** and **"Function Logs"**

### Analytics
Vercel provides free analytics:
- Page views
- Top pages
- Visitor locations
- Performance metrics

Access via: **Dashboard → Your Project → Analytics**

---

## Important Notes

⚠️ **API Key Security:**
- Never commit your API key to GitHub
- Always use environment variables
- Rotate keys if accidentally exposed

✅ **Best Practices:**
- Test locally before pushing
- Use preview deployments for testing
- Monitor build times and errors
- Keep dependencies updated

---

## Need Help?

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Vite Documentation:** [vitejs.dev](https://vitejs.dev)
- **Project Issues:** Check the build logs in Vercel Dashboard

---

## Quick Reference Commands

```bash
# Local development
npm run dev

# Local build test
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel (CLI)
vercel --prod

# Check Vercel CLI version
vercel --version

# Pull environment variables from Vercel
vercel env pull
```

---

**Your SmartQueue app is now live! 🎉**
