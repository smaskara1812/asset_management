# 🆓 Free Tier Deployment Guide

## Quick Start (15 minutes)

### 1. 🚀 Deploy Backend to Railway (Free)

**Go to [railway.app](https://railway.app)**

1. **Sign up with GitHub**
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your `asset_management` repository**
5. **Railway auto-detects Django** ✅

**Add PostgreSQL Database:**
1. **Click "New" → "Database" → "PostgreSQL"**
2. **Copy the DATABASE_URL** (you'll need this)

**Set Environment Variables:**
Go to your service → Variables tab:

```bash
SECRET_KEY=django-insecure-your-secret-key-here-make-it-long
DATABASE_URL=postgresql://user:pass@host:port/dbname
DJANGO_SETTINGS_MODULE=asset_backend.settings_production
DEBUG=False
ALLOWED_HOSTS=*.railway.app
```

**Your backend will be live at:** `https://your-project-name.railway.app`

---

### 2. 🌐 Deploy Frontend to Vercel (Free)

**Go to [vercel.com](https://vercel.com)**

1. **Sign up with GitHub**
2. **Click "New Project"**
3. **Import your repository**
4. **Configure:**
   - **Framework Preset:** Vite
   - **Root Directory:** `asset_frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

**Set Environment Variable:**
Go to Settings → Environment Variables:

```bash
VITE_API_URL=https://your-railway-backend-url.railway.app/api
```

**Your frontend will be live at:** `https://your-project-name.vercel.app`

---

## 🧪 Testing Your Deployment

### Test Backend API:
```bash
curl https://your-backend.railway.app/api/assets/
```

### Test Frontend:
1. **Visit your Vercel URL**
2. **Try adding an asset**
3. **Check if data saves to database**

---

## 💰 Free Tier Limits

### Railway:
- ✅ **$5 credit monthly** (usually enough)
- ✅ **512MB RAM**
- ✅ **PostgreSQL database included**
- ✅ **Custom domains**

### Vercel:
- ✅ **Unlimited personal projects**
- ✅ **100GB bandwidth/month**
- ✅ **Unlimited deployments**
- ✅ **Custom domains**

### **Total Cost: $0/month** 🎉

---

## 🔧 Troubleshooting

### Backend Issues:
- **Check Railway logs** in dashboard
- **Verify environment variables** are set
- **Test API endpoints** directly
- **Check database connection**

### Frontend Issues:
- **Check Vercel logs** in dashboard
- **Verify VITE_API_URL** is correct
- **Test build locally** with `npm run build`
- **Check browser console** for errors

### Common Fixes:
```bash
# If backend fails to start
SECRET_KEY=your-secret-key-here
DEBUG=False

# If CORS errors
ALLOWED_HOSTS=*.railway.app,*.vercel.app

# If database connection fails
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

---

## 📈 Upgrade Path

When you're ready to upgrade:

### Railway Pro ($5/month):
- **More resources**
- **Better performance**
- **Priority support**

### Vercel Pro ($20/month):
- **More bandwidth**
- **Team collaboration**
- **Advanced analytics**

### Custom Domain:
- **Buy domain** (Namecheap, GoDaddy)
- **Configure DNS** to point to Railway/Vercel
- **Update CORS settings**

---

## 🎯 Success Checklist

- [ ] Backend deployed to Railway
- [ ] PostgreSQL database created
- [ ] Environment variables set
- [ ] Frontend deployed to Vercel
- [ ] API URL configured
- [ ] App working end-to-end
- [ ] Can add/view assets
- [ ] Database persisting data

**You're live! 🚀**
