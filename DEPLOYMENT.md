# Deployment Guide for AI Website Builder

## FREE OPTIONS (Recommended)

### Option 1: Railway (Best Free Option)

**Free Tier**: $5 credit monthly (usually sufficient)

1. **Setup**
   - Go to railway.app and sign up
   - Connect your GitHub account
   - Import your repository

2. **Configure**
   - Railway auto-detects Python
   - Add environment variables in dashboard:
     - `OPENAI_API_KEY`
     - `SESSION_SECRET`

3. **Deploy**
   - Automatic deployment on git push
   - Get your app URL from Railway dashboard

### Option 2: Render (Free with Sleep)

**Free Tier**: 750 hours/month (apps sleep after 15 min inactivity)

1. **Setup**
   - Go to render.com and sign up
   - Connect your GitHub repository
   - Choose "Web Service"

2. **Configure Build Settings**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn main:app`
   - Python Version: 3.11

3. **Environment Variables**
   - Add `OPENAI_API_KEY`
   - Add `SESSION_SECRET`

### Option 3: PythonAnywhere (Python-Specific)

**Free Tier**: One web app, limited CPU seconds

1. **Setup**
   - Sign up at pythonanywhere.com
   - Upload your files via file manager
   - Install packages in Bash console: `pip3.10 install --user flask gunicorn boltiotai python-dotenv`

2. **Configure Web App**
   - Go to Web tab, create new web app
   - Choose Manual configuration, Python 3.10
   - Set source code path to your uploaded folder
   - Configure WSGI file to point to your app

3. **Environment Variables**
   - Set in WSGI file or use .env file

## PAID OPTIONS (If Free Limits Exceeded)

### Heroku (No Longer Free)
- Hobby tier: $7/month
- Most reliable option
- Easy scaling

## Why Not Netlify?

Netlify is designed for static sites and doesn't support:
- Python server applications
- File system writes (your app saves websites to `/sites` folder)
- Background processes
- Server-side routing

## File Structure for Deployment

Make sure these files are in your project root:
- `Procfile` - tells Heroku how to run your app
- `runtime.txt` - specifies Python version
- `main.py` - entry point for the application
- `.env` - for local development (not deployed)

## Environment Variables Needed

- `OPENAI_API_KEY` - Your OpenAI API key
- `SESSION_SECRET` - Secret key for Flask sessions

## Post-Deployment

After deployment:
1. Your app will be available at the provided URL
2. Generated websites are stored in memory/temporary storage
3. Consider using cloud storage (AWS S3, Google Cloud) for persistent file storage in production