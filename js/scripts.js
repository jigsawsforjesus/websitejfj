document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const scrollTop = document.querySelector('.scroll-top');
  const puzzleContainers = document.querySelectorAll('.puzzle-options-container');
  let backdrop = document.querySelector('.puzzle-backdrop');
  let activeModal = null;

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'puzzle-backdrop';
    document.body.appendChild(backdrop);
  }

  const imageBackdrop = document.createElement('div');
  imageBackdrop.className = 'image-lightbox-backdrop';
  document.body.appendChild(imageBackdrop);

  const imageLightbox = document.createElement('div');
  imageLightbox.className = 'image-lightbox';
  imageLightbox.setAttribute('role', 'dialog');
  imageLightbox.setAttribute('aria-modal', 'true');
  imageLightbox.setAttribute('aria-label', 'Expanded puzzle image');
  imageLightbox.innerHTML = `
    <button type="button" class="image-lightbox-close" aria-label="Close expanded image">&times;</button>
    <img src="" alt="" />
  `;
  document.body.appendChild(imageLightbox);

  const imageLightboxImg = imageLightbox.querySelector('img');
  const imageLightboxClose = imageLightbox.querySelector('.image-lightbox-close');

  /* Portal variant modals to body so they center on the viewport */
  puzzleContainers.forEach((container) => {
    const modal = container.querySelector('.puzzle-options-hover');
    if (!modal) return;

    modal.classList.add('puzzle-variant-modal');
    modal.classList.remove('puzzle-options-hover');
    document.body.appendChild(modal);
    container._variantModal = modal;
  });

  const closeImageLightbox = () => {
    imageLightbox.classList.remove('is-visible');
    imageBackdrop.classList.remove('visible');
    imageLightboxImg.removeAttribute('src');
    imageLightboxImg.alt = '';
  };

  const closeModal = () => {
    if (activeModal) {
      activeModal.classList.remove('is-visible');
      activeModal = null;
    }
    backdrop.classList.remove('visible');
    puzzleContainers.forEach((c) => c.classList.remove('is-open'));
  };

  const closeAllOverlays = () => {
    closeModal();
    closeImageLightbox();
  };

  const openImageLightbox = (img) => {
    closeModal();
    imageLightboxImg.src = img.currentSrc || img.src;
    imageLightboxImg.alt = img.alt;
    imageBackdrop.classList.add('visible');
    imageLightbox.classList.add('is-visible');
    imageLightboxClose.focus();
  };

  const openModal = (container) => {
    closeImageLightbox();
    const modal = container._variantModal;
    if (!modal) return;

    if (activeModal && activeModal !== modal) {
      activeModal.classList.remove('is-visible');
    }

    activeModal = modal;
    container.classList.add('is-open');
    backdrop.classList.add('visible');
    modal.classList.add('is-visible');
  };

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    siteNav.querySelectorAll('.js-scroll').forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#') || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 84;
        const offset = headerHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: 'smooth' });

        siteNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  document.querySelectorAll('.product-image-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const img = trigger.querySelector('img');
      if (img) openImageLightbox(img);
    });
  });

  puzzleContainers.forEach((container) => {
    const trigger = container.querySelector('.puzzle-options-trigger');

    if (trigger) {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        if (container.classList.contains('is-open')) {
          closeModal();
        } else {
          openModal(container);
        }
      });
    }
  });

  backdrop.addEventListener('click', closeModal);
  imageBackdrop.addEventListener('click', closeImageLightbox);

  imageLightboxClose.addEventListener('click', (event) => {
    event.preventDefault();
    closeImageLightbox();
  });

  document.querySelectorAll('.variant-modal-close').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeModal();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllOverlays();
  });

  const toggleScrollTop = () => {
    if (!scrollTop) return;
    scrollTop.classList.toggle('visible', window.scrollY > 240);
  };

  window.addEventListener('scroll', toggleScrollTop, { passive: true });
  toggleScrollTop();
});
