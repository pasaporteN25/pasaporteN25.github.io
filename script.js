(() => {
  const projects = {
    movieInbox: {
      title: "Movie Inbox", type: "public", platforms: ["web", "android"], labels: ["Web", "Android"], active: "web", preview: true,
      repos: { web: "https://github.com/pasaporteN25/MovieCache", android: "https://github.com/pasaporteN25/MovieCacheAndroid" },
      descriptions: {
        web: { es: "Aplicación web para guardar películas de interés, organizar una lista personal y llevar un seguimiento de lo que quieres ver y lo que ya has visto.", en: "Web application to save movies of interest, organize a personal list and keep track of what you want to watch and what you have already seen." },
        android: { es: "Aplicación Android complementaria para usar la colección sin conexión y sincronizarla con una instancia de Movie Inbox.", en: "Android companion app for using the collection offline and syncing it with a Movie Inbox instance." }
      }
    },
    lexidex: {
      title: "Lexidex", type: "public", platforms: ["mobile", "web"], labels: ["Mobile", "Web"], active: "mobile",
      repos: { mobile: "https://github.com/pasaporteN25/lexidex-mvp", web: "https://github.com/pasaporteN25/lexidex-mvp" },
      descriptions: {
        mobile: { es: "Enciclopedia personal offline-first para buscar términos y explorar relaciones entre ideas.", en: "An offline-first personal encyclopedia for searching terms and exploring relationships between ideas." },
        web: { es: "Enciclopedia personal offline-first para buscar términos y explorar relaciones entre ideas.", en: "An offline-first personal encyclopedia for searching terms and exploring relationships between ideas." }
      }
    },
    tdv1: { title: "TDv1", type: "private" }, tdv2: { title: "TDv2", type: "private" },
    td3d: { title: "TD3D", type: "private" }, formerWalker: { title: "Former Walker", type: "private" }
  };

  const map = document.querySelector("#map");
  const card = document.querySelector("#project-card");
  const link = document.querySelector("#selected-link");
  const title = document.querySelector("#card-title");
  const controls = document.querySelector("#platform-controls");
  const copy = document.querySelector("#public-copy");
  const status = document.querySelector("#private-status");
  const bottomRow = document.querySelector("#card-bottom-row");
  const repo = document.querySelector("#repo-action");
  const preview = document.querySelector("#preview-frame");
  const descEs = document.querySelector("#description-es");
  const descEn = document.querySelector("#description-en");
  const stations = [...document.querySelectorAll("[data-project]")];
  const stacked = window.matchMedia("(max-width: 760px)");
  let activeProject = "movieInbox";

  function setPlatform(project, platform) {
    if (!project.platforms.includes(platform)) return;
    project.active = platform;
    controls.querySelectorAll("[data-platform]").forEach((button) => {
      const selected = button.dataset.platform === platform;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    descEs.textContent = project.descriptions[platform].es;
    descEn.textContent = project.descriptions[platform].en;
    repo.href = project.repos[platform];
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
    const project = projects[id];
    if (!project) return;
    activeProject = id;
    stations.forEach((station) => {
      const selected = station.dataset.project === id;
      station.classList.toggle("is-selected", selected);
      station.setAttribute("aria-pressed", String(selected));
    });
    title.textContent = project.title;
    const isPrivate = project.type === "private";
    card.classList.toggle("is-private", isPrivate);
    card.classList.toggle("is-text-only", !isPrivate && !project.preview);
    controls.hidden = isPrivate;
    copy.hidden = isPrivate;
    bottomRow.hidden = isPrivate;
    status.hidden = !isPrivate;
    preview.hidden = !project.preview;
    if (!isPrivate) {
      controls.querySelectorAll("[data-platform]").forEach((button, index) => {
        button.dataset.platform = project.platforms[index];
        button.textContent = project.labels[index];
      });
      setPlatform(project, project.active);
    }
    positionLink();
  }

  stations.forEach((station) => station.addEventListener("click", () => {
    selectProject(station.dataset.project);
    if (stacked.matches) card.scrollIntoView({ block: "nearest" });
  }));
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-platform]");
    if (button) setPlatform(projects[activeProject], button.dataset.platform);
  });
  document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => {
    const language = button.dataset.language;
    document.documentElement.lang = language;
    document.querySelectorAll("[data-es][data-en]").forEach((element) => { element.textContent = element.dataset[language]; });
    document.querySelectorAll("[data-language]").forEach((item) => item.setAttribute("aria-pressed", String(item.dataset.language === language)));
    positionLink();
  }));

  new ResizeObserver(positionLink).observe(map);
  selectProject(activeProject);
})();
