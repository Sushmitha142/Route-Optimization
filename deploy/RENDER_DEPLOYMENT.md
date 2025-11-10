# Deploy to Render - Quick Guide

This guide will help you deploy your Route Optimization app to Render (free hosting).

## Prerequisites
- GitHub account
- Render account (free): https://render.com/

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)

1. **Push your code to GitHub** (if not already done)
   ```powershell
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Sign up/Login to Render**
   - Go to: https://render.com/
   - Sign up with GitHub (recommended)

3. **Create New Web Service for Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Sushmitha142/Route-Optimization`
   - Configure:
     - **Name**: `route-optimization-backend`
     - **Runtime**: Docker
     - **Dockerfile Path**: `./backend/Dockerfile`
     - **Docker Context**: `./backend`
     - **Plan**: Free
   - Click "Create Web Service"

4. **Create New Static Site for Frontend**
   - Click "New +" → "Static Site"
   - Connect the same repository
   - Configure:
     - **Name**: `route-optimization-frontend`
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Publish Directory**: `frontend/build`
   - Click "Create Static Site"

5. **Update Frontend API URL**
   - Once backend is deployed, copy its URL (e.g., `https://route-optimization-backend.onrender.com`)
   - Update `frontend/src/App.js` or create `.env.production` in frontend:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com
     ```
   - Redeploy frontend

### Option 2: Using render.yaml (Blueprint)

1. Push code to GitHub
2. Go to Render Dashboard → "Blueprints" → "New Blueprint Instance"
3. Connect your repository
4. Render will automatically read `render.yaml` and create both services

## Post-Deployment

### Backend URL
Your API will be available at: `https://route-optimization-backend.onrender.com`

Test it:
```powershell
curl https://route-optimization-backend.onrender.com/health
```

### Frontend URL
Your app will be available at: `https://route-optimization-frontend.onrender.com`

## Important Notes

- **Free tier limitations**: Apps spin down after 15 minutes of inactivity
- **Cold starts**: First request after inactivity takes ~30 seconds
- **CORS**: Update backend CORS to allow frontend URL

## Update CORS for Production

Edit `backend/main.py` to allow your Render frontend URL:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://route-optimization-frontend.onrender.com"  # Add your actual URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

- **Backend not starting**: Check logs in Render dashboard
- **Frontend can't connect**: Verify CORS settings and API URL
- **Build failures**: Check build logs for missing dependencies

## Costs

- ✅ **Free tier**: 750 hours/month per service
- ✅ Both backend and frontend can run on free tier
- ✅ No credit card required for free tier
