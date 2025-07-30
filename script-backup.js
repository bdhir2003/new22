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

// Add scroll effect to navigation
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.background = '#fff';
    }
});

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.project-card, .about-text, .contact-content');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);

// Handle contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show success message (in real deployment, you'd send this to a server)
    alert('Thank you for your message! I\'ll get back to you soon.');
    
    // Reset form
    this.reset();
});

// Add typing effect to the home section
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

// Initialize typing effect when page loads
window.addEventListener('load', function() {
    const homeTitle = document.querySelector('.home-content h1');
    if (homeTitle) {
        const originalText = homeTitle.textContent;
        typeWriter(homeTitle, originalText, 50);
    }
    
    // Load all data from localStorage
    loadAllPortfolioData();
});

// Load all portfolio data from localStorage
function loadAllPortfolioData() {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            console.log('Loading portfolio data:', data); // Debug log
            
            // Load personal information
            loadPersonalData(data);
            
            // Load about information
            loadAboutData(data);
            
            // Load education data
            loadEducationData(data);
            
            // Load skills data
            loadSkillsData(data);
            
            // Load projects data
            loadProjectsData(data);
            
            // Load publications data
            loadPublicationsData(data);
            
            // Load podcasts data
            loadPodcastsData(data);
            
            // Load videos data
            loadVideosData(data);
            
            // Load awards data
            loadAwardsData(data);
            
            // Load contact data
            loadContactData(data);
            
        } catch (e) {
            console.warn('Failed to load portfolio data:', e);
        }
    }
}

// Load personal information
function loadPersonalData(data) {
    if (!data.personal) return;
    
    // Determine which data to use - hero data takes precedence for home section
    const heroData = data.hero || {};
    const personalData = data.personal;
    
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
        } else {
            homeName.textContent = 'Add your name in admin panel';
            homeName.className = 'no-content';
        }
    }
    
    const homeTitle = document.getElementById('homeTitle');
    if (homeTitle) {
        const title = heroData.title || personalData.title;
        if (title && title.trim()) {
            homeTitle.textContent = title;
            homeTitle.className = '';
        } else {
            homeTitle.textContent = 'Add your title in the admin panel';
            homeTitle.className = 'no-content';
        }
    }
    
    const homeTagline = document.getElementById('homeTagline');
    if (homeTagline) {
        const tagline = heroData.tagline || personalData.tagline;
        if (tagline && tagline.trim()) {
            homeTagline.textContent = tagline;
            homeTagline.className = '';
        } else {
            homeTagline.textContent = 'Add your tagline in the admin panel';
            homeTagline.className = 'no-content';
        }
    }
    
    // Update hero subtitle if it exists
    const homeSubtitle = document.getElementById('homeSubtitle');
    if (homeSubtitle) {
        if (heroData.subtitle && heroData.subtitle.trim()) {
            homeSubtitle.textContent = heroData.subtitle;
            homeSubtitle.style.display = 'block';
        } else {
            homeSubtitle.style.display = 'none';
        }
    }
    
    // Update hero button
    const heroButton = document.querySelector('.home .btn');
    if (heroButton) {
        heroButton.textContent = heroData.buttonText || 'Learn More About Me';
        heroButton.href = heroData.buttonUrl || '#about';
    }
    
    // Update profile image
    const profileImg = document.getElementById('profileImage');
    if (profileImg && personalData.profileImage && personalData.profileImage.trim() !== '') {
        profileImg.src = personalData.profileImage;
        profileImg.onerror = function() {
            // If image fails to load, revert to placeholder
            this.src = 'https://via.placeholder.com/300x300/3498db/ffffff?text=Your+Photo';
        };
    }
}

// Load about information
function loadAboutData(data) {
    if (!data.about) return;
    
    const aboutDescription = document.getElementById('aboutDescription');
    if (aboutDescription) {
        if (data.about.description && data.about.description.trim()) {
            aboutDescription.textContent = data.about.description;
        } else {
            aboutDescription.textContent = 'No description available yet. Use the admin panel to add your story!';
            aboutDescription.className = 'no-content';
        }
    }
}

