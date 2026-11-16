(() => {
  const projects = {
    movieInbox: {
      title: "Movie Inbox", platforms: ["web", "android"], labels: ["Web", "Android"], active: "web",
      details: {
        web: {
          repo: "https://github.com/pasaporteN25/MovieCache", meta: ["Python", "JavaScript", "GPL v3"],
          es: "Aplicación web para guardar películas de interés, organizar una lista personal y llevar un seguimiento de lo que quieres ver y lo que ya has visto.",
          en: "Web application to save movies of interest, organize a personal list and keep track of what you want to watch and what you have already seen."
        },
        android: {
          repo: "https://github.com/pasaporteN25/MovieCacheAndroid", meta: ["Kotlin", "GPL v3"],
          es: "Aplicación Android complementaria para usar la colección sin conexión y sincronizarla con una instancia de Movie Inbox.",
          en: "Android companion app for using the collection offline and syncing it with a Movie Inbox instance."
        }
      }
    },
    lexidex: {
      title: "Lexidex", platforms: ["mobile", "web"], labels: ["Mobile", "Web"], active: "mobile",
      details: {
        mobile: {
          repo: "https://github.com/pasaporteN25/lexidex-mvp", meta: ["Kotlin", "JavaScript", "Python", "GPL v3"],
          es: "Enciclopedia personal offline-first para buscar términos y explorar relaciones entre ideas.",
          en: "An offline-first personal encyclopedia for searching terms and exploring relationships between ideas."
        },
        web: {
          repo: "https://github.com/pasaporteN25/lexidex-mvp", meta: ["Kotlin", "JavaScript", "Python", "GPL v3"],
          es: "Enciclopedia personal offline-first para buscar términos y explorar relaciones entre ideas.",
          en: "An offline-first personal encyclopedia for searching terms and exploring relationships between ideas."
        }
      }
    },
    monstersAndCanons: {
      title: "Monsters & Canons",
      details: {
        repo: "https://github.com/pasaporteN25/MonstersAndCanons", meta: ["Godot 4", "GDScript", "GPL v3"],
        es: "Tower defense 2D de fantasía y tecnología: defiende la colonia de Cántaro decidiendo dónde construir, qué torres mejorar y cómo combinarlas a lo largo de una campaña de 15 niveles. En desarrollo; todavía no hay descarga pública.",
        en: "A 2D fantasy-and-technology tower defense: defend the colony of Cántaro by deciding where to build, which towers to upgrade and how to combine them across a 15-level campaign. In development; there is no public download yet."
      },
      preview: {
        src: "assets/screens/monsters-and-canons.png",
        alt: { es: "Mapa de pradera con un camino de tierra, una torre colocada y la barra de torres disponibles", en: "Meadow map with a dirt path, one tower placed and the bar of available towers" },
        caption: { es: "Preparación de la defensa antes de la primera oleada", en: "Setting up the defence before the first wave" }
      }
    }
  };
  const titles = { es: "pasaporteN25 — proyectos en movimiento", en: "pasaporteN25 — projects in motion" };

  const map = document.querySelector("#map");
  const card = document.querySelector("#project-card");
  const link = document.querySelector("#selected-link");
  const title = document.querySelector("#card-title");
  const controls = document.querySelector("#platform-controls");
  const description = document.querySelector("#card-description");
  const meta = document.querySelector("#card-meta");
  const repo = document.querySelector("#repo-action");
  const preview = document.querySelector("#preview-frame");
  const previewImage = document.querySelector("#preview-image");
  const previewCaption = document.querySelector("#preview-caption");
  const stations = [...document.querySelectorAll("[data-project]")];
  const stacked = window.matchMedia("(max-width: 760px)");
  let activeProject = "movieInbox";
  let language = "es";

  // Fills the card for the active project, platform and language.
  function renderCard() {
    const project = projects[activeProject];
    const details = project.platforms ? project.details[project.active] : project.details;
    title.textContent = project.title;
    description.textContent = details[language];
    meta.replaceChildren(...details.meta.map((item) => Object.assign(document.createElement("li"), { textContent: item })));
    repo.href = details.repo;

    controls.hidden = !project.platforms;
    if (project.platforms) {
      controls.querySelectorAll("[data-platform]").forEach((button, index) => {
        const selected = project.platforms[index] === project.active;
        button.dataset.platform = project.platforms[index];
        button.textContent = project.labels[index];
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    }

    preview.hidden = !project.preview;
    card.classList.toggle("is-text-only", !project.preview);
    if (project.preview) {
      previewImage.src = project.preview.src;
      previewImage.alt = project.preview.alt[language];
      previewCaption.textContent = project.preview.caption[language];
    }
    positionLink();
  }

  // Draws the dotted connector from the selected station down to the card.
  function positionLink() {
    const station = stations.find((item) => item.classList.contains("is-selected"));
    if (!station || stacked.matches) return;
    const origin = map.getBoundingClientRect();
    const marker = station.querySelector(".station-marker").getBoundingClientRect();
    const top = marker.bottom - origin.top + 6;
    const height = card.getBoundingClientRect().top - origin.top - top;
    link.style.left = `${marker.left + marker.width / 2 - origin.left - 1.5}px`;
    link.style.top = `${top}px`;
    link.style.height = `${Math.max(height, 0)}px`;
    link.classList.toggle("is-game", Boolean(station.closest(".games-network")));
  }

  function selectProject(id) {
    if (!projects[id]) return;
    activeProject = id;
    stations.forEach((station) => {
      const selected = station.dataset.project === id;
      station.classList.toggle("is-selected", selected);
      station.setAttribute("aria-pressed", String(selected));
    });
    renderCard();
  }

  function setLanguage(next) {
    language = next === "en" ? "en" : "es";
    document.documentElement.lang = language;
    document.title = titles[language];
    document.querySelectorAll("[data-es][data-en]").forEach((element) => { element.textContent = element.dataset[language]; });
    document.querySelectorAll("[data-aria-es][data-aria-en]").forEach((element) => {
      element.setAttribute("aria-label", language === "en" ? element.dataset.ariaEn : element.dataset.ariaEs);
    });
    document.querySelectorAll("[data-language]").forEach((item) => item.setAttribute("aria-pressed", String(item.dataset.language === language)));
    renderCard();
  }

  function storedLanguage() {
    try { return localStorage.getItem("language"); } catch { return null; }
  }

  stations.forEach((station) => station.addEventListener("click", () => {
    selectProject(station.dataset.project);
    if (stacked.matches) card.scrollIntoView({ block: "nearest" });
  }));
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-platform]");
    if (!button) return;
    projects[activeProject].active = button.dataset.platform;
    renderCard();
  });
  document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => {
    setLanguage(button.dataset.language);
    try { localStorage.setItem("language", language); } catch { /* Preference is optional. */ }
  }));

  // Marks the navigation entry for the section in view.
  const navProjects = document.querySelector("#nav-projects");
  const navAbout = document.querySelector("#nav-about");
  new IntersectionObserver(([entry]) => {
    navAbout.classList.toggle("is-active", entry.isIntersecting);
    navProjects.classList.toggle("is-active", !entry.isIntersecting);
  }, { threshold: 0.6 }).observe(document.querySelector("#about"));

  new ResizeObserver(positionLink).observe(map);
  previewImage.addEventListener("load", positionLink);
  if (document.fonts) document.fonts.ready.then(positionLink);
  setLanguage(storedLanguage() || (navigator.language.toLowerCase().startsWith("es") ? "es" : "en"));
})();
