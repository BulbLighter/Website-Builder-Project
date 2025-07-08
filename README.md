# AI Website Builder

A Flask-based web application that generates complete websites using AI (OpenAI's GPT-4o model). Users can input website specifications and receive fully functional HTML/CSS/JavaScript websites.

## Features

- AI-powered website generation using OpenAI GPT-4o
- Responsive design with Bootstrap 5
- Real-time preview with desktop, tablet, and mobile views
- Website publishing and hosting
- ZIP file download for generated websites
- Modern glassmorphism UI with monochrome theme

## Setup Instructions for VS Code

### 1. Prerequisites

- Python 3.8 or higher
- pip package manager

### 2. Installation

1. Clone or download the project files
2. Open the project folder in VS Code
3. Install required packages:
   ```bash
   pip install flask gunicorn boltiotai python-dotenv
   ```

### 3. Environment Configuration

1. Rename `.env` file or create a new one in the project root
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   SESSION_SECRET=your_session_secret_key_here
   ```

### 4. Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

### 5. Running the Application

1. Open terminal in VS Code
2. Run the Flask application:
   ```bash
   python app.py
   ```
   Or use Flask's built-in server:
   ```bash
   flask run
   ```

3. Open your browser and navigate to `http://localhost:5000`

### 6. Project Structure

```
├── app.py                 # Main Flask application
├── main.py               # Entry point for deployment
├── static/
│   ├── css/style.css     # Custom styling
│   ├── js/app.js         # Client-side JavaScript
│   └── background.jpg    # Background image
├── templates/
│   ├── index.html        # Main interface
│   ├── preview.html      # Website preview
│   └── published.html    # Published sites gallery
├── sites/                # Generated websites storage
├── .env                  # Environment variables
└── README.md            # This file
```

### 7. Usage

1. Fill in the website form with:
   - Website title
   - Description
   - Theme selection
   - Content sections
   - Color preferences

2. Click "Generate Website" to create your site
3. Preview your website in different device modes
4. Publish your website to make it publicly accessible
5. Download as ZIP file for local hosting

### 8. Troubleshooting

**API Key Issues:**
- Ensure your OpenAI API key is valid and has credits
- Check that the `.env` file is in the project root
- Verify the API key format (starts with `sk-`)

**Port Issues:**
- If port 5000 is in use, change it in the `app.py` file
- Use `flask run --port 3000` to run on a different port

**Dependencies:**
- Ensure all required packages are installed
- Use `pip list` to verify installed packages

## Development

This project uses:
- Flask for the web framework
- OpenAI API via boltiotai library
- Bootstrap 5 for UI components
- Vanilla JavaScript for client-side functionality

## License

This project is for educational and development purposes.