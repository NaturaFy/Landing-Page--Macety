// Tab navigation and dynamic content loading
class TabManager {
    constructor() {
        this.tabLinks = document.querySelectorAll('.tab-link');
        this.tabContainer = document.getElementById('tab-container');
        this.currentTab = 'hero'; // Default tab
        this.cache = new Map(); // Cache loaded content
        this.autoScrollEnabled = true;
        this.scrollTimeout = null;
        this.isScrolling = false;
        this.lastScrollTime = 0;
        this.tabOrder = ['hero', 'funcionalidades', 'comunidad', 'recursos', 'contact'];
        this.currentTabIndex = 0;
        
        this.init();
    }

    init() {
        // Hide tab container initially to prevent flash
        this.tabContainer.style.opacity = '0';
        
        // Load initial content
        this.loadTabContent('hero', true);
        
        // Add event listeners to tab links
        this.tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleTabClick(link);
            });
        });

        // Add scroll event listener for auto navigation
        this.setupScrollNavigation();
        
        // Add keyboard navigation
        this.setupKeyboardNavigation();
        
        // Show content after everything is loaded
        setTimeout(() => {
            this.tabContainer.style.opacity = '1';
            this.tabContainer.classList.add('loaded');
        }, 150);
    }

    handleTabClick(clickedLink) {
        // Temporarily disable auto-scroll when user clicks manually
        this.autoScrollEnabled = false;
        
        // Remove active class from all links
        this.tabLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        clickedLink.classList.add('active');
        
        // Get tab ID and load content
        const tabId = clickedLink.getAttribute('data-tab');
        this.currentTabIndex = this.tabOrder.indexOf(tabId);
        this.loadTabContent(tabId);
        
        // Update footer visibility
        this.updateFooterVisibility(this.currentTabIndex);
        
        // Update scroll indicator
        if (window.updateScrollIndicator) {
            window.updateScrollIndicator(this.currentTabIndex);
        }
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Re-enable auto-scroll after a delay
        setTimeout(() => {
            this.autoScrollEnabled = true;
        }, 2000);
    }

    async loadTabContent(tabId, isInitial = false) {
        // Check if content is already cached
        if (this.cache.has(tabId)) {
            this.displayContent(this.cache.get(tabId), isInitial);
            this.currentTab = tabId;
            return;
        }

        try {
            // Show loading state
            if (!isInitial) {
                this.tabContainer.innerHTML = '<div class="loading">Cargando...</div>';
            }

            // Map tab IDs to file names
            const tabFiles = {
                'hero': 'inicio.html',
                'funcionalidades': 'productos.html',
                'comunidad': 'comunidad.html',
                'recursos': 'recursos.html',
                'contact': 'contacto.html'
            };

            const fileName = tabFiles[tabId];
            if (!fileName) {
                throw new Error(`Tab file not found for: ${tabId}`);
            }

            // Fetch content from file
            const response = await fetch(`./tabs/${fileName}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${fileName}`);
            }

            const content = await response.text();
            
            // Cache the content
            this.cache.set(tabId, content);
            
            // Display the content
            this.displayContent(content, isInitial);
            this.currentTab = tabId;

        } catch (error) {
            console.error('Error loading tab content:', error);
            this.displayError(tabId);
        }
    }

    displayContent(content, isInitial = false) {
        // Clear existing content first
        this.tabContainer.innerHTML = '';
        
        // Add new content
        this.tabContainer.innerHTML = content;
        
        // Add enhanced fade-in animation for better UX
        if (!isInitial) {
            this.tabContainer.style.opacity = '0';
            this.tabContainer.style.transform = 'translateY(30px)';
            setTimeout(() => {
                this.tabContainer.style.opacity = '1';
                this.tabContainer.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    setupScrollNavigation() {
        let ticking = false;

        window.addEventListener('wheel', (e) => {
            if (!this.autoScrollEnabled || this.isScrolling) return;

            const now = Date.now();
            if (now - this.lastScrollTime < 1000) return; // Throttle scroll events

            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll(e);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: false });

        // Touch events for mobile
        let touchStartY = 0;
        let touchEndY = 0;

        window.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            if (!this.autoScrollEnabled || this.isScrolling) return;

            touchEndY = e.changedTouches[0].screenY;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaY) > 50) { // Minimum swipe distance
                if (deltaY > 0) {
                    this.nextTab();
                } else {
                    this.prevTab();
                }
            }
        }, { passive: true });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.autoScrollEnabled || this.isScrolling) return;

            switch(e.key) {
                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    this.nextTab();
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.prevTab();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToTab(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToTab(this.tabOrder.length - 1);
                    break;
            }
        });
    }

    handleScroll(e) {
        const deltaY = e.deltaY;
        
        if (deltaY > 0) {
            // Scrolling down
            this.nextTab();
        } else if (deltaY < 0) {
            // Scrolling up
            this.prevTab();
        }
    }

    nextTab() {
        if (this.currentTabIndex < this.tabOrder.length - 1) {
            this.goToTab(this.currentTabIndex + 1);
        }
    }

    prevTab() {
        if (this.currentTabIndex > 0) {
            this.goToTab(this.currentTabIndex - 1);
        }
    }

    goToTab(index) {
        if (index >= 0 && index < this.tabOrder.length && index !== this.currentTabIndex) {
            this.currentTabIndex = index;
            const tabId = this.tabOrder[index];
            
            // Update navigation
            this.updateActiveNav(tabId);
            
            // Control footer visibility
            this.updateFooterVisibility(index);
            
            // Load content with enhanced animation
            this.loadTabContentWithAnimation(tabId);
            
            this.lastScrollTime = Date.now();
        }
    }

    updateFooterVisibility(tabIndex) {
        const footer = document.querySelector('footer');
        const isLastTab = tabIndex === this.tabOrder.length - 1;
        
        if (footer) {
            if (isLastTab) {
                footer.classList.add('show');
            } else {
                footer.classList.remove('show');
            }
        }
    }

    updateActiveNav(tabId) {
        this.tabLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-tab') === tabId) {
                link.classList.add('active');
            }
        });
    }

    async loadTabContentWithAnimation(tabId) {
        this.isScrolling = true;
        
        // Add exit animation
        this.tabContainer.style.opacity = '0';
        this.tabContainer.style.transform = 'translateY(-20px)';
        
        setTimeout(async () => {
            await this.loadTabContent(tabId);
            this.currentTab = tabId;
            
            setTimeout(() => {
                this.isScrolling = false;
            }, 600); // Allow animation to complete
        }, 300);
    }

    displayError(tabId) {
        this.tabContainer.innerHTML = `
            <div class="error-message">
                <h2>Error al cargar el contenido</h2>
                <p>No se pudo cargar la pestaña "${tabId}". Por favor, intenta de nuevo.</p>
                <button onclick="location.reload()" class="btn-primary">Recargar página</button>
            </div>
        `;
    }
}

