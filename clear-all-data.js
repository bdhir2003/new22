// Clear all existing portfolio data and start fresh
// Run this script once to reset everything

(function() {
    'use strict';
    
    console.log('🗑️ Clearing all existing portfolio data...');
    
    // Clear all portfolio-related localStorage data
    const keysToRemove = [
        'portfolioData',
        'githubToken',
        'autoSaveEnabled',
        'adminAuthenticated',
        'adminLoginTime'
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`✅ Cleared: ${key}`);
    });
    
    // Also clear sessionStorage
    sessionStorage.clear();
    console.log('✅ Cleared session storage');
    
    console.log('🎉 All data cleared! You can now start fresh in the admin panel.');
    
    // Optional: redirect to admin to start fresh
    if (confirm('Data cleared! Go to admin panel to start adding your content?')) {
        window.location.href = '/admin-login.html';
    }
})();
