// PRIORIDAD 3: Control de scroll horizontal según dispositivo
const isMobile = window.innerWidth <= 768;

// Función para detectar si es móvil
function isMobileDevice() {
  return window.innerWidth <= 768 ||
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Función para detectar si es touch device
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Variable para controlar si se deben ejecutar animaciones horizontales
let shouldEnableHorizontalScroll = !isMobileDevice();

// Función para inicializar o destruir scroll horizontal
function handleHorizontalScrollSetup() {

  const isMobile = isMobileDevice();

  if (isMobile) {
    // MÓVIL: Desactivar scroll horizontal
    console.log('Móvil detectado - Desactivando scroll horizontal');

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.id === 'horizontalPin' || trigger.vars.id === 'horizontalPinIzq') {
          trigger.kill();
        }
      });
    }

    // Resetear estilos de elementos horizontales
    gsap.set("#pinWrap, #pinWrapIzq", {
      x: 0,
      clearProps: "transform"
    });

    // Aplicar estilos móviles a las secciones horizontales
    document.querySelectorAll('.horizontal-section').forEach(section => {
      section.style.overflow = 'visible';
      section.style.height = 'auto';
    });

    document.querySelectorAll('.horizontal-container').forEach(container => {
      container.style.overflow = 'visible';
      container.style.height = 'auto';
    });

    document.querySelectorAll('.horizontal-content').forEach(content => {
      content.style.display = 'block';
      content.style.width = '100%';
      content.style.flexDirection = 'column';
    });

    document.querySelectorAll('.horizontal-item').forEach(item => {
      item.style.width = '100%';
      item.style.minWidth = 'auto';
      item.style.marginBottom = '2rem';
    });

  } else {
    // DESKTOP: Activar scroll horizontal
    console.log('Desktop detectado - Activando scroll horizontal');
    shouldEnableHorizontalScroll = true;

    // Restaurar estilos desktop
    document.querySelectorAll('.horizontal-section').forEach(section => {
      section.style.overflow = 'hidden';
      section.style.height = '100vh';
    });

    // Inicializar animaciones horizontales
    initHorizontalScrollAnimations();
  }
}

// Función para inicializar animaciones horizontales (solo desktop)
function initHorizontalScrollAnimations() {
  if (!shouldEnableHorizontalScroll) return;

  const pinWrap = document.querySelector("#pinWrap");
  const sectionPin = document.querySelector("#sectionPin");

  if (pinWrap && sectionPin) {
    const scrollLength = pinWrap.scrollWidth - window.innerWidth;

    gsap.to(pinWrap, {
      x: () => `-${scrollLength}`,
      ease: "none",
      scrollTrigger: {
        trigger: sectionPin,
        start: "top top",
        end: () => `+=${scrollLength}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        id: 'horizontalPin'
      }
    });
  }

  const pinWrapIzq = document.querySelector("#pinWrapIzq");
  const sectionPinIzq = document.querySelector("#sectionPinIzq");

  if (pinWrapIzq && sectionPinIzq) {
    const scrollLengthIzq = pinWrapIzq.scrollWidth - window.innerWidth;

    // ✅ NO CAMBIES EL SIGNO
    gsap.to(pinWrapIzq, {
      x: () => `${scrollLengthIzq}`,
      ease: "none",
      scrollTrigger: {
        trigger: sectionPinIzq,
        start: "top top",
        end: () => `+=${scrollLengthIzq}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        id: 'horizontalPinIzq'
      }
    });
  }

  ScrollTrigger.refresh();
}

