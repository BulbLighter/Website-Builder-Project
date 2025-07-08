from boltiotai import openai
import os
import json
import uuid
import shutil
import zipfile
import tempfile
from flask import Flask, render_template, request, jsonify, send_from_directory, redirect, url_for, flash, send_file
from datetime import datetime
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

# Configure OpenAI
openai.api_key = os.environ.get('OPENAI_API_KEY')

# Check if OpenAI API key is set
if not openai.api_key:
    logging.warning("OPENAI_API_KEY not found in environment variables. Please set it in .env file.")
    print("⚠️  Warning: OPENAI_API_KEY not found. Please add it to your .env file.")

# Ensure sites directory exists
os.makedirs('sites', exist_ok=True)

def generate_website_content(title, description, theme, sections, primary_color, secondary_color):
    """Generate complete website content using AI"""
    try:
        # Prepare sections description
        sections_text = ", ".join(sections)
        
        # Color scheme description
        color_desc = f"Primary color: {primary_color}, Secondary color: {secondary_color}"
        
        # Theme-specific styling
        theme_styles = {
            'modern': "Clean, contemporary design with 16px border radius, cubic-bezier transitions, Inter font",
            'classic': "Timeless, professional look with 8px border radius, standard transitions, Georgia serif font", 
            'minimal': "Simple, focused design with 4px border radius, quick transitions, Helvetica font",
            'creative': "Bold, artistic approach with 24px border radius, bouncy transitions, Poppins font"
        }
        
        # the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
        # do not change this unless explicitly requested by the user
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system", 
                    "content": "You are an expert web developer who creates complete, professional websites. Generate fully functional HTML, CSS, and JavaScript code with modern design principles and responsive layouts."
                },
                {
                    "role": "user",
                    "content": f"""Create a complete, professional website with the following specifications:

Title: {title}
Description: {description}
Style Theme: {theme} - {theme_styles.get(theme, 'Modern design')}
Sections to Include: {sections_text}
Color Scheme: {color_desc}

Requirements:
1. Generate complete HTML structure with proper DOCTYPE, head, and body
2. Include comprehensive embedded CSS with modern, responsive design using specified colors
3. Add extensive JavaScript for smooth scrolling, animations, form validation, and interactivity
4. Use Bootstrap 5 CDN for responsive framework and Font Awesome 6 for icons
5. Make it fully responsive and mobile-friendly with proper breakpoints
6. Add proper meta tags for SEO optimization
7. Include relevant, professional placeholder content for each section
8. Apply the {theme} theme styling throughout with consistent design language
9. Use the color scheme: {primary_color} (primary) and {secondary_color} (secondary)
10. Add smooth animations, transitions, hover effects, and modern visual effects
11. Include a fixed/sticky navigation menu linking to all sections with active states
12. Add intersection observer animations for scroll-triggered effects
13. Include comprehensive form validation with error messages for contact sections
14. Add counter animations, progress bars, and interactive elements for statistics
15. Include particle effects, gradient overlays, and modern visual enhancements
16. Add loading animations, button hover effects, and micro-interactions
17. Include proper accessibility features (ARIA labels, focus states, keyboard navigation)
18. Make it production-ready, visually stunning, and professionally polished
19. Add typed text animations, smooth reveal effects, and modern UI patterns
20. Include responsive images, optimized layouts, and cross-browser compatibility

Section Guidelines:
- Hero: Full-screen landing with gradient background, title, description, CTA buttons
- About: Company/personal info with stats, team, or achievements
- Services: Grid layout showcasing offerings with icons and descriptions  
- Contact: Contact form with validation and contact information

Color Usage:
- Use {primary_color} for primary buttons, links, and accents
- Use {secondary_color} for secondary elements and gradients
- Create gradients combining both colors for headers and CTAs
- Ensure proper contrast ratios for accessibility

CSS Requirements:
- Include comprehensive responsive design with mobile-first approach
- Add beautiful animations: fade-in, slide-up, bounce, rotate effects
- Include hover effects: scale, glow, color transitions, shadow changes
- Add gradient backgrounds, box-shadows, and modern styling
- Include custom scrollbar styling and smooth transitions
- Add loading spinners, progress bars, and interactive elements
- Use CSS Grid and Flexbox for modern layouts
- Include 3D effects, transforms, and advanced visual effects

JavaScript Requirements:
- Implement smooth scrolling navigation with active link highlighting
- Add intersection observer for scroll-triggered animations
- Include typing animation effects for hero text
- Add form validation with real-time feedback and error handling
- Include counter animations that count up when visible
- Add particle effects or floating elements for visual appeal
- Implement modal/popup functionality for images or content
- Add scroll-to-top button that appears on scroll
- Include loading states and button feedback animations
- Add parallax scrolling effects where appropriate
- Include carousel/slider functionality if needed
- Add search functionality for content sections
- Include copy-to-clipboard functionality for contact info
- Add dynamic theme switching or color changes
- Include responsive navigation with mobile hamburger menu

Please provide the complete HTML file with embedded comprehensive CSS and JavaScript. Make it visually stunning, highly interactive, and production-ready with professional animations and effects."""
                }
            ]
        )
        
        return response['choices'][0]['message']['content']
    except Exception as e:
        logging.error(f"Error generating website content: {e}")
        return f"Error generating website: {str(e)}"

