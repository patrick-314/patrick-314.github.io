function renderSmiles() {
  const elements = document.querySelectorAll(".smiles");

  elements.forEach((el) => {
    if (el.dataset.rendered) return;

    const smiles = el.getAttribute("data-smiles");

    const drawer = new SmilesDrawer.Drawer({
      width: 100,
      height: 100,
    });

    SmilesDrawer.parse(smiles, function (tree) {
      const canvas = document.createElement("canvas");
      el.appendChild(canvas);
      drawer.draw(tree, canvas, "light", false);
      el.dataset.rendered = "true";
    });
  });
}

// 初始加载
document.addEventListener("DOMContentLoaded", renderSmiles);

// Zensical 页面切换（类似 SPA）
document.addEventListener("astro:page-load", renderSmiles);