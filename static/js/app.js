// AI Website Builder - Enhanced JavaScript with Premium Features
class WebsiteBuilder {
    constructor() {
        this.currentSiteId = null;
        this.currentContent = null;
        this.selectedTheme = 'modern';
        this.selectedSections = ['hero', 'about', 'services', 'contact'];
        this.primaryColor = '#6366f1';
        this.secondaryColor = '#8b5cf6';
        this.initializeEventListeners();
        this.initializeColorPickers();
        this.initializeThemeSelection();
        this.initializeSectionToggles();
        this.initializeTabNavigation();
    }

    initializeEventListeners() {
        // Form submission
        document.getElementById('websiteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateWebsite();
        });

        // Action buttons
        document.getElementById('publishBtn').addEventListener('click', () => {
            this.publishWebsite();
        });

        document.getElementById('downloadHtmlBtn').addEventListener('click', () => {
            this.downloadHtmlFile();
        });

        document.getElementById('downloadZipBtn').addEventListener('click', () => {
            this.downloadZipFile();
        });

        // Copy buttons for code tabs
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.copyCode(e.target.dataset.codeType);
            });
        });

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal(e.target.id);
            }
        });

        // Copy URL button
        const copyUrlBtn = document.getElementById('copyUrlBtn');
        if (copyUrlBtn) {
            copyUrlBtn.addEventListener('click', () => {
                this.copyPublishedUrl();
            });
        }

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    initializeColorPickers() {
        // Primary color picker synchronization
        const primaryPicker = document.getElementById('primaryColor');
        const primaryText = document.getElementById('primaryColorText');

        primaryPicker.addEventListener('input', (e) => {
            this.primaryColor = e.target.value;
            primaryText.value = e.target.value.toUpperCase();
            this.updateColorPreview();
        });

        primaryText.addEventListener('input', (e) => {
            const color = e.target.value;
            if (this.isValidColor(color)) {
                this.primaryColor = color;
                primaryPicker.value = color;
                this.updateColorPreview();
            }
        });

        // Secondary color picker synchronization
        const secondaryPicker = document.getElementById('secondaryColor');
        const secondaryText = document.getElementById('secondaryColorText');

        secondaryPicker.addEventListener('input', (e) => {
            this.secondaryColor = e.target.value;
            secondaryText.value = e.target.value.toUpperCase();
            this.updateColorPreview();
        });

        secondaryText.addEventListener('input', (e) => {
            const color = e.target.value;
            if (this.isValidColor(color)) {
                this.secondaryColor = color;
                secondaryPicker.value = color;
                this.updateColorPreview();
            }
        });
    }

    initializeThemeSelection() {
        document.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected class from all cards
                document.querySelectorAll('.theme-card').forEach(c => {
                    c.classList.remove('selected');
                });
                
                // Add selected class to clicked card
                card.classList.add('selected');
                this.selectedTheme = card.dataset.theme;
                
                // Add ripple effect
                this.createRippleEffect(card);
            });
        });

        // Set default selection
        document.querySelector('.theme-card[data-theme="modern"]').classList.add('selected');
    }

    initializeSectionToggles() {
        document.querySelectorAll('.section-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const section = toggle.dataset.section;
                
                if (toggle.classList.contains('active')) {
                    // Don't allow removing hero section
                    if (section === 'hero') return;
                    
                    toggle.classList.remove('active');
                    this.selectedSections = this.selectedSections.filter(s => s !== section);
                } else {
                    toggle.classList.add('active');
                    this.selectedSections.push(section);
                }
                
                // Add ripple effect
                this.createRippleEffect(toggle);
            });
        });
    }

    initializeTabNavigation() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(activeTab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${activeTab}"]`).classList.add('active');

        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${activeTab}-tab`).classList.add('active');
    }

    async generateWebsite() {
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();

        if (!title) {
            this.showError('Please enter a website title');
            return;
        }

        // Show loading overlay
        this.showLoadingOverlay();

        // Animate button
        this.animateGenerateButton(true);

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    theme: this.selectedTheme,
                    sections: this.selectedSections,
                    primaryColor: this.primaryColor,
                    secondaryColor: this.secondaryColor,
                    content_type: 'custom'
                })
            });

            const data = await response.json();

            if (data.success) {
                this.currentSiteId = data.site_id;
                this.currentContent = data.content;
                this.hideLoadingOverlay();
                this.showWebsitePreview(data.content);
                this.extractAndDisplayCode(data.content);
                this.showActionButtons();
            } else {
                this.hideLoadingOverlay();
                this.showError(data.error || 'Failed to generate website');
            }
        } catch (error) {
            console.error('Error generating website:', error);
            this.hideLoadingOverlay();
            this.showError('Network error. Please try again.');
        } finally {
            this.animateGenerateButton(false);
        }
    }

    async publishWebsite() {
        if (!this.currentSiteId || !this.currentContent) {
            this.showError('No website to publish');
            return;
        }

        const publishBtn = document.getElementById('publishBtn');
        const originalHTML = publishBtn.innerHTML;
        publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
        publishBtn.disabled = true;

        try {
            const response = await fetch('/publish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    site_id: this.currentSiteId,
                    content: this.currentContent
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccessModal(data.full_url);
            } else {
                this.showError(data.error || 'Failed to publish website');
            }
        } catch (error) {
            console.error('Error publishing website:', error);
            this.showError('Network error. Please try again.');
        } finally {
            publishBtn.innerHTML = originalHTML;
            publishBtn.disabled = false;
        }
    }

    downloadHtmlFile() {
        if (!this.currentContent) {
            this.showError('No website to download');
            return;
        }

        const blob = new Blob([this.currentContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'website.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show success feedback
        const downloadBtn = document.getElementById('downloadHtmlBtn');
        const originalHTML = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
        downloadBtn.classList.add('success-state');

        setTimeout(() => {
            downloadBtn.innerHTML = originalHTML;
            downloadBtn.classList.remove('success-state');
        }, 2000);
    }

    async downloadZipFile() {
        if (!this.currentContent || !this.currentSiteId) {
            this.showError('No website to download');
            return;
        }

        const downloadBtn = document.getElementById('downloadZipBtn');
        const originalHTML = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating ZIP...';
        downloadBtn.disabled = true;

        try {
            const response = await fetch('/download-zip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: this.currentContent,
                    site_id: this.currentSiteId
                })
            });

            if (response.ok) {
                // Create blob from response and trigger download
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `website_${this.currentSiteId}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                // Show success feedback
                downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                downloadBtn.classList.add('success-state');

                setTimeout(() => {
                    downloadBtn.innerHTML = originalHTML;
                    downloadBtn.classList.remove('success-state');
                    downloadBtn.disabled = false;
                }, 2000);
            } else {
                const error = await response.json();
                this.showError(error.error || 'Failed to create ZIP file');
                downloadBtn.innerHTML = originalHTML;
                downloadBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error downloading ZIP:', error);
            this.showError('Network error. Please try again.');
            downloadBtn.innerHTML = originalHTML;
            downloadBtn.disabled = false;
        }
    }

    copyCode(codeType) {
        let content = '';
        switch (codeType) {
            case 'html':
                content = document.getElementById('htmlCode').textContent;
                break;
            case 'css':
                content = document.getElementById('cssCode').textContent;
                break;
            case 'js':
                content = document.getElementById('jsCode').textContent;
                break;
        }

        if (!content || content === `No ${codeType.toUpperCase()} code generated yet`) {
            this.showError('No code to copy');
            return;
        }

        navigator.clipboard.writeText(content).then(() => {
            const copyBtn = document.querySelector(`[data-code-type="${codeType}"]`);
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.background = '#10b981';

            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
            }, 2000);
        }).catch(() => {
            this.showError('Failed to copy code to clipboard');
        });
    }

    copyPublishedUrl() {
        const urlElement = document.getElementById('publishedUrl');
        const url = urlElement.href;

        navigator.clipboard.writeText(url).then(() => {
            const copyBtn = document.getElementById('copyUrlBtn');
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.background = '#10b981';

            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
            }, 2000);
        }).catch(() => {
            this.showError('Failed to copy URL to clipboard');
        });
    }

    showWebsitePreview(content) {
        // Hide welcome message
        document.getElementById('welcomeMessage').style.display = 'none';
        
        // Show preview iframe
        const previewFrame = document.getElementById('previewFrame');
        previewFrame.style.display = 'block';
        
        // Create blob URL for preview
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Create iframe element
        previewFrame.innerHTML = `<iframe src="${url}" style="width: 100%; height: 100%; border: none; border-radius: 12px;"></iframe>`;
        
        // Switch to preview tab
        this.switchTab('preview');
    }

    extractAndDisplayCode(content) {
        // Extract HTML
        document.getElementById('htmlCode').textContent = content;
        
        // Extract CSS (between <style> tags)
        const cssMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        const cssCode = cssMatch ? cssMatch[1].trim() : 'No CSS found in generated website';
        document.getElementById('cssCode').textContent = cssCode;
        
        // Extract JavaScript (between <script> tags)
        const jsMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        const jsCode = jsMatch ? jsMatch[1].trim() : 'No JavaScript found in generated website';
        document.getElementById('jsCode').textContent = jsCode;
        
        // Show copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.style.display = 'flex';
        });
    }

    showLoadingOverlay() {
        document.getElementById('loadingOverlay').style.display = 'flex';
        
        // Add random loading messages
        const messages = [
            'AI is crafting your website...',
            'Analyzing your requirements...',
            'Generating custom code...',
            'Optimizing for performance...',
            'Adding finishing touches...'
        ];
        
        let messageIndex = 0;
        const titleElement = document.querySelector('.loading-title');
        
        const messageInterval = setInterval(() => {
            titleElement.textContent = messages[messageIndex];
            messageIndex = (messageIndex + 1) % messages.length;
        }, 2000);
        
        // Store interval for cleanup
        this.loadingMessageInterval = messageInterval;
    }

    hideLoadingOverlay() {
        document.getElementById('loadingOverlay').style.display = 'none';
        
        // Clear loading message interval
        if (this.loadingMessageInterval) {
            clearInterval(this.loadingMessageInterval);
            this.loadingMessageInterval = null;
        }
    }

    showSuccessModal(url) {
        const modal = document.getElementById('successModal');
        const urlElement = document.getElementById('publishedUrl');
        
        urlElement.href = url;
        urlElement.textContent = url;
        
        modal.style.display = 'flex';
        
        // Add entrance animation
        setTimeout(() => {
            modal.querySelector('.modal-content').style.transform = 'translateY(0)';
            modal.querySelector('.modal-content').style.opacity = '1';
        }, 10);
    }

    showError(message) {
        const modal = document.getElementById('errorModal');
        document.getElementById('errorText').textContent = message;
        modal.style.display = 'flex';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    showActionButtons() {
        document.getElementById('actionButtons').style.display = 'flex';
    }

    animateGenerateButton(loading) {
        const btn = document.querySelector('.generate-btn');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');

        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            btn.disabled = true;
        } else {
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            btn.disabled = false;
        }
    }

    updateColorPreview() {
        // Update CSS custom properties for real-time preview
        document.documentElement.style.setProperty('--primary-color', this.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', this.secondaryColor);
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    isValidColor(color) {
        const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return colorRegex.test(color);
    }
}

// Global functions for modal management
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteBuilder();
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .success-state {
            background: #10b981 !important;
        }
    `;
    document.head.appendChild(style);
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Enhanced keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                const form = document.getElementById('websiteForm');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
                break;
            case 's':
                e.preventDefault();
                const publishBtn = document.getElementById('publishBtn');
                if (publishBtn && publishBtn.style.display !== 'none') {
                    publishBtn.click();
                }
                break;
            case 'd':
                e.preventDefault();
                const downloadBtn = document.getElementById('downloadBtn');
                if (downloadBtn && downloadBtn.style.display !== 'none') {
                    downloadBtn.click();
                }
                break;
        }
    }
    
    // Tab navigation with arrow keys
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            const tabs = Array.from(document.querySelectorAll('.tab-btn'));
            const currentIndex = tabs.indexOf(activeTab);
            let newIndex;
            
            if (e.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            } else {
                newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            }
            
            tabs[newIndex].click();
        }
    }
});

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    });
}, observerOptions);

// Observe all glass containers for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.glass-container').forEach(container => {
        observer.observe(container);
    });
});

// Add fadeInUp animation
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeInStyle);

// Performance optimization: Debounce color picker updates
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add focus management for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add styles for keyboard navigation
const keyboardNavStyle = document.createElement('style');
keyboardNavStyle.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-color) !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(keyboardNavStyle);