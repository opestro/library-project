// Main JavaScript file for the Digital Historical Library

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initTabSystem();
  initDarkMode();
  initAnimations();
  initContactForm();
  initAccessibility();
  initSecurityFeatures();
});

// Navigation functionality
function initNavigation() {
  const menuBtn = document.querySelector('.nav-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navbar = document.getElementById('main-nav');
  
  // Mobile menu toggle
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      menuBtn.innerHTML = isExpanded ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
    });
  }
  
  // Navbar scroll effect
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (navLinks && navLinks.classList.contains('active') && !event.target.closest('.nav-links') && !event.target.closest('.nav-menu-btn')) {
      navLinks.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          menuBtn.setAttribute('aria-expanded', 'false');
          menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
        
        // Scroll to element
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for fixed header
          behavior: 'smooth'
        });
        
        // Update active nav link
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        });
        
        const navLink = document.querySelector(`.nav-links a[href="${targetId}"]`);
        if (navLink) {
          navLink.classList.add('active');
          navLink.setAttribute('aria-current', 'page');
        }
      }
    });
  });
}

// Tab system functionality
function initTabSystem() {
  const tabItems = document.querySelectorAll('.tabs-list .tab-item');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabItems.length) {
    tabItems.forEach(tab => {
      tab.addEventListener('click', () => {
        // Get the target panel ID
        const targetPanelId = tab.getAttribute('aria-controls');
        
        // Hide all tab contents
        tabContents.forEach(content => {
          content.style.display = 'none';
        });
        
        // Show the selected tab content
        const targetPanel = document.getElementById(targetPanelId);
        if (targetPanel) {
          targetPanel.style.display = 'block';
        }
        
        // Update tab states
        tabItems.forEach(item => {
          item.classList.remove('active');
          item.setAttribute('aria-selected', 'false');
        });
        
        // Activate the clicked tab
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      });
    });
    
    // Ensure the first tab is selected by default
    if (tabItems[0] && !tabItems[0].classList.contains('active')) {
      tabItems[0].click();
    }
  }
}

// Dark mode toggle
function initDarkMode() {
  const darkModeToggle = document.querySelector('.nav-actions .btn-icon');
  const htmlElement = document.documentElement;
  
  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
    updateDarkModeIcon(savedTheme === 'dark');
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    updateDarkModeIcon(prefersDark);
    if (prefersDark) {
      htmlElement.setAttribute('data-theme', 'dark');
    }
  }
  
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateDarkModeIcon(newTheme === 'dark');
    });
  }
  
  function updateDarkModeIcon(isDark) {
    if (darkModeToggle) {
      darkModeToggle.innerHTML = isDark ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
    }
  }
}

// Animation effects
function initAnimations() {
  // Animate elements when they come into view
  const animateElements = document.querySelectorAll('.card, .feature-card, .hero-content, .section-title, .section-description');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animateElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animateElements.forEach(element => {
      element.classList.add('fade-in');
    });
  }
}

// Contact form validation and submission
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic form validation
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      
      let isValid = true;
      
      if (!name.value.trim()) {
        highlightInvalidField(name);
        isValid = false;
      } else {
        resetField(name);
      }
      
      if (!email.value.trim() || !isValidEmail(email.value)) {
        highlightInvalidField(email);
        isValid = false;
      } else {
        resetField(email);
      }
      
      if (!message.value.trim()) {
        highlightInvalidField(message);
        isValid = false;
      } else {
        resetField(message);
      }
      
      if (isValid) {
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        
        // Simulate API call
        setTimeout(() => {
          submitButton.innerHTML = '<i class="fas fa-check"></i> تم الإرسال بنجاح';
          
          // Reset form
        contactForm.reset();
          
          // Reset button after a delay
          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
          }, 3000);
          
          // Show success message
          showNotification('تم إرسال رسالتك بنجاح، سنتواصل معك قريبًا', 'success');
        }, 1500);
      }
    });
  }
  
  function highlightInvalidField(field) {
    field.classList.add('invalid');
    
    // Add error message if it doesn't exist
    const errorId = `${field.id}-error`;
    if (!document.getElementById(errorId)) {
      const errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      errorMsg.id = errorId;
      errorMsg.innerText = 'هذا الحقل مطلوب';
      
      if (field.id === 'email' && field.value) {
        errorMsg.innerText = 'يرجى إدخال بريد إلكتروني صحيح';
      }
      
      field.parentNode.appendChild(errorMsg);
    }
  }
  
  function resetField(field) {
    field.classList.remove('invalid');
    
    // Remove error message if it exists
    const errorMsg = document.getElementById(`${field.id}-error`);
    if (errorMsg) {
      errorMsg.remove();
    }
  }
  
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }
}

// Accessibility enhancements
function initAccessibility() {
  // Add focus states for keyboard navigation
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusables = document.querySelectorAll(focusableElements);
  
  focusables.forEach(element => {
    element.addEventListener('focus', () => {
      element.classList.add('focused');
    });
    
    element.addEventListener('blur', () => {
      element.classList.remove('focused');
    });
  });
  
  // Implement escape key handling for modals, dropdowns, etc.
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const mobileMenu = document.querySelector('.nav-links.active');
      if (mobileMenu) {
        const menuBtn = document.querySelector('.nav-menu-btn');
        mobileMenu.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  });
}

// Security features demonstration
function initSecurityFeatures() {
  // Add simulated security status updates
  const securityStatusElements = document.querySelectorAll('.security-status');
  
  if (securityStatusElements.length) {
    // Simulate security status checks
    setTimeout(() => {
      securityStatusElements.forEach(element => {
        element.innerHTML = '<i class="fas fa-shield-check"></i><span>محمي ومؤمن</span>';
        element.classList.add('checked');
      });
    }, 2000);
  }
  
  // Add blockchain verification animation on documents
  const verificationBadges = document.querySelectorAll('.card-badge .badge');
  if (verificationBadges.length) {
    verificationBadges.forEach(badge => {
      badge.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Show verification animation
        this.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري التحقق...';
        
        setTimeout(() => {
          this.innerHTML = '<i class="fas fa-check-circle"></i> تم التحقق';
          this.classList.add('verified');
          
          setTimeout(() => {
            this.innerHTML = '<i class="fas fa-shield-alt"></i> موثق';
            this.classList.remove('verified');
          }, 2000);
        }, 1500);
      });
    });
  }
}

// Notification system
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Add icon based on type
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'warning') icon = 'exclamation-triangle';
  if (type === 'error') icon = 'times-circle';
  
  notification.innerHTML = `
    <div class="notification-icon">
      <i class="fas fa-${icon}"></i>
    </div>
    <div class="notification-content">
      <p>${message}</p>
    </div>
    <button class="notification-close" aria-label="إغلاق الإشعار">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add to DOM
  const notificationsContainer = document.querySelector('.notifications-container');
  if (!notificationsContainer) {
    const container = document.createElement('div');
    container.className = 'notifications-container';
    document.body.appendChild(container);
    container.appendChild(notification);
  } else {
    notificationsContainer.appendChild(notification);
  }
  
  // Add close button functionality
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', () => {
    notification.classList.add('notification-hiding');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.add('notification-hiding');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, 5000);
}
