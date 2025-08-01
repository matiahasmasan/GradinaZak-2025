// components/footer.js
class Footer {
  constructor() {
    this.init();
  }

  getFooterHTML() {
    return `
          <footer class="bg-dark text-white py-12">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                      <div>
                          <div class="flex items-center space-x-3 mb-4">
                              <img src="images/utility/logo.jpg" alt="Gradina Zak" class="h-12 w-12 rounded-md">
                              <span class="text-xl font-bold">Gradina Zak</span>
                          </div>
                          <p class="text-gray-300 leading-relaxed">
                              Creăm spații verzi extraordinare cu peste 25 de ani de experiență în peisagistică și întreținere grădini în Maramureș.
                          </p>
                          <div class="mt-4">
                              <a href="https://www.facebook.com/gradinazak/" target="_blank" class="inline-flex items-center text-gray-300 hover:text-accent transition-colors">
                                  <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                  </svg>
                                  Facebook
                              </a>
                          </div>
                      </div>
                      
                      <div>
                          <h3 class="text-lg font-semibold mb-4">Servicii Principale</h3>
                          <ul class="space-y-2 text-gray-300">
                              <li><a href="portofolio.html" class="hover:text-accent transition-colors">Amenajare grădini</a></li>
                              <li><a href="portofolio.html" class="hover:text-accent transition-colors">Peisagistică</a></li>
                              <li><a href="portofolio.html" class="hover:text-accent transition-colors">Toaletare copaci</a></li>
                              <li><a href="portofolio.html" class="hover:text-accent transition-colors">Sisteme irigații</a></li>
                              <li><a href="portofolio.html" class="hover:text-accent transition-colors">Drenaje</a></li>
                              <li><a href="portofolio.html" class="hover:text-accent transition-colors">Transport materiale</a></li>
                          </ul>
                      </div>
                      
                      <div>
                          <h3 class="text-lg font-semibold mb-4">Contact</h3>
                          <div class="space-y-3 text-gray-300">
                              <p class="flex items-start">
                                  <svg class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span>Strada Dealul Grosului nr.16<br>Baia Mare, Maramureș</span>
                              </p>
                              <p class="flex items-center">
                                  <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  <a href="tel:0766431164" class="hover:text-accent transition-colors">0766 431 164</a>
                              </p>
                              <p class="flex items-center">
                                  <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  <a href="mailto:office@gradinazak.ro" class="hover:text-accent transition-colors">office@gradinazak.ro</a>
                              </p>
                              <p class="flex items-center">
                                  <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>Luni - Vineri: 8:00 - 18:00</span>
                              </p>
                          </div>
                      </div>
                  </div>
                  
                  <div class="border-t border-gray-700 pt-8">
                      <div class="flex flex-col md:flex-row justify-between items-center text-gray-300 text-sm">
                          <p>&copy; ${new Date().getFullYear()} Gradina Zak SRL. Toate drepturile rezervate.</p>
                          <p class="mt-2 md:mt-0">
                              Toate imaginile și textele sunt proprietatea Gradina Zak și nu pot fi preluate fără acordul în scris.
                          </p>
                      </div>
                  </div>
              </div>
          </footer>
      `;
  }

  init() {
    // Auto-render if footer container exists
    document.addEventListener("DOMContentLoaded", () => {
      this.render();
    });
  }

  render(containerId = "footer-container") {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = this.getFooterHTML();
    }
  }
}

// Auto-initialize
const footer = new Footer();

// Export for use in other files
window.Footer = Footer;
