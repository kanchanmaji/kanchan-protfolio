// Portfolio App JavaScript
class PortfolioApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initTypingAnimation();
        this.initIntersectionObserver();
        this.initSkillBars();
        this.initBackToTop();
        this.initContactForm();
        this.initSmoothScrolling();
    }
    
    setupEventListeners() {
        // Mobile hamburger menu
        const hamburger = document.getElementById('nav-hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close mobile menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            this.handleNavbarScroll();
            this.updateActiveNavLink();
            this.handleBackToTopVisibility();
        });
        
        // Window resize handler
        window.addEventListener('resize', () => {
            if (window.innerWidth > 767) {
                const hamburger = document.getElementById('nav-hamburger');
                const navMenu = document.getElementById('nav-menu');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    }
    
    initTypingAnimation() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;
        
        const texts = [
            'Python & Backend Developer',
            'DBMS Enthusiast',
            'Django Specialist',
            'Flask Developer',
            'API Designer',
            'System Architect'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseTime = 2000;
        
        const typeText = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let speed = isDeleting ? deleteSpeed : typeSpeed;
            
            if (!isDeleting && charIndex === currentText.length) {
                speed = pauseTime;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
            
            setTimeout(typeText, speed);
        };
        
        typeText();
    }
    
    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    
                    // Trigger skill bar animations
                    if (entry.target.id === 'skills') {
                        this.animateSkillBars();
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    initSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            const level = item.dataset.level;
            const progressBar = item.querySelector('.skill-progress');
            if (progressBar) {
                progressBar.style.setProperty('--skill-width', level + '%');
            }
        });
    }
    
    animateSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
            }, index * 100);
        });
    }
    
    initBackToTop() {
        const backToTopButton = document.getElementById('back-to-top');
        
        if (backToTopButton) {
            // Remove any existing event listeners
            backToTopButton.onclick = null;
            
            // Add click event listener
            backToTopButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Scroll to top smoothly
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Alternative fallback for older browsers
                if (window.scrollY > 0) {
                    const scrollStep = -window.scrollY / (500 / 15);
                    const scrollInterval = setInterval(() => {
                        if (window.scrollY !== 0) {
                            window.scrollBy(0, scrollStep);
                        } else {
                            clearInterval(scrollInterval);
                        }
                    }, 15);
                }
            });
            
            // Also handle keyboard accessibility
            backToTopButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }
    
    handleBackToTopVisibility() {
        const backToTopButton = document.getElementById('back-to-top');
        if (!backToTopButton) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            backToTopButton.classList.remove('hidden');
        } else {
            backToTopButton.classList.add('hidden');
        }
    }
    
    handleNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    }
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Real-time validation
        if (nameInput) nameInput.addEventListener('blur', () => this.validateName());
        if (emailInput) emailInput.addEventListener('blur', () => this.validateEmail());
        if (messageInput) messageInput.addEventListener('blur', () => this.validateMessage());
        
        // Clear errors on input
        if (nameInput) nameInput.addEventListener('input', () => this.clearError('name'));
        if (emailInput) emailInput.addEventListener('input', () => this.clearError('email'));
        if (messageInput) messageInput.addEventListener('input', () => this.clearError('message'));
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }
    
    validateName() {
        const nameInput = document.getElementById('name');
        if (!nameInput) return false;
        
        const name = nameInput.value.trim();
        
        if (name.length < 2) {
            this.showError('name', 'Name must be at least 2 characters long');
            return false;
        }
        
        this.clearError('name');
        return true;
    }
    
    validateEmail() {
        const emailInput = document.getElementById('email');
        if (!emailInput) return false;
        
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError('email', 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError('email', 'Please enter a valid email address');
            return false;
        }
        
        this.clearError('email');
        return true;
    }
    
    validateMessage() {
        const messageInput = document.getElementById('message');
        if (!messageInput) return false;
        
        const message = messageInput.value.trim();
        
        if (message.length < 10) {
            this.showError('message', 'Message must be at least 10 characters long');
            return false;
        }
        
        this.clearError('message');
        return true;
    }
    
    showError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const inputElement = document.getElementById(fieldName);
        
        if (errorElement) errorElement.textContent = message;
        if (inputElement) inputElement.style.borderColor = '#ff6b6b';
    }
    
    clearError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const inputElement = document.getElementById(fieldName);
        
        if (errorElement) errorElement.textContent = '';
        if (inputElement) inputElement.style.borderColor = '#333333';
    }
    
    async handleFormSubmit() {
        const form = document.getElementById('contact-form');
        const statusDiv = document.getElementById('form-status');
        const submitButton = form ? form.querySelector('button[type="submit"]') : null;
        
        if (!form || !submitButton) return;
        
        // Validate all fields
        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();
        const isMessageValid = this.validateMessage();
        
        if (!isNameValid || !isEmailValid || !isMessageValid) {
            this.showFormStatus('Please fix the errors above', 'error');
            return;
        }
        
        // Show loading state
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        try {
            await this.simulateFormSubmission();
            
            // Success
            this.showFormStatus('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
            
        } catch (error) {
            // Error
            this.showFormStatus('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    }
    
    async simulateFormSubmission() {
        const form = document.getElementById('contact-form');
        if (!form) return Promise.reject(new Error('Form not found'));
        
        // Get access_key from hidden input
        const accessKeyInput = form.querySelector('input[name="access_key"]');
        const access_key = accessKeyInput ? accessKeyInput.value : '';
        if (!access_key) return Promise.reject(new Error('Access key missing'));
        
        // Collect form data
        const formData = new FormData(form);
        
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                return; // success — handleFormSubmit will continue
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (err) {
            throw err;
        }
    }
    showFormStatus(message, type) {
        const statusDiv = document.getElementById('form-status');
        if (!statusDiv) return;
        
        statusDiv.textContent = message;
        statusDiv.className = `form-status ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 5000);
    }
    
    // Utility method to add subtle animations to elements
    addHoverEffects() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.social-card, .skill-category, .stat');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
    
    // Method to handle theme switching (if needed in future)
    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-theme');
                const isLight = document.body.classList.contains('light-theme');
                if (typeof Storage !== 'undefined') {
                    localStorage.setItem('theme', isLight ? 'light' : 'dark');
                }
            });
            
            // Load saved theme
            if (typeof Storage !== 'undefined') {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'light') {
                    document.body.classList.add('light-theme');
                }
            }
        }
    }
    
    // Add particle effect to hero section (optional enhancement)
    initParticleEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        hero.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        const resizeCanvas = () => {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        };
        
        const createParticle = () => {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            };
        };
        
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((particle, index) => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 217, 255, ${particle.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animateParticles);
        };
        
        // Initialize particles
        resizeCanvas();
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
        
        animateParticles();
        
        window.addEventListener('resize', resizeCanvas);
    }
    
    // Add scroll progress indicator
    initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.position = 'fixed';
        progressBar.style.top = '0';
        progressBar.style.left = '0';
        progressBar.style.width = '0%';
        progressBar.style.height = '3px';
        progressBar.style.background = 'linear-gradient(90deg, #00d9ff, #4ecdc4)';
        progressBar.style.zIndex = '9999';
        progressBar.style.transition = 'width 0.1s ease';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }
    
    // Add loading animation
    initLoadingAnimation() {
        const loader = document.createElement('div');
        loader.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #0a0a0a;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                transition: opacity 0.5s ease;
            ">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 3px solid #333;
                    border-top: 3px solid #00d9ff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(loader);
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 1000);
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    
    // Optional enhancements
    // app.initParticleEffect(); // Uncomment for particle effect
    // app.initScrollProgress(); // Uncomment for scroll progress bar
    // app.initLoadingAnimation(); // Uncomment for loading animation
    
    // Add some additional interactive features
    app.addHoverEffects();
    
    // Console message for developers
    console.log(`
    ╔══════════════════════════════════════╗
    ║     Kanchan Maji - Portfolio         ║
    ║     Built with HTML, CSS & JS        ║
    ║                                      ║
    ║  🐍 Python & Backend Developer       ║
    ║  💾 DBMS Enthusiast                  ║
    ║  🚀 Django & Flask Specialist       ║
    ╚══════════════════════════════════════╝
    
    Thanks for checking out the code! 🚀
    `);
});

// Service Worker registration (for PWA capabilities) - only if supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful');
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed - this is normal in development');
            });
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}
