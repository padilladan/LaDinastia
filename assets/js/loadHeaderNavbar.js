function loadHTML(elementId, filePath, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (!element) {
                console.error(`Element with ID ${elementId} not found`);
                return;
            }
            element.innerHTML = data;
            if (callback) callback();
        })
        .catch(error => console.error('Error loading HTML:', error));
}

function highlightActiveMenuItem() {
    var path = window.location.pathname;
    var page = path.split("/").pop();
    var navItems = document.querySelectorAll('.navbar-nav .nav-item');

    navItems.forEach(function (item) {
        var link = item.querySelector('a');
        if (link.getAttribute('href') === page) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function loadPageContent(page) {
    console.log(`Attempting to load content for: ${page}`);
    loadHTML('main-content', page, () => {
        highlightActiveMenuItem();
        console.log(`Successfully loaded content for: ${page}`);
    });
    history.pushState(null, null, page); // Update the URL without reloading the page
}

function setupNavLinks() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the default link behavior
            const page = link.getAttribute('href');
            loadPageContent(page);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Ensure the main content element exists
    const mainContentElement = document.getElementById('main-content');
    if (!mainContentElement) {
        console.error('Main content element not found');
        return;
    }

    // Ensure the navbar placeholder exists
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) {
        console.error('Navbar placeholder element not found');
        return;
    }

    // Ensure the footer placeholder exists
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) {
        console.error('Footer placeholder element not found');
        return;
    }

    loadHTML('navbar-placeholder', 'navbar.html', () => {
        setupNavLinks();

        // Load initial content based on the URL
        const initialPage = window.location.pathname.split("/").pop() || 'index.html';
        loadPageContent(initialPage);
    });

    // Load the footer
    loadHTML('footer-placeholder', 'footer.html');
});

window.addEventListener('popstate', () => {
    // Handle the browser back/forward buttons
    const page = window.location.pathname.split("/").pop();
    loadPageContent(page);
});

// Add this to force a reload and clear cache when the page is refreshed
window.addEventListener('beforeunload', () => {
    // Clear the cache and reload the page
    window.location.reload(true);
});
