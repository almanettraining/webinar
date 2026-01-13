document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const registerForm = document.getElementById('registerForm');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const successMessage = document.getElementById('successMessage');

    // --- Validation Logic ---
    const validators = {
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        phone: (value) => /^\d{10,15}$/.test(value.replace(/\D/g, '')),
        required: (value) => value.trim().length > 0
    };

    function validateField(input) {
        const group = input.closest('.form-group');
        const errorMsg = group.querySelector('.error-msg');
        let isValid = true;

        // Reset state
        input.classList.remove('input-error', 'input-success');
        if (errorMsg) errorMsg.classList.add('hidden');

        // Check required
        if (input.hasAttribute('required') && !validators.required(input.value)) {
            isValid = false;
        }

        // Check specific types if value exists
        if (isValid && input.value.trim() !== '') {
            if (input.type === 'email' && !validators.email(input.value)) {
                isValid = false;
            }
            if (input.type === 'tel' && !validators.phone(input.value)) {
                isValid = false;
            }
        }

        // Apply state
        if (!isValid) {
            input.classList.add('input-error');
            if (errorMsg) errorMsg.classList.remove('hidden');
        } else if (input.value.trim() !== '') {
            input.classList.add('input-success');
        }

        return isValid;
    }

    if (registerForm) {
        // Validation Listeners
        const inputs = registerForm.querySelectorAll('input[required], select[required], input[type="email"], input[type="tel"]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                input.classList.remove('input-error');
                const group = input.closest('.form-group');
                const errorMsg = group.querySelector('.error-msg');
                if (errorMsg) errorMsg.classList.add('hidden');
            });
        });

        // Form Submission
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let formValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    formValid = false;
                }
            });

            if (!formValid) {
                const firstInvalid = registerForm.querySelector('.input-error');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
                return;
            }

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Registering...';
            btn.disabled = true;

            const selectedCourseField = document.getElementById('selectedCourse');
            const payload = {
                name: this.name.value,
                email: this.email.value,
                phone: this.phone.value,
                status: this.status?.value || "",
                college: this.college?.value || "",
                course: this.course?.value || "",
                branch: this.branch?.value || "",
                passingYear: this.passingYear?.value || "",
                selectedCourse: selectedCourseField?.value || ""
            };

            fetch('https://script.google.com/macros/s/AKfycbyLNk141_7foJVFiAMjOu9PrC50LStJrqlxJbAOGq4l1wp59hXJyBbvBEvYRAbg4r_O/exec', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            })
                .then(() => {
                    registerForm.style.display = 'none';
                    const header = document.querySelector('.register-header');
                    if (header) header.style.display = 'none';

                    if (successMessage) {
                        successMessage.classList.remove('hidden');
                        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    this.reset();
                })
                .catch(err => {
                    console.error(err);
                    alert('Submission failed. Please try again.');
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }

    // --- Mobile Menu ---
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileServiceDropdown = () => {
        const dropdowns = mobileNav ? mobileNav.querySelectorAll('.mobile-services-dropdown, .mobile-courses-dropdown, .mobile-events-dropdown') : [];
        dropdowns.forEach(dd => dd.classList.remove('open'));
        const toggles = mobileNav ? mobileNav.querySelectorAll('.mobile-services-toggle, .mobile-courses-toggle, .mobile-events-toggle') : [];
        toggles.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    };

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('hidden');
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => {
                    mobileNav.classList.add('hidden');
                }, 150);
            });
        });

        // Mobile courses dropdown toggle
        const mobileCoursesToggle = mobileNav.querySelector('.mobile-courses-toggle');
        const mobileCoursesDropdown = mobileNav.querySelector('.mobile-courses-dropdown');

        if (mobileCoursesToggle && mobileCoursesDropdown) {
            mobileCoursesToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = mobileCoursesDropdown.classList.toggle('open');
                mobileCoursesToggle.setAttribute('aria-expanded', String(isOpen));
            });

            // Close dropdown when a course link is tapped
            mobileCoursesDropdown.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileCoursesDropdown.classList.remove('open');
                    mobileCoursesToggle.setAttribute('aria-expanded', 'false');
                    setTimeout(() => {
                        mobileNav.classList.add('hidden');
                    }, 150);
                });
            });
        }

        // Mobile services dropdown toggle
        const mobileServicesToggle = mobileNav.querySelector('.mobile-services-toggle');
        const mobileServicesDropdown = mobileNav.querySelector('.mobile-services-dropdown');
        if (mobileServicesToggle && mobileServicesDropdown) {
            mobileServicesToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = mobileServicesDropdown.classList.toggle('open');
                mobileServicesToggle.setAttribute('aria-expanded', String(isOpen));
            });
            mobileServicesDropdown.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileServicesDropdown.classList.remove('open');
                    mobileServicesToggle.setAttribute('aria-expanded', 'false');
                    setTimeout(() => {
                        mobileNav.classList.add('hidden');
                    }, 150);
                });
            });
        }

        // Mobile events dropdown toggle
        const mobileEventsToggle = mobileNav.querySelector('.mobile-events-toggle');
        const mobileEventsDropdown = mobileNav.querySelector('.mobile-events-dropdown');
        if (mobileEventsToggle && mobileEventsDropdown) {
            mobileEventsToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = mobileEventsDropdown.classList.toggle('open');
                mobileEventsToggle.setAttribute('aria-expanded', String(isOpen));
            });
            mobileEventsDropdown.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileEventsDropdown.classList.remove('open');
                    mobileEventsToggle.setAttribute('aria-expanded', 'false');
                    setTimeout(() => {
                        mobileNav.classList.add('hidden');
                    }, 150);
                });
            });
        }

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileNav.classList.contains('hidden')) {
                const clickedInsideNav = mobileNav.contains(e.target);
                const clickedToggle = mobileMenuBtn.contains(e.target);
                if (!clickedInsideNav && !clickedToggle) {
                    mobileNav.classList.add('hidden');
                    mobileServiceDropdown();
                }
            }
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#' || targetId === '#!') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    // --- Curriculum Accordion ---
    document.querySelectorAll('.accordion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentCard = btn.closest('.learn-card');
            const currentContent = currentCard.querySelector('.accordion-content');

            document.querySelectorAll('.learn-card').forEach(card => {
                if (card !== currentCard) {
                    card.classList.remove('active');
                    const content = card.querySelector('.accordion-content');
                    if (content) content.classList.add('hidden');
                }
            });
            currentCard.classList.toggle('active');
            currentContent.classList.toggle('hidden');
        });
    });

    // --- Desktop Courses Dropdown (accessibility + click support) ---
    const desktopCoursesToggle = document.querySelector('.nav-courses-toggle');
    const desktopCoursesItem = desktopCoursesToggle ? desktopCoursesToggle.closest('.nav-has-dropdown') : null;

    if (desktopCoursesToggle && desktopCoursesItem) {
        desktopCoursesToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = desktopCoursesItem.classList.toggle('open');
            desktopCoursesToggle.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', (e) => {
            if (!desktopCoursesItem.contains(e.target)) {
                desktopCoursesItem.classList.remove('open');
                desktopCoursesToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Desktop Services Dropdown ---
    const desktopServicesToggle = document.querySelector('.nav-services-toggle');
    const desktopServicesItem = desktopServicesToggle ? desktopServicesToggle.closest('.nav-has-dropdown') : null;
    if (desktopServicesToggle && desktopServicesItem) {
        desktopServicesToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = desktopServicesItem.classList.toggle('open');
            desktopServicesToggle.setAttribute('aria-expanded', String(isOpen));
        });
        document.addEventListener('click', (e) => {
            if (!desktopServicesItem.contains(e.target)) {
                desktopServicesItem.classList.remove('open');
                desktopServicesToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Desktop Events Dropdown ---
    const desktopEventsToggle = document.querySelector('.nav-events-toggle');
    const desktopEventsItem = desktopEventsToggle ? desktopEventsToggle.closest('.nav-has-dropdown') : null;
    if (desktopEventsToggle && desktopEventsItem) {
        desktopEventsToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = desktopEventsItem.classList.toggle('open');
            desktopEventsToggle.setAttribute('aria-expanded', String(isOpen));
        });
        document.addEventListener('click', (e) => {
            if (!desktopEventsItem.contains(e.target)) {
                desktopEventsItem.classList.remove('open');
                desktopEventsToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Accessibility: keyboard support and escape to close ---
    const desktopDropdowns = document.querySelectorAll('.nav-has-dropdown');
    const closeAllDesktopDropdowns = () => {
        desktopDropdowns.forEach(item => {
            item.classList.remove('open');
            const toggle = item.querySelector('.nav-link');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    };

    function addToggleKeyboardSupport(toggle, item) {
        if (!toggle || !item) return;
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isOpen = item.classList.toggle('open');
                toggle.setAttribute('aria-expanded', String(isOpen));
            }
            if (e.key === 'Escape') {
                item.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
            }
        });
    }

    if (desktopCoursesToggle && desktopCoursesItem) addToggleKeyboardSupport(desktopCoursesToggle, desktopCoursesItem);
    if (desktopServicesToggle && desktopServicesItem) addToggleKeyboardSupport(desktopServicesToggle, desktopServicesItem);
    if (desktopEventsToggle && desktopEventsItem) addToggleKeyboardSupport(desktopEventsToggle, desktopEventsItem);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllDesktopDropdowns();
            if (mobileNav && !mobileNav.classList.contains('hidden')) {
                mobileNav.classList.add('hidden');
                mobileServiceDropdown();
            }
        }
    });

    // --- Course Details Modal ---
    const courseData = {
        'python-fullstack': {
            title: 'Full Stack Python Development',
            icon: 'fa-solid fa-code',
            description: 'End-to-end web development using Python, Django/FastAPI, databases, and frontend basics with real-world projects. Master both frontend and backend to build complete web applications.',
            duration: '6 Months',
            level: 'Beginner → Advanced',
            topics: [
                'Frontend + Backend integration',
                'Django / FastAPI APIs',
                'Authentication & authorization',
                'Database design & optimization',
                'RESTful API development',
                'Deployment & project demo',
                'Real-world project workflows'
            ]
        },
        'backend-python': {
            title: 'Backend with Python & Django',
            icon: 'fa-brands fa-python',
            description: 'Core Python + OOP concepts, Django fundamentals, and building scalable CRUD applications. Learn to create robust backend systems that power modern web applications.',
            duration: '4 Months',
            level: 'Beginner → Intermediate',
            topics: [
                'Python basics & OOP',
                'Django project structure',
                'Models, Views & Templates',
                'CRUD operations',
                'Middleware & security',
                'API development',
                'Testing & debugging'
            ]
        },
        'database-orm': {
            title: 'Database & ORM',
            icon: 'fa-solid fa-database',
            description: 'Database integration (MySQL) and Django ORM optimization. Learn to design efficient databases and leverage ORM for powerful data operations.',
            duration: '2 Months',
            level: 'Beginner',
            topics: [
                'Relational database concepts',
                'MySQL integration',
                'Django ORM queries',
                'Performance optimization',
                'Database migrations',
                'Query optimization',
                'Data modeling best practices'
            ]
        },
        'frontend': {
            title: 'Frontend Essentials',
            icon: 'fa-brands fa-html5',
            description: 'HTML, CSS & JavaScript basics, responsive UI, and frontend–backend integration. Build beautiful, interactive user interfaces that work seamlessly with backend APIs.',
            duration: '3 Months',
            level: 'Beginner',
            topics: [
                'HTML structure & semantics',
                'CSS layouts & responsiveness',
                'JavaScript fundamentals',
                'DOM manipulation',
                'Connecting frontend with backend APIs',
                'Modern CSS frameworks',
                'Responsive design principles'
            ]
        },
        'professional': {
            title: 'Professional Readiness',
            icon: 'fa-solid fa-briefcase',
            description: 'Real-world workflows, Git/GitHub, resume building, and interview preparation. Get job-ready with industry-standard tools and practices.',
            duration: '1 Month',
            level: 'All Levels',
            topics: [
                'Real-world project workflow',
                'Git & GitHub basics',
                'Resume & LinkedIn tips',
                'Interview preparation',
                'Portfolio development',
                'Networking strategies',
                'Career guidance'
            ]
        }
    };

    // Create modal HTML structure with future-ready sections
    function createModal() {
        const modalHTML = `
            <div class="modal-overlay" id="courseModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">Course Details</h3>
                        <button class="modal-close" aria-label="Close Modal">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-course-icon" id="modalIcon"></div>
                        <div class="modal-course-meta" id="modalMeta"></div>
                        <div class="modal-course-description" id="modalDescription"></div>
                        
                        <!-- Future-ready: Course Resources Section -->
                        <div class="modal-resources" id="modalResources" style="display: none;">
                            <h4>Course Resources</h4>
                            <div class="modal-resources-grid" id="modalResourcesContent"></div>
                        </div>
                        
                        <!-- Eligibility & Prerequisites Section -->
                        <div class="modal-eligibility" id="modalEligibility" style="display: none;">
                            <h4>Eligibility & Prerequisites</h4>
                            <div id="modalEligibilityContent"></div>
                        </div>
                        
                        <!-- Tools & Technologies Section -->
                        <div class="modal-tools" id="modalTools" style="display: none;">
                            <h4>Tools & Technologies</h4>
                            <div class="modal-tools-list" id="modalToolsContent"></div>
                        </div>
                        
                        <div class="modal-topics-section">
                            <h4>What You'll Learn</h4>
                            <ul class="modal-topics-list" id="modalTopics"></ul>
                        </div>
                        
                        <div class="modal-actions">
                            <a href="register.html" class="btn-primary" id="modalRegisterBtn">Register Now</a>
                            <button class="btn-secondary modal-close">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Initialize modal if on courses page or if view-details buttons exist
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    if (viewDetailsButtons.length > 0) {
        createModal();
    }

    // Open modal with course data
    function openModal(courseId) {
        const modal = document.getElementById('courseModal');
        if (!modal) return;

        const data = courseData[courseId];
        if (!data) return;

        // Populate modal
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalIcon').innerHTML = `<i class="${data.icon}"></i>`;
        document.getElementById('modalDescription').textContent = data.description;
        
        // Meta information
        const metaHTML = `
            <span><i class="fa-regular fa-clock"></i> ${data.duration}</span>
            <span><i class="fa-solid fa-signal"></i> ${data.level}</span>
        `;
        document.getElementById('modalMeta').innerHTML = metaHTML;

        // Topics list
        const topicsHTML = data.topics.map(topic => `<li>${topic}</li>`).join('');
        document.getElementById('modalTopics').innerHTML = topicsHTML;

        // Future-ready: Resources section (PDFs, brochures, etc.)
        // This structure is ready for future implementation
        const resourcesSection = document.getElementById('modalResources');
        const resourcesContent = document.getElementById('modalResourcesContent');
        if (data.resources && data.resources.length > 0) {
            const resourcesHTML = data.resources.map(resource => `
                <a href="${resource.url}" class="resource-link" target="_blank">
                    <i class="${resource.icon || 'fa-solid fa-file-pdf'}"></i>
                    <span>${resource.label}</span>
                </a>
            `).join('');
            resourcesContent.innerHTML = resourcesHTML;
            resourcesSection.style.display = 'block';
        } else {
            resourcesSection.style.display = 'none';
        }

        // Future-ready: Eligibility & Prerequisites
        const eligibilitySection = document.getElementById('modalEligibility');
        const eligibilityContent = document.getElementById('modalEligibilityContent');
        if (data.eligibility) {
            eligibilityContent.innerHTML = `<p>${data.eligibility}</p>`;
            eligibilitySection.style.display = 'block';
        } else {
            eligibilitySection.style.display = 'none';
        }

        // Future-ready: Tools & Technologies
        const toolsSection = document.getElementById('modalTools');
        const toolsContent = document.getElementById('modalToolsContent');
        if (data.tools && data.tools.length > 0) {
            const toolsHTML = data.tools.map(tool => `<span class="tool-badge">${tool}</span>`).join('');
            toolsContent.innerHTML = toolsHTML;
            toolsSection.style.display = 'block';
        } else {
            toolsSection.style.display = 'none';
        }

        // Set course ID for registration
        const registerBtn = document.getElementById('modalRegisterBtn');
        const courseParam = encodeURIComponent(courseId);
        registerBtn.href = `register.html?course=${courseParam}`;

        // Show modal
        modal.classList.add('active');
        // Prevent body scroll on mobile
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        // Prevent iOS Safari bounce scroll
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
    }

    // Close modal
    function closeModal() {
        const modal = document.getElementById('courseModal');
        if (modal) {
            modal.classList.remove('active');
            // Restore body scroll
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        }
    }

    // Event listeners for modal
    document.addEventListener('click', (e) => {
        // Open modal on "View Details" button click
        const viewDetailsBtn = e.target.closest('.view-details-btn');
        if (viewDetailsBtn) {
            e.preventDefault();
            e.stopPropagation();
            const card = viewDetailsBtn.closest('.course-card');
            if (card) {
                const courseId = card.getAttribute('data-course');
                if (courseId) {
                    openModal(courseId);
                }
            }
        }

        // Close modal - handle both click and touch events
        const modalCloseBtn = e.target.closest('.modal-close');
        if (modalCloseBtn) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        }
        
        // Close modal when clicking overlay (but not the modal content)
        if (e.target.id === 'courseModal' && e.target === e.currentTarget) {
            e.preventDefault();
            closeModal();
        }
    });
    
    // Also handle touch events for better mobile support
    document.addEventListener('touchend', (e) => {
        const modalCloseBtn = e.target.closest('.modal-close');
        if (modalCloseBtn) {
            e.preventDefault();
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // --- Google Sheets Integration for Course Data ---
    // This function can be used to fetch course data from Google Sheets
    // Replace the URL with your Google Apps Script web app URL that returns JSON
    async function fetchCourseDataFromSheets() {
        // Example: Replace with your Google Apps Script URL
        // const SHEETS_API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
        
        // try {
        //     const response = await fetch(SHEETS_API_URL);
        //     const data = await response.json();
        //     return data;
        // } catch (error) {
        //     console.error('Error fetching course data:', error);
        //     return null;
        // }
        
        // For now, using static data defined above
        return courseData;
    }

    // --- Course Selection in Registration Form ---
    // Auto-fill course selection from URL parameter
    if (registerForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedCourse = urlParams.get('course');
        
        // Add course selection field if it doesn't exist
        let courseSelectField = document.getElementById('selectedCourse');
        
        if (!courseSelectField) {
            const courseSelectGroup = document.createElement('div');
            courseSelectGroup.className = 'form-group course-selection-group';
            courseSelectGroup.innerHTML = `
                <label for="selectedCourse">Interested Course</label>
                <select id="selectedCourse" name="selectedCourse">
                    <option value="">Select a course (optional)</option>
                    <option value="python-fullstack">Full Stack Python Development</option>
                    <option value="backend-python">Backend with Python & Django</option>
                    <option value="database-orm">Database & ORM</option>
                    <option value="frontend">Frontend Essentials</option>
                    <option value="professional">Professional Readiness</option>
                </select>
            `;
            
            // Insert after phone field
            const phoneField = document.getElementById('phone');
            if (phoneField) {
                phoneField.closest('.form-group').after(courseSelectGroup);
                courseSelectField = document.getElementById('selectedCourse');
            }
        }
        
        // Set the selected course from URL parameter
        if (courseSelectField && selectedCourse && courseData[selectedCourse]) {
            courseSelectField.value = selectedCourse;
        }
    }

});