// Initialize tab manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const tabManager = new TabManager();
    
    // Add scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    
    const tabOrder = ['hero', 'funcionalidades', 'comunidad', 'recursos', 'contact'];
    const tabNames = ['Inicio', 'Productos', 'Comunidad', 'Recursos', 'Contacto'];
    
    tabOrder.forEach((tab, index) => {
        const dot = document.createElement('div');
        dot.className = `scroll-dot ${index === 0 ? 'active' : ''}`;
        dot.title = tabNames[index];
        dot.addEventListener('click', () => {
            tabManager.goToTab(index);
            updateScrollIndicator(index);
        });
        scrollIndicator.appendChild(dot);
    });
    
    document.body.appendChild(scrollIndicator);
    document.body.classList.add('auto-scroll-mode');
    
    // Function to update scroll indicator
    window.updateScrollIndicator = (activeIndex) => {
        const dots = scrollIndicator.querySelectorAll('.scroll-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    };
    
    // Update indicator when tab changes
    const originalGoToTab = tabManager.goToTab.bind(tabManager);
    tabManager.goToTab = function(index) {
        originalGoToTab(index);
        updateScrollIndicator(index);
    };
});

// Add CSS for loading and error states
const style = document.createElement('style');
style.textContent = `
    .loading {
        text-align: center;
        padding: 4rem 2rem;
        font-size: 1.2rem;
        color: #666;
        margin-top: 80px;
    }

    .error-message {
        text-align: center;
        padding: 4rem 2rem;
        margin-top: 80px;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .error-message h2 {
        color: #e74c3c;
        margin-bottom: 1rem;
    }

    .error-message p {
        color: #666;
        margin-bottom: 2rem;
    }

    #tab-container {
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform-origin: center center;
    }

    /* Auto-scroll indicator */
    .scroll-indicator {
        position: fixed;
        right: 2rem;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1001;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .scroll-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid rgba(76, 175, 80, 0.3);
    }

    .scroll-dot.active {
        background: #4CAF50;
        border-color: #4CAF50;
        transform: scale(1.2);
    }

    .scroll-dot:hover {
        background: rgba(76, 175, 80, 0.8);
        transform: scale(1.1);
    }

    /* Enhanced animations */
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInFromBottom {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Disable scroll on body when auto-scroll is active */
    body.auto-scroll-mode {
        overflow: hidden;
    }

    /* Mobile optimizations */
    @media (max-width: 768px) {
        .scroll-indicator {
            right: 1rem;
            gap: 0.3rem;
        }
        
        .scroll-dot {
            width: 10px;
            height: 10px;
        }
    }
`;
document.head.appendChild(style);