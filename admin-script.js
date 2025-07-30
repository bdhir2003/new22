// Admin Panel JavaScript
class PortfolioAdmin {
    constructor() {
        this.data = {
            personal: {
                fullName: 'Mamello Makhele',
                title: '',
                tagline: '',
                profileImage: 'https://via.placeholder.com/300x300/3498db/ffffff?text=Your+Photo'
            },
            hero: {
                name: 'Mamello Makhele',
                title: '',
                tagline: '',
                subtitle: '',
                buttonText: 'Learn More About Me',
                buttonUrl: '#about'
            },
            about: {
                description: ""
            },
            education: [],
            skills: [],
            projects: [],
            contact: {
                email: 'your.email@example.com',
                phone: '+1 (555) 123-4567',
                linkedin: 'https://linkedin.com/in/yourprofile',
                github: 'https://github.com/yourusername',
                twitter: '',
                website: ''
            },
            publications: [],
            podcasts: [],
            videos: [],
            awards: [],
            settings: {
                siteTitle: 'Student Portfolio - Your Name',
                colorScheme: 'blue',
                metaDescription: 'Student portfolio showcasing projects and skills in web development'
            }
        };

        this.currentProject = null;
        this.currentEducation = null;
        this.currentPublication = null;
        this.currentPodcast = null;
        this.currentVideo = null;
        this.currentAward = null;
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.populateFields();
        this.renderProjects();
        this.renderEducation();
        this.renderSkills();
        this.renderPublications();
        this.renderPodcasts();
        this.renderVideos();
        this.renderAwards();
        
        // Ensure data is saved on initialization so the main site can access it
        this.saveData();
        
        // Clear any old cached data and ensure fresh start
        this.clearOldCachedData();
    }
    
