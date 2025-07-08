# AI Website Builder

## Overview

This is a Flask-based web application that generates complete websites using AI (OpenAI's GPT-4o model). Users can input website specifications (title, description, theme, and content type) and receive fully functional HTML/CSS/JavaScript websites that can be previewed, published, and downloaded.

## System Architecture

### Frontend Architecture
- **Framework**: Flask with Jinja2 templating
- **UI Library**: Bootstrap 5 with dark theme
- **Icons**: Font Awesome 6.0
- **JavaScript**: Vanilla JavaScript with ES6 classes
- **Responsive Design**: Mobile-first approach with preview modes for desktop, tablet, and mobile

### Backend Architecture
- **Framework**: Flask (Python)
- **AI Integration**: OpenAI API via boltiotai library
- **File Storage**: Local filesystem for generated websites
- **Session Management**: Flask sessions with secret key
- **Logging**: Python logging module

### Data Storage Solutions
- **File System**: Generated websites stored in `/sites` directory
- **Session Storage**: Flask session cookies for user state
- **No Database**: Currently uses filesystem for persistence

## Key Components

### 1. Website Generation Engine (`app.py`)
- **Purpose**: Core AI-powered website generation
- **Key Function**: `generate_website_content()` - Creates complete HTML/CSS/JS using GPT-4o
- **Features**: 
  - Responsive design generation
  - Bootstrap 5 integration
  - Font Awesome icons
  - SEO meta tags

### 2. User Interface Templates
- **`index.html`**: Main builder interface with form inputs and preview
- **`preview.html`**: Full-screen preview with iframe
- **`published.html`**: Gallery of published websites

### 3. Static Assets
- **CSS**: Custom styling in `static/css/style.css`
- **JavaScript**: Client-side logic in `static/js/app.js`

### 4. Website Builder Class (`static/js/app.js`)
- **Purpose**: Handles client-side interactions
- **Key Methods**:
  - `generateWebsite()`: Form submission and API calls
  - `publishWebsite()`: Site publishing functionality
  - `setPreviewMode()`: Responsive preview switching

## Data Flow

1. **User Input**: User fills form with website specifications
2. **AI Generation**: Form data sent to Flask backend
3. **OpenAI API Call**: Backend calls GPT-4o with structured prompt
4. **Content Creation**: AI generates complete HTML/CSS/JS
5. **File Storage**: Generated content saved to `/sites/{uuid}/`
6. **Preview**: User can preview in multiple device modes
7. **Publishing**: Sites can be published and made publicly accessible
8. **Download**: Users can download generated websites as files

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for website generation
- **boltiotai**: Custom OpenAI wrapper library

### Frontend Libraries
- **Bootstrap 5**: UI framework via CDN
- **Font Awesome 6.0**: Icons via CDN
- **Replit Bootstrap Theme**: Dark theme styling

### Python Packages
- **Flask**: Web framework
- **boltiotai**: OpenAI integration
- **uuid**: Unique site ID generation
- **shutil**: File operations
- **datetime**: Timestamp handling
- **logging**: Application logging

## Deployment Strategy

### Development
- **Environment**: Replit or local development
- **Port**: 5000 (Flask default)
- **Debug Mode**: Enabled for development
- **Host**: 0.0.0.0 for external access

### Environment Variables
- `OPENAI_API_KEY`: Required for AI functionality
- `SESSION_SECRET`: Flask session security (defaults to dev key)
- `.env` file support for local development in VS Code

### File Structure
```
/sites/
  /{uuid}/
    index.html (generated website)
/templates/
  index.html
  preview.html
  published.html
/static/
  css/style.css
  js/app.js
```

## Deployment Strategy

### Production Deployment
- **Recommended Platform**: Heroku, Railway, or Render (not Netlify)
- **Reason**: Flask requires Python server runtime, Netlify is for static sites only
- **Files Added**: Procfile, runtime.txt, DEPLOYMENT.md with complete deployment guide

### Cloud Considerations
- Generated websites stored in `/sites` directory (temporary in cloud environments)
- Consider AWS S3 or Google Cloud Storage for persistent file storage in production
- Environment variables required: OPENAI_API_KEY, SESSION_SECRET

## Changelog
- July 08, 2025. Initial setup
- July 08, 2025. Added .env file support for local VS Code development with environment variables
- July 08, 2025. Added deployment configuration files and guide for Heroku/Railway/Render deployment

## User Preferences

Preferred communication style: Simple, everyday language.