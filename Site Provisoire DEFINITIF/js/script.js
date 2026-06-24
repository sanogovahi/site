// ==========================================
// SCRIPT PRINCIPAL CORRIGÉ ET STABLE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // 🔴 GESTION PUB
  // ==========================================
  const ADS_ENABLED = true;
  const adsWrapper = document.getElementById("ads-wrapper");

  function loadAdsState() {
    if (!adsWrapper) return;

    const adsVisible = localStorage.getItem("adsVisible");
    if (adsVisible === "false") {
      adsWrapper.classList.add("ads-hidden");
    }
  }

  window.toggleAds = function () {
    if (!adsWrapper) return;

    const isHidden = adsWrapper.classList.contains("ads-hidden");

    if (isHidden) {
      adsWrapper.classList.remove("ads-hidden");
      localStorage.setItem("adsVisible", "true");
    } else {
      adsWrapper.classList.add("ads-hidden");
      localStorage.setItem("adsVisible", "false");
    }
  };

  loadAdsState();

  if (!ADS_ENABLED && adsWrapper) {
    adsWrapper.classList.add("ads-hidden");
  }

  // ==========================================
  // 🎯 CAROUSEL PUB (sécurisé)
  // ==========================================
  function createCarousel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const track = container.querySelector(".ad-track");
    const slides = container.querySelectorAll(".ad-slide");
    const prevBtn = container.querySelector(".prev");
    const nextBtn = container.querySelector(".next");

    if (!track || slides.length === 0) return;

    let index = 0;
    let interval;

    function updateSlide() {
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
      index = (index + 1) % slides.length;
      updateSlide();
    }

    function prevSlide() {
      index = (index - 1 + slides.length) % slides.length;
      updateSlide();
    }

    function startAuto() {
      interval = setInterval(nextSlide, 3000);
    }

    function stopAuto() {
      clearInterval(interval);
    }

    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    container.addEventListener("mouseenter", stopAuto);
    container.addEventListener("mouseleave", startAuto);

    startAuto();
  }

  createCarousel("adLeft");
  createCarousel("adRight");

  // ==========================================
  // 📷 IMAGE DYNAMIQUE FORMULAIRE
  // ==========================================
  const typeDeclaration = document.getElementById("declaration-type");
  const imageField = document.getElementById("image-field");

  if (typeDeclaration && imageField) {
    typeDeclaration.addEventListener("change", function () {
      const typesAvecImage = ["perte", "vol", "disparition", "autre"];

      if (typesAvecImage.includes(this.value)) {
        imageField.style.display = "block";
      } else {
        imageField.style.display = "none";
      }
    });
  }

  // ==========================================
  // 🍔 MENU HAMBURGER
  // ==========================================
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      nav.classList.toggle("active");
    });
  }

  // ==========================================
  // 📱 SOUS-MENUS MOBILE (CORRIGÉ)
  // ==========================================
  if (window.innerWidth <= 1024) {
    document.querySelectorAll("nav li").forEach(li => {
      const submenu = li.querySelector("ul");
      const link = li.querySelector("a");

      if (submenu && link) {
        submenu.style.display = "none";

        link.addEventListener("click", function (e) {
          e.preventDefault();
          submenu.style.display =
            submenu.style.display === "flex" ? "none" : "flex";
        });
      }
    });
  }

  // ==========================================
  // 🚨 BANNIÈRE URGENCE
  // ==========================================
  const emergencyBannerEnabled = true;
  const banner = document.getElementById("emergency-banner");
  const header = document.querySelector("header");

  if (banner && header) {
    if (emergencyBannerEnabled) {
      banner.style.display = "block";

      setTimeout(() => {
        header.style.marginTop = banner.offsetHeight + "px";
      }, 50);
    } else {
      banner.style.display = "none";
      header.style.marginTop = "0";
    }
  }

  // ==========================================
  // 🌙 MODE SOMBRE
  // ==========================================
  const themeToggle = document.querySelector(".theme-toggle");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");

      localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-mode") ? "dark" : "light"
      );
    });
  }

  // ==========================================
  // 🔗 SCROLL ANCRE
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ==========================================
  // 🔍 RECHERCHE COMMISSARIAT
  // ==========================================
  const searchButton = document.querySelector(".search-button");
  const resultsSection = document.getElementById("results");

  if (searchButton && resultsSection) {
    searchButton.addEventListener("click", function () {
      resultsSection.style.display = "block";
      resultsSection.scrollIntoView({ behavior: "smooth" });
    });
  }

});