    // Clear old cached data if structure has changed
    clearOldCachedData() {
        const savedData = localStorage.getItem('portfolioData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                // Check if we have old format data and clear it
                if (data.skills && !Array.isArray(data.skills)) {
                    console.log('Clearing old skills format');
                    this.data.skills = [];
                }
                // Save the cleaned data
                this.saveData();
            } catch (e) {
                console.warn('Error clearing old data:', e);
            }
        }
    }

    // Load data from localStorage
    loadData() {
        const savedData = localStorage.getItem('portfolioData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                this.data = { ...this.data, ...parsedData };
                console.log('Loaded data:', this.data); // Debug log
            } catch (e) {
                console.error('Failed to load saved data:', e);
                // Don't show warning message on load - just use defaults silently
            }
        } else {
            console.log('No saved data found, using defaults');
        }
    }

    // Save data to localStorage
    saveData() {
        try {
            localStorage.setItem('portfolioData', JSON.stringify(this.data));
            this.showMessage('Data saved successfully!', 'success');
            
            // Also export to static file for production use
            this.exportToStaticFile();
        } catch (e) {
            this.showMessage('Failed to save data: ' + e.message, 'error');
        }
    }

    // Export data to a static JavaScript file
    exportToStaticFile() {
        const dataContent = `// Auto-generated portfolio data - Upload this file to your website
// Generated on: ${new Date().toISOString()}

window.PORTFOLIO_DATA = ${JSON.stringify(this.data, null, 2)};

// Auto-load this data when the page loads
if (typeof loadAllPortfolioData === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        // Use static data if no localStorage data exists
        const existingData = localStorage.getItem('portfolioData');
        if (!existingData || existingData === '{}') {
            localStorage.setItem('portfolioData', JSON.stringify(window.PORTFOLIO_DATA));
        }
        // Always reload with current data
        loadAllPortfolioData();
    });
}`;

        // Create downloadable file
        const blob = new Blob([dataContent], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = 'portfolio-data.js';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showMessage('📥 Portfolio data exported! Upload portfolio-data.js to your website root.', 'info');
    }

    // Save data to localStorage silently (no notifications)
    saveDataSilently() {
        try {
            localStorage.setItem('portfolioData', JSON.stringify(this.data));
        } catch (e) {
            console.error('Failed to save data:', e);
        }
    }

    // Bind event listeners
    bindEvents() {
        // Navigation
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(link.getAttribute('href').substring(1));
                
                // Update active nav
                document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Save all button
        document.getElementById('saveAllBtn').addEventListener('click', () => {
            this.collectAllData();
            this.saveData();
        });

        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => {
            window.open('index.html', '_blank');
        });

        // Project management
        document.getElementById('addProjectBtn').addEventListener('click', () => {
            this.showProjectModal();
        });

        // Delete all projects
        document.getElementById('deleteAllProjectsBtn').addEventListener('click', () => {
            this.deleteAllProjects();
        });

        // Education management
        document.getElementById('addEducationBtn').addEventListener('click', () => {
            this.showEducationModal();
        });

        // Delete all education
        document.getElementById('deleteAllEducationBtn').addEventListener('click', () => {
            this.deleteAllEducation();
        });

        // Skills management
        document.getElementById('addSkillBtn').addEventListener('click', () => {
            this.showSkillModal();
        });

        // Delete all skills
        document.getElementById('deleteAllSkillsBtn').addEventListener('click', () => {
            this.deleteAllSkills();
        });

        // Publications management
        document.getElementById('addPublicationBtn').addEventListener('click', () => {
            this.showPublicationModal();
        });

        // Delete all publications
        document.getElementById('deleteAllPublicationsBtn').addEventListener('click', () => {
            this.deleteAllPublications();
        });

        // Podcasts management
        document.getElementById('addPodcastBtn').addEventListener('click', () => {
            this.showPodcastModal();
        });

        // Delete all podcasts
        document.getElementById('deleteAllPodcastsBtn').addEventListener('click', () => {
            this.deleteAllPodcasts();
        });

        // Videos management
        document.getElementById('addVideoBtn').addEventListener('click', () => {
            this.showVideoModal();
        });

        // Delete all videos
        document.getElementById('deleteAllVideosBtn').addEventListener('click', () => {
            this.deleteAllVideos();
        });

        // Awards management
        document.getElementById('addAwardBtn').addEventListener('click', () => {
            this.showAwardModal();
        });

        // Delete all awards
        document.getElementById('deleteAllAwardsBtn').addEventListener('click', () => {
            this.deleteAllAwards();
        });

        // Modal events
        document.querySelector('.close').addEventListener('click', () => {
            this.hideProjectModal();
        });

        document.getElementById('closeEducationModal').addEventListener('click', () => {
            this.hideEducationModal();
        });

        // Add close button event listeners for new modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    // Reset current items
                    this.currentPublication = null;
                    this.currentPodcast = null;
                    this.currentVideo = null;
                    this.currentAward = null;
                }
            });
        });

        document.querySelectorAll('.cancel-btn').forEach(cancelBtn => {
            cancelBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    // Reset current items
                    this.currentPublication = null;
                    this.currentPodcast = null;
                    this.currentVideo = null;
                    this.currentAward = null;
                }
            });
        });

        document.getElementById('cancelProjectBtn').addEventListener('click', () => {
            this.hideProjectModal();
        });

        document.getElementById('saveProjectBtn').addEventListener('click', () => {
            this.saveProject();
        });

        document.getElementById('cancelEducationBtn').addEventListener('click', () => {
            this.hideEducationModal();
        });

        document.getElementById('saveEducationEntryBtn').addEventListener('click', () => {
            this.saveEducation();
        });

        // Publication modal events
        document.getElementById('publicationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePublication();
        });

        // Podcast modal events
        document.getElementById('podcastForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePodcast();
        });

        // Video modal events
        document.getElementById('videoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveVideo();
        });

        // Award modal events
        document.getElementById('awardForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAward();
        });

        // Skills modal events
        document.getElementById('skillForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSkill();
        });

        // Save Skill button event (since button is outside form)
        document.getElementById('saveSkill').addEventListener('click', () => {
            this.saveSkill();
        });

        // Cancel Skill button event
        document.getElementById('cancelSkillBtn').addEventListener('click', () => {
            this.hideSkillModal();
        });

        // Close skill modal event
        document.getElementById('closeSkillModal').addEventListener('click', () => {
            this.hideSkillModal();
        });

        // Settings actions
        document.getElementById('exportDataBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('importDataBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                this.resetData();
            }
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const projectModal = document.getElementById('projectModal');
            const educationModal = document.getElementById('educationModal');
            const publicationModal = document.getElementById('publicationModal');
            const podcastModal = document.getElementById('podcastModal');
            const videoModal = document.getElementById('videoModal');
            
            if (e.target === projectModal) {
                this.hideProjectModal();
            } else if (e.target === educationModal) {
                this.hideEducationModal();
            } else if (e.target === publicationModal) {
                this.hidePublicationModal();
            } else if (e.target === podcastModal) {
                this.hidePodcastModal();
            } else if (e.target === videoModal) {
                this.hideVideoModal();
            }
        });

        // Auto-save on input changes (silent)
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                // Debounce auto-save
                clearTimeout(this.autoSaveTimeout);
                this.autoSaveTimeout = setTimeout(() => {
                    this.collectAllData();
                    this.saveDataSilently(); // Use silent save to avoid notifications
                }, 3000); // Increased to 3 seconds to reduce frequency
            }
        });

        // Profile image file upload
        document.getElementById('profileImageFile').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });

        // Profile image URL input with debouncing
        document.getElementById('profileImage').addEventListener('input', (e) => {
            // Clear any existing timeout
            clearTimeout(this.imageValidationTimeout);
            
            // Only validate after user stops typing for 1 second
            this.imageValidationTimeout = setTimeout(() => {
                const url = e.target.value.trim();
                if (url && url.length > 10) { // Only validate if there's a reasonable URL
                    this.updateProfileImagePreview(url);
                } else if (!url) {
                    // If empty, just show placeholder without warning
                    const previewImg = document.getElementById('currentProfileImg');
                    previewImg.src = 'https://via.placeholder.com/150x150/3498db/ffffff?text=No+Image';
                }
            }, 1000);
        });

        // Delete profile image
        document.getElementById('deleteProfileBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete your profile image?')) {
                this.deleteProfileImage();
            }
        });

        // Individual save buttons
        document.getElementById('savePersonalBtn').addEventListener('click', () => {
            this.collectPersonalData();
            this.saveData();
            this.showMessage('Personal information saved successfully!', 'success');
        });

        document.getElementById('saveAboutBtn').addEventListener('click', () => {
            this.collectAboutData();
            this.saveData();
            this.showMessage('About section saved successfully!', 'success');
        });

        document.getElementById('saveHeroBtn').addEventListener('click', () => {
            this.collectHeroData();
            this.saveData();
            this.showMessage('Hero section saved successfully!', 'success');
        });

        document.getElementById('saveEducationBtn').addEventListener('click', () => {
            this.saveData();
            this.showMessage('Education saved successfully!', 'success');
        });

        document.getElementById('saveSkillsBtn').addEventListener('click', () => {
            this.collectSkillsData();
            this.saveData();
            this.showMessage('Skills saved successfully!', 'success');
        });

        document.getElementById('saveProjectsBtn').addEventListener('click', () => {
            this.saveData();
            this.showMessage('Projects saved successfully!', 'success');
        });

        document.getElementById('saveContactBtn').addEventListener('click', () => {
            this.collectContactData();
            this.saveData();
            this.showMessage('Contact information saved successfully!', 'success');
        });

        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.collectSettingsData();
            this.saveData();
            this.showMessage('Settings saved successfully!', 'success');
        });

        document.getElementById('savePublicationsBtn').addEventListener('click', () => {
            this.saveData();
            this.showMessage('Publications saved successfully!', 'success');
        });

        document.getElementById('savePodcastsBtn').addEventListener('click', () => {
            this.saveData();
            this.showMessage('Podcasts saved successfully!', 'success');
        });

        document.getElementById('saveVideosBtn').addEventListener('click', () => {
            this.saveData();
            this.showMessage('Videos saved successfully!', 'success');
        });

        document.getElementById('saveAwardsBtn').addEventListener('click', () => {
            this.saveData();
            this.showMessage('Awards saved successfully!', 'success');
        });

        // Drag and drop for image upload
        const uploadSection = document.querySelector('.image-upload-section');
        uploadSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadSection.classList.add('dragover');
        });

        uploadSection.addEventListener('dragleave', () => {
            uploadSection.classList.remove('dragover');
        });

        uploadSection.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadSection.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.handleImageUpload(files[0]);
            }
        });
    }

    // Show specific section
    showSection(sectionId) {
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    // Populate form fields with current data
    populateFields() {
        // Personal info
        document.getElementById('fullName').value = this.data.personal.fullName;
        document.getElementById('title').value = this.data.personal.title;
        document.getElementById('tagline').value = this.data.personal.tagline;
        document.getElementById('profileImage').value = this.data.personal.profileImage;

        // Update profile image preview
        this.updateProfileImagePreview(this.data.personal.profileImage);

        // About
        document.getElementById('aboutText').value = this.data.about.description;

        // Hero section
        if (this.data.hero) {
            document.getElementById('heroName').value = this.data.hero.name || this.data.personal.fullName;
            document.getElementById('heroTitle').value = this.data.hero.title || this.data.personal.title;
            document.getElementById('heroTagline').value = this.data.hero.tagline || this.data.personal.tagline;
            document.getElementById('heroSubtitle').value = this.data.hero.subtitle || '';
            document.getElementById('heroButtonText').value = this.data.hero.buttonText || 'Learn More About Me';
            document.getElementById('heroButtonUrl').value = this.data.hero.buttonUrl || '#about';
        }

        // Skills - handle both old and new format
        if (this.data.skills.all) {
            // New simplified format
            document.getElementById('allSkills').value = this.data.skills.all.join(', ');
        } else if (this.data.skills.programming || this.data.skills.web || this.data.skills.tools) {
            // Old format - migrate to new format
            const allSkills = [
                ...(this.data.skills.programming || []),
                ...(this.data.skills.web || []),
                ...(this.data.skills.tools || [])
            ];
            document.getElementById('allSkills').value = allSkills.join(', ');
            // Update data structure
            this.data.skills = { all: allSkills };
        } else {
            document.getElementById('allSkills').value = '';
        }

        // Contact
        document.getElementById('email').value = this.data.contact.email;
        document.getElementById('phone').value = this.data.contact.phone;
        document.getElementById('linkedin').value = this.data.contact.linkedin;
        document.getElementById('github').value = this.data.contact.github;
        document.getElementById('twitter').value = this.data.contact.twitter;
        document.getElementById('website').value = this.data.contact.website;

        // Settings
        document.getElementById('siteTitle').value = this.data.settings.siteTitle;
        document.getElementById('colorScheme').value = this.data.settings.colorScheme;
        document.getElementById('metaDescription').value = this.data.settings.metaDescription;
    }

    // Collect data from all form fields
    collectAllData() {
        // Personal info
        this.data.personal.fullName = document.getElementById('fullName').value;
        this.data.personal.title = document.getElementById('title').value;
        this.data.personal.tagline = document.getElementById('tagline').value;
        this.data.personal.profileImage = document.getElementById('profileImage').value;

        // About
        this.data.about.description = document.getElementById('aboutText').value;
        this.data.about.degree = document.getElementById('degree').value;
        this.data.about.university = document.getElementById('university').value;
        this.data.about.graduationYear = document.getElementById('graduationYear').value;
        this.data.about.skills = document.getElementById('skills').value.split(',').map(s => s.trim()).filter(s => s);

        // Contact
        this.data.contact.email = document.getElementById('email').value;
        this.data.contact.phone = document.getElementById('phone').value;
        this.data.contact.linkedin = document.getElementById('linkedin').value;
        this.data.contact.github = document.getElementById('github').value;
        this.data.contact.twitter = document.getElementById('twitter').value;
        this.data.contact.website = document.getElementById('website').value;

        // Settings
        this.data.settings.siteTitle = document.getElementById('siteTitle').value;
        this.data.settings.colorScheme = document.getElementById('colorScheme').value;
        this.data.settings.metaDescription = document.getElementById('metaDescription').value;
    }

    // Render projects list
    renderProjects() {
        console.log('Rendering projects:', this.data.projects); // Debug log
        const projectsList = document.getElementById('projectsList');
        
        if (!projectsList) {
            console.error('Project list element not found');
            return;
        }
        
        projectsList.innerHTML = '';

        // Ensure projects array exists
        if (!this.data.projects || !Array.isArray(this.data.projects)) {
            this.data.projects = [];
        }

        console.log('Projects array length:', this.data.projects.length); // Debug log

        // If no projects, show message
        if (this.data.projects.length === 0) {
            projectsList.innerHTML = '<p class="no-content">No projects yet. Click "Add New Project" to get started!</p>';
            return;
        }

        // Render all projects
        this.data.projects.forEach(project => {
            const projectItem = this.createProjectItem(project);
            projectsList.appendChild(projectItem);
        });
    }

    // Helper method to create project item
    createProjectItem(project) {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.innerHTML = `
            <div class="project-item-header">
                <div>
                    <h4>${project.name || 'Untitled Project'}</h4>
                </div>
                <div class="project-item-actions">
                    <button class="btn btn-secondary btn-small project-edit-btn" data-project-id="${project.id}">Edit</button>
                    <button class="btn btn-danger btn-small project-delete-btn" data-project-id="${project.id}">Delete</button>
                </div>
            </div>
            <p>${project.description || 'No description available'}</p>
            <div class="project-tech-tags">
                ${(project.technologies || []).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        `;
        
        // Add event listeners for the buttons
        const editBtn = projectItem.querySelector('.project-edit-btn');
        const deleteBtn = projectItem.querySelector('.project-delete-btn');
        
        editBtn.addEventListener('click', () => this.editProject(project.id));
        deleteBtn.addEventListener('click', () => this.deleteProject(project.id));
        
        return projectItem;
    }

    // Show project modal
    showProjectModal(project = null) {
        this.currentProject = project;
        const modal = document.getElementById('projectModal');
        const modalTitle = document.getElementById('modalTitle');

        if (project) {
            modalTitle.textContent = 'Edit Project';
            document.getElementById('projectName').value = project.name;
            document.getElementById('projectDescription').value = project.description;
            document.getElementById('projectTech').value = project.technologies.join(', ');
            document.getElementById('projectUrl').value = project.url || '';
            document.getElementById('projectGithub').value = project.github || '';
        } else {
            modalTitle.textContent = 'Add New Project';
            document.getElementById('projectName').value = '';
            document.getElementById('projectDescription').value = '';
            document.getElementById('projectTech').value = '';
            document.getElementById('projectUrl').value = '';
            document.getElementById('projectGithub').value = '';
        }

        modal.style.display = 'block';
    }

    // Hide project modal
    hideProjectModal() {
        document.getElementById('projectModal').style.display = 'none';
        this.currentProject = null;
    }

    // Save project
    saveProject() {
        const name = document.getElementById('projectName').value;
        const description = document.getElementById('projectDescription').value;
        const technologies = document.getElementById('projectTech').value.split(',').map(s => s.trim()).filter(s => s);
        const url = document.getElementById('projectUrl').value;
        const github = document.getElementById('projectGithub').value;

        if (!name || !description) {
            this.showMessage('Please fill in required fields', 'error');
            return;
        }

        // Ensure projects array exists
        if (!this.data.projects || !Array.isArray(this.data.projects)) {
            this.data.projects = [];
        }

        const projectData = {
            name,
            description,
            technologies,
            url,
            github
        };

        if (this.currentProject) {
            // Edit existing project
            const index = this.data.projects.findIndex(p => p.id === this.currentProject.id);
            if (index !== -1) {
                this.data.projects[index] = { ...this.currentProject, ...projectData };
            }
        } else {
            // Add new project
            const newId = this.data.projects.length > 0 ? Math.max(...this.data.projects.map(p => p.id || 0)) + 1 : 1;
            this.data.projects.push({ id: newId, ...projectData });
        }

        this.renderProjects();
        this.hideProjectModal();
        this.saveData();
        this.showMessage('Project saved successfully!', 'success');
    }

    // Edit project
    editProject(id) {
        const project = this.data.projects.find(p => p.id === id);
        if (project) {
            this.showProjectModal(project);
        }
    }

    // Delete project
    deleteProject(id) {
        if (confirm('Are you sure you want to delete this project?')) {
            // Ensure projects array exists
            if (!this.data.projects || !Array.isArray(this.data.projects)) {
                this.data.projects = [];
                return;
            }
            
            this.data.projects = this.data.projects.filter(p => p.id !== id);
            this.renderProjects();
            this.saveData();
            this.showMessage('Project deleted successfully!', 'success');
        }
    }

    // Export data
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'portfolio-data.json';
        link.click();
        URL.revokeObjectURL(url);
        this.showMessage('Data exported successfully!', 'success');
    }

    // Import data
    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.data = { ...this.data, ...importedData };
                this.populateFields();
                this.renderProjects();
                this.saveData();
                this.showMessage('Data imported successfully!', 'success');
            } catch (error) {
                this.showMessage('Failed to import data: Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Reset data
    resetData() {
        localStorage.removeItem('portfolioData');
        location.reload();
    }

    // Show message
    showMessage(text, type = 'success') {
        const messageContainer = document.getElementById('messageContainer');
        
        // Check if the same message already exists
        const existingMessages = messageContainer.querySelectorAll('.message');
        for (let msg of existingMessages) {
            if (msg.textContent === text) {
                return; // Don't show duplicate message
            }
        }
        
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        messageContainer.appendChild(message);

        // Auto-remove after 3 seconds (reduced from 4)
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }

    // Handle image file upload
    handleImageUpload(file) {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showMessage('Please select a valid image file', 'error');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            this.showMessage('Image size must be less than 5MB', 'error');
            return;
        }

        // Create FileReader to convert image to base64
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            
            // Store the image as base64 in localStorage
            this.data.personal.profileImage = imageData;
            document.getElementById('profileImage').value = imageData;
            
            // Update preview
            this.updateProfileImagePreview(imageData);
            
            // Save data
            this.saveData();
            this.showMessage('Profile image uploaded successfully!', 'success');
        };

        reader.onerror = () => {
            this.showMessage('Failed to read image file', 'error');
        };

        reader.readAsDataURL(file);
    }

    // Update profile image preview
    updateProfileImagePreview(imageUrl) {
        const previewImg = document.getElementById('currentProfileImg');
        if (imageUrl && imageUrl.trim() !== '') {
            // Create a new image to test loading before updating preview
            const testImg = new Image();
            testImg.onload = () => {
                previewImg.src = imageUrl;
            };
            testImg.onerror = () => {
                previewImg.src = 'https://via.placeholder.com/150x150/3498db/ffffff?text=Invalid+URL';
                // Only show warning if it looks like a complete URL
                if (imageUrl.includes('http') && imageUrl.includes('.')) {
                    this.showMessage('Invalid image URL or failed to load image', 'warning');
                }
            };
            testImg.src = imageUrl;
        } else {
            previewImg.src = 'https://via.placeholder.com/150x150/3498db/ffffff?text=No+Image';
        }
    }

    // Render education list
    renderEducation() {
        const educationList = document.getElementById('educationList');
        if (!educationList) return;
        
        educationList.innerHTML = '';

        // Ensure education array exists
        if (!this.data.education || !Array.isArray(this.data.education)) {
            this.data.education = [];
        }

        if (this.data.education.length === 0) {
            educationList.innerHTML = '<p class="no-content">No education entries added yet. Click "Add New Education" to get started!</p>';
            return;
        }

        this.data.education.forEach(edu => {
            const educationItem = document.createElement('div');
            educationItem.className = 'education-item-admin';
            
            // Format date display
            let dateRange = '';
            if (edu.startMonth && edu.startYear) {
                const startMonth = this.getMonthName(edu.startMonth);
                dateRange += `${startMonth} ${edu.startYear}`;
            } else if (edu.startYear) {
                dateRange += edu.startYear;
            }
            
            if (edu.endMonth && edu.endYear) {
                const endMonth = this.getMonthName(edu.endMonth);
                dateRange += ` - ${endMonth} ${edu.endYear}`;
            } else if (edu.endYear) {
                dateRange += ` - ${edu.endYear}`;
            }
            
            if (!dateRange) {
                dateRange = 'Date not specified';
            }
            
            educationItem.innerHTML = `
                <div class="education-item-header">
                    <div>
                        <h4>${edu.degree || 'Untitled Degree'}</h4>
                        <div class="institution">${edu.institution || 'Institution not specified'}</div>
                        <div class="year-range">${dateRange}</div>
                    </div>
                    <div class="education-item-actions">
                        <button class="btn btn-secondary btn-small education-edit-btn" data-edu-id="${edu.id}">Edit</button>
                        <button class="btn btn-danger btn-small education-delete-btn" data-edu-id="${edu.id}">Delete</button>
                    </div>
                </div>
                ${edu.description ? `<p>${edu.description}</p>` : ''}
            `;
            
            // Add event listeners for the buttons
            const editBtn = educationItem.querySelector('.education-edit-btn');
            const deleteBtn = educationItem.querySelector('.education-delete-btn');
            
            editBtn.addEventListener('click', () => this.editEducation(edu.id));
            deleteBtn.addEventListener('click', () => this.deleteEducation(edu.id));
            
            educationList.appendChild(educationItem);
        });
    }

    // Helper method to get month name
    getMonthName(monthNumber) {
        const months = {
            '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
            '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
            '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
        };
        return months[monthNumber] || monthNumber;
    }

    // Show education modal
    showEducationModal(education = null) {
        this.currentEducation = education;
        const modal = document.getElementById('educationModal');
        const modalTitle = document.getElementById('educationModalTitle');

        if (education) {
            modalTitle.textContent = 'Edit Education';
            document.getElementById('educationDegree').value = education.degree || '';
            document.getElementById('educationInstitution').value = education.institution || '';
            document.getElementById('educationStartMonth').value = education.startMonth || '';
            document.getElementById('educationStartYear').value = education.startYear || '';
            document.getElementById('educationEndMonth').value = education.endMonth || '';
            document.getElementById('educationEndYear').value = education.endYear || '';
            document.getElementById('educationDescription').value = education.description || '';
        } else {
            modalTitle.textContent = 'Add New Education';
            document.getElementById('educationDegree').value = '';
            document.getElementById('educationInstitution').value = '';
            document.getElementById('educationStartMonth').value = '';
            document.getElementById('educationStartYear').value = '';
            document.getElementById('educationEndMonth').value = '';
            document.getElementById('educationEndYear').value = '';
            document.getElementById('educationDescription').value = '';
        }

        modal.style.display = 'block';
    }

    // Hide education modal
    hideEducationModal() {
        document.getElementById('educationModal').style.display = 'none';
        this.currentEducation = null;
    }

    // Save education
    saveEducation() {
        const degree = document.getElementById('educationDegree').value;
        const institution = document.getElementById('educationInstitution').value;
        const startMonth = document.getElementById('educationStartMonth').value;
        const startYear = parseInt(document.getElementById('educationStartYear').value);
        const endMonth = document.getElementById('educationEndMonth').value;
        const endYear = parseInt(document.getElementById('educationEndYear').value);
        const description = document.getElementById('educationDescription').value;

        if (!degree || !institution) {
            this.showMessage('Please fill in degree and institution fields', 'error');
            return;
        }

        // Ensure education array exists
        if (!this.data.education || !Array.isArray(this.data.education)) {
            this.data.education = [];
        }

        const educationData = {
            degree,
            institution,
            startMonth: startMonth || '',
            startYear: startYear || '',
            endMonth: endMonth || '',
            endYear: endYear || '',
            description
        };

        if (this.currentEducation) {
            // Edit existing education
            const index = this.data.education.findIndex(e => e.id === this.currentEducation.id);
            if (index !== -1) {
                this.data.education[index] = { ...this.currentEducation, ...educationData };
            }
        } else {
            // Add new education
            const newId = this.data.education.length > 0 ? Math.max(...this.data.education.map(e => e.id || 0)) + 1 : 1;
            this.data.education.push({ id: newId, ...educationData });
        }

        this.renderEducation();
        this.hideEducationModal();
        this.saveData();
        this.showMessage('Education saved successfully!', 'success');
    }

    // Edit education
    editEducation(id) {
        const education = this.data.education.find(e => e.id === id);
        if (education) {
            this.showEducationModal(education);
        }
    }

    // Delete education
    deleteEducation(id) {
        if (confirm('Are you sure you want to delete this education entry?')) {
            // Ensure education array exists
            if (!this.data.education || !Array.isArray(this.data.education)) {
                this.data.education = [];
                return;
            }
            
            this.data.education = this.data.education.filter(e => e.id !== id);
            this.renderEducation();
            this.saveData();
            this.showMessage('Education deleted successfully!', 'success');
        }
    }

    // Skills Management Methods
    
    // Render skills list
    renderSkills() {
        const skillsList = document.getElementById('skillsList');
        if (!skillsList) return;

        skillsList.innerHTML = '';

        // Ensure skills array exists - convert old format if needed
        if (!this.data.skills || !Array.isArray(this.data.skills)) {
            // Convert old format to new format
            if (this.data.skills && this.data.skills.all && Array.isArray(this.data.skills.all)) {
                this.data.skills = this.data.skills.all.map((skill, index) => ({
                    id: Date.now() + index,
                    name: skill,
                    category: '',
                    proficiency: ''
                }));
            } else {
                this.data.skills = [];
            }
        }

        if (this.data.skills.length === 0) {
            skillsList.innerHTML = '<p class="no-content">No skills added yet. Click "Add New Skill" to get started!</p>';
            return;
        }

        this.data.skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
                <div class="skill-item-content">
                    <h4>${skill.name}</h4>
                    <div class="skill-item-meta">
                        ${skill.category ? `<span class="skill-category">${skill.category}</span>` : ''}
                        ${skill.proficiency ? `<span class="skill-proficiency">${skill.proficiency}</span>` : ''}
                    </div>
                </div>
                <div class="skill-item-actions">
                    <button class="btn btn-secondary btn-small skill-edit-btn" data-skill-id="${skill.id}">Edit</button>
                    <button class="btn btn-danger btn-small skill-delete-btn" data-skill-id="${skill.id}">Delete</button>
                </div>
            `;
            
            // Add event listeners for the buttons
            const editBtn = skillItem.querySelector('.skill-edit-btn');
            const deleteBtn = skillItem.querySelector('.skill-delete-btn');
            
            editBtn.addEventListener('click', () => this.editSkill(skill.id));
            deleteBtn.addEventListener('click', () => this.deleteSkill(skill.id));
            
            skillsList.appendChild(skillItem);
        });
    }

    // Show skill modal
    showSkillModal(skill = null) {
        this.currentSkill = skill;
        const modal = document.getElementById('skillModal');
        const modalTitle = document.getElementById('skillModalTitle');

        if (skill) {
            modalTitle.textContent = 'Edit Skill';
            document.getElementById('skillName').value = skill.name || '';
            document.getElementById('skillCategory').value = skill.category || '';
            document.getElementById('skillProficiency').value = skill.proficiency || '';
        } else {
            modalTitle.textContent = 'Add New Skill';
            document.getElementById('skillName').value = '';
            document.getElementById('skillCategory').value = '';
            document.getElementById('skillProficiency').value = '';
        }

        modal.style.display = 'block';
    }

    // Hide skill modal
    hideSkillModal() {
        document.getElementById('skillModal').style.display = 'none';
        this.currentSkill = null;
    }

    // Save skill
    saveSkill() {
        const name = document.getElementById('skillName').value.trim();
        const category = document.getElementById('skillCategory').value;
        const proficiency = document.getElementById('skillProficiency').value;

        if (!name) {
            this.showMessage('Skill name is required!', 'error');
            return;
        }

        // Ensure skills array exists
        if (!this.data.skills || !Array.isArray(this.data.skills)) {
            this.data.skills = [];
        }

        if (this.currentSkill) {
            // Update existing skill
            const index = this.data.skills.findIndex(s => s.id === this.currentSkill.id);
            if (index !== -1) {
                this.data.skills[index] = {
                    ...this.data.skills[index],
                    name: name,
                    category: category,
                    proficiency: proficiency
                };
            }
        } else {
            // Add new skill
            const newSkill = {
                id: Date.now(),
                name: name,
                category: category,
                proficiency: proficiency
            };
            this.data.skills.push(newSkill);
        }

        this.renderSkills();
        this.hideSkillModal();
        this.saveData();
        this.showMessage(`Skill ${this.currentSkill ? 'updated' : 'added'} successfully!`, 'success');
    }

    // Edit skill
    editSkill(id) {
        const skill = this.data.skills.find(s => s.id === id);
        if (skill) {
            this.showSkillModal(skill);
        }
    }

    // Delete skill
    deleteSkill(id) {
        if (confirm('Are you sure you want to delete this skill?')) {
            // Ensure skills array exists
            if (!this.data.skills || !Array.isArray(this.data.skills)) {
                this.data.skills = [];
                return;
            }
            
            this.data.skills = this.data.skills.filter(s => s.id !== id);
            this.renderSkills();
            this.saveData();
            this.showMessage('Skill deleted successfully!', 'success');
        }
    }

    // Delete all skills
    deleteAllSkills() {
        if (confirm('Are you sure you want to delete ALL skills? This action cannot be undone.')) {
            this.data.skills = [];
            this.renderSkills();
            this.saveData();
            this.showMessage('All skills deleted successfully!', 'success');
        }
    }

    // Delete profile image
    deleteProfileImage() {
        this.data.personal.profileImage = '';
        document.getElementById('profileImage').value = '';
        document.getElementById('profileImageFile').value = '';
        this.updateProfileImagePreview('');
        this.saveData();
        this.showMessage('Profile image deleted successfully!', 'success');
    }

    // Individual data collection methods
    collectPersonalData() {
        this.data.personal.fullName = document.getElementById('fullName').value;
        this.data.personal.title = document.getElementById('title').value;
        this.data.personal.tagline = document.getElementById('tagline').value;
        this.data.personal.profileImage = document.getElementById('profileImage').value;
    }

    collectAboutData() {
        this.data.about.description = document.getElementById('aboutText').value;
    }

    collectHeroData() {
        this.data.hero.name = document.getElementById('heroName').value;
        this.data.hero.title = document.getElementById('heroTitle').value;
        this.data.hero.tagline = document.getElementById('heroTagline').value;
        this.data.hero.subtitle = document.getElementById('heroSubtitle').value;
        this.data.hero.buttonText = document.getElementById('heroButtonText').value;
        this.data.hero.buttonUrl = document.getElementById('heroButtonUrl').value;
    }

    collectSkillsData() {
        // Skills are now managed individually like education
        // Data is already stored in this.data.skills array
        // No need to collect from form fields
    }

    collectContactData() {
        this.data.contact.email = document.getElementById('email').value;
        this.data.contact.phone = document.getElementById('phone').value;
        this.data.contact.linkedin = document.getElementById('linkedin').value;
        this.data.contact.github = document.getElementById('github').value;
        this.data.contact.twitter = document.getElementById('twitter').value;
        this.data.contact.website = document.getElementById('website').value;
    }

    collectSettingsData() {
        this.data.settings.siteTitle = document.getElementById('siteTitle').value;
        this.data.settings.colorScheme = document.getElementById('colorScheme').value;
        this.data.settings.metaDescription = document.getElementById('metaDescription').value;
    }

    // Publications Management
    renderPublications() {
        const publicationsList = document.getElementById('publicationsList');
        publicationsList.innerHTML = '';

        this.data.publications.forEach(publication => {
            const publicationItem = document.createElement('div');
            publicationItem.className = 'publication-item-admin';
            publicationItem.innerHTML = `
                <div class="publication-item-header">
                    <div>
                        <h4>${publication.title}</h4>
                        <div class="publication-journal">${publication.journal}</div>
                        <div class="publication-date">${new Date(publication.date).toLocaleDateString()}</div>
                        <div class="publication-authors">${publication.authors}</div>
                    </div>
                    <div class="publication-item-actions">
                        <button class="btn btn-secondary btn-small publication-edit-btn" data-publication-id="${publication.id}">Edit</button>
                        <button class="btn btn-danger btn-small publication-delete-btn" data-publication-id="${publication.id}">Delete</button>
                    </div>
                </div>
                <p>${publication.abstract}</p>
                ${publication.url ? `<p><a href="${publication.url}" target="_blank">View Publication</a></p>` : ''}
            `;
            
            // Add event listeners for the buttons
            const editBtn = publicationItem.querySelector('.publication-edit-btn');
            const deleteBtn = publicationItem.querySelector('.publication-delete-btn');
            
            editBtn.addEventListener('click', () => this.editPublication(publication.id));
            deleteBtn.addEventListener('click', () => this.deletePublication(publication.id));
            
            publicationsList.appendChild(publicationItem);
        });
    }

    showPublicationModal(publication = null) {
        this.currentPublication = publication;
        const modal = document.getElementById('publicationModal');
        const modalTitle = document.getElementById('publicationModalTitle');

        if (publication) {
            modalTitle.textContent = 'Edit Publication';
            document.getElementById('publicationTitle').value = publication.title;
            document.getElementById('publicationJournal').value = publication.journal;
            document.getElementById('publicationDate').value = publication.date;
            document.getElementById('publicationAuthors').value = publication.authors;
            document.getElementById('publicationAbstract').value = publication.abstract;
            document.getElementById('publicationUrl').value = publication.url || '';
            document.getElementById('publicationDoi').value = publication.doi || '';
        } else {
            modalTitle.textContent = 'Add New Publication';
            document.getElementById('publicationForm').reset();
        }

        modal.style.display = 'block';
    }

    hidePublicationModal() {
        document.getElementById('publicationModal').style.display = 'none';
        this.currentPublication = null;
    }

    savePublication() {
        const form = document.getElementById('publicationForm');
        const formData = new FormData(form);
        
        const publicationData = {
            title: formData.get('title'),
            journal: formData.get('journal'),
            date: formData.get('date'),
            authors: formData.get('authors'),
            abstract: formData.get('abstract'),
            url: formData.get('url'),
            doi: formData.get('doi')
        };

        if (this.currentPublication) {
            // Update existing publication
            const index = this.data.publications.findIndex(p => p.id === this.currentPublication.id);
            this.data.publications[index] = { ...this.currentPublication, ...publicationData };
        } else {
            // Add new publication
            publicationData.id = Date.now();
            this.data.publications.push(publicationData);
        }

        this.saveData();
        this.renderPublications();
        this.hidePublicationModal();
    }

    editPublication(id) {
        const publication = this.data.publications.find(p => p.id === id);
        if (publication) {
            this.showPublicationModal(publication);
        }
    }

    deletePublication(id) {
        if (confirm('Are you sure you want to delete this publication?')) {
            this.data.publications = this.data.publications.filter(p => p.id !== id);
            this.saveData();
            this.renderPublications();
        }
    }

    // Podcasts Management
    renderPodcasts() {
        const podcastsList = document.getElementById('podcastsList');
        podcastsList.innerHTML = '';

        this.data.podcasts.forEach(podcast => {
            const podcastItem = document.createElement('div');
            podcastItem.className = 'podcast-item-admin';
            podcastItem.innerHTML = `
                <div class="podcast-item-header">
                    <div>
                        <h4>${podcast.title}</h4>
                        <div class="podcast-show">${podcast.show}</div>
                        <div class="podcast-date">${new Date(podcast.date).toLocaleDateString()}</div>
                        <div class="podcast-host">Hosted by: ${podcast.host}</div>
                    </div>
                    <div class="podcast-item-actions">
                        <button class="btn btn-secondary btn-small podcast-edit-btn" data-podcast-id="${podcast.id}">Edit</button>
                        <button class="btn btn-danger btn-small podcast-delete-btn" data-podcast-id="${podcast.id}">Delete</button>
                    </div>
                </div>
                <p>${podcast.description}</p>
                <p><strong>Platform:</strong> ${podcast.platform}</p>
                <p><a href="${podcast.url}" target="_blank">Listen to Episode</a></p>
            `;
            
            // Add event listeners for the buttons
            const editBtn = podcastItem.querySelector('.podcast-edit-btn');
            const deleteBtn = podcastItem.querySelector('.podcast-delete-btn');
            
            editBtn.addEventListener('click', () => this.editPodcast(podcast.id));
            deleteBtn.addEventListener('click', () => this.deletePodcast(podcast.id));
            
            podcastsList.appendChild(podcastItem);
        });
    }

    showPodcastModal(podcast = null) {
        this.currentPodcast = podcast;
        const modal = document.getElementById('podcastModal');
        const modalTitle = document.getElementById('podcastModalTitle');

        if (podcast) {
            modalTitle.textContent = 'Edit Podcast';
            document.getElementById('podcastTitle').value = podcast.title;
            document.getElementById('podcastShow').value = podcast.show;
            document.getElementById('podcastDate').value = podcast.date;
            document.getElementById('podcastHost').value = podcast.host;
            document.getElementById('podcastDescription').value = podcast.description;
            document.getElementById('podcastUrl').value = podcast.url;
            document.getElementById('podcastPlatform').value = podcast.platform;
        } else {
            modalTitle.textContent = 'Add New Podcast';
            document.getElementById('podcastForm').reset();
        }

        modal.style.display = 'block';
    }

    hidePodcastModal() {
        document.getElementById('podcastModal').style.display = 'none';
        this.currentPodcast = null;
    }

    savePodcast() {
        const form = document.getElementById('podcastForm');
        const formData = new FormData(form);
        
        const podcastData = {
            title: formData.get('title'),
            show: formData.get('show'),
            date: formData.get('date'),
            host: formData.get('host'),
            description: formData.get('description'),
            url: formData.get('url'),
            platform: formData.get('platform')
        };

        if (this.currentPodcast) {
            // Update existing podcast
            const index = this.data.podcasts.findIndex(p => p.id === this.currentPodcast.id);
            this.data.podcasts[index] = { ...this.currentPodcast, ...podcastData };
        } else {
            // Add new podcast
            podcastData.id = Date.now();
            this.data.podcasts.push(podcastData);
        }

        this.saveData();
        this.renderPodcasts();
        this.hidePodcastModal();
    }

    editPodcast(id) {
        const podcast = this.data.podcasts.find(p => p.id === id);
        if (podcast) {
            this.showPodcastModal(podcast);
        }
    }

    deletePodcast(id) {
        if (confirm('Are you sure you want to delete this podcast?')) {
            this.data.podcasts = this.data.podcasts.filter(p => p.id !== id);
            this.saveData();
            this.renderPodcasts();
        }
    }

    // Videos Management
    renderVideos() {
        console.log('Rendering videos:', this.data.videos); // Debug log
        const videosList = document.getElementById('videosList');
        if (!videosList) {
            console.error('Videos list element not found');
            return;
        }
        
        videosList.innerHTML = '';

        // Ensure videos array exists
        if (!this.data.videos || !Array.isArray(this.data.videos)) {
            this.data.videos = [];
        }

        console.log('Videos array length:', this.data.videos.length); // Debug log

        if (this.data.videos.length === 0) {
            videosList.innerHTML = '<p class="no-content">No videos yet. Click "Add New Video" to get started!</p>';
            return;
        }

        this.data.videos.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item-admin';
            videoItem.innerHTML = `
                <div class="video-item-header">
                    <div>
                        <h4>${video.title}</h4>
                    </div>
                    <div class="video-item-actions">
                        <button class="btn btn-secondary btn-small video-edit-btn" data-video-id="${video.id}">Edit</button>
                        <button class="btn btn-danger btn-small video-delete-btn" data-video-id="${video.id}">Delete</button>
                    </div>
                </div>
                <p><a href="${video.url}" target="_blank">Watch Video</a></p>
            `;
            
            // Add event listeners for the buttons
            const editBtn = videoItem.querySelector('.video-edit-btn');
            const deleteBtn = videoItem.querySelector('.video-delete-btn');
            
            editBtn.addEventListener('click', () => this.editVideo(video.id));
            deleteBtn.addEventListener('click', () => this.deleteVideo(video.id));
            
            videosList.appendChild(videoItem);
        });
    }

    showVideoModal(video = null) {
        this.currentVideo = video;
        const modal = document.getElementById('videoModal');
        const modalTitle = document.getElementById('videoModalTitle');

        if (video) {
            modalTitle.textContent = 'Edit Video';
            document.getElementById('videoTitle').value = video.title;
            document.getElementById('videoUrl').value = video.url;
        } else {
            modalTitle.textContent = 'Add New Video';
            document.getElementById('videoForm').reset();
        }

        modal.style.display = 'block';
    }

    hideVideoModal() {
        document.getElementById('videoModal').style.display = 'none';
        this.currentVideo = null;
    }

    saveVideo() {
        const form = document.getElementById('videoForm');
        const formData = new FormData(form);
        
        const videoData = {
            title: formData.get('title'),
            url: formData.get('url')
        };

        if (this.currentVideo) {
            // Update existing video
            const index = this.data.videos.findIndex(v => v.id === this.currentVideo.id);
            this.data.videos[index] = { ...this.currentVideo, ...videoData };
        } else {
            // Add new video
            videoData.id = Date.now();
            this.data.videos.push(videoData);
        }

        this.saveData();
        this.renderVideos();
        this.hideVideoModal();
    }

    editVideo(id) {
        const video = this.data.videos.find(v => v.id === id);
        if (video) {
            this.showVideoModal(video);
        }
    }

    deleteVideo(id) {
        if (confirm('Are you sure you want to delete this video?')) {
            this.data.videos = this.data.videos.filter(v => v.id !== id);
            this.saveData();
            this.renderVideos();
        }
    }

    // Awards Management
    renderAwards() {
        const awardsList = document.getElementById('awardsList');
        awardsList.innerHTML = '';

        this.data.awards.forEach(award => {
            const awardItem = document.createElement('div');
            awardItem.className = 'award-item-admin';
            awardItem.innerHTML = `
                <div class="award-item-header">
                    <div>
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <span class="award-icon">${award.icon || '🏆'}</span>
                            <h4>${award.title}</h4>
                        </div>
                        <div class="award-organization">${award.organization}</div>
                        <div class="award-date">${new Date(award.date).toLocaleDateString()}</div>
                        <span class="award-category">${award.category}</span>
                    </div>
                    <div class="award-item-actions">
                        <button class="btn btn-secondary btn-small award-edit-btn" data-award-id="${award.id}">Edit</button>
                        <button class="btn btn-danger btn-small award-delete-btn" data-award-id="${award.id}">Delete</button>
                    </div>
                </div>
                <p>${award.description}</p>
                ${award.url ? `<p><a href="${award.url}" target="_blank">View Certificate</a></p>` : ''}
            `;
            
            // Add event listeners for the buttons
            const editBtn = awardItem.querySelector('.award-edit-btn');
            const deleteBtn = awardItem.querySelector('.award-delete-btn');
            
            editBtn.addEventListener('click', () => this.editAward(award.id));
            deleteBtn.addEventListener('click', () => this.deleteAward(award.id));
            
            awardsList.appendChild(awardItem);
        });
    }

    showAwardModal(award = null) {
        this.currentAward = award;
        const modal = document.getElementById('awardModal');
        const modalTitle = document.getElementById('awardModalTitle');

        if (award) {
            modalTitle.textContent = 'Edit Award';
            document.getElementById('awardTitle').value = award.title;
            document.getElementById('awardOrganization').value = award.organization;
            document.getElementById('awardDate').value = award.date;
            document.getElementById('awardCategory').value = award.category;
            document.getElementById('awardDescription').value = award.description;
            document.getElementById('awardIcon').value = award.icon || '';
            document.getElementById('awardUrl').value = award.url || '';
        } else {
            modalTitle.textContent = 'Add New Award';
            document.getElementById('awardForm').reset();
        }

        modal.style.display = 'block';
    }

    hideAwardModal() {
        document.getElementById('awardModal').style.display = 'none';
        this.currentAward = null;
    }

    saveAward() {
        const form = document.getElementById('awardForm');
        const formData = new FormData(form);
        
        const awardData = {
            title: formData.get('title'),
            organization: formData.get('organization'),
            date: formData.get('date'),
            category: formData.get('category'),
            description: formData.get('description'),
            icon: formData.get('icon') || '🏆',
            url: formData.get('url')
        };

        if (this.currentAward) {
            // Update existing award
            const index = this.data.awards.findIndex(a => a.id === this.currentAward.id);
            this.data.awards[index] = { ...this.currentAward, ...awardData };
        } else {
            // Add new award
            awardData.id = Date.now();
            this.data.awards.push(awardData);
        }

        this.saveData();
        this.renderAwards();
        this.hideAwardModal();
    }

    editAward(id) {
        const award = this.data.awards.find(a => a.id === id);
        if (award) {
            this.showAwardModal(award);
        }
    }

    deleteAward(id) {
        if (confirm('Are you sure you want to delete this award?')) {
            this.data.awards = this.data.awards.filter(a => a.id !== id);
            this.saveData();
            this.renderAwards();
        }
    }

    // Delete all awards
    deleteAllAwards() {
        if (confirm('Are you sure you want to delete ALL awards and achievements? This action cannot be undone.')) {
            this.data.awards = [];
            this.renderAwards();
            this.saveData();
            this.showMessage('All awards and achievements deleted successfully!', 'success');
        }
    }

    // Delete all education
    deleteAllEducation() {
        if (confirm('Are you sure you want to delete ALL education entries? This action cannot be undone.')) {
            this.data.education = [];
            this.renderEducation();
            this.saveData();
            this.showMessage('All education entries deleted successfully!', 'success');
        }
    }

    // Delete all publications
    deleteAllPublications() {
        if (confirm('Are you sure you want to delete ALL publications? This action cannot be undone.')) {
            this.data.publications = [];
            this.renderPublications();
            this.saveData();
            this.showMessage('All publications deleted successfully!', 'success');
        }
    }

    // Delete all podcasts
    deleteAllPodcasts() {
        if (confirm('Are you sure you want to delete ALL podcasts? This action cannot be undone.')) {
            this.data.podcasts = [];
            this.renderPodcasts();
            this.saveData();
            this.showMessage('All podcasts deleted successfully!', 'success');
        }
    }

    // Delete all videos
    deleteAllVideos() {
        if (confirm('Are you sure you want to delete ALL videos? This action cannot be undone.')) {
            this.data.videos = [];
            this.renderVideos();
            this.saveData();
            this.showMessage('All videos deleted successfully!', 'success');
        }
    }

    // Delete all featured projects
    // Delete all projects
    deleteAllProjects() {
        if (confirm('Are you sure you want to delete ALL projects? This action cannot be undone.')) {
            this.data.projects = [];
            this.renderProjects();
            this.saveData();
            this.showMessage('All projects deleted successfully!', 'success');
        }
    }

    // Generate updated HTML for the main site
    generateHTML() {
        // This would generate the updated HTML based on the current data
        // For now, we'll just update localStorage and show a message
        this.collectAllData();
        this.saveData();
        this.showMessage('Site data updated! Refresh your main portfolio to see changes.', 'success');
    }
}

// Initialize admin when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new PortfolioAdmin();
});

// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Global function to clear all data (for emergency reset)
function clearAllData() {
    if (confirm('This will permanently delete ALL portfolio data including personal info, projects, skills, experience, education, and awards. This action cannot be undone. Are you sure?')) {
        // Clear all localStorage
        localStorage.clear();
        
        // Reset the admin data
        window.admin = new PortfolioAdmin();
        window.admin.init();
        
        alert('All portfolio data has been cleared! Please refresh the main portfolio page to see changes.');
        
        location.reload();
    }
}

console.log('Portfolio Admin Panel Loaded! 🚀');
