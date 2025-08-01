// components/navbar.js
class Navbar {
  constructor() {
    this.init();
  }

  getNavbarHTML(currentPage = "") {
    return `
            <nav class="fixed top-0 w-full z-50 glass-effect nav-shadow transition-all duration-300" id="navbar">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-20">
                        <!-- Logo -->
                        <div class="flex items-center">
                            <a href="index.html" class="flex items-center space-x-3">
                                <img src="images/utility/logo.jpg" alt="Gradina Zak Logo" class="h-12 w-12 rounded-md object-cover">
                                <div class="hidden sm:block">
                                    <span class="text-xl font-bold text-white">Gradina Zak</span>
                                    <div class="text-xs text-white/80">Design | Grădini</div>
                                </div>
                            </a>
                        </div>
                        
                        <!-- Desktop Navigation -->
                        <div class="hidden md:flex items-center space-x-8">
                            <a href="index.html" class="nav-link ${
                              currentPage === "home"
                                ? "text-accent font-semibold"
                                : "text-white hover:text-accent"
                            } transition-colors duration-200 font-medium">Acasă</a>
                            <a href="portofolio.html" class="nav-link ${
                              currentPage === "portfolio"
                                ? "text-accent font-semibold"
                                : "text-white hover:text-accent"
                            } transition-colors duration-200 font-medium">Proiecte</a>
                            <a href="contact.html" class="nav-link ${
                              currentPage === "contact"
                                ? "text-accent font-semibold"
                                : "text-white hover:text-accent"
                            } transition-colors duration-200 font-medium">Contact</a>
                        </div>
                        
                        <!-- Mobile menu button -->
                        <button class="md:hidden p-2 rounded-md text-white hover:text-accent transition-colors" id="mobile-menu-btn">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Mobile Navigation -->
                <div class="md:hidden hidden" id="mobile-menu">
                    <div class="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
                        <a href="index.html" class="block px-3 py-2 ${
                          currentPage === "home"
                            ? "text-accent font-medium"
                            : "text-gray-700 hover:text-primary"
                        } transition-colors">Acasă</a>
                        <a href="portofolio.html" class="block px-3 py-2 ${
                          currentPage === "portfolio"
                            ? "text-accent font-medium"
                            : "text-gray-700 hover:text-primary"
                        } transition-colors">Proiecte</a>
                        <a href="contact.html" class="block px-3 py-2 ${
                          currentPage === "contact"
                            ? "text-accent font-medium"
                            : "text-gray-700 hover:text-primary"
                        } transition-colors">Contact</a>
                    </div>
                </div>
            </nav>
        `;
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupEventListeners()
      );
    } else {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });

      // Close mobile menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !mobileMenuBtn.contains(e.target) &&
          !mobileMenu.contains(e.target)
        ) {
          mobileMenu.classList.add("hidden");
        }
      });
    }

    // Navbar background and text color on scroll
    window.addEventListener("scroll", () => {
      const navbar = document.getElementById("navbar");
      if (navbar) {
        const navLinks = navbar.querySelectorAll('.nav-link');
        const logo = navbar.querySelector('span');
        const subtitle = navbar.querySelector('div.text-xs');
        const mobileBtn = navbar.querySelector('#mobile-menu-btn');
        
        if (window.scrollY > 50) {
          navbar.classList.add("bg-white/95");
          // Change text to dark when background appears
          navLinks.forEach(link => {
            if (!link.classList.contains('text-accent')) {
              link.classList.remove('text-white', 'hover:text-accent');
              link.classList.add('text-gray-700', 'hover:text-primary');
            }
          });
          if (logo) {
            logo.classList.remove('text-white');
            logo.classList.add('text-primary');
          }
          if (subtitle) {
            subtitle.classList.remove('text-white/80');
            subtitle.classList.add('text-secondary');
          }
          if (mobileBtn) {
            mobileBtn.classList.remove('text-white', 'hover:text-accent');
            mobileBtn.classList.add('text-gray-700', 'hover:text-primary');
          }
        } else {
          navbar.classList.remove("bg-white/95");
          // Change text to white when transparent
          navLinks.forEach(link => {
            if (!link.classList.contains('text-accent')) {
              link.classList.remove('text-gray-700', 'hover:text-primary');
              link.classList.add('text-white', 'hover:text-accent');
            }
          });
          if (logo) {
            logo.classList.remove('text-primary');
            logo.classList.add('text-white');
          }
          if (subtitle) {
            subtitle.classList.remove('text-secondary');
            subtitle.classList.add('text-white/80');
          }
          if (mobileBtn) {
            mobileBtn.classList.remove('text-gray-700', 'hover:text-primary');
            mobileBtn.classList.add('text-white', 'hover:text-accent');
          }
        }
      }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  render(containerId, currentPage = "") {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = this.getNavbarHTML(currentPage);
      this.setupEventListeners();
    }
  }
}

// Auto-initialize if navbar container exists
document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-container");
  if (navbarContainer) {
    const navbar = new Navbar();
    // Get current page from body data attribute or URL
    const currentPage = document.body.getAttribute("data-page") || "";
    navbar.render("navbar-container", currentPage);
  }
});

// Export for use in other files
window.Navbar = Navbar;
