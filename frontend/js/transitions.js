/**
 * CoreInventory Page Transitions
 * Handles smooth entry/exit animations between pages
 */

document.addEventListener('DOMContentLoaded', () => {
    // Add entry animation class to body
    document.body.classList.add('page-fade-in');

    // Helper to check if a URL is the current one
    const isSamePage = (href) => {
        if (!href || href === '#' || href.startsWith('javascript:')) return true;
        
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(href, window.location.href);
        
        return currentUrl.pathname === targetUrl.pathname && 
               currentUrl.search === targetUrl.search;
    };

    // Handle smooth page exits on link clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        
        if (link) {
            const href = link.getAttribute('href');
            const target = link.getAttribute('target');

            // Skip fragment links, new tabs, cross-origin, or same page
            if (!href || 
                href.startsWith('#') || 
                href.startsWith('javascript:') || 
                target === '_blank' ||
                isSamePage(href)) {
                return;
            }
            
            e.preventDefault();
            window.smoothNavigate(href);
        }
    });

    // Expose a manual navigation function for JS-based routing
    window.smoothNavigate = (href) => {
        // Double check same-page to prevent animation sticking
        if (isSamePage(href) && href !== window.location.href) {
            window.location.href = href;
            return;
        }

        document.body.classList.add('page-fade-out');
        
        // Safety timeout to prevent getting stuck if navigation fails
        const safetyTimeout = setTimeout(() => {
            window.location.href = href;
        }, 500);

        // Listen for pagehide to clear if possible (though we are navigating)
        window.addEventListener('pagehide', () => clearTimeout(safetyTimeout));
    };
});
