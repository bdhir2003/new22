// Enhanced Portfolio JavaScript with Modern Features

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections for fade-in animation
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Also observe cards and other elements
    const cards = document.querySelectorAll('.project-card, .skill-category, .education-item');
    cards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
});

// Enhanced navigation background on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Update navigation background
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.backdropFilter = 'blur(20px)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.9)';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.boxShadow = 'none';
    }
    
    // Update active navigation link
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Enhanced contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name') || this.querySelector('input[type="text"]')?.value;
        const email = formData.get('email') || this.querySelector('input[type="email"]')?.value;
        const message = formData.get('message') || this.querySelector('textarea')?.value;
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        this.reset();
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '300px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-out',
        backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Enhanced typing animation for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation
document.addEventListener('DOMContentLoaded', () => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        setTimeout(() => typeWriter(subtitle, text, 50), 1000);
    }
});

// Default portfolio data to show when localStorage is empty
const defaultPortfolioData = {
    hero: {
        name: 'Mamello Makhele',
        title: 'Computer Science Student',
        tagline: 'Passionate about AI, Machine Learning, and Software Development'
    },
    personal: {
        fullName: 'Mamello Makhele'
    },
    about: {
        description: 'I am a dedicated Computer Science student with a passion for artificial intelligence and machine learning. I enjoy working on innovative projects that solve real-world problems and am always eager to learn new technologies.',
        profileImage: 'https://via.placeholder.com/300x300/667eea/ffffff?text=MM'
    },
    education: [
        {
            id: '1',
            institution: 'University of Nebraska at Omaha',
            degree: 'Bachelor of Science in Computer Science',
            year: '2022-2026',
            description: 'Focusing on Artificial Intelligence and Machine Learning'
        }
    ],
    skills: {
        'Programming Languages': ['Python', 'JavaScript', 'Java', 'C++'],
        'Web Development': ['HTML', 'CSS', 'React', 'Node.js'],
        'Data Science': ['Machine Learning', 'Data Analysis', 'Statistics'],
        'Tools & Technologies': ['Git', 'VS Code', 'MongoDB', 'SQL']
    },
    projects: [
        {
            id: '1',
            title: 'AI Fairness in Healthcare',
            description: 'Research project analyzing bias in machine learning models used for healthcare predictions.',
            technologies: ['Python', 'Scikit-learn', 'Pandas'],
            link: '#'
        },
        {
            id: '2',
            title: 'Student Portfolio Website',
            description: 'Modern, responsive portfolio website with admin panel for content management.',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            link: '#'
        }
    ],
    contact: {
        email: 'mamello.makhele@example.com',
        linkedin: 'linkedin.com/in/mamellomakhele'
    }
};

// Load all portfolio data from localStorage (enhanced version)
function loadAllPortfolioData() {
    const savedData = localStorage.getItem('portfolioData');
    let data = defaultPortfolioData; // Start with default data
    
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            // Merge saved data with default data, giving priority to saved data
            data = { ...defaultPortfolioData, ...parsedData };
            console.log('Loading saved portfolio data:', data); // Debug log
        } catch (e) {
            console.warn('Failed to load portfolio data, using defaults:', e);
        }
    } else {
        console.log('No saved data found, using default portfolio data');
    }
    
    // Load all sections with data (either saved or default)
    loadPersonalData(data);
    loadAboutData(data);
    loadEducationData(data);
    loadSkillsData(data);
    loadProjectsData(data);
    loadPublicationsData(data);
    loadPodcastsData(data);
    loadVideosData(data);
    loadAwardsData(data);
    loadContactData(data);
}

