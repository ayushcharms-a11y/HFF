const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const pageBody = document.body;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const currentYearNodes = document.querySelectorAll("[data-current-year]");

currentYearNodes.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const volunteerForm = document.querySelector("[data-volunteer-form]");
const partnershipForm = document.querySelector("[data-partnership-form]");
const hffInbox = "hffcharlotte@gmail.com";

const openHffGmailDraft = (subject, body) => {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    tf: "1",
    to: hffInbox,
    su: subject,
    body,
  });

  window.location.href = `https://mail.google.com/mail/?${params.toString()}`;
};

if (volunteerForm) {
  volunteerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const errorNode = volunteerForm.querySelector(".form-error");
    const successNode = volunteerForm.querySelector(".form-success");
    const nameInput = volunteerForm.querySelector('input[name="name"]');
    const emailInput = volunteerForm.querySelector('input[name="email"]');
    const messageInput = volunteerForm.querySelector('textarea[name="message"]');
    const interestInputs = volunteerForm.querySelectorAll('input[name="interest"]:checked');

    if (errorNode) errorNode.textContent = "";
    if (successNode) successNode.textContent = "";

    const missingRequired =
      !nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim();

    if (missingRequired) {
      errorNode.textContent = "Please fill out your name, email, and message before submitting.";
      return;
    }

    if (interestInputs.length === 0) {
      errorNode.textContent = "Please choose at least one area of interest.";
      return;
    }

    const schoolInput = volunteerForm.querySelector('input[name="school"]');
    const interests = Array.from(interestInputs).map((input) => input.value).join(", ");
    const subject = "HFF Volunteer Form";
    const body =
      [
        `Full Name: ${nameInput.value.trim()}`,
        `Email: ${emailInput.value.trim()}`,
        `School / Organization: ${schoolInput.value.trim()}`,
        `Areas of Interest: ${interests}`,
        "",
        "Why do you want to join HFF?",
        messageInput.value.trim(),
      ].join("\n");

    openHffGmailDraft(subject, body);
    volunteerForm.reset();
    successNode.textContent = "A Gmail draft addressed to HFF is opening now.";
  });
}

if (partnershipForm) {
  partnershipForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const errorNode = partnershipForm.querySelector(".form-error");
    const successNode = partnershipForm.querySelector(".form-success");
    const nameInput = partnershipForm.querySelector('input[name="contact-name"]');
    const emailInput = partnershipForm.querySelector('input[name="email"]');
    const organizationInput = partnershipForm.querySelector('input[name="organization"]');
    const phoneInput = partnershipForm.querySelector('input[name="phone"]');
    const messageInput = partnershipForm.querySelector('textarea[name="message"]');
    const interestInputs = partnershipForm.querySelectorAll(
      'input[name="partnership-interest"]:checked',
    );

    if (errorNode) errorNode.textContent = "";
    if (successNode) successNode.textContent = "";

    const missingRequired =
      !nameInput.value.trim() ||
      !emailInput.value.trim() ||
      !organizationInput.value.trim() ||
      !messageInput.value.trim();

    if (missingRequired) {
      errorNode.textContent =
        "Please fill out your name, email, organization, and message before submitting.";
      return;
    }

    if (interestInputs.length === 0) {
      errorNode.textContent = "Please choose at least one partnership interest.";
      return;
    }

    const interests = Array.from(interestInputs).map((input) => input.value).join(", ");
    const subject = "HFF Partnership Inquiry";
    const body =
      [
        `Contact Name: ${nameInput.value.trim()}`,
        `Email: ${emailInput.value.trim()}`,
        `Business / Organization: ${organizationInput.value.trim()}`,
        `Phone Number: ${phoneInput.value.trim()}`,
        `Partnership Interest: ${interests}`,
        "",
        "How would you like to partner with HFF Charlotte?",
        messageInput.value.trim(),
      ].join("\n");

    openHffGmailDraft(subject, body);
    partnershipForm.reset();
    successNode.textContent = "A Gmail draft addressed to HFF is opening now.";
  });
}

