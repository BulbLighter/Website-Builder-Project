#!/usr/bin/env python3
"""
Simple script to run the Flask application for development
"""
from app import app

if __name__ == '__main__':
    print("🚀 Starting AI Website Builder...")
    print("📍 Open your browser and navigate to: http://localhost:5000")
    print("🔧 Running in development mode with debug enabled")
    print("⚠️  Make sure your OPENAI_API_KEY is set in the .env file")
    print("-" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)