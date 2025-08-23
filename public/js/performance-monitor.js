// Performance Monitoring and Analytics
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.startMonitoring();
    });

    window.addEventListener('load', () => {
      this.captureLoadMetrics();
    });
  }

  startMonitoring() {
    // Monitor Core Web Vitals
    this.monitorLCP();
    this.monitorFID();
    this.monitorCLS();
    
    // Monitor image performance
    this.monitorImageLoading();
    
    // Monitor resource loading
    this.monitorResourceLoading();
  }

  // Monitor Largest Contentful Paint
  monitorLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        
        console.log('LCP:', this.metrics.lcp.toFixed(2), 'ms');
        this.sendMetric('lcp', this.metrics.lcp);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  // Monitor First Input Delay
  monitorFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          console.log('FID:', this.metrics.fid.toFixed(2), 'ms');
          this.sendMetric('fid', this.metrics.fid);
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  // Monitor Cumulative Layout Shift
  monitorCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
        console.log('CLS:', this.metrics.cls.toFixed(4));
        this.sendMetric('cls', this.metrics.cls);
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Monitor image loading performance
  monitorImageLoading() {
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;
    const startTime = performance.now();
    
    const trackImageLoad = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        const loadTime = performance.now() - startTime;
        this.metrics.imageLoadTime = loadTime;
        console.log('All images loaded in:', loadTime.toFixed(2), 'ms');
        this.sendMetric('image_load_time', loadTime);
      }
    };

    images.forEach(img => {
      if (img.complete) {
        trackImageLoad();
      } else {
        img.addEventListener('load', trackImageLoad);
        img.addEventListener('error', trackImageLoad);
      }
    });
  }

  // Monitor resource loading
  monitorResourceLoading() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.initiatorType === 'img') {
            console.log('Image loaded:', entry.name, 'in', entry.duration.toFixed(2), 'ms');
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  // Capture overall page load metrics
  captureLoadMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      this.metrics.loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
      this.metrics.totalLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      console.log('DOM Content Loaded:', this.metrics.domContentLoaded.toFixed(2), 'ms');
      console.log('Page Load Complete:', this.metrics.loadComplete.toFixed(2), 'ms');
      console.log('Total Load Time:', this.metrics.totalLoadTime.toFixed(2), 'ms');
      
      this.sendMetric('dom_content_loaded', this.metrics.domContentLoaded);
      this.sendMetric('load_complete', this.metrics.loadComplete);
      this.sendMetric('total_load_time', this.metrics.totalLoadTime);
    }
  }

  // Send metrics to analytics
  sendMetric(name, value) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        page_url: window.location.href
      });
    }
    
    // Custom analytics endpoint (if you have one)
    if (window.analyticsEndpoint) {
      fetch(window.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric: name,
          value: value,
          url: window.location.href,
          timestamp: Date.now()
        })
      }).catch(err => console.log('Analytics error:', err));
    }
  }

  // Get performance report
  getPerformanceReport() {
    return {
      ...this.metrics,
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null,
      timestamp: Date.now()
    };
  }

  // Log performance report
  logReport() {
    const report = this.getPerformanceReport();
    console.log('Performance Report:', report);
    return report;
  }
}

// Initialize performance monitor
const performanceMonitor = new PerformanceMonitor();

// Export for use in other scripts
window.PerformanceMonitor = PerformanceMonitor; 