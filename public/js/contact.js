// js/contact.js
class ContactForm {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initForm();
      this.initMap();
    });
  }

  initForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", this.handleSubmit.bind(this));

    // Real-time validation
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearErrors(input));
    });

    // Auto-save form data
    this.initAutoSave();
  }

  handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validate all fields
    if (!this.validateForm(form)) {
      Utils.showNotification(
        "Vă rugăm să corectați erorile din formular",
        "error"
      );
      return;
    }

    this.submitForm(data, form);
  }

  async submitForm(data, form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    Utils.setButtonLoading(submitBtn, true);

    try {
      // Here you would normally send to your backend
      // For demo, we'll simulate an API call
      await this.simulateAPICall(data);

      // Success
      Utils.showNotification(
        "Mesajul a fost trimis cu succes! Vă vom contacta în curând.",
        "success"
      );
      form.reset();
      this.clearAutoSave();

      // Redirect or show success page
      setTimeout(() => {
        window.location.href = "index.html?message=sent";
      }, 2000);
    } catch (error) {
      console.error("Form submission error:", error);
      Utils.showNotification(
        "A apărut o eroare. Vă rugăm să încercați din nou sau să ne sunați direct.",
        "error"
      );
    } finally {
      Utils.setButtonLoading(submitBtn, false);
    }
  }

  simulateAPICall(data) {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve({ success: true, id: Date.now() });
        } else {
          reject(new Error("Simulated network error"));
        }
      }, 2000);
    });
  }

  validateForm(form) {
    const inputs = form.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );
    let isValid = true;

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Remove previous errors
    this.clearErrors(field);

    // Required field validation
    if (field.hasAttribute("required") && !value) {
      errorMessage = "Acest câmp este obligatoriu";
      isValid = false;
    }
    // Email validation
    else if (field.type === "email" && value && !this.isValidEmail(value)) {
      errorMessage = "Vă rugăm să introduceți o adresă de email validă";
      isValid = false;
    }
    // Phone validation
    else if (field.type === "tel" && value && !this.isValidPhone(value)) {
      errorMessage = "Vă rugăm să introduceți un număr de telefon valid";
      isValid = false;
    }
    // Text length validation
    else if (field.tagName === "TEXTAREA" && value && value.length < 10) {
      errorMessage = "Mesajul trebuie să conțină cel puțin 10 caractere";
      isValid = false;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length >= 10 && phoneRegex.test(phone);
  }

  showFieldError(field, message) {
    field.classList.add("border-red-500");

    // Create or update error message
    let errorElement = field.parentNode.querySelector(".error-message");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "error-message text-red-500 text-sm mt-1";
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  clearErrors(field) {
    field.classList.remove("border-red-500");
    const errorElement = field.parentNode.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
  }

  initAutoSave() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    // Load saved data
    this.loadAutoSavedData();

    // Save on input
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.saveFormData();
      });
    });
  }

  saveFormData() {
    const form = document.getElementById("contact-form");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Don't save sensitive data
    delete data.gdpr;

    localStorage.setItem("contactFormData", JSON.stringify(data));
  }

  loadAutoSavedData() {
    const savedData = localStorage.getItem("contactFormData");
    if (!savedData) return;

    try {
      const data = JSON.parse(savedData);
      const form = document.getElementById("contact-form");

      Object.keys(data).forEach((key) => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field && data[key]) {
          field.value = data[key];
        }
      });

      // Show notification about restored data
      Utils.showNotification(
        "Datele salvate anterior au fost restaurate",
        "info",
        3000
      );
    } catch (error) {
      console.error("Error loading auto-saved data:", error);
    }
  }

  clearAutoSave() {
    localStorage.removeItem("contactFormData");
  }

  initMap() {
    // Enhanced map functionality
    const mapContainer = document.querySelector(".gmap_canvas iframe");
    if (!mapContainer) return;

    // Add loading state
    const loadingDiv = document.createElement("div");
    loadingDiv.className =
      "absolute inset-0 bg-gray-200 flex items-center justify-center";
    loadingDiv.innerHTML = `
            <div class="text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p class="text-gray-600">Se încarcă harta...</p>
            </div>
        `;

    mapContainer.parentNode.style.position = "relative";
    mapContainer.parentNode.appendChild(loadingDiv);

    // Remove loading when map loads
    mapContainer.addEventListener("load", () => {
      loadingDiv.remove();
    });

    // Add click handler for directions
    this.addMapDirections();
  }

  addMapDirections() {
    const mapContainer = document.querySelector(".map-container");
    if (!mapContainer) return;

    const directionsBtn = document.createElement("button");
    directionsBtn.className =
      "absolute top-4 right-4 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-10";
    directionsBtn.innerHTML = `
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3v15l-6 3-6-3z"></path>
            </svg>
            Navigare
        `;

    directionsBtn.addEventListener("click", () => {
      const address = encodeURIComponent(
        "Strada Dealul Grosului nr.16, Baia Mare, Romania"
      );
      const mapsURL = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
      window.open(mapsURL, "_blank");
    });

    mapContainer.style.position = "relative";
    mapContainer.appendChild(directionsBtn);
  }

  // Public methods for external use
  setFieldValue(fieldName, value) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.value = value;
      this.validateField(field);
    }
  }

  getFormData() {
    const form = document.getElementById("contact-form");
    if (!form) return {};

    const formData = new FormData(form);
    return Object.fromEntries(formData);
  }

  resetForm() {
    const form = document.getElementById("contact-form");
    if (form) {
      form.reset();
      this.clearAutoSave();

      // Clear all error states
      const fields = form.querySelectorAll("input, select, textarea");
      fields.forEach((field) => this.clearErrors(field));
    }
  }
}

// Quick contact actions
class QuickContact {
  static call() {
    window.location.href = "tel:0766431164";
  }

  static email() {
    window.location.href =
      "mailto:office@gradinazak.ro?subject=Solicitare informații - Gradina Zak";
  }

  static whatsapp() {
    const message = encodeURIComponent(
      "Bună ziua! Sunt interessat de serviciile Gradina Zak."
    );
    window.open(`https://wa.me/40766431164?text=${message}`, "_blank");
  }

  static facebook() {
    window.open("https://www.facebook.com/gradinazak/", "_blank");
  }
}

// Initialize contact functionality
const contactForm = new ContactForm();

// Export for global use
window.ContactForm = ContactForm;
window.QuickContact = QuickContact;
window.contactForm = contactForm;
