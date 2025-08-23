// Image Optimization and Performance Enhancement
class ImageOptimizer {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupLazyLoading();
      this.setupWebPSupport();
      this.optimizeCriticalImages();
      this.setupIntersectionObserver();
    });
  }

  // Check WebP support and replace images if supported
  setupWebPSupport() {
    const webpSupported = this.checkWebPSupport();
    if (webpSupported) {
      this.replaceImagesWithWebP();
    }
  }

  // Test WebP support
  checkWebPSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Replace JPEG/PNG images with WebP versions
  replaceImagesWithWebP() {
    const images = document.querySelectorAll('img[src*=".jpg"], img[src*=".png"]');
    images.forEach(img => {
      const originalSrc = img.src;
      const webpSrc = originalSrc.replace(/\.(jpg|png)$/i, '.webp');
      
      // Create a test image to check if WebP exists
      const testImg = new Image();
      testImg.onload = () => {
        img.src = webpSrc;
      };
      testImg.onerror = () => {
        // WebP not available, keep original
      };
      testImg.src = webpSrc;
    });
  }

  // Setup lazy loading for non-critical images
  setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('fade-in');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      lazyImages.forEach(img => {
        img.classList.add('fade-in');
      });
    }
  }

  // Optimize critical images (above the fold)
  optimizeCriticalImages() {
    const criticalImages = document.querySelectorAll('img[fetchpriority="high"]');
    criticalImages.forEach(img => {
      // Preload critical images
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src;
      document.head.appendChild(link);
    });
  }

  // Setup intersection observer for animations
  setupIntersectionObserver() {
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animationDelay = Math.random() * 0.3 + 's';
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      animatedElements.forEach(el => {
        observer.observe(el);
      });
    }
  }

  // Progressive image loading
  setupProgressiveLoading() {
    const images = document.querySelectorAll('img[data-progressive]');
    images.forEach(img => {
      const lowResSrc = img.dataset.lowRes;
      const highResSrc = img.src;
      
      if (lowResSrc) {
        img.src = lowResSrc;
        
        const highResImg = new Image();
        highResImg.onload = () => {
          img.src = highResSrc;
          img.classList.add('progressive-loaded');
        };
        highResImg.src = highResSrc;
      }
    });
  }

  // Image error handling
  setupErrorHandling() {
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') {
        const img = e.target;
        const fallbackSrc = img.dataset.fallback || 'images/utility/placeholder.jpg';
        
        if (img.src !== fallbackSrc) {
          img.src = fallbackSrc;
          img.classList.add('image-error');
        }
      }
    }, true);
  }

  // Performance monitoring
  trackImagePerformance() {
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;
    
    const trackLoad = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        this.logPerformance();
      }
    };

    images.forEach(img => {
      if (img.complete) {
        trackLoad();
      } else {
        img.addEventListener('load', trackLoad);
        img.addEventListener('error', trackLoad);
      }
    });
  }

  logPerformance() {
    const loadTime = performance.now();
    console.log(`All images loaded in ${loadTime.toFixed(2)}ms`);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'image_load_complete', {
        load_time: loadTime,
        image_count: document.querySelectorAll('img').length
      });
    }
  }
}

// Initialize image optimizer
const imageOptimizer = new ImageOptimizer(); 