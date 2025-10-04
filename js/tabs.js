// Tab navigation and dynamic content loading
class TabManager {
    constructor() {
        this.tabLinks = document.querySelectorAll('.tab-link');
        this.tabContainer = document.getElementById('tab-container');
        this.currentTab = 'hero'; // Default tab
        this.cache = new Map(); // Cache loaded content
        
        this.init();
    }

    init() {
        // Load initial content
        this.loadTabContent('hero', true);
        
        // Add event listeners to tab links
        this.tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleTabClick(link);
            });
        });
    }

    handleTabClick(clickedLink) {
        // Remove active class from all links
        this.tabLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        clickedLink.classList.add('active');
        
        // Get tab ID and load content
        const tabId = clickedLink.getAttribute('data-tab');
        this.loadTabContent(tabId);
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        this.tabContainer.innerHTML = content;
        
        // Add fade-in animation for better UX
        if (!isInitial) {
            this.tabContainer.style.opacity = '0';
            setTimeout(() => {
                this.tabContainer.style.opacity = '1';
            }, 50);
        }
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
    new TabManager();
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
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);