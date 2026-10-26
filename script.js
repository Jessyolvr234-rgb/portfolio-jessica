

/* ========================================
   PORTFÓLIO — JESSICA MARIA
   JavaScript principal
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initLucideIcons();
  initSmoothScroll();
  initCardInteractions();
  initCurrentYear();
});

function initCurrentYear() {
  const yearElement = document.querySelector("#current-year");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
}

/* ========================================
   1. MENU PARA CELULAR
======================================== */

function initMobileMenu() {
  const menuToggle = document.querySelector("#menu-toggle");
  const navMenu = document.querySelector("#nav-menu");

  if (!menuToggle || !navMenu) return;

  function closeMenu() {
    navMenu.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !navMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });
}

/* ========================================
   2. ÍCONES LUCIDE
======================================== */

function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
    return;
  }

  const existingScript = document.querySelector(
    'script[data-lucide-loader]'
  );

  if (existingScript) {
    existingScript.addEventListener("load", () => {
      window.lucide?.createIcons();
    }, { once: true });

    return;
  }

  const script = document.createElement("script");

  script.src = "https://unpkg.com/lucide@latest";
  script.dataset.lucideLoader = "true";

  script.onload = () => {
    window.lucide?.createIcons();
  };

  script.onerror = () => {
    console.warn("Não foi possível carregar os ícones Lucide.");
  };

  document.head.appendChild(script);
}

/* ========================================
   3. ROLAGEM SUAVE DOS LINKS INTERNOS
======================================== */

function initSmoothScroll() {
  const internalLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });

      history.replaceState(null, "", targetId);
    });
  });
}

/* ========================================
   4. INTERAÇÕES DOS CARTÕES
======================================== */

function initCardInteractions() {
  const cards = document.querySelectorAll(
    ".skill-card, .ai-card, .value-card"
  );

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("is-hovered");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-hovered");
    });
  });
}

/* ==========================================
   ANIMAÇÕES DO PORTFÓLIO
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const prefereMovimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* --------------------------------------
       1. REVELAR SEÇÕES DURANTE A ROLAGEM
    -------------------------------------- */

    const elementosParaAnimar = document.querySelectorAll(
        ".about, .trajectory, .skills, .projects, .contact, " +
        ".project-card, .skill-card, .contact-card"
    );

    if (
        prefereMovimentoReduzido ||
        !("IntersectionObserver" in window)
    ) {
        elementosParaAnimar.forEach((elemento) => {
            elemento.classList.add("motion-visible");
        });
    } else {
        const observador = new IntersectionObserver(
            (entradas, observer) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add("motion-visible");
                        observer.unobserve(entrada.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        elementosParaAnimar.forEach((elemento) => {
            elemento.classList.add("motion-reveal");
            observador.observe(elemento);
        });
    }

    /* --------------------------------------
       2. BOLA ROSA SOMENTE EM ÁREAS VAZIAS
    -------------------------------------- */

    document.addEventListener("click", (event) => {
        if (prefereMovimentoReduzido || event.detail === 0) {
            return;
        }

        const alvo = event.target;

        // Não animar cliques em elementos interativos.
        const elementoProtegido = alvo.closest(`
            a,
            button,
            input,
            textarea,
            select,
            label,
            form,
            img,
            video,
            audio,
            svg,
            canvas,
            [role="button"],
            [role="link"],
            [contenteditable="true"],
            .project-card,
            .skill-card,
            .contact-card,
            .hero-actions,
            .hero-socials
        `);

        if (elementoProtegido) return;

        // Só permite o efeito quando o próprio fundo estrutural
        // recebe o clique, não quando um texto recebe o clique.
        const areaVazia = alvo.matches(
            "body, main, section, footer, header, " +
            ".hero, .container"
        );

        if (!areaVazia) return;

        const bola = document.createElement("div");

        bola.className = "click-reveal";
        bola.style.left = `${event.clientX}px`;
        bola.style.top = `${event.clientY}px`;

        document.body.appendChild(bola);

        bola.addEventListener("animationend", () => {
            bola.remove();
        }, { once: true });
    });
});