// Load personal information (enhanced)
function loadPersonalData(data) {
    if (!data.personal && !data.hero) return;
    
    // Determine which data to use - hero data takes precedence for home section
    const heroData = data.hero || {};
    const personalData = data.personal || {};
    
    // Update navigation name (always use personal name)
    const navName = document.getElementById('navName');
    if (navName && personalData.fullName) {
        navName.textContent = personalData.fullName;
    }
    
    // Update home section - use hero data if available, fallback to personal data
    const homeName = document.getElementById('homeName');
    if (homeName) {
        const name = heroData.name || personalData.fullName;
        if (name && name.trim() && name !== 'Your Name') {
            homeName.textContent = name;
        }
    }
    
    // Update home title
    const homeTitle = document.getElementById('homeTitle');
    if (homeTitle && heroData.title) {
        homeTitle.textContent = heroData.title;
    }
    
    // Update home tagline
    const homeTagline = document.getElementById('homeTagline');
    if (homeTagline && heroData.tagline) {
        homeTagline.textContent = heroData.tagline;
    }
    
    // Update footer name
    const footerName = document.getElementById('footerName');
    if (footerName && personalData.fullName) {
        footerName.textContent = personalData.fullName;
    }
    
    // Update profile image
    const profileImg = document.getElementById('profileImage');
    if (profileImg && data.about && data.about.profileImage) {
        profileImg.src = data.about.profileImage;
    }
}

// Load about information (enhanced)
function loadAboutData(data) {
    if (!data.about) return;
    
    const aboutDescription = document.getElementById('aboutDescription');
    if (aboutDescription && data.about.description) {
        aboutDescription.textContent = data.about.description;
    }
}

// Load education data with enhanced styling
function loadEducationData(data) {
    if (!data.education || !Array.isArray(data.education)) return;
    
    const educationList = document.getElementById('educationList');
    if (!educationList) return;
    
    educationList.innerHTML = '';
    
    data.education.forEach((edu, index) => {
        const educationItem = document.createElement('div');
        educationItem.className = 'education-item fade-in';
        educationItem.style.animationDelay = `${index * 0.1}s`;
        
        // Format date display
        let dateRange = '';
        if (edu.startMonth && edu.startYear) {
            const startMonth = getMonthName(edu.startMonth);
            dateRange += `${startMonth} ${edu.startYear}`;
        } else if (edu.startYear) {
            dateRange += edu.startYear;
        }
        
        if (edu.endMonth && edu.endYear) {
            const endMonth = getMonthName(edu.endMonth);
            dateRange += ` - ${endMonth} ${edu.endYear}`;
        } else if (edu.endYear) {
            dateRange += ` - ${edu.endYear}`;
        }
        
        // Fallback to old format for backward compatibility
        if (!dateRange && edu.startYear && edu.endYear) {
            dateRange = `${edu.startYear} - ${edu.endYear}`;
        }
        
        if (!dateRange) {
            dateRange = 'Date not specified';
        }
        
        educationItem.innerHTML = `
            <div class="education-content">
                <h3>${edu.degree}</h3>
                <p class="education-institution">${edu.institution}</p>
                <p class="education-date">${dateRange}</p>
                ${edu.description ? `<p class="education-description">${edu.description}</p>` : ''}
            </div>
        `;
        educationList.appendChild(educationItem);
        
        // Add to observer for animations
        observer.observe(educationItem);
    });
}

// Helper function to get month name
function getMonthName(monthNumber) {
    const months = {
        '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
        '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
        '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
    };
    return months[monthNumber] || monthNumber;
}