// Load education data
function loadEducationData(data) {
    if (!data.education || !Array.isArray(data.education)) return;
    
    const educationList = document.getElementById('educationList');
    if (!educationList) return;
    
    educationList.innerHTML = '';
    
    data.education.forEach(edu => {
        const educationItem = document.createElement('div');
        educationItem.className = 'education-item';
        
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
            <div class="education-year">${dateRange}</div>
            <div class="education-content">
                <h3>${edu.degree}</h3>
                <p class="education-institution">${edu.institution}</p>
                ${edu.description ? `<p class="education-description">${edu.description}</p>` : ''}
            </div>
        `;
        educationList.appendChild(educationItem);
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

// Load skills data
function loadSkillsData(data) {
    const allSkillsContainer = document.getElementById('allSkills');
    if (!allSkillsContainer) return;
    
    allSkillsContainer.innerHTML = '';
    
    // Handle new individual skills format (array of objects)
    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
        data.skills.forEach(skill => {
            const skillElement = document.createElement('span');
            skillElement.className = 'skill';
            skillElement.textContent = skill.name ? skill.name.trim() : skill.trim();
            allSkillsContainer.appendChild(skillElement);
        });
    }
    // Handle old simplified format (array of strings)
    else if (data.skills && data.skills.all && Array.isArray(data.skills.all) && data.skills.all.length > 0) {
        data.skills.all.forEach(skill => {
            const skillElement = document.createElement('span');
            skillElement.className = 'skill';
            skillElement.textContent = skill.trim();
            allSkillsContainer.appendChild(skillElement);
        });
    } 
    // Handle old format for backward compatibility
    else if (data.skills && (data.skills.programming || data.skills.web || data.skills.tools)) {
        const allSkills = [
            ...(data.skills.programming || []),
            ...(data.skills.web || []),
            ...(data.skills.tools || [])
        ];
        
        if (allSkills.length > 0) {
            allSkills.forEach(skill => {
                const skillElement = document.createElement('span');
                skillElement.className = 'skill';
                skillElement.textContent = skill.trim();
                allSkillsContainer.appendChild(skillElement);
            });
        } else {
            allSkillsContainer.innerHTML = '<p class="no-content">No skills added yet. Use the admin panel to add your skills!</p>';
        }
    } else {
        allSkillsContainer.innerHTML = '<p class="no-content">No skills added yet. Use the admin panel to add your skills!</p>';
    }
}

// Load projects data
function loadProjectsData(data) {
    if (!data.projects || !Array.isArray(data.projects)) return;
    
    const projectsGrid = document.getElementById('projectsGrid');
    
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    
    // If no projects at all, show a message
    if (data.projects.length === 0) {
        projectsGrid.innerHTML = '<p class="no-content">No projects available yet. Use the admin panel to add your projects!</p>';
        return;
    }
    
    // Display all projects
    data.projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

// Helper function to create project card
function createProjectCard(project) {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <div class="project-tech">
            ${(project.technologies || []).map(tech => `<span>${tech}</span>`).join('')}
        </div>
        ${project.url ? `<div class="project-links"><a href="${project.url}" target="_blank" class="btn btn-small">View Project</a></div>` : ''}
        ${project.github ? `<div class="project-links"><a href="${project.github}" target="_blank" class="btn btn-small">View Code</a></div>` : ''}
    `;
    return projectCard;
}

// Load contact data
function loadContactData(data) {
    if (!data.contact) return;
    
    const contactEmail = document.getElementById('contactEmail');
    if (contactEmail && data.contact.email) {
        contactEmail.textContent = data.contact.email;
    }
    
    const contactLinkedin = document.getElementById('contactLinkedin');
    if (contactLinkedin && data.contact.linkedin) {
        contactLinkedin.innerHTML = `<a href="${data.contact.linkedin}" target="_blank">${data.contact.linkedin.replace('https://', '')}</a>`;
    }
}

// Load publications data
function loadPublicationsData(data) {
    if (!data.publications || !Array.isArray(data.publications)) return;
    
    const publicationsList = document.getElementById('publicationsList');
    if (!publicationsList) return;
    
    publicationsList.innerHTML = '';
    
    if (data.publications.length === 0) {
        publicationsList.innerHTML = '<p class="no-content">No publications available yet.</p>';
        return;
    }
    
    data.publications.forEach(publication => {
        const publicationItem = document.createElement('div');
        publicationItem.className = 'publication-card';
        publicationItem.innerHTML = `
            <div class="publication-header">
                <h3>${publication.title}</h3>
                <span class="publication-date">${new Date(publication.date).getFullYear()}</span>
            </div>
            <p class="publication-journal">${publication.journal}</p>
            <p class="publication-authors">By: ${publication.authors}</p>
            <p class="publication-description">${publication.abstract}</p>
            ${publication.doi ? `<p class="publication-doi">DOI: ${publication.doi}</p>` : ''}
            <div class="publication-links">
                ${publication.url ? `<a href="${publication.url}" target="_blank" class="btn btn-small">Read Paper</a>` : ''}
            </div>
        `;
        publicationsList.appendChild(publicationItem);
    });
}

// Load podcasts data
function loadPodcastsData(data) {
    if (!data.podcasts || !Array.isArray(data.podcasts)) return;
    
    const podcastsList = document.getElementById('podcastsList');
    if (!podcastsList) return;
    
    podcastsList.innerHTML = '';
    
    if (data.podcasts.length === 0) {
        podcastsList.innerHTML = '<p class="no-content">No podcast appearances available yet.</p>';
        return;
    }
    
    data.podcasts.forEach(podcast => {
        const podcastItem = document.createElement('div');
        podcastItem.className = 'podcast-card';
        podcastItem.innerHTML = `
            <div class="podcast-image">
                <img src="https://via.placeholder.com/300x200/34495e/ffffff?text=Podcast" alt="Podcast Cover">
            </div>
            <div class="podcast-content">
                <h3>${podcast.title}</h3>
                <p class="podcast-show">${podcast.show}</p>
                <p class="podcast-date">${new Date(podcast.date).toLocaleDateString()}</p>
                <p class="podcast-host">Hosted by: ${podcast.host}</p>
                <p class="podcast-description">${podcast.description}</p>
                <p class="podcast-platform">Platform: ${podcast.platform}</p>
                <div class="podcast-links">
                    <a href="${podcast.url}" target="_blank" class="btn btn-small">Listen</a>
                </div>
            </div>
        `;
        podcastsList.appendChild(podcastItem);
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

// Load videos data
function loadVideosData(data) {
    if (!data.videos || !Array.isArray(data.videos)) return;
    
    const videosList = document.getElementById('videosList');
    if (!videosList) return;
    
    videosList.innerHTML = '';
    
    if (data.videos.length === 0) {
        videosList.innerHTML = '<p class="no-content">No video case studies available yet.</p>';
        return;
    }
    
    data.videos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-card';
        
        // Check if it's a YouTube URL and create embed
        const embedUrl = getYouTubeEmbedUrl(video.url);
        
        videoItem.innerHTML = `
            <div class="video-container">
                ${embedUrl ? 
                    `<iframe src="${embedUrl}" 
                        title="${video.title}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>` :
                    `<div class="video-thumbnail">
                        <img src="https://via.placeholder.com/400x225/e74c3c/ffffff?text=Video+Thumbnail" alt="Video Thumbnail">
                        <div class="play-button">▶</div>
                    </div>`
                }
            </div>
            <div class="video-content">
                <h3>${video.title}</h3>
                ${!embedUrl ? `<div class="video-links">
                    <a href="${video.url}" target="_blank" class="btn btn-small">Watch Video</a>
                </div>` : ''}
            </div>
        `;
        videosList.appendChild(videoItem);
    });
}

// Load awards data
function loadAwardsData(data) {
    if (!data.awards || !Array.isArray(data.awards)) {
        const awardsList = document.getElementById('awardsList');
        if (awardsList) {
            awardsList.innerHTML = '<p class="no-content">No awards available yet.</p>';
        }
        return;
    }
    
    const awardsList = document.getElementById('awardsList');
    if (!awardsList) return;
    
    awardsList.innerHTML = '';
    
    if (data.awards.length === 0) {
        awardsList.innerHTML = '<p class="no-content">No awards available yet.</p>';
        return;
    }
    
    data.awards.forEach(award => {
        const awardCard = document.createElement('div');
        awardCard.className = 'award-card';
        awardCard.innerHTML = `
            <div class="award-content">
                <div class="award-header">
                    <h3>${award.title}</h3>
                    <span class="award-category">${award.category || 'Achievement'}</span>
                </div>
                <p class="award-organization">${award.organization}</p>
                <p class="award-date">${new Date(award.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                <p class="award-description">${award.description}</p>
                ${award.url ? `<div class="award-links" style="margin-top: 15px;"><a href="${award.url}" target="_blank" class="btn btn-small">View Certificate</a></div>` : ''}
            </div>
        `;
        awardsList.appendChild(awardCard);
    });
}

// Add active state to navigation links based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
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

// Mobile menu functionality (if you want to add mobile menu later)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Add some interactive effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Skill tags hover effect
document.querySelectorAll('.skill').forEach(skill => {
    skill.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.4)';
    });
    
    skill.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

console.log('Student Portfolio Website Loaded Successfully! 🎉');
