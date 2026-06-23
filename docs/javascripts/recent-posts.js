/* 主页最近文章列表渲染 */
document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("recent-posts-container");
  if (!container) return;

  fetch("data/recent-posts.json", { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (posts) {
      if (!Array.isArray(posts) || posts.length === 0) {
        container.innerHTML = '<div class="recent-posts-empty">近一个月暂无新文章，去喝杯海盐冰茶吧 ☕</div>';
        return;
      }

      container.textContent = "";
      var wrap = document.createElement("div");
      wrap.className = "recent-posts-grid";

      posts.forEach(function (post) {
        wrap.appendChild(renderCard(post));
      });

      container.appendChild(wrap);
    })
    .catch(function (err) {
      container.innerHTML = '<div class="recent-posts-empty">最近文章加载失败：' + err.message + "</div>";
    });
});

function renderCard(post) {
  var card = document.createElement("a");
  card.className = "rp-card";
  card.href = post.url;

  var dateParts = (post.date || "").split("-");
  var day = dateParts[2] || "";
  var monthYear = dateParts[1] && dateParts[0] ? dateParts[1] + "月 " + dateParts[0] : post.date;

  var badge = document.createElement("div");
  badge.className = "rp-date-badge";
  badge.innerHTML =
    '<span class="rp-date-day">' + day + "</span>" +
    '<span class="rp-date-my">' + monthYear + "</span>";
  card.appendChild(badge);

  var body = document.createElement("div");
  body.className = "rp-body";

  var title = document.createElement("div");
  title.className = "rp-title";
  title.textContent = post.title;
  body.appendChild(title);

  if (post.excerpt) {
    var ex = document.createElement("p");
    ex.className = "rp-excerpt";
    ex.textContent = post.excerpt;
    body.appendChild(ex);
  }

  var meta = document.createElement("div");
  meta.className = "rp-meta";
  meta.innerHTML =
    '<span class="rp-read-more">阅读全文</span>' +
    '<svg class="rp-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
  body.appendChild(meta);

  card.appendChild(body);
  return card;
}
