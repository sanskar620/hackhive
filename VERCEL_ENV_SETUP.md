# 🔑 API Key Setup for Vercel Deployment

## ⚠️ CRITICAL: YES, You MUST Add Environment Variables on Vercel!

Even though you have `.env` files locally, **Vercel requires you to add environment variables separately** in their dashboard.

---

## Why You Need to Add Environment Variables on Vercel

1. **`.env` files are NOT deployed** - They're ignored for security reasons
2. **Vercel uses its own environment system** - Separate from your local files
3. **Security best practice** - Never commit API keys to Git

---

## 🚀 How to Add Your API Key on Vercel

### During Initial Deployment

When you import your project on Vercel:

1. After selecting your repository, you'll see **"Configure Project"**
2. Scroll down to **"Environment Variables"** section
3. Click **"Add"** or expand the section
4. Enter:
   - **Name:** `VITE_API_KEY`
   - **Value:** `AIzaSyD_YG-IlAQ1AP5T7h2aA4FbLuaZ56xVxag`
   - **Environments:** Select all (Production, Preview, Development)
5. Click **"Add"**
6. Continue with deployment

### After Deployment (If You Forgot)

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in the left sidebar
4. Click **"Add New"**
5. Enter:
   - **Key:** `VITE_API_KEY`
   - **Value:** `AIzaSyD_YG-IlAQ1AP5T7h2aA4FbLuaZ56xVxag`
   - **Environments:** Select all
6. Click **"Save"**
7. **Redeploy** your project (go to Deployments → click "..." → Redeploy)

---

## 📋 Quick Checklist

Before deploying to Vercel:

- [x] `.env` files added to `.gitignore` ✅ (Already fixed!)
- [ ] Initialize Git repository
- [ ] Commit your code (`.env` files will be ignored)
- [ ] Push to GitHub
- [ ] Import project on Vercel
- [ ] **Add `VITE_API_KEY` in Vercel dashboard** ⚠️ REQUIRED
- [ ] Deploy

---

## 🔒 Security Note

Your API key is:
```
AIzaSyD_YG-IlAQ1AP5T7h2aA4FbLuaZ56xVxag
```

**Important:**
- ✅ This key is now protected locally (added to `.gitignore`)
- ✅ It won't be committed to GitHub
- ⚠️ You MUST manually add it to Vercel's environment variables
- 💡 Consider rotating this key if it was previously committed to GitHub

---

## 🎯 Summary

**Answer: YES, you absolutely MUST add the environment variable on Vercel!**

Your local `.env` files are only for local development. Vercel has its own separate environment variable system that you must configure through their dashboard.

**Without adding the API key to Vercel, your deployed app won't work!**
