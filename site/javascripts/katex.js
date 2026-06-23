/* KaTeX 懒加载：仅当页面含数学公式时才加载 CDN 资源 */
function initKatex() {
  var body = document.body;
  if (!body) return;

  var html = body.textContent || "";
  var hasMath = html.indexOf("$") !== -1 || html.indexOf("\\(") !== -1 || html.indexOf("\\[") !== -1;

  if (!hasMath) return;

  Promise.all([
    loadStyle("https://unpkg.com/katex@0/dist/katex.min.css"),
    loadScript("https://unpkg.com/katex@0/dist/katex.min.js"),
    loadScript("https://unpkg.com/katex@0/dist/contrib/auto-render.min.js")
  ]).then(function () {
    if (typeof renderMathInElement === "function") {
      renderMathInElement(body, {
        delimiters: [
          { left: "$$",  right: "$$",  display: true },
          { left: "$",   right: "$",   display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ]
      });
    }
  }).catch(function (err) {
    console.error("KaTeX 加载失败:", err);
  });
}

function loadScript(src) {
  return new Promise(function (resolve, reject) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function loadStyle(href) {
  return new Promise(function (resolve, reject) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    l.onload = resolve;
    l.onerror = reject;
    document.head.appendChild(l);
  });
}

document$.subscribe(initKatex);
