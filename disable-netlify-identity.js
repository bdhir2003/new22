// Override Netlify Identity behavior completely
// This ensures any identity widgets or redirects go to our custom admin

(function() {
    'use strict';
    
    // Override any netlifyIdentity global object
    if (typeof window !== 'undefined') {
        window.netlifyIdentity = {
            on: function() { console.log('Netlify Identity disabled - using custom admin'); },
            open: function() { window.location.href = '/admin-login.html'; },
            close: function() { },
            init: function() { console.log('Netlify Identity disabled - using custom admin'); }
        };
        
        // Intercept any identity-related URLs and redirect to our admin
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        function interceptStateChange(original) {
            return function(state, title, url) {
                if (url && (url.includes('/.netlify/identity') || url.includes('/admin/accept-invite') || url.includes('/admin/login'))) {
                    console.log('Intercepted Netlify Identity redirect, going to custom admin');
                    window.location.href = '/admin-login.html';
                    return;
                }
                return original.apply(this, arguments);
            };
        }
        
        history.pushState = interceptStateChange(originalPushState);
        history.replaceState = interceptStateChange(originalReplaceState);
        
        // Also intercept direct navigation attempts
        window.addEventListener('beforeunload', function() {
            const currentUrl = window.location.href;
            if (currentUrl.includes('/.netlify/identity') || 
                currentUrl.includes('/admin/accept-invite') || 
                currentUrl.includes('/admin/login')) {
                window.location.href = '/admin-login.html';
            }
        });
        
        // Check URL on page load and redirect if needed
        document.addEventListener('DOMContentLoaded', function() {
            const currentUrl = window.location.href;
            if (currentUrl.includes('/.netlify/identity') || 
                currentUrl.includes('/admin/accept-invite') || 
                currentUrl.includes('/admin/login')) {
                console.log('Detected Netlify Identity URL, redirecting to custom admin');
                window.location.href = '/admin-login.html';
            }
        });
    }
})();
