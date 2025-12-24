document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modal = document.getElementById('registerModal');
    const registerForm = document.getElementById('registerForm');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    // --- Modal Logic ---
    function openModal() {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }

    // Close on X btn, Cancel btn, or clicking outside
    [closeModalBtn, cancelBtn].forEach(btn => {
        if (btn) btn.addEventListener('click', closeModal);
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- Form Handling ---
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate API call / processing
            const btn = registerForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            btn.innerText = 'Registering...';
            btn.disabled = true;

            setTimeout(() => {
                // Success State
                alert('Registration Successful! Check your email for the joining link.');
                registerForm.reset();
                closeModal();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // --- Mobile Menu ---
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            if (mobileNav.classList.contains('hidden')) {
                mobileNav.classList.remove('hidden');
            } else {
                mobileNav.classList.add('hidden');
            }
        });

        // Close menu when clicking a link
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.add('hidden');
            });
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

});
