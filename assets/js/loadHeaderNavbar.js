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
    loadHTML('main-content', page, () => {
        highlightActiveMenuItem();
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
    loadHTML('navbar-placeholder', 'navbar.html', () => {
        setupNavLinks();

        // Load initial content based on the URL
        const initialPage = window.location.pathname.split("/").pop() || 'index.html';
        loadPageContent(initialPage);
    });
});

window.addEventListener('popstate', () => {
    // Handle the browser back/forward buttons
    const page = window.location.pathname.split("/").pop();
    loadPageContent(page);
});
