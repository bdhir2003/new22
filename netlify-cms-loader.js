// Netlify CMS Content Loader
// This script loads content from markdown files created by Netlify CMS

async function loadNetlifyCMSContent() {
    try {
        // Load personal information
        const personalResponse = await fetch('/content/personal.md');
        if (personalResponse.ok) {
            const personalText = await personalResponse.text();
            const personalData = parseMarkdownFrontmatter(personalText);
            updatePersonalInfo(personalData);
        }

        // Load hero section
        const heroResponse = await fetch('/content/hero.md');
        if (heroResponse.ok) {
            const heroText = await heroResponse.text();
            const heroData = parseMarkdownFrontmatter(heroText);
            updateHeroSection(heroData);
        }

        // Load about section
        const aboutResponse = await fetch('/content/about.md');
        if (aboutResponse.ok) {
            const aboutText = await aboutResponse.text();
            const aboutData = parseMarkdownFrontmatter(aboutText);
            updateAboutSection(aboutData);
        }

        // Load settings
        const settingsResponse = await fetch('/content/settings.md');
        if (settingsResponse.ok) {
            const settingsText = await settingsResponse.text();
            const settingsData = parseMarkdownFrontmatter(settingsText);
            updateSiteSettings(settingsData);
        }

        // Load collections (education, skills, projects, etc.)
        await loadCollections();

        console.log('✅ Netlify CMS content loaded successfully!');
    } catch (error) {
        console.log('⚠️ Netlify CMS content not available, using defaults:', error);
    }
}

function parseMarkdownFrontmatter(markdownText) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
    const match = markdownText.match(frontmatterRegex);
    
    if (!match) return {};
    
    const frontmatter = match[1];
    const data = {};
    
    // Simple YAML parser for basic key-value pairs
    const lines = frontmatter.split('\n');
    let currentKey = null;
    let currentValue = '';
    let inMultiline = false;
    
    for (const line of lines) {
        if (line.trim() === '') continue;
        
        if (line.includes('|') && !inMultiline) {
            // Start of multiline string
            currentKey = line.split(':')[0].trim();
            inMultiline = true;
            currentValue = '';
        } else if (inMultiline) {
            if (line.startsWith('  ')) {
                // Continuation of multiline string
                currentValue += (currentValue ? '\n' : '') + line.substring(2);
            } else {
                // End of multiline string
                data[currentKey] = currentValue.trim();
                inMultiline = false;
                
                // Process current line as new key-value pair
                if (line.includes(':')) {
                    const [key, value] = line.split(':').map(s => s.trim());
                    data[key] = value.replace(/^["']|["']$/g, '');
                }
            }
        } else if (line.includes(':')) {
            const [key, value] = line.split(':').map(s => s.trim());
            data[key] = value.replace(/^["']|["']$/g, '');
        }
    }
    
    // Handle last multiline if exists
    if (inMultiline && currentKey) {
        data[currentKey] = currentValue.trim();
    }
    
    return data;
}

function updatePersonalInfo(data) {
    if (data.fullName) {
        const nameElements = document.querySelectorAll('.hero-name, .profile-name');
        nameElements.forEach(el => el.textContent = data.fullName);
    }
    
    if (data.email) {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.href = `mailto:${data.email}`;
            link.textContent = data.email;
        });
    }
    
    if (data.profileImage) {
        const profileImages = document.querySelectorAll('.profile-image, .hero-image');
        profileImages.forEach(img => img.src = data.profileImage);
    }
}

function updateHeroSection(data) {
    if (data.heroName) {
        const heroName = document.querySelector('.hero-name');
        if (heroName) heroName.textContent = data.heroName;
    }
    
    if (data.heroTitle) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.textContent = data.heroTitle;
    }
    
    if (data.heroTagline) {
        const heroTagline = document.querySelector('.hero-tagline');
        if (heroTagline) heroTagline.textContent = data.heroTagline;
    }
    
    if (data.heroSubtitle) {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) heroSubtitle.textContent = data.heroSubtitle;
    }
    
    if (data.heroButtonText && data.heroButtonUrl) {
        const heroButton = document.querySelector('.hero-button');
        if (heroButton) {
            heroButton.textContent = data.heroButtonText;
            heroButton.href = data.heroButtonUrl;
        }
    }
}

function updateAboutSection(data) {
    if (data.aboutText) {
        const aboutText = document.querySelector('.about-text');
        if (aboutText) {
            // Convert markdown to HTML (simple conversion)
            const htmlText = data.aboutText
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br>');
            aboutText.innerHTML = `<p>${htmlText}</p>`;
        }
    }
}

function updateSiteSettings(data) {
    if (data.siteTitle) {
        document.title = data.siteTitle;
        const titleElements = document.querySelectorAll('.site-title');
        titleElements.forEach(el => el.textContent = data.siteTitle);
    }
    
    if (data.colorScheme) {
        document.documentElement.setAttribute('data-theme', data.colorScheme);
    }
    
    if (data.metaDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = data.metaDescription;
    }
}

async function loadCollections() {
    // This would load education, skills, projects, etc.
    // For now, we'll keep the existing functionality
    console.log('Collection loading will be implemented as needed');
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', loadNetlifyCMSContent);

// Export for use in other scripts
window.loadNetlifyCMSContent = loadNetlifyCMSContent;
