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

            const payload = {
                name: this.name.value,
                email: this.email.value,
                phone: this.phone.value,
                status: this.status?.value || "",
                college: this.college?.value || "",
                course: this.course?.value || "",
                branch: this.branch?.value || "",
                passingYear: this.passingYear?.value || ""
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

});