// CSS adicional para móvil (agregar con JavaScript)
function addMobileStyles() {
  if (isMobileDevice()) {
    const mobileStyles = `
      <style id="mobile-horizontal-styles">
        @media (max-width: 768px) {
          .horizontal-section {
            height: auto !important;
            overflow: visible !important;
          }

          .horizontal-container {
            height: auto !important;
            overflow: visible !important;
          }

          .horizontal-content {
            display: block !important;
            width: 100% !important;
            flex-direction: column !important;
            transform: none !important;
          }

          .horizontal-item {
            width: 100% !important;
            min-width: auto !important;
            margin-bottom: 2rem !important;
            padding: 1rem !important;
          }

          .horizontal-card {
            flex-direction: column !important;
            text-align: center !important;
          }

          .horizontal-video {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            margin-bottom: 1rem !important;
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', mobileStyles);
  }
}

// Función debounce para optimizar resize
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Función alternativa: Deshabilitar solo en touch devices
function disableHorizontalOnTouch() {
  if (isTouchDevice()) {
    document.querySelectorAll('.horizontal-section').forEach(section => {
      section.style.touchAction = 'pan-y pinch-zoom';
      section.style.overflowX = 'hidden';
    });
  }
}

// En tu main.js - Optimizar para touch
ScrollTrigger.config({
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  ignoreMobileResize: true
});

// Video Modal - Funciones globales
function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const player = document.getElementById('videoPlayer');

  if (modal && player) {
    modal.style.display = 'none';
    player.pause();
    player.src = "";
  }
}

function openVideoModal(src) {
  const modal = document.getElementById('videoModal');
  const player = document.getElementById('videoPlayer');

  if (modal && player && src) {
    modal.style.display = 'flex';
    player.src = src;
    player.play();
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // Esperar a que GSAP esté listo
  gsap.registerPlugin(ScrollTrigger);

  // Configurar según dispositivo
  handleHorizontalScrollSetup();

  // Agregar estilos móviles
  addMobileStyles();

  // Scroll inicial
  window.scrollTo(0, 0);

  // Configuración inicial
  const config = {
    scrollDuration: 600,
    touchThreshold: 30,
    intersectionThreshold: 0.7,
    transitionDelay: 300,
    pointerEventsDelay: 1400
  };

  const colors = ['#00D4FF', '#facc15', '#86efac', '#FF6B35', '#00FF88', '#facc15', '#00D4FF', '#86efac'];

  // Elementos del DOM
  const elements = {
    textBlocks: document.querySelectorAll('.text-block'),
    nextSection: document.querySelector('.scrollable-section'),
    scrollableTextBlocks: document.querySelectorAll('.scrollable-text-block'),
    scrollableSection: document.getElementById('scrollableSection'),
    heroSplit: document.querySelector('.hero-split'),
    sectionPin: document.getElementById('sectionPin'),
    sectionPinIzq: document.getElementById('sectionPinIzq'),
    pinWrap: document.getElementById('pinWrap'),
    pinWrapIzq: document.getElementById('pinWrapIzq'),
    videoElements: document.querySelectorAll('.video-preview')
  };

  // Validación de elementos críticos
  if (!elements.textBlocks.length) {
    console.warn('No se encontraron elementos .text-block');
    return;
  }

  // Estado de la aplicación
  const state = {
    currentBlock: 0,
    currentScrollableBlock: 0,
    isScrolling: false,
    isScrollableScrolling: false,
    transitioningToNextSection: false,
    listenersAttached: false
  };

  // Configuración de videos
  function initVideoModal() {
    elements.videoElements.forEach(video => {
      video.addEventListener('click', () => {
        const src = video.getAttribute('src');
        if (src) openVideoModal(src);
      });
    });
  }

  // Funciones de utilidad
  function applyBlockStyles(block, isActive, colorIndex) {
    if (!block) return;

    block.classList.toggle('active', isActive);
    block.style.opacity = isActive ? '1' : '0';
    block.style.transform = isActive ? 'translateY(0)' : 'translateY(20px)';
    block.style.color = colors[colorIndex] || '#ffffff';
  }

  function disableScrollTemporarily(duration = 1000) {
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';

    setTimeout(() => {
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
    }, duration);
  }

  // Sección Hero - Navegación por bloques de texto
  function showBlock(index) {
    if (!elements.textBlocks.length) return;

    elements.textBlocks.forEach((block, i) => {
      applyBlockStyles(block, i === index, i);
    });
  }

  function handleHeroScroll(direction) {
    if (state.isScrolling) return;

    state.isScrolling = true;

    if (direction > 0) {
      if (state.currentBlock < elements.textBlocks.length - 1) {
        state.currentBlock++;
        showBlock(state.currentBlock);
      } else if (elements.nextSection) {
        disableScrollTemporarily(1300);
        gsap.to(window, {
          scrollTo: {
            y: elements.nextSection,
            autoKill: false
          },
          duration: 1.2,
          ease: "power2.inOut"
        });
        removeHeroListeners();
      }
    } else if (direction < 0 && state.currentBlock > 0) {
      state.currentBlock--;
      showBlock(state.currentBlock);
    }

    setTimeout(() => {
      state.isScrolling = false;
    }, config.scrollDuration);
  }

  // Event handlers para la sección hero
  function heroWheelHandler(e) {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    handleHeroScroll(delta);
  }

  let heroTouchStartY = 0;
  function heroTouchStartHandler(e) {
    heroTouchStartY = e.touches[0].clientY;
  }

  function heroTouchEndHandler(e) {
    const delta = heroTouchStartY - e.changedTouches[0].clientY;
    if (Math.abs(delta) > config.touchThreshold) {
      handleHeroScroll(Math.sign(delta));
    }
  }

  function removeHeroListeners() {
    window.removeEventListener('wheel', heroWheelHandler);
    window.removeEventListener('touchstart', heroTouchStartHandler);
    window.removeEventListener('touchend', heroTouchEndHandler);
  }

  function initHeroSection() {
    if (!elements.textBlocks.length) return;

    document.body.style.overflow = 'hidden';
    showBlock(state.currentBlock);

    window.addEventListener('wheel', heroWheelHandler, { passive: false });
    window.addEventListener('touchstart', heroTouchStartHandler);
    window.addEventListener('touchend', heroTouchEndHandler);
  }

  // Sección Scrollable - Navegación por bloques
  function showScrollableBlock(index) {
    if (!elements.scrollableTextBlocks.length) return;

    elements.scrollableTextBlocks.forEach((block, i) => {
      applyBlockStyles(block, i === index, i);
    });
  }

  function handleScrollableScroll(direction) {
    if (state.isScrollableScrolling || state.transitioningToNextSection) return;

    state.isScrollableScrolling = true;

    if (direction > 0) {
      if (state.currentScrollableBlock < elements.scrollableTextBlocks.length - 1) {
        state.currentScrollableBlock++;
        showScrollableBlock(state.currentScrollableBlock);
      } else {
        // 🔧 TRANSICIÓN NATURAL: Dejar que el scroll normal tome control
        document.body.style.overflow = 'auto'; // Restaurar scroll normal
        removeScrollableListeners(); // Quitar listeners de scroll personalizado

        // Pequeño delay para que el scroll natural funcione
        setTimeout(() => {
          // El scroll natural llevará a la siguiente sección
        }, 100);
      }
    } else if (direction < 0) {
      if (state.currentScrollableBlock > 0) {
        state.currentScrollableBlock--;
        showScrollableBlock(state.currentScrollableBlock);
      } else {
        transitionToPreviousSection();
      }
    }

    setTimeout(() => {
      state.isScrollableScrolling = false;
    }, config.scrollDuration);
  }

  function transitionToPreviousSection() {
    if (!elements.heroSplit) return;

    disableScrollTemporarily(1300);

    gsap.to(window, {
      scrollTo: {
        y: elements.heroSplit,
        autoKill: false
      },
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        // 👇 Reinicia HERO: muestra primer bloque
        elements.textBlocks.forEach((block, i) => {
          block.classList.toggle('active', i === 0);
          block.style.opacity = i === 0 ? '1' : '0';
          block.style.transform = i === 0 ? 'translateY(0)' : 'translateY(20px)';
        });
        state.currentBlock = 0;

        // 👇 Reactiva los listeners HERO
        window.addEventListener('wheel', heroWheelHandler, { passive: false });
        window.addEventListener('touchstart', heroTouchStartHandler);
        window.addEventListener('touchend', heroTouchEndHandler);

        state.transitioningToNextSection = false;
      }
    });
  }

  // Event handlers para la sección scrollable
  function scrollableWheelHandler(e) {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    handleScrollableScroll(delta);
  }

  let scrollableTouchStartY = 0;
  function scrollableTouchStartHandler(e) {
    scrollableTouchStartY = e.touches[0].clientY;
  }

  function scrollableTouchEndHandler(e) {
    const delta = scrollableTouchStartY - e.changedTouches[0].clientY;
    if (Math.abs(delta) > config.touchThreshold) {
      handleScrollableScroll(Math.sign(delta));
    }
  }

  function attachScrollableListeners() {
    if (state.listenersAttached) return;

    window.addEventListener('wheel', scrollableWheelHandler, { passive: false });
    window.addEventListener('touchstart', scrollableTouchStartHandler);
    window.addEventListener('touchend', scrollableTouchEndHandler);
    state.listenersAttached = true;
  }

  function removeScrollableListeners() {
    window.removeEventListener('wheel', scrollableWheelHandler);
    window.removeEventListener('touchstart', scrollableTouchStartHandler);
    window.removeEventListener('touchend', scrollableTouchEndHandler);
    state.listenersAttached = false;
  }

  // Intersection Observer para la sección scrollable
  function initScrollableObserver() {
    if (!elements.scrollableSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          attachScrollableListeners();
        } else {
          removeScrollableListeners();
        }
      });
    }, { threshold: config.intersectionThreshold });

    observer.observe(elements.scrollableSection);

    return () => observer.disconnect();
  }

  // 🔧 NUEVA FUNCIÓN: Observer para detectar cuando llegamos a la sección horizontal
  function initHorizontalSectionObserver() {
    if (!elements.sectionPin) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Cuando llegamos a la sección horizontal, asegurar que el scroll funciona bien
          console.log('Sección horizontal visible');
          ScrollTrigger.refresh();
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '-10px 0px -10px 0px' // Pequeño margen para evitar triggers prematuros
    });

    observer.observe(elements.sectionPin);
    return () => observer.disconnect();
  }

  // Inicialización principal
  function init() {
    try {
      // Inicializar componentes
      initVideoModal();
      initHeroSection();
      showScrollableBlock(state.currentScrollableBlock);

      // Bloque scrollable automático
      gsap.registerPlugin(ScrollTrigger);
      // ✅ ScrollTrigger para B2B Marketing Section
      const marketingContainer = document.querySelector("#scrollableSection");
      const marketingBlocks = gsap.utils.toArray("#scrollableSection .scrollable-text-block");
      let currentMarketingBlock = 0;

      ScrollTrigger.create({
        trigger: marketingContainer,
        start: "top top",
        end: () => "+=" + marketingContainer.offsetHeight,
        pin: true,
        pinSpacing: true,
        scrub: true,
        onUpdate: self => {
          const newIndex = Math.floor(self.progress * marketingBlocks.length);
          if (newIndex !== currentMarketingBlock) {
            gsap.to(marketingBlocks[currentMarketingBlock], { opacity: 0, y: 20, duration: 0.3 });
            gsap.to(marketingBlocks[newIndex], { opacity: 1, y: 0, duration: 0.3 });
            currentMarketingBlock = newIndex;
          }
        }
      });

      ScrollTrigger.create({
        trigger: marketingContainer,
        start: "top top",
        end: "bottom top",
        onLeaveBack: () => {
          gsap.to(marketingBlocks, { opacity: 0, y: 20, duration: 0.3 });
          gsap.to(marketingBlocks[0], { opacity: 1, y: 0, duration: 0.3 });
          currentMarketingBlock = 0;
        }
      });

      // ✅ ScrollTrigger para ERP Integration Section
      const erpContainer = document.querySelector("#scrollableERP");
      const erpBlocks = gsap.utils.toArray("#scrollableERP .scrollable-text-block");
      let currentERPBlock = 0;

      ScrollTrigger.create({
        trigger: erpContainer,
        start: "top top",
        end: () => "+=" + erpContainer.offsetHeight,
        pin: true,
        pinSpacing: true,
        scrub: true,
        onUpdate: self => {
          const newIndex = Math.floor(self.progress * erpBlocks.length);
          if (newIndex !== currentERPBlock) {
            gsap.to(erpBlocks[currentERPBlock], { opacity: 0, y: 20, duration: 0.3 });
            gsap.to(erpBlocks[newIndex], { opacity: 1, y: 0, duration: 0.3 });
            currentERPBlock = newIndex;
          }
        }
      });

      ScrollTrigger.create({
        trigger: erpContainer,
        start: "top top",
        end: "bottom top",
        onLeaveBack: () => {
          gsap.to(erpBlocks, { opacity: 0, y: 20, duration: 0.3 });
          gsap.to(erpBlocks[0], { opacity: 1, y: 0, duration: 0.3 });
          currentERPBlock = 0;
        }
      });

      // Inicializar observadores
      const cleanupObserver = initScrollableObserver();
      const cleanupHorizontalObserver = initHorizontalSectionObserver(); // 🔧 NUEVO

      // Inicializar GSAP con delay
      setTimeout(() => {
        initHorizontalScrollAnimations();

        // 🔧 ELIMINAMOS LA TRANSICIÓN AUTOMÁTICA PROBLEMÁTICA
        // Ya no forzamos una transición, dejamos que el scroll natural funcione

        if (window.ScrollTrigger) {
          ScrollTrigger.refresh();
        }

      }, 500);

      // Event listener para cambios de tamaño de ventana
      window.addEventListener('resize', debounce(() => {
        handleHorizontalScrollSetup();
        ScrollTrigger.refresh();
      }, 250));

      // Cleanup al unload
      window.addEventListener('beforeunload', () => {
        removeHeroListeners();
        removeScrollableListeners();
        if (cleanupObserver) cleanupObserver();
        if (cleanupHorizontalObserver) cleanupHorizontalObserver(); // 🔧 NUEVO
      });

    } catch (error) {
      console.error('Error en la inicialización:', error);
    }
  }

  // Inicializar aplicación
  init();
});
