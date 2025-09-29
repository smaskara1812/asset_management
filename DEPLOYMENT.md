# 🚀 Deployment Guide for Asset Management App

## Quick Deployment Options

### Option 1: Railway (Recommended - Easiest)

#### Backend Deployment:
1. **Sign up at [Railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Create a new project**
4. **Add PostgreSQL database service**
5. **Deploy your backend:**
   - Select your repository
   - Choose the `asset_backend` folder
   - Railway will auto-detect Django
   - Set environment variables:
     ```
     SECRET_KEY=your-secret-key-here
     DATABASE_URL=postgresql://user:pass@host:port/dbname
     DJANGO_SETTINGS_MODULE=asset_backend.settings_production
     ```

#### Frontend Deployment:
1. **Deploy to Vercel:**
   - Sign up at [Vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Select the `asset_frontend` folder
   - Set environment variable:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```

### Option 2: Render (Alternative)

#### Backend:
1. **Sign up at [Render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your repository**
4. **Configure:**
   - Build Command: `cd asset_backend && pip install -r requirements.txt`
   - Start Command: `cd asset_backend && python manage.py migrate && gunicorn asset_backend.wsgi:application`
   - Environment: Python 3.9

#### Frontend:
1. **Create a new Static Site**
2. **Connect your repository**
3. **Configure:**
   - Build Command: `cd asset_frontend && npm install && npm run build`
   - Publish Directory: `asset_frontend/dist`

### Option 3: Netlify + Railway

#### Backend: Railway (as above)
#### Frontend: Netlify
1. **Sign up at [Netlify.com](https://netlify.com)**
2. **Connect your repository**
3. **Configure:**
   - Build Command: `cd asset_frontend && npm install && npm run build`
   - Publish Directory: `asset_frontend/dist`
   - Environment Variable: `VITE_API_URL=https://your-backend-url.railway.app/api`

## Environment Variables

### Backend (Railway/Render):
```
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:pass@host:port/dbname
DJANGO_SETTINGS_MODULE=asset_backend.settings_production
DEBUG=False
ALLOWED_HOSTS=your-domain.com,*.railway.app
```

### Frontend (Vercel/Netlify):
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

## Custom Domain Setup

1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **Configure DNS:**
   - Backend: `api.yourdomain.com` → Railway URL
   - Frontend: `yourdomain.com` → Vercel/Netlify URL
3. **Update CORS settings** in Django settings
4. **Update environment variables** with new URLs

## SSL Certificates

- **Railway**: Automatic SSL
- **Vercel**: Automatic SSL
- **Netlify**: Automatic SSL
- **Render**: Automatic SSL

## Monitoring & Analytics

- **Railway**: Built-in metrics
- **Vercel**: Built-in analytics
- **Netlify**: Built-in analytics
- **Uptime monitoring**: UptimeRobot, Pingdom

## Cost Estimation

### Railway:
- **Backend**: $5/month (after free tier)
- **Database**: $5/month (after free tier)
- **Total**: ~$10/month

### Vercel:
- **Frontend**: Free tier (100GB bandwidth)
- **Custom domain**: Free

### Total Monthly Cost: ~$10-15

## Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Set DEBUG=False
- [ ] Configure ALLOWED_HOSTS
- [ ] Set up CORS properly
- [ ] Use HTTPS everywhere
- [ ] Regular database backups
- [ ] Monitor logs and errors

## Backup Strategy

1. **Database backups**: Railway/Render automatic backups
2. **Code backups**: GitHub repository
3. **Media files**: Consider AWS S3 or similar
4. **Regular testing**: Test deployment process

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check CORS_ALLOWED_ORIGINS
2. **Database connection**: Verify DATABASE_URL
3. **Static files**: Ensure WhiteNoise is configured
4. **Build failures**: Check Python/Node versions

### Debug Commands:
```bash
# Check logs
railway logs
vercel logs

# Test locally with production settings
cd asset_backend
python manage.py runserver --settings=asset_backend.settings_production
```
