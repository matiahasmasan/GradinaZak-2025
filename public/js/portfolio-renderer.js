// Portfolio Card Renderer
class PortfolioRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.projects = portfolioProjects || [];
    this.currentFilter = "all";
    this.isFiltering = false;
  }

  // Generate HTML for a single project card with lazy loading
  generateCardHTML(project) {
    return `
      <div class="project-item group" data-category="${project.category}">
        <div class="project-card relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onclick="portfolioModal.openModal('${project.image}', '${project.categoryLabel}', '${project.categoryLabel}')">
          <div class="relative overflow-hidden">
            <div class="lazy-placeholder w-full h-64" data-src="${project.image}" data-alt="${project.categoryLabel}">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                alt=""
                class="w-full h-64 object-cover project-image opacity-0"
                loading="lazy"
              />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute top-4 right-4">
              <span class="inline-flex items-center px-3 py-1 ${project.categoryColor} text-white rounded-full text-sm font-medium backdrop-blur-sm">
                <i class="${project.categoryIcon} mr-1"></i>
                ${project.categoryLabel}
              </span>
            </div>

            <div class="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="bg-white/20 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">
                <i class="fas fa-expand-alt text-white text-sm"></i>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center text-gray-500 text-sm">
                <i class="fas fa-calendar-alt mr-2"></i>
                ${project.year}
              </div>
              <div class="flex items-center text-gray-500 text-sm">
                <i class="fas fa-map-marker-alt mr-2"></i>
                ${project.location}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Render all projects
  renderProjects() {
    if (!this.container) {
      console.error("Portfolio container not found");
      return;
    }

    const projectsHTML = this.projects
      .map((project) => this.generateCardHTML(project))
      .join("");

    this.container.innerHTML = projectsHTML;

    // Initialize lazy loading after rendering
    this.initializeLazyLoading();
  }

  // Initialize lazy loading
  initializeLazyLoading() {
    const lazyImages = document.querySelectorAll(".lazy-placeholder");

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const placeholder = entry.target;
            const img = placeholder.querySelector("img");
            const imageSrc = placeholder.getAttribute("data-src");
            const imageAlt = placeholder.getAttribute("data-alt");

            img.src = imageSrc;
            img.alt = imageAlt;

            img.onload = () => {
              img.classList.remove("opacity-0");
              placeholder.classList.remove("lazy-placeholder");
            };

            observer.unobserve(placeholder);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.1,
      }
    );

    lazyImages.forEach((placeholder) => {
      imageObserver.observe(placeholder);
    });
  }

  // Filter projects by category with smooth transitions
  async filterProjects(category) {
    if (this.isFiltering || this.currentFilter === category) return;

    this.isFiltering = true;
    this.currentFilter = category;

    const projectItems = document.querySelectorAll(".project-item");
    const visibleItems = [];
    const hiddenItems = [];

    // Separate items into visible and hidden
    projectItems.forEach((item) => {
      if (
        category === "all" ||
        item.getAttribute("data-category") === category
      ) {
        visibleItems.push(item);
      } else {
        hiddenItems.push(item);
      }
    });

    // Animate out hidden items
    const hidePromises = hiddenItems.map((item) => {
      return new Promise((resolve) => {
        item.classList.add("filtering-out");
        setTimeout(() => {
          item.classList.add("hidden");
          item.classList.remove("filtering-out");
          resolve();
        }, 300);
      });
    });

    // Wait for hide animations to complete
    await Promise.all(hidePromises);

    // Animate in visible items
    visibleItems.forEach((item) => {
      item.classList.remove("hidden");
      item.classList.add("filtering-in");
      setTimeout(() => {
        item.classList.remove("filtering-in");
      }, 300);
    });

    // Reset filtering state
    setTimeout(() => {
      this.isFiltering = false;
    }, 600);
  }

  // Initialize portfolio with animations
  initialize() {
    this.renderProjects();
    this.setupAnimations();
  }

  // Setup scroll animations
  setupAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      });
    }, observerOptions);

    // Observe all project items
    setTimeout(() => {
      const projectItems = document.querySelectorAll(".project-item");
      projectItems.forEach((item) => observer.observe(item));
    }, 100);
  }
}

// Parallax effect handler - Disabled for better performance
class ParallaxHandler {
  constructor() {
    // Parallax effect disabled
  }

  init() {
    // No initialization needed
  }

  updateParallax() {
    // Parallax effect disabled
  }
}

// Portfolio Modal Class
class PortfolioModal {
  constructor() {
    this.modal = null;
    this.createModal();
  }

  createModal() {
    // Create modal HTML
    const modalHTML = `
      <div id="portfolio-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
        <div class="relative max-w-7xl max-h-full mx-4 md:mx-8">
          <!-- Close button -->
          <button 
            id="modal-close" 
            class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close modal"
          >
            <i class="fas fa-times text-2xl"></i>
          </button>
          
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg overflow-hidden shadow-2xl">
            <div class="relative">
              <img 
                id="modal-image" 
                src="" 
                alt="" 
                class="w-full h-auto max-h-[80vh] object-contain"
              />
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 id="modal-title" class="text-white text-xl md:text-2xl font-bold"></h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add modal to body
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    this.modal = document.getElementById("portfolio-modal");

    // Setup event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    const closeBtn = document.getElementById("modal-close");
    const modalImage = document.getElementById("modal-image");

    // Close on close button click
    closeBtn.addEventListener("click", () => this.closeModal());

    // Close on outside click
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.modal.classList.contains("hidden")) {
        this.closeModal();
      }
    });

    // Prevent modal from closing when clicking on image
    modalImage.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  openModal(imageSrc, title, alt) {
    const modalImage = document.getElementById("modal-image");
    const modalTitle = document.getElementById("modal-title");

    modalImage.src = imageSrc;
    modalImage.alt = alt;
    modalTitle.textContent = title;

    this.modal.classList.remove("hidden");
    this.modal.classList.add("flex");
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    // Add fade-in animation
    setTimeout(() => {
      this.modal.style.opacity = "1";
    }, 10);
  }

  closeModal() {
    this.modal.classList.add("hidden");
    this.modal.classList.remove("flex");
    document.body.style.overflow = ""; // Restore scrolling
    this.modal.style.opacity = "0";
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize portfolio renderer
  const portfolio = new PortfolioRenderer("portfolio-grid");
  portfolio.initialize();

  // Initialize modal
  window.portfolioModal = new PortfolioModal();

  // Parallax handler disabled for better performance
  // new ParallaxHandler();

  // Setup filter functionality for desktop buttons
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterValue = button.getAttribute("data-filter");

      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Update mobile select to match
      const mobileSelect = document.getElementById("mobile-filter-select");
      if (mobileSelect) {
        mobileSelect.value = filterValue;
      }

      // Apply filter
      portfolio.filterProjects(filterValue);
    });
  });

  // Setup mobile dropdown functionality
  const mobileButton = document.getElementById("mobile-filter-button");
  const mobileDropdown = document.getElementById("mobile-filter-dropdown");
  const mobileFilterText = document.getElementById("mobile-filter-text");
  const mobileFilterArrow = document.getElementById("mobile-filter-arrow");
  const mobileOptions = document.querySelectorAll(".mobile-filter-option");

  if (mobileButton && mobileDropdown) {
    // Toggle dropdown
    mobileButton.addEventListener("click", () => {
      const isOpen = !mobileDropdown.classList.contains("hidden");

      if (isOpen) {
        mobileDropdown.classList.add("hidden");
        mobileFilterArrow.style.transform = "rotate(0deg)";
      } else {
        mobileDropdown.classList.remove("hidden");
        mobileFilterArrow.style.transform = "rotate(180deg)";
      }
    });

    // Handle option selection
    mobileOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const filterValue = option.getAttribute("data-filter");
        const optionText = option.querySelector("span").textContent;
        const optionIcon = option.querySelector("i").className;

        // Update button text and icon
        mobileFilterText.textContent = optionText;
        mobileButton.querySelector("i").className = optionIcon;

        // Close dropdown
        mobileDropdown.classList.add("hidden");
        mobileFilterArrow.style.transform = "rotate(0deg)";

        // Remove active class from all desktop buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to matching desktop button
        const matchingButton = document.querySelector(
          `[data-filter="${filterValue}"]`
        );
        if (matchingButton) {
          matchingButton.classList.add("active");
        }

        // Apply filter
        portfolio.filterProjects(filterValue);
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !mobileButton.contains(e.target) &&
        !mobileDropdown.contains(e.target)
      ) {
        mobileDropdown.classList.add("hidden");
        mobileFilterArrow.style.transform = "rotate(0deg)";
      }
    });
  }

  // Parallax handler disabled for better performance
  // new ParallaxHandler();
});
