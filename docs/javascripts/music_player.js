const MUSIC_ICON = `<svg viewBox="0 0 24 24"><path d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8,12 6,14 6,16.5C6,19 8,21 10.5,21C13,21 15,19 15,16.5V6H19V3H12Z" /></svg>`;

let musicDepsLoaded = false;

function initMusicPlayer() {
    if (document.getElementById("music-player-toggle")) return;
    createMusicUI();
}

function createMusicUI() {
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "music-player-toggle";
    toggleBtn.title = "Music Player";
    toggleBtn.innerHTML = MUSIC_ICON;
    document.body.appendChild(toggleBtn);

    const playerContainer = document.createElement("div");
    playerContainer.id = "music-player-container";
    document.body.appendChild(playerContainer);

    toggleBtn.addEventListener("click", () => {
        if (!musicDepsLoaded) {
            musicDepsLoaded = true;
            loadMusicDeps().then(() => {
                createMetingPlayer(playerContainer);
                playerContainer.classList.add("show");
                toggleBtn.classList.add("active");
            });
            return;
        }
        playerContainer.classList.toggle("show");
        toggleBtn.classList.toggle("active");
    });
}

function loadMusicDeps() {
    return Promise.all([
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.js"),
        loadScript("https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"),
        loadStyle("https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.css")
    ]);
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

function loadStyle(href) {
    return new Promise((resolve, reject) => {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = href;
        l.onload = resolve;
        l.onerror = reject;
        document.head.appendChild(l);
    });
}

function createMetingPlayer(container) {
    const metingElement = document.createElement("meting-js");
    metingElement.setAttribute("server", "netease");
    metingElement.setAttribute("type", "playlist");
    metingElement.setAttribute("id", "17583751945");
    metingElement.setAttribute("fixed", "false");
    metingElement.setAttribute("mini", "false");
    metingElement.setAttribute("autoplay", "false");
    metingElement.setAttribute("list-folded", "true");
    metingElement.setAttribute("theme", "#2980b9");
    metingElement.setAttribute("volume", "0.7");
    metingElement.setAttribute("preload", "none");
    container.appendChild(metingElement);
}

document$.subscribe(initMusicPlayer);
