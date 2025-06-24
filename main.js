// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');

// Utility Functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Navigation Functions
function initNavigation() {
  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Update active navigation link on scroll
  const updateActiveNavLink = throttle(() => {
    const scrollPosition = window.scrollY + 100;
    
    navLinks.forEach(link => {
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const sectionTop = targetSection.offsetTop;
        const sectionBottom = sectionTop + targetSection.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          navLinks.forEach(navLink => navLink.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }, 100);

  window.addEventListener('scroll', updateActiveNavLink);
}

// Navbar scroll effect
function initNavbarScroll() {
  const handleNavbarScroll = throttle(() => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(15, 23, 42, 0.98)';
      navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.background = 'rgba(15, 23, 42, 0.95)';
      navbar.style.boxShadow = 'none';
    }
  }, 100);

  window.addEventListener('scroll', handleNavbarScroll);
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Add animation classes to elements
  const animateElements = document.querySelectorAll('.skill-category, .project-card, .contact-item, .achievement-card, .experience-card');
  animateElements.forEach((el, index) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(el);
  });

  // About section animations
  const aboutText = document.querySelector('.about-text');
  const aboutImage = document.querySelector('.about-image');
  
  if (aboutText && aboutImage) {
    aboutText.classList.add('slide-in-left');
    aboutImage.classList.add('slide-in-right');
    observer.observe(aboutText);
    observer.observe(aboutImage);
  }
}

// Skill bar animation
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBar = entry.target;
        const level = skillBar.getAttribute('data-level');
        
        setTimeout(() => {
          skillBar.style.width = `${level}%`;
        }, 200);
        
        observer.unobserve(skillBar);
      }
    });
  });

  skillBars.forEach(bar => observer.observe(bar));
}

