/* 说说时间线渲染 */
document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("shuoshuo-container");
  if (!container) return;

  container.classList.add("shuoshuo-loading");
  container.textContent = "加载中…";

  fetch("../data/说说.json", { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (items) {
      if (!Array.isArray(items) || items.length === 0) {
        container.classList.remove("shuoshuo-loading");
        container.textContent = "还没有说说。";
        return;
      }

      items.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      container.classList.remove("shuoshuo-loading");
      container.textContent = "";

      items.forEach(function (item) {
        container.appendChild(renderItem(item));
      });
    })
    .catch(function (err) {
      container.classList.remove("shuoshuo-loading");
      container.classList.add("shuoshuo-error");
      container.textContent = "说说加载失败：" + err.message;
    });
});

function renderItem(item) {
  var el = document.createElement("div");
  el.className = "shuoshuo-item";

  var avatar = document.createElement("div");
  avatar.className = "shuoshuo-avatar";
  var img = document.createElement("img");
  img.src = "/images/patrick.jpg";
  img.alt = "Patrick";
  img.onerror = function () { this.style.visibility = "hidden"; };
  avatar.appendChild(img);
  el.appendChild(avatar);

  var card = document.createElement("div");
  card.className = "shuoshuo-card";

  var header = document.createElement("div");
  header.className = "shuoshuo-header";

  var time = document.createElement("span");
  time.className = "shuoshuo-time";
  var d = new Date(item.date);
  time.textContent = relativeTime(d);
  time.title = d.toLocaleString("zh-CN");
  header.appendChild(time);

  if (item.mood) {
    var mood = document.createElement("span");
    mood.className = "shuoshuo-mood";
    mood.textContent = item.mood;
    header.appendChild(mood);
  }
  card.appendChild(header);

  if (item.content) {
    var content = document.createElement("div");
    content.className = "shuoshuo-content";
    content.textContent = item.content;
    card.appendChild(content);
  }

  if (Array.isArray(item.images) && item.images.length > 0) {
    var gallery = document.createElement("div");
    gallery.className = "shuoshuo-images count-" + Math.min(item.images.length, 9);
    item.images.slice(0, 9).forEach(function (src) {
      var gimg = document.createElement("img");
      gimg.src = src;
      gimg.loading = "lazy";
      gimg.addEventListener("click", function () {
        if (gimg.requestFullscreen) gimg.requestFullscreen();
      });
      gallery.appendChild(gimg);
    });
    card.appendChild(gallery);
  }

  el.appendChild(card);
  return el;
}

function relativeTime(date) {
  var now = Date.now();
  var diff = (now - date.getTime()) / 1000;
  if (diff < 60) return "刚刚";
  if (diff < 3600) return Math.floor(diff / 60) + " 分钟前";
  if (diff < 86400) return Math.floor(diff / 3600) + " 小时前";
  if (diff < 2592000) return Math.floor(diff / 86400) + " 天前";
  if (diff < 31536000) return Math.floor(diff / 2592000) + " 个月前";
  return Math.floor(diff / 31536000) + " 年前";
}