// Load skills data with enhanced display
function loadSkillsData(data) {
    const allSkillsContainer = document.getElementById('allSkills');
    if (!allSkillsContainer) return;
    
    allSkillsContainer.innerHTML = '';
    
    // Handle new individual skills format (array of objects)
    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
        data.skills.forEach((skill, index) => {
            const skillElement = document.createElement('span');
            skillElement.className = 'skill fade-in';
            skillElement.style.animationDelay = `${index * 0.05}s`;
            skillElement.textContent = skill.name ? skill.name.trim() : skill.trim();
            allSkillsContainer.appendChild(skillElement);
        });
    }
    // Handle object format with categories (like default data)
    else if (data.skills && typeof data.skills === 'object' && !Array.isArray(data.skills)) {
        let skillIndex = 0;
        Object.keys(data.skills).forEach(category => {
            if (Array.isArray(data.skills[category])) {
                // Add category header
                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'skill-category-header';
                categoryHeader.textContent = category;
                allSkillsContainer.appendChild(categoryHeader);
                
                // Add skills in this category
                data.skills[category].forEach(skill => {
                    const skillElement = document.createElement('span');
                    skillElement.className = 'skill fade-in';
                    skillElement.style.animationDelay = `${skillIndex * 0.05}s`;
                    skillElement.textContent = skill.trim();
                    allSkillsContainer.appendChild(skillElement);
                    skillIndex++;
                });
            }
        });
    }
    // Handle old simplified format (array of strings)
    else if (data.skills && data.skills.all && Array.isArray(data.skills.all) && data.skills.all.length > 0) {
        data.skills.all.forEach((skill, index) => {
            const skillElement = document.createElement('span');
            skillElement.className = 'skill fade-in';
            skillElement.style.animationDelay = `${index * 0.05}s`;
            skillElement.textContent = skill.trim();
            allSkillsContainer.appendChild(skillElement);
        });
    }
}

// Load projects data with enhanced cards
function loadProjectsData(data) {
    if (!data.projects || !Array.isArray(data.projects)) return;
    
    const projectsGrid = document.getElementById('projectsGrid');
    
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    
    // If no projects at all, show a message
    if (data.projects.length === 0) {
        projectsGrid.innerHTML = '<div class="no-content">No projects available yet. Use the admin panel to add your projects!</div>';
        return;
    }
    
    // Display all projects with enhanced styling
    data.projects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        projectsGrid.appendChild(projectCard);
    });
}