const slideshows = document.querySelectorAll("[data-slideshow]");

slideshows.forEach((slideshow) => {
  const images = slideshow.querySelectorAll(".slideshow-image");
  const captions = slideshow.querySelectorAll(".slideshow-caption");
  const prevButton = slideshow.querySelector(".slideshow-prev");
  const nextButton = slideshow.querySelector(".slideshow-next");
  let currentIndex = 0;

  const renderSlide = (index) => {
    images.forEach((image, imageIndex) => {
      image.classList.toggle("is-active", imageIndex === index);
    });

    captions.forEach((caption, captionIndex) => {
      caption.classList.toggle("is-active", captionIndex === index);
    });
  };

  prevButton?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    renderSlide(currentIndex);
  });

  nextButton?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    renderSlide(currentIndex);
  });
});

const canUseIntersectionObserver = !prefersReducedMotion && "IntersectionObserver" in window;

const revealFlowTarget = (element) => {
  element.classList.add("is-visible");
};

const flowObserver = canUseIntersectionObserver
  ? new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          revealFlowTarget(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      },
    )
  : null;

const registerFlowReveal = (element, options = {}) => {
  const { delay = 0, style = "rise" } = options;

  if (!element || element.dataset.flowReveal === "true") {
    return;
  }

  element.dataset.flowReveal = "true";
  element.classList.add("flow-reveal");

  if (style !== "rise") {
    element.classList.add(`flow-reveal--${style}`);
  }

  element.style.setProperty("--flow-delay", `${delay}ms`);

  if (flowObserver) {
    flowObserver.observe(element);
    return;
  }

  revealFlowTarget(element);
};

const registerFlowGroup = (selector, options = {}) => {
  const { step = 90, maxDelay = 320, styles = "rise" } = options;

  document.querySelectorAll(selector).forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      const style = Array.isArray(styles) ? styles[index % styles.length] : styles;

      registerFlowReveal(child, {
        delay: Math.min(index * step, maxDelay),
        style,
      });
    });
  });
};

const registerFlowSet = (selectors, options = {}) => {
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      registerFlowReveal(element, options);
    });
  });
};

if (pageBody.classList.contains("home-page")) {
  registerFlowSet(
    [".section-heading", ".home-story-copy", ".home-event-copy", ".home-event-card", ".home-cta-panel"],
    { style: "settle" },
  );
  registerFlowGroup(".home-story-cards", { styles: ["drift", "settle", "glide"] });
  registerFlowGroup(".home-learn-grid", { styles: ["focus", "settle", "glide"] });
  registerFlowGroup(".footer-grid", { styles: "settle" });
} else if (pageBody.classList.contains("about-page")) {
  registerFlowSet([".section-heading", ".officer-banner", ".pull-quote"], { style: "drift" });
  registerFlowGroup(".split", { styles: ["drift", "glide"] });
  registerFlowGroup(".officer-grid", { styles: ["drift", "settle", "glide", "settle"] });
  registerFlowGroup(".three-up", { styles: ["drift", "settle", "glide"] });
  registerFlowGroup(".footer-grid", { styles: "drift" });
} else if (pageBody.classList.contains("huntingtons-page")) {
  registerFlowSet([".section-heading", ".fact-panel"], { style: "focus" });
  registerFlowGroup(".split", { styles: ["focus", "glide"] });
  registerFlowGroup(".three-up", { styles: ["focus", "settle", "focus"] });
  registerFlowGroup(".footer-grid", { styles: "focus" });
} else if (pageBody.classList.contains("events-page")) {
  registerFlowSet([".section-heading", ".gallery-card"], { style: "tilt" });
  registerFlowGroup(".event-list", { styles: ["tilt", "glide"] });
  registerFlowGroup(".footer-grid", { styles: "tilt" });
} else if (pageBody.classList.contains("involved-page")) {
  registerFlowSet([".section-heading"], { style: "settle" });
  registerFlowGroup(".form-layout", { styles: ["settle", "glide"] });
  registerFlowGroup(".footer-grid", { styles: "settle" });
} else if (pageBody.classList.contains("donate-page")) {
  registerFlowSet([".section-heading", ".payment-form", ".fundraiser-meter"], { style: "focus" });
  registerFlowGroup(".split", { styles: ["focus", "glide"] });
  registerFlowGroup(".three-up", { styles: ["settle", "focus", "glide"] });
  registerFlowGroup(".footer-grid", { styles: "focus" });
} else {
  registerFlowSet([".section-heading", ".cta-panel", ".gallery-card", ".payment-form"], {
    style: "rise",
  });
  registerFlowGroup(".split");
  registerFlowGroup(".three-up");
  registerFlowGroup(".footer-grid");
}