// Contact form handling
function initContactForm() {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      showNotification('Message sent successfully!', 'success');
      contactForm.reset();
      
      // Remove focus from form inputs
      const formInputs = contactForm.querySelectorAll('input, textarea');
      formInputs.forEach(input => input.blur());
      
    } catch (error) {
      showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

// Notification system
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
      <span class="notification-message">${message}</span>
    </div>
  `;
  
  // Add notification styles
  Object.assign(notification.style, {
    position: 'fixed',
    top: '90px',
    right: '20px',
    background: type === 'success' ? '#10B981' : '#EF4444',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: '9999',
    transform: 'translateX(400px)',
    transition: 'transform 0.3s ease-in-out',
    maxWidth: '300px',
    wordWrap: 'break-word'
  });
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 4000);
}

// Modal functionality
function openModal(projectId) {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  
  const projectData = {
    project1: {
      title: 'Credit Card Data Insights & Risk Prediction',
      description: 'A comprehensive data analysis project focused on analyzing credit card transaction data to identify spending patterns and predict credit risk using advanced machine learning techniques. The project involved extensive data preprocessing, feature engineering, and model optimization to achieve high accuracy in risk prediction.',
      technologies: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'NumPy', 'Jupyter Notebook'],
      features: [
        'Comprehensive data cleaning and preprocessing',
        'Exploratory data analysis with interactive visualizations',
        'Feature engineering for improved model performance',
        'Multiple classification algorithms comparison',
        'Hyperparameter tuning for optimal results',
        'Risk prediction dashboard with visual insights',
        'Model performance evaluation and validation'
      ],
      images: [
        'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    project2: {
      title: 'E-commerce Website Development',
      description: 'A full-stack e-commerce platform built using the MERN stack, featuring comprehensive user authentication, dynamic product listings, shopping cart functionality, and secure payment processing. The application provides a seamless shopping experience with responsive design and modern UI/UX principles.',
      technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'Stripe API', 'Bootstrap'],
      features: [
        'User registration and authentication system',
        'Dynamic product catalog with search and filtering',
        'Shopping cart and wishlist functionality',
        'Secure payment processing integration',
        'Order management and tracking system',
        'Admin dashboard for inventory management',
        'Responsive design for all devices',
        'RESTful API architecture'
      ],
      images: [
        'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    }
  };
  
  const project = projectData[projectId];
  if (!project) return;
  
  modalBody.innerHTML = `
    <div class="modal-project">
      <div class="modal-image">
        <img src="${project.images[0]}" alt="${project.title}">
      </div>
      <div class="modal-info">
        <h2 class="modal-title">${project.title}</h2>
        <p class="modal-description">${project.description}</p>
        
        <div class="modal-section">
          <h3>Technologies Used</h3>
          <div class="modal-tech">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        </div>
        
        <div class="modal-section">
          <h3>Key Features</h3>
          <ul class="modal-features">
            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        <div class="modal-actions">
          <a href="#" class="btn btn-primary">View Live Demo</a>
          <a href="#" class="btn btn-secondary">View Code</a>
        </div>
      </div>
    </div>
  `;
  
  // Add modal styles
  const style = document.createElement('style');
  style.textContent = `
    .modal-project {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }
    
    .modal-image img {
      width: 100%;
      height: 250px;
      object-fit: cover;
      border-radius: 12px;
    }
    
    .modal-title {
      font-size: 1.875rem;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }
    
    .modal-description {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    
    .modal-section {
      margin-bottom: 2rem;
    }
    
    .modal-section h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      color: var(--primary-color);
    }
    
    .modal-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .modal-features {
      list-style: none;
      padding: 0;
    }
    
    .modal-features li {
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-secondary);
    }
    
    .modal-features li:before {
      content: '✓';
      color: var(--success-color);
      margin-right: 0.5rem;
      font-weight: bold;
    }
    
    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }
    
    @media (max-width: 768px) {
      .modal-project {
        grid-template-columns: 1fr;
      }
      
      .modal-actions {
        flex-direction: column;
      }
    }
  `;
  
  document.head.appendChild(style);
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('project-modal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('project-modal');
  if (e.target === modal) {
    closeModal();
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Particle animation
function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Create additional particles dynamically
  setInterval(() => {
    if (document.querySelectorAll('.particle').length < 10) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.setProperty('--delay', Math.random() * 20 + 's');
      particle.style.setProperty('--duration', (15 + Math.random() * 10) + 's');
      hero.querySelector('.hero-background').appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 25000);
    }
  }, 3000);
}

// Typing animation for hero text
function initTypingAnimation() {
  const heroDescription = document.querySelector('.hero-description');
  if (!heroDescription) return;
  
  const originalText = heroDescription.textContent;
  heroDescription.textContent = '';
  
  let i = 0;
  const typeWriter = () => {
    if (i < originalText.length) {
      heroDescription.textContent += originalText.charAt(i);
      i++;
      setTimeout(typeWriter, 30);
    }
  };
  
  // Start typing animation after hero title animation
  setTimeout(typeWriter, 1200);
}

// Performance optimization: Lazy loading for images
function initLazyLoading() {
  const images = document.querySelectorAll('img[src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('fade-in');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initNavbarScroll();
  initScrollAnimations();
  initSkillBars();
  initContactForm();
  initParticles();
  initTypingAnimation();
  initLazyLoading();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is hidden
    document.body.style.animationPlayState = 'paused';
  } else {
    // Resume animations when page is visible
    document.body.style.animationPlayState = 'running';
  }
});

// Smooth scroll to top button
const createScrollToTopButton = () => {
  const button = document.createElement('button');
  button.innerHTML = '↑';
  button.className = 'scroll-to-top';
  button.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    box-shadow: var(--shadow-lg);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
  `;
  
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  const toggleButton = throttle(() => {
    if (window.scrollY > 300) {
      button.style.opacity = '1';
      button.style.visibility = 'visible';
    } else {
      button.style.opacity = '0';
      button.style.visibility = 'hidden';
    }
  }, 100);
  
  window.addEventListener('scroll', toggleButton);
  document.body.appendChild(button);
};

// Initialize scroll to top button
createScrollToTopButton();

// Preload critical resources
const preloadCriticalResources = () => {
  const criticalImages = [
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

preloadCriticalResources();

// Add global error handling
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});