#!/usr/bin/env python3
"""
Script to install required packages for the AI Website Builder
Run this script to install all dependencies at once
"""

import subprocess
import sys

def install_package(package):
    """Install a single package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✅ Successfully installed {package}")
    except subprocess.CalledProcessError:
        print(f"❌ Failed to install {package}")
        return False
    return True

def main():
    """Main installation function"""
    print("🚀 Installing AI Website Builder dependencies...")
    print("-" * 50)
    
    packages = [
        "flask",
        "gunicorn", 
        "boltiotai",
        "python-dotenv"
    ]
    
    failed_packages = []
    
    for package in packages:
        if not install_package(package):
            failed_packages.append(package)
    
    print("-" * 50)
    
    if failed_packages:
        print(f"❌ Installation failed for: {', '.join(failed_packages)}")
        print("Please install these packages manually:")
        for package in failed_packages:
            print(f"  pip install {package}")
    else:
        print("✅ All packages installed successfully!")
        print("🎉 You can now run the application with: python app.py")
        print("📋 Don't forget to set your OPENAI_API_KEY in the .env file!")

if __name__ == "__main__":
    main()