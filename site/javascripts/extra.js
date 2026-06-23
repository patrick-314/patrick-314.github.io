/* 音乐控制按钮与播放器自动避让页脚 */
function initExtraJs() {
    function updateButtonPosition() {
        const footer = document.querySelector(".md-footer") || document.querySelector("footer");
        if (!footer) return;

        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const distanceToFooter = viewportHeight - footerRect.top;

        const baseBottom = 20;
        let offset = 0;

        if (distanceToFooter > 0) {
            offset = distanceToFooter;
        }

        const musicToggle = document.getElementById("music-player-toggle");
        if (musicToggle) {
            musicToggle.style.bottom = `${baseBottom + 52 + offset}px`;
        }

        const musicContainer = document.getElementById("music-player-container");
        if (musicContainer) {
            musicContainer.style.bottom = `${baseBottom + offset}px`;
        }
    }

    window.addEventListener("scroll", updateButtonPosition, { passive: true });
    window.addEventListener("resize", updateButtonPosition, { passive: true });

    setTimeout(updateButtonPosition, 100);
}

document$.subscribe(initExtraJs);
