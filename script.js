// Contact modal
const openBtn = document.getElementById('open-contact');
const closeBtn = document.getElementById('close-contact');
const modal = document.getElementById('contact-modal');
const emailInput = document.getElementById('contact-email');
const sendBtn = document.getElementById('send-email');
const TARGET_EMAIL = 'target@example.com'; // TODO: 替换为你的目标邮箱
const footer = document.querySelector('footer');
const headerEl = document.getElementById('header');

// Contact click -> scroll to footer (no modal)
openBtn?.addEventListener('click', () => {
    footer?.scrollIntoView({ behavior: 'smooth' });
});

// 保留弹窗关闭逻辑，避免残留
const closeModal = () => {
    if (modal) modal.style.display = 'none';
};

// 如果未来仍需弹窗，可取消注释下行：
// const openModal = () => { modal.style.display = 'flex'; emailInput.focus(); };

closeBtn?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

sendBtn?.addEventListener('click', () => {
    const email = (emailInput?.value || '').trim();
    if (!email) {
        emailInput?.focus();
        return;
    }
    const subject = encodeURIComponent('Contact request');
    const body = encodeURIComponent(`Email: ${email}`);
    window.location.href = `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;
    closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Logo hover - blur header background
const logoEl = document.querySelector('.logo');
if (logoEl && headerEl) {
    logoEl.addEventListener('mouseenter', () => {
        headerEl.classList.add('logo-hover-blur');
    });
    logoEl.addEventListener('mouseleave', () => {
        headerEl.classList.remove('logo-hover-blur');
    });
}

// Footer blur on view
if (footer) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    footer.classList.add('blurred');
                    headerEl?.classList.add('header-blur');
                } else {
                    footer.classList.remove('blurred');
                    headerEl?.classList.remove('header-blur');
                }
            });
        },
        { threshold: 0.2 }
    );
    observer.observe(footer);
}