if (pageBody.classList.contains("home-page") && !prefersReducedMotion) {
  document.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const burst = document.createElement("span");
    burst.className = "home-click-burst";
    burst.style.left = `${event.clientX}px`;
    burst.style.top = `${event.clientY}px`;
    pageBody.appendChild(burst);

    burst.addEventListener(
      "animationend",
      () => {
        burst.remove();
      },
      { once: true },
    );
  });
}

const homeStatsSection = document.querySelector("[data-home-stats]");

if (homeStatsSection) {
  const statCards = homeStatsSection.querySelectorAll(".home-stat-card");
  const statNumbers = homeStatsSection.querySelectorAll(".home-stat-number");

  const formatStatValue = (value, format) => {
    if (format === "comma") {
      return new Intl.NumberFormat("en-US").format(value);
    }

    return String(value);
  };

  const animateStatNumber = (node) => {
    const targetValue = Number(node.dataset.countTo || 0);
    const suffix = node.dataset.countSuffix || "";
    const format = node.dataset.countFormat || "";
    const duration = 1400;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(targetValue * easedProgress);

      node.textContent = `${formatStatValue(nextValue, format)}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  const revealStats = () => {
    statCards.forEach((card) => card.classList.add("is-visible"));

    statNumbers.forEach((node) => {
      if (node.dataset.animated === "true") {
        return;
      }

      node.dataset.animated = "true";

      if (prefersReducedMotion) {
        const targetValue = Number(node.dataset.countTo || 0);
        const suffix = node.dataset.countSuffix || "";
        const format = node.dataset.countFormat || "";
        node.textContent = `${formatStatValue(targetValue, format)}${suffix}`;
        return;
      }

      animateStatNumber(node);
    });
  };

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealStats();
  } else {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          revealStats();
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.35,
      },
    );

    statsObserver.observe(homeStatsSection);
  }
}

const educationFactsPanel = document.querySelector("[data-education-facts]");

if (educationFactsPanel) {
  const factRows = educationFactsPanel.querySelectorAll(".education-fact-row");
  const factValues = educationFactsPanel.querySelectorAll("[data-count-to]");

  const animateFactValue = (node) => {
    const targetValue = Number(node.dataset.countTo || 0);
    const suffix = node.dataset.countSuffix || "";
    const duration = 1300;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(targetValue * easedProgress);

      node.textContent = `${nextValue}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  const revealEducationFacts = () => {
    factRows.forEach((row) => row.classList.add("is-visible"));

    factValues.forEach((node) => {
      if (node.dataset.animated === "true") {
        return;
      }

      node.dataset.animated = "true";

      if (prefersReducedMotion) {
        const targetValue = Number(node.dataset.countTo || 0);
        const suffix = node.dataset.countSuffix || "";
        node.textContent = `${targetValue}${suffix}`;
        return;
      }

      animateFactValue(node);
    });
  };

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEducationFacts();
  } else {
    const educationFactsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          revealEducationFacts();
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.32,
      },
    );

    educationFactsObserver.observe(educationFactsPanel);
  }
}