// Enhanced helper function to create project card
function createProjectCard(project, index = 0) {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card fade-in';
    projectCard.style.animationDelay = `${index * 0.1}s`;
    
    projectCard.innerHTML = `
        <h3>${project.name}</h3>
        <p class="project-description">${project.description}</p>
        ${(project.technologies && project.technologies.length > 0) ? `
            <div class="project-tech">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        ` : ''}
        <div class="project-links">
            ${project.url ? `<a href="${project.url}" target="_blank" rel="noopener" class="project-link">View Project</a>` : ''}
            ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="project-link secondary">View Code</a>` : ''}
        </div>
    `;
    
    // Add to observer for animations
    observer.observe(projectCard);
    
    return projectCard;
}

// Load contact data (enhanced)
function loadContactData(data) {
    if (!data.contact) return;
    
    const contactEmail = document.getElementById('contactEmail');
    if (contactEmail && data.contact.email) {
        contactEmail.textContent = data.contact.email;
    }
    
    const contactLinkedin = document.getElementById('contactLinkedin');
    if (contactLinkedin && data.contact.linkedin) {
        contactLinkedin.innerHTML = `<a href="${data.contact.linkedin}" target="_blank" rel="noopener">${data.contact.linkedin.replace('https://', '')}</a>`;
    }
}

// Load publications data with enhanced styling
function loadPublicationsData(data) {
    if (!data.publications || !Array.isArray(data.publications)) return;
    
    const publicationsList = document.getElementById('publicationsList');
    if (!publicationsList) return;
    
    publicationsList.innerHTML = '';
    
    if (data.publications.length === 0) {
        publicationsList.innerHTML = '<div class="no-content">No publications available yet.</div>';
        return;
    }
    
    data.publications.forEach((publication, index) => {
        const publicationItem = document.createElement('div');
        publicationItem.className = 'content-card fade-in';
        publicationItem.style.animationDelay = `${index * 0.1}s`;
        
        publicationItem.innerHTML = `
            <h3>${publication.title}</h3>
            <p class="content-meta">${publication.journal} • ${new Date(publication.date).getFullYear()}</p>
            <p class="content-authors">By: ${publication.authors}</p>
            <p>${publication.abstract}</p>
            ${publication.doi ? `<p class="content-doi">DOI: ${publication.doi}</p>` : ''}
            ${publication.url ? `<a href="${publication.url}" target="_blank" rel="noopener" class="content-link">Read Paper</a>` : ''}
        `;
        
        publicationsList.appendChild(publicationItem);
        observer.observe(publicationItem);
    });
}

// Load podcasts data with enhanced styling
function loadPodcastsData(data) {
    if (!data.podcasts || !Array.isArray(data.podcasts)) return;
    
    const podcastsList = document.getElementById('podcastsList');
    if (!podcastsList) return;
    
    podcastsList.innerHTML = '';
    
    if (data.podcasts.length === 0) {
        podcastsList.innerHTML = '<div class="no-content">No podcast appearances available yet.</div>';
        return;
    }
    
    data.podcasts.forEach((podcast, index) => {
        const podcastItem = document.createElement('div');
        podcastItem.className = 'content-card fade-in';
        podcastItem.style.animationDelay = `${index * 0.1}s`;
        
        podcastItem.innerHTML = `
            <h3>${podcast.title}</h3>
            <p class="content-meta">${podcast.show} • ${podcast.platform}</p>
            <p class="content-meta">${new Date(podcast.date).toLocaleDateString()} • Hosted by: ${podcast.host}</p>
            <p>${podcast.description}</p>
            <a href="${podcast.url}" target="_blank" rel="noopener" class="content-link">Listen</a>
        `;
        
        podcastsList.appendChild(podcastItem);
        observer.observe(podcastItem);
    });
}

// Load videos data with enhanced styling
function loadVideosData(data) {
    if (!data.videos || !Array.isArray(data.videos)) return;
    
    const videosList = document.getElementById('videosList');
    if (!videosList) return;
    
    videosList.innerHTML = '';
    
    if (data.videos.length === 0) {
        videosList.innerHTML = '<div class="no-content">No video case studies available yet.</div>';
        return;
    }
    
    data.videos.forEach((video, index) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'content-card fade-in';
        videoItem.style.animationDelay = `${index * 0.1}s`;
        
        // Check if it's a YouTube URL and create embed
        const embedUrl = getYouTubeEmbedUrl(video.url);
        
        videoItem.innerHTML = `
            ${embedUrl ? 
                `<div class="video-container">
                    <iframe src="${embedUrl}" 
                        title="${video.title}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>` : ''
            }
            <h3>${video.title}</h3>
            ${!embedUrl ? `<a href="${video.url}" target="_blank" rel="noopener" class="content-link">Watch Video</a>` : ''}
        `;
        
        videosList.appendChild(videoItem);
        observer.observe(videoItem);
    });
}

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url) {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    let videoId = null;
    
    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
        return url; // Already an embed URL
    }
    
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return null;
}

// Load awards data with enhanced styling
function loadAwardsData(data) {
    if (!data.awards || !Array.isArray(data.awards)) {
        const awardsList = document.getElementById('awardsList');
        if (awardsList) {
            awardsList.innerHTML = '<div class="no-content">No awards available yet.</div>';
        }
        return;
    }
    
    const awardsList = document.getElementById('awardsList');
    if (!awardsList) return;
    
    awardsList.innerHTML = '';
    
    if (data.awards.length === 0) {
        awardsList.innerHTML = '<div class="no-content">No awards available yet.</div>';
        return;
    }
    
    data.awards.forEach((award, index) => {
        const awardCard = document.createElement('div');
        awardCard.className = 'content-card fade-in';
        awardCard.style.animationDelay = `${index * 0.1}s`;
        
        awardCard.innerHTML = `
            <h3>${award.title}</h3>
            <p class="content-meta">${award.organization} • ${award.category || 'Achievement'}</p>
            <p class="content-meta">${new Date(award.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
            <p>${award.description}</p>
            ${award.url ? `<a href="${award.url}" target="_blank" rel="noopener" class="content-link">View Certificate</a>` : ''}
        `;
        
        awardsList.appendChild(awardCard);
        observer.observe(awardCard);
    });
}

// Enhanced page loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    // Load all data
    loadAllPortfolioData();
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('Enhanced Student Portfolio Website Loaded Successfully! 🎉');
});
