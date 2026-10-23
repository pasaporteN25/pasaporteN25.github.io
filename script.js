(() => {
  const projects = {
    movieInbox: {
      title: "Movie Inbox", type: "public", platforms: ["web", "android"], labels: ["Web", "Android"], active: "web",
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
  const card = document.querySelector("#project-card");
  const title = document.querySelector("#card-title");
  const controls = document.querySelector("#platform-controls");
  const copy = document.querySelector("#public-copy");
  const status = document.querySelector("#private-status");
  const repo = document.querySelector("#repo-action");
  const preview = document.querySelector("#preview-frame");
  const descEs = document.querySelector("#description-es");
  const descEn = document.querySelector("#description-en");
  const stations = [...document.querySelectorAll("[data-project]")];
  let activeProject = "movieInbox";

  function configurePlatforms(project) {
    [...controls.querySelectorAll("[data-platform]")].forEach((button, index) => {
      button.dataset.platform = project.platforms[index];
      button.textContent = project.labels[index];
    });
  }
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
    card.classList.toggle("is-text-only", id === "lexidex");
    controls.hidden = isPrivate;
    copy.hidden = isPrivate;
    status.hidden = !isPrivate;
    repo.hidden = isPrivate;
    preview.hidden = id !== "movieInbox";
    if (!isPrivate) {
      configurePlatforms(project);
      setPlatform(project, project.active);
    }
  }
  stations.forEach((station) => station.addEventListener("click", () => selectProject(station.dataset.project)));
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-platform]");
    if (button) setPlatform(projects[activeProject], button.dataset.platform);
  });
  document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => {
    const language = button.dataset.language;
    document.documentElement.lang = language;
    document.querySelectorAll("[data-es][data-en]").forEach((element) => { element.textContent = element.dataset[language]; });
    document.querySelectorAll("[data-language]").forEach((item) => item.setAttribute("aria-pressed", String(item.dataset.language === language)));
  }));
  selectProject("movieInbox");
})();
(() => {
  const anchors = {
    movieInbox: [34.55, 16.5], lexidex: [62.8, 16.5],
    tdv1: [34.5, 28.4], tdv2: [48.5, 28.4], td3d: [46.8, 37.7], formerWalker: [77.8, 28.4]
  };
  const stage = document.querySelector(".stage");
  const buttons = [...document.querySelectorAll("[data-project]")];
  function updateSelectedLine(id) {
    const [x, y] = anchors[id] || anchors.movieInbox;
    stage.style.setProperty("--selected-x", `${x}%`);
    stage.style.setProperty("--selected-y", `${y}%`);
    stage.classList.toggle("is-game-selected", ["tdv1", "tdv2", "td3d", "formerWalker"].includes(id));
  }
  buttons.forEach((button) => button.addEventListener("click", () => {
    updateSelectedLine(button.dataset.project);
  }));
  updateSelectedLine("movieInbox");
})();