def save_website(content, site_id):
    """Save generated website content to file system"""
    try:
        site_dir = os.path.join('sites', site_id)
        os.makedirs(site_dir, exist_ok=True)
        
        # Save the main HTML file
        with open(os.path.join(site_dir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(content)
        
        # Save metadata
        metadata = {
            'created_at': datetime.now().isoformat(),
            'site_id': site_id,
            'status': 'published'
        }
        
        with open(os.path.join(site_dir, 'metadata.json'), 'w') as f:
            json.dump(metadata, f, indent=2)
        
        return True
    except Exception as e:
        logging.error(f"Error saving website: {e}")
        return False

@app.route('/')
def index():
    """Main website builder interface"""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_website():
    """Generate website based on user inputs"""
    try:
        data = request.get_json()
        
        title = data.get('title', '').strip()
        description = data.get('description', '').strip()
        theme = data.get('theme', 'modern')
        sections = data.get('sections', ['hero', 'about', 'services', 'contact'])
        primary_color = data.get('primaryColor', '#6366f1')
        secondary_color = data.get('secondaryColor', '#8b5cf6')
        
        if not title:
            return jsonify({'error': 'Title is required'}), 400
        
        # Validate sections
        valid_sections = ['hero', 'about', 'services', 'contact']
        sections = [s for s in sections if s in valid_sections]
        if not sections:
            sections = ['hero']  # Always include hero as minimum
        
        # Generate website content
        content = generate_website_content(title, description, theme, sections, primary_color, secondary_color)
        
        if content.startswith('Error'):
            return jsonify({'error': content}), 500
        
        # Generate unique site ID
        site_id = str(uuid.uuid4())[:8]
        
        return jsonify({
            'success': True,
            'content': content,
            'site_id': site_id,
            'preview_url': f'/preview/{site_id}'
        })
        
    except Exception as e:
        logging.error(f"Error in generate_website: {e}")
        return jsonify({'error': f'Generation failed: {str(e)}'}), 500

@app.route('/preview/<site_id>')
def preview_website(site_id):
    """Preview generated website"""
    return render_template('preview.html', site_id=site_id)

@app.route('/publish', methods=['POST'])
def publish_website():
    """Publish generated website"""
    try:
        data = request.get_json()
        site_id = data.get('site_id')
        content = data.get('content')
        
        if not site_id or not content:
            return jsonify({'error': 'Site ID and content are required'}), 400
        
        # Save website
        if save_website(content, site_id):
            return jsonify({
                'success': True,
                'site_id': site_id,
                'url': f'/site/{site_id}',
                'full_url': f'{request.host_url}site/{site_id}'
            })
        else:
            return jsonify({'error': 'Failed to save website'}), 500
            
    except Exception as e:
        logging.error(f"Error in publish_website: {e}")
        return jsonify({'error': f'Publishing failed: {str(e)}'}), 500

@app.route('/site/<site_id>')
def serve_website(site_id):
    """Serve published website"""
    try:
        site_dir = os.path.join('sites', site_id)
        if not os.path.exists(site_dir):
            return "Website not found", 404
        
        return send_from_directory(site_dir, 'index.html')
    except Exception as e:
        logging.error(f"Error serving website: {e}")
        return "Error loading website", 500

@app.route('/sites')
def list_sites():
    """List all published websites"""
    try:
        sites = []
        sites_dir = 'sites'
        
        if os.path.exists(sites_dir):
            for site_id in os.listdir(sites_dir):
                site_path = os.path.join(sites_dir, site_id)
                if os.path.isdir(site_path):
                    metadata_path = os.path.join(site_path, 'metadata.json')
                    if os.path.exists(metadata_path):
                        with open(metadata_path, 'r') as f:
                            metadata = json.load(f)
                            sites.append({
                                'site_id': site_id,
                                'created_at': metadata.get('created_at', ''),
                                'url': f'/site/{site_id}'
                            })
        
        return render_template('published.html', sites=sites)
    except Exception as e:
        logging.error(f"Error listing sites: {e}")
        return "Error loading sites", 500

@app.route('/download/<site_id>')
def download_website(site_id):
    """Download website as ZIP file"""
    try:
        site_dir = os.path.join('sites', site_id)
        if not os.path.exists(site_dir):
            return "Website not found", 404
        
        # Create ZIP file
        zip_path = f'/tmp/{site_id}.zip'
        shutil.make_archive(zip_path[:-4], 'zip', site_dir)
        
        return send_from_directory('/tmp', f'{site_id}.zip', as_attachment=True)
    except Exception as e:
        logging.error(f"Error downloading website: {e}")
        return "Error downloading website", 500

@app.route('/download-zip', methods=['POST'])
def download_website_zip():
    """Download generated website as ZIP file"""
    try:
        data = request.get_json()
        content = data.get('content', '')
        site_id = data.get('site_id', str(uuid.uuid4())[:8])
        
        if not content:
            return jsonify({'error': 'No content to download'}), 400
        
        # Create temporary directory and files
        temp_dir = tempfile.mkdtemp()
        site_dir = os.path.join(temp_dir, 'website')
        os.makedirs(site_dir, exist_ok=True)
        
        # Save HTML file
        html_path = os.path.join(site_dir, 'index.html')
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        # Create README file
        readme_path = os.path.join(site_dir, 'README.md')
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(f"""# Website - {site_id}

Generated by AI Website Builder on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Files Included:
- `index.html` - Main website file
- `README.md` - This file

## Usage:
1. Open `index.html` in any web browser
2. Upload to any web hosting service
3. Customize the code as needed

## Note:
This website uses CDN links for Bootstrap and Font Awesome, so an internet connection is required for full styling.
""")
        
        # Create ZIP file
        zip_path = os.path.join(temp_dir, f'website_{site_id}.zip')
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            for root, dirs, files in os.walk(site_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arc_name = os.path.relpath(file_path, site_dir)
                    zf.write(file_path, arc_name)
        
        return send_file(
            zip_path,
            mimetype='application/zip',
            as_attachment=True,
            download_name=f'website_{site_id}.zip'
        )
        
    except Exception as e:
        logging.error(f"Error creating ZIP download: {e}")
        return jsonify({'error': 'Failed to create ZIP file'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
