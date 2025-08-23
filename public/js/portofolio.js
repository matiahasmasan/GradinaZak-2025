// js/portfolio.js
class Portfolio {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initFilterSystem();
      this.initModal();
      this.initMasonry();
    });
  }

  initFilterSystem() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectItems = document.querySelectorAll(".project-item");

    // Desktop filter buttons
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        button.classList.add("active");

        const filterValue = button.getAttribute("data-filter");
        this.filterProjects(filterValue, projectItems);

        // Update URL without page reload
        const url = new URL(window.location);
        if (filterValue === "all") {
          url.searchParams.delete("filter");
        } else {
          url.searchParams.set("filter", filterValue);
        }
        window.history.replaceState({}, "", url);
      });
    });

    // Mobile dropdown functionality
    this.initMobileDropdown();

    // Check URL for initial filter
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilter = urlParams.get("filter");
    if (initialFilter) {
      const filterBtn = document.querySelector(
        `[data-filter="${initialFilter}"]`
      );
      if (filterBtn) {
        filterBtn.click();
      }
    }
  }

  initMobileDropdown() {
    const mobileButton = document.getElementById("mobile-filter-button");
    const mobileDropdown = document.getElementById("mobile-filter-dropdown");
    const mobileFilterText = document.getElementById("mobile-filter-text");
    const mobileFilterArrow = document.getElementById("mobile-filter-arrow");
    const mobileOptions = document.querySelectorAll(".mobile-filter-option");
    const projectItems = document.querySelectorAll(".project-item");

    if (!mobileButton || !mobileDropdown) return;

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

        // Filter projects
        this.filterProjects(filterValue, projectItems);

        // Update URL without page reload
        const url = new URL(window.location);
        if (filterValue === "all") {
          url.searchParams.delete("filter");
        } else {
          url.searchParams.set("filter", filterValue);
        }
        window.history.replaceState({}, "", url);
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

  filterProjects(filterValue, projectItems) {
    projectItems.forEach((item, index) => {
      const shouldShow =
        filterValue === "all" ||
        item.getAttribute("data-category") === filterValue;

      if (shouldShow) {
        item.style.display = "block";
        // Staggered animation
        setTimeout(() => {
          item.classList.add("animate-zoom-in");
        }, index * 50);
      } else {
        item.classList.remove("animate-zoom-in");
        setTimeout(() => {
          item.style.display = "none";
        }, 150);
      }
    });

    // Update project count
    this.updateProjectCount(filterValue, projectItems);
  }

  updateProjectCount(filterValue, projectItems) {
    const visibleCount = Array.from(projectItems).filter(
      (item) =>
        filterValue === "all" ||
        item.getAttribute("data-category") === filterValue
    ).length;

    const countElement = document.getElementById("project-count");
    if (countElement) {
      countElement.textContent = `${visibleCount} proiecte`;
    }
  }

  initModal() {
    const modal = this.createModal();
    document.body.appendChild(modal);

    // Add click listeners to project images
    document.querySelectorAll(".project-image").forEach((img) => {
      img.addEventListener("click", () => this.openModal(img));
    });

    // Close modal events
    modal.addEventListener("click", (e) => {
      if (e.target === modal) this.closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal();
    });
  }

  createModal() {
    const modal = document.createElement("div");
    modal.id = "imageModal";
    modal.className =
      "modal hidden fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4";
    modal.innerHTML = `
            <div class="modal-content relative max-w-5xl max-h-full bg-white rounded-lg overflow-hidden animate-zoom-in">
                <button class="close-modal absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold cursor-pointer transition-all z-10" onclick="portfolio.closeModal()">
                    &times;
                </button>
                <img id="modalImage" src="" alt="Imagine mărită" class="w-full h-auto max-h-[70vh] object-contain">
                <div class="p-6 bg-white">
                    <h3 id="modalTitle" class="text-2xl font-semibold text-primary mb-2"></h3>
                    <p id="modalDescription" class="text-gray-600 mb-4"></p>
                    <div id="modalCategory" class="inline-block px-3 py-1 rounded-full text-sm font-medium"></div>
                    <div class="flex gap-4 mt-4">
                        <button id="prevImage" class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors">
                            ← Anterior
                        </button>
                        <button id="nextImage" class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors">
                            Următorul →
                        </button>
                    </div>
                </div>
            </div>
        `;
    return modal;
  }

  openModal(img) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalCategory = document.getElementById("modalCategory");

    modal.classList.remove("hidden");
    modalImg.src = img.src;
    modalImg.alt = img.alt;

    // Get project details from the card
    const card = img.closest(".project-card");
    const title = card.querySelector("h3").textContent;
    const description = card.querySelector("p").textContent;
    const category = card.querySelector("span").textContent;
    const categoryClass = card.querySelector("span").className;

    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalCategory.textContent = category;
    modalCategory.className = categoryClass;

    // Store current image for navigation
    this.currentImages = Array.from(
      document.querySelectorAll(".project-image")
    );
    this.currentImageIndex = this.currentImages.indexOf(img);

    // Setup navigation
    this.setupModalNavigation();

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Add loading state
    modalImg.addEventListener("load", () => {
      modalImg.classList.add("animate-fade-in");
    });
  }

  closeModal() {
    const modal = document.getElementById("imageModal");
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";

    // Clear modal content
    document.getElementById("modalImage").src = "";
    document.getElementById("modalImage").classList.remove("animate-fade-in");
  }

  setupModalNavigation() {
    const prevBtn = document.getElementById("prevImage");
    const nextBtn = document.getElementById("nextImage");

    prevBtn.onclick = () => this.navigateModal(-1);
    nextBtn.onclick = () => this.navigateModal(1);

    // Keyboard navigation
    document.addEventListener("keydown", this.handleKeyNavigation.bind(this));

    // Update button states
    prevBtn.disabled = this.currentImageIndex === 0;
    nextBtn.disabled = this.currentImageIndex === this.currentImages.length - 1;
  }

  navigateModal(direction) {
    const newIndex = this.currentImageIndex + direction;
    if (newIndex >= 0 && newIndex < this.currentImages.length) {
      this.currentImageIndex = newIndex;
      this.openModal(this.currentImages[newIndex]);
    }
  }

  handleKeyNavigation(e) {
    if (!document.getElementById("imageModal").classList.contains("hidden")) {
      switch (e.key) {
        case "ArrowLeft":
          this.navigateModal(-1);
          break;
        case "ArrowRight":
          this.navigateModal(1);
          break;
      }
    }
  }

  initMasonry() {
    // Simple masonry layout for better visual arrangement
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    const resizeGridItem = (item) => {
      const rowHeight = parseInt(
        window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
      );
      const rowGap = parseInt(
        window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
      );
      const rowSpan = Math.ceil(
        (item.querySelector(".project-card").getBoundingClientRect().height +
          rowGap) /
          (rowHeight + rowGap)
      );
      item.style.gridRowEnd = "span " + rowSpan;
    };

    const resizeAllGridItems = () => {
      const allItems = grid.querySelectorAll(".project-item");
      allItems.forEach(resizeGridItem);
    };

    // Wait for images to load
    const images = grid.querySelectorAll("img");
    let loadedImages = 0;

    images.forEach((img) => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.addEventListener("load", () => {
          loadedImages++;
          if (loadedImages === images.length) {
            resizeAllGridItems();
          }
        });
      }
    });

    if (loadedImages === images.length) {
      resizeAllGridItems();
    }

    // Resize on window resize
    window.addEventListener("resize", resizeAllGridItems);
  }

  // Add new project dynamically (for admin use)
  addProject(projectData) {
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    const projectHTML = `
            <div class="project-item animate-zoom-in" data-category="${projectData.category}">
                <div class="project-card">
                    <img src="${projectData.image}" alt="${projectData.title}" class="project-image cursor-pointer" onclick="portfolio.openModal(this)">
                    <div class="p-6">
                        <h3 class="text-xl font-semibold text-primary mb-2">${projectData.title}</h3>
                        <p class="text-gray-600 mb-4">${projectData.description}</p>
                        <span class="inline-block px-3 py-1 ${projectData.categoryClass} rounded-full text-sm font-medium">${projectData.categoryLabel}</span>
                    </div>
                </div>
            </div>
        `;

    grid.insertAdjacentHTML("beforeend", projectHTML);

    // Re-initialize modal for new image
    const newImg = grid.lastElementChild.querySelector(".project-image");
    newImg.addEventListener("click", () => this.openModal(newImg));

    // Update masonry
    setTimeout(() => this.initMasonry(), 100);
  }

  // Filter projects by search term
  searchProjects(searchTerm) {
    const projectItems = document.querySelectorAll(".project-item");
    const term = searchTerm.toLowerCase();

    projectItems.forEach((item) => {
      const title = item.querySelector("h3").textContent.toLowerCase();
      const description = item.querySelector("p").textContent.toLowerCase();
      const category = item.querySelector("span").textContent.toLowerCase();

      const matches =
        title.includes(term) ||
        description.includes(term) ||
        category.includes(term);

      if (matches) {
        item.style.display = "block";
        item.classList.add("animate-zoom-in");
      } else {
        item.style.display = "none";
        item.classList.remove("animate-zoom-in");
      }
    });
  }

  // Get projects by category
  getProjectsByCategory(category) {
    const projectItems = document.querySelectorAll(".project-item");
    return Array.from(projectItems).filter(
      (item) => item.getAttribute("data-category") === category
    );
  }

  // Get all categories
  getAllCategories() {
    const projectItems = document.querySelectorAll(".project-item");
    const categories = new Set();

    projectItems.forEach((item) => {
      categories.add(item.getAttribute("data-category"));
    });

    return Array.from(categories);
  }

  // Lazy load images for better performance
  initLazyLoading() {
    const images = document.querySelectorAll(".project-image[data-src]");

    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            img.classList.add("animate-fade-in");
            imageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: "50px",
      }
    );

    images.forEach((img) => imageObserver.observe(img));
  }

  // Generate portfolio statistics
  getPortfolioStats() {
    const projects = document.querySelectorAll(".project-item");
    const categories = this.getAllCategories();

    const stats = {
      totalProjects: projects.length,
      categories: categories.length,
      projectsByCategory: {},
    };

    categories.forEach((category) => {
      stats.projectsByCategory[category] =
        this.getProjectsByCategory(category).length;
    });

    return stats;
  }

  // Export portfolio data (for backup or sharing)
  exportPortfolioData() {
    const projects = [];
    const projectItems = document.querySelectorAll(".project-item");

    projectItems.forEach((item) => {
      const card = item.querySelector(".project-card");
      const img = card.querySelector("img");
      const title = card.querySelector("h3").textContent;
      const description = card.querySelector("p").textContent;
      const category = item.getAttribute("data-category");
      const categoryLabel = card.querySelector("span").textContent;

      projects.push({
        title,
        description,
        category,
        categoryLabel,
        image: img.src,
        alt: img.alt,
      });
    });

    return {
      projects,
      exportDate: new Date().toISOString(),
      totalProjects: projects.length,
    };
  }

  // Import portfolio data (for admin use)
  importPortfolioData(data) {
    const grid = document.getElementById("portfolio-grid");
    if (!grid || !data.projects) return;

    // Clear existing projects
    grid.innerHTML = "";

    // Add imported projects
    data.projects.forEach((project) => {
      this.addProject(project);
    });

    Utils.showNotification(
      `${data.projects.length} proiecte au fost importate cu succes!`,
      "success"
    );
  }

  // Shuffle projects for random display
  shuffleProjects() {
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    const projects = Array.from(grid.children);

    // Fisher-Yates shuffle
    for (let i = projects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [projects[i], projects[j]] = [projects[j], projects[i]];
    }

    // Reappend in new order
    projects.forEach((project) => grid.appendChild(project));

    // Re-trigger animations
    setTimeout(() => {
      projects.forEach((project, index) => {
        project.style.animationDelay = `${index * 100}ms`;
        project.classList.add("animate-zoom-in");
      });
    }, 100);
  }

  // Sort projects by date (if you have date data)
  sortProjectsByDate(ascending = false) {
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    const projects = Array.from(grid.children);

    projects.sort((a, b) => {
      // You'd need to add data-date attributes to your projects
      const dateA = new Date(a.getAttribute("data-date") || "2024-01-01");
      const dateB = new Date(b.getAttribute("data-date") || "2024-01-01");

      return ascending ? dateA - dateB : dateB - dateA;
    });

    projects.forEach((project) => grid.appendChild(project));
  }

  // Create portfolio slideshow for presentations
  createSlideshow() {
    const images = Array.from(document.querySelectorAll(".project-image"));
    if (images.length === 0) return;

    let currentSlide = 0;
    const slideshowModal = document.createElement("div");
    slideshowModal.className =
      "fixed inset-0 bg-black z-50 flex items-center justify-center";
    slideshowModal.innerHTML = `
            <div class="relative w-full h-full flex items-center justify-center">
                <img id="slideshow-image" src="${
                  images[0].src
                }" alt="" class="max-w-full max-h-full object-contain">
                <button id="prev-slide" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <button id="next-slide" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
                <button id="close-slideshow" class="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
                    <span id="slide-counter">${currentSlide + 1} / ${
      images.length
    }</span>
                </div>
            </div>
        `;

    document.body.appendChild(slideshowModal);

    const slideImage = slideshowModal.querySelector("#slideshow-image");
    const slideCounter = slideshowModal.querySelector("#slide-counter");

    const updateSlide = () => {
      slideImage.src = images[currentSlide].src;
      slideImage.alt = images[currentSlide].alt;
      slideCounter.textContent = `${currentSlide + 1} / ${images.length}`;
    };

    // Navigation
    slideshowModal.querySelector("#prev-slide").onclick = () => {
      currentSlide = currentSlide > 0 ? currentSlide - 1 : images.length - 1;
      updateSlide();
    };

    slideshowModal.querySelector("#next-slide").onclick = () => {
      currentSlide = currentSlide < images.length - 1 ? currentSlide + 1 : 0;
      updateSlide();
    };

    slideshowModal.querySelector("#close-slideshow").onclick = () => {
      slideshowModal.remove();
    };

    // Keyboard navigation
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          slideshowModal.querySelector("#prev-slide").click();
          break;
        case "ArrowRight":
          slideshowModal.querySelector("#next-slide").click();
          break;
        case "Escape":
          slideshowModal.querySelector("#close-slideshow").click();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    // Clean up event listener when modal is removed
    const originalRemove = slideshowModal.remove;
    slideshowModal.remove = function () {
      document.removeEventListener("keydown", handleKeyPress);
      originalRemove.call(this);
    };

    // Auto-advance slideshow (optional)
    const autoAdvance = setInterval(() => {
      slideshowModal.querySelector("#next-slide").click();
    }, 5000);

    // Stop auto-advance when modal is closed
    slideshowModal.addEventListener("DOMNodeRemoved", () => {
      clearInterval(autoAdvance);
    });
  }

  // Performance optimization: Virtual scrolling for large portfolios
  initVirtualScrolling() {
    const grid = document.getElementById("portfolio-grid");
    if (!grid || grid.children.length < 50) return; // Only for large portfolios

    const itemHeight = 400; // Approximate item height
    const containerHeight = window.innerHeight;
    const visibleItems = Math.ceil(containerHeight / itemHeight) + 2;

    let scrollTop = 0;
    let startIndex = 0;
    let endIndex = visibleItems;

    const allItems = Array.from(grid.children);
    const visibleContainer = document.createElement("div");
    visibleContainer.style.height = `${allItems.length * itemHeight}px`;

    grid.innerHTML = "";
    grid.appendChild(visibleContainer);

    const updateVisibleItems = () => {
      const newStartIndex = Math.floor(scrollTop / itemHeight);
      const newEndIndex = Math.min(
        newStartIndex + visibleItems,
        allItems.length
      );

      if (newStartIndex !== startIndex || newEndIndex !== endIndex) {
        startIndex = newStartIndex;
        endIndex = newEndIndex;

        visibleContainer.innerHTML = "";
        for (let i = startIndex; i < endIndex; i++) {
          const item = allItems[i].cloneNode(true);
          item.style.transform = `translateY(${i * itemHeight}px)`;
          visibleContainer.appendChild(item);
        }
      }
    };

    window.addEventListener("scroll", () => {
      scrollTop = window.pageYOffset;
      updateVisibleItems();
    });

    updateVisibleItems(); // Initial render
  }
}

// Initialize portfolio
const portfolio = new Portfolio();

// Export for global use
window.Portfolio = Portfolio;
window.portfolio = portfolio;
