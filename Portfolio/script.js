/* ============================================
   Portfolio Website JavaScript
   WCAG 2.1 AA Compliant & Accessible
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initDarkMode();
    initMobileMenu();
    initSmoothScrolling();
    initActiveNavigation();
    initScrollAnimations();
    initBackToTop();
    initProjectFilter();
    initBlogSearch();
    initFormValidation();
});

/* ============================================
   Dark Mode Toggle
   ============================================ */
function initDarkMode() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    let currentTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply the theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            
            // Announce theme change to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = `Theme changed to ${currentTheme} mode`;
            document.body.appendChild(announcement);
            
            setTimeout(() => announcement.remove(), 1000);
        });
    }
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            currentTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
        }
    });
}

/* ============================================
   Mobile Menu Toggle
   ============================================ */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('open');
            
            // Focus first menu item when opening
            if (!isExpanded) {
                const firstLink = mainNav.querySelector('.nav-link');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                if (mainNav.classList.contains('open')) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mainNav.classList.remove('open');
                }
            }
        });
        
        // Close menu on escape key
        mainNav.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('open');
                menuToggle.focus();
            }
        });
        
        // Handle keyboard navigation within menu
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextLink = navLinks[index + 1];
                    if (nextLink) nextLink.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevLink = navLinks[index - 1];
                    if (prevLink) prevLink.focus();
                }
            });
        });
    }
}

/* ============================================
   Smooth Scrolling
   ============================================ */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mainNav = document.querySelector('.main-nav');
                const menuToggle = document.querySelector('.menu-toggle');
                if (mainNav && mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
                }
                
                // Smooth scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update focus for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });
}

/* ============================================
   Active Navigation Highlighting
   ============================================ */
function initActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (href.includes(currentPage.replace('.html', '')))) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

/* ============================================
   Scroll Animations
   ============================================ */
function initScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animatedElements = document.querySelectorAll(
        '.skill-card, .project-card, .testimonial-card, .blog-card, .about-content, .contact-info, .contact-form'
    );
    
    animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   Back to Top Button
   ============================================ */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (!backToTop) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================
   Project Filtering
   ============================================ */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0 || projectCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.classList.add('fade-in-up');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in-up');
                }
            });
            
            // Announce filter change to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = `Showing ${filter === 'all' ? 'all projects' : filter + ' projects'}`;
            document.body.appendChild(announcement);
            
            setTimeout(() => announcement.remove(), 1000);
        });
    });
}

/* ============================================
   Blog Search
   ============================================ */
function initBlogSearch() {
    const searchInput = document.querySelector('.search-input');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (!searchInput || blogCards.length === 0) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        blogCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const summary = card.querySelector('p').textContent.toLowerCase();
            const category = card.getAttribute('data-category')?.toLowerCase() || '';
            
            const matchesSearch = title.includes(searchTerm) || 
                                  summary.includes(searchTerm) || 
                                  category.includes(searchTerm);
            
            if (matchesSearch || searchTerm === '') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

/* ============================================
   Form Validation
   ============================================ */
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error on input
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorId = this.getAttribute('aria-describedby');
                if (errorId) {
                    const errorElement = document.getElementById(errorId);
                    if (errorElement) {
                        errorElement.classList.remove('visible');
                    }
                }
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Show success message
            showSuccessMessage(contactForm);
            
            // Reset form
            contactForm.reset();
            
            // Remove success classes from inputs
            inputs.forEach(input => {
                input.classList.remove('success');
            });
        } else {
            // Focus first invalid field
            const firstInvalid = contactForm.querySelector('.form-input.error, .form-textarea.error');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    const isRequired = field.hasAttribute('required');
    const fieldType = field.getAttribute('type');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (isRequired && value === '') {
        isValid = false;
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    
    // Email validation
    if (fieldType === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Update field state
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('success');
        
        const errorId = field.getAttribute('aria-describedby');
        if (errorId) {
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.classList.remove('visible');
            }
        }
    } else {
        field.classList.remove('success');
        field.classList.add('error');
        
        const errorId = field.getAttribute('aria-describedby');
        if (errorId) {
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('visible');
            }
        }
    }
    
    return isValid;
}

function showSuccessMessage(form) {
    // Remove existing success message
    const existingMessage = form.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.setAttribute('role', 'alert');
    successMessage.setAttribute('aria-live', 'polite');
    successMessage.innerHTML = `
        <p style="color: var(--success-color); font-weight: 600; margin-bottom: 0.5rem;">
            ✓ Message sent successfully!
        </p>
        <p style="color: var(--text-secondary); margin: 0;">
            Thank you for reaching out. I'll get back to you soon.
        </p>
    `;
    
    // Insert after form
    form.parentNode.insertBefore(successMessage, form.nextSibling);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

/* ============================================
   Utility Functions
   ============================================ */

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add screen reader only class for hidden content
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(style);
