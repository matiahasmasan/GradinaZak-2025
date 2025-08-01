// js/utils.js
class Utils {
  // Intersection Observer for animations
  static initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          // Add stagger delay for multiple elements
          const delay =
            Array.from(entry.target.parentNode.children).indexOf(entry.target) *
            100;
          entry.target.style.animationDelay = `${delay}ms`;
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document
      .querySelectorAll(".animate-slide-up, .card-hover, .project-card")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  // Lazy loading for images
  static initLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("opacity-0");
          img.classList.add("animate-fade-in");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => {
      img.classList.add("opacity-0", "transition-opacity", "duration-300");
      imageObserver.observe(img);
    });
  }

  // Preload critical images
  static preloadImages(imagePaths) {
    imagePaths.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  // Phone number formatting
  static formatPhoneNumber(input) {
    input.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length >= 10) {
        value = value.substring(0, 10);
        value = value.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
      }
      e.target.value = value;
    });
  }

  // Form validation enhancement
  static enhanceFormValidation() {
    const inputs = document.querySelectorAll(".form-input");
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        this.classList.remove("border-red-500", "border-green-500");

        if (this.hasAttribute("required") && !this.value.trim()) {
          this.classList.add("border-red-500");
          this.setCustomValidity("Acest câmp este obligatoriu");
        } else if (
          this.type === "email" &&
          this.value &&
          !this.checkValidity()
        ) {
          this.classList.add("border-red-500");
          this.setCustomValidity(
            "Vă rugăm să introduceți o adresă de email validă"
          );
        } else if (
          this.type === "tel" &&
          this.value &&
          this.value.replace(/\D/g, "").length < 10
        ) {
          this.classList.add("border-red-500");
          this.setCustomValidity(
            "Vă rugăm să introduceți un număr de telefon valid"
          );
        } else {
          this.classList.add("border-green-500");
          this.setCustomValidity("");
        }
      });

      input.addEventListener("focus", function () {
        this.classList.remove("border-red-500");
        this.setCustomValidity("");
      });
    });
  }

  // Loading states for buttons
  static setButtonLoading(button, isLoading = true) {
    const textElement = button.querySelector("[data-text]") || button;
    const loadingElement = button.querySelector("[data-loading]");

    if (isLoading) {
      if (loadingElement) {
        textElement.classList.add("hidden");
        loadingElement.classList.remove("hidden");
      } else {
        button.disabled = true;
        button.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Se încarcă...
                `;
      }
    } else {
      if (loadingElement) {
        textElement.classList.remove("hidden");
        loadingElement.classList.add("hidden");
      }
      button.disabled = false;
    }
  }

  // Notification system
  static showNotification(message, type = "success", duration = 5000) {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
        ? "bg-red-500 text-white"
        : type === "warning"
        ? "bg-yellow-500 text-black"
        : "bg-blue-500 text-white"
    }`;

    notification.innerHTML = `
            <div class="flex items-center">
                <span class="flex-1">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-current hover:opacity-75">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    // Auto hide
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  // Scroll to top functionality
  static initScrollToTop() {
    const scrollBtn = document.createElement("button");
    scrollBtn.className =
      "fixed bottom-8 right-8 bg-primary hover:bg-secondary text-white p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 translate-y-10 z-40";
    scrollBtn.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
        `;

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.body.appendChild(scrollBtn);

    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.remove("opacity-0", "translate-y-10");
      } else {
        scrollBtn.classList.add("opacity-0", "translate-y-10");
      }
    });
  }

  // Cookie consent (simple version)
  static initCookieConsent() {
    if (localStorage.getItem("cookieConsent")) return;

    const banner = document.createElement("div");
    banner.className =
      "fixed bottom-0 left-0 right-0 bg-dark text-white p-4 z-50 transform translate-y-full transition-transform duration-300";
    banner.innerHTML = `
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p class="text-sm">Folosim cookie-uri pentru a îmbunătăți experiența dvs. pe site.</p>
                <div class="flex gap-2">
                    <button id="accept-cookies" class="bg-primary hover:bg-secondary px-4 py-2 rounded text-sm transition-colors">Accept</button>
                    <button id="decline-cookies" class="border border-gray-400 hover:bg-gray-700 px-4 py-2 rounded text-sm transition-colors">Refuz</button>
                </div>
            </div>
        `;

    document.body.appendChild(banner);

    setTimeout(() => banner.classList.remove("translate-y-full"), 1000);

    document.getElementById("accept-cookies").addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "accepted");
      banner.remove();
    });

    document.getElementById("decline-cookies").addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "declined");
      banner.remove();
    });
  }

  // Initialize all utilities
  static init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initScrollAnimations();
      this.initLazyLoading();
      this.enhanceFormValidation();
      this.initScrollToTop();
      this.initCookieConsent();

      // Preload critical images
      this.preloadImages([
        "images/utility/logo.jpg",
        "images/gradina1.jpg",
        "images/gradina2.jpg",
        "images/gradina3.jpg",
      ]);

      // Format phone inputs
      const phoneInputs = document.querySelectorAll('input[type="tel"]');
      phoneInputs.forEach((input) => this.formatPhoneNumber(input));
    });
  }
}

// Auto-initialize
Utils.init();

// Export for use in other files
window.Utils = Utils;
