/* ブラッシュアップ用の動き（トップ・サービス・添削の3ページだけ）
   1. スクロールでヘッダーが少し縮む
   2. 章の中身が、画面に入ったときにふわっと出る（0.06秒ずつずらす）
   3. 歩みの縦線が、スクロールに合わせて伸びる */
(function () {
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // 自己紹介動画：押されたときに初めてYouTubeを読み込む（ページを重くしないため）
  document.querySelectorAll(".yt[data-yt]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var box = document.createElement("div");
      box.className = "yt is-playing";
      var spot = document.createElement("div");
      box.appendChild(spot);
      link.replaceWith(box);
      loadYouTubeApi(function () { playWithoutCaptions(spot, link.dataset.yt); },
                     function () { spot.replaceWith(plainIframe(link.dataset.yt)); });
    });
  });

  // 動画には字幕を焼き込んであるので、YouTubeの自動字幕は「字幕なし」にする（二重に出るのを防ぐ）
  function playWithoutCaptions(spot, id) {
    var off = function (e) { e.target.setOption("captions", "track", {}); };
    new YT.Player(spot, {
      host: "https://www.youtube-nocookie.com",
      videoId: id,
      playerVars: { autoplay: 1, rel: 0, playsinline: 1 },
      events: {
        onReady: function (e) { e.target.getIframe().title = "松尾隆弘の自己紹介動画"; e.target.playVideo(); },
        onApiChange: off,
        onStateChange: function (e) { if (e.data === YT.PlayerState.PLAYING) off(e); }
      }
    });
  }

  function loadYouTubeApi(done, fail) {
    if (window.YT && window.YT.Player) return done();
    var prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () { if (prev) prev(); done(); };
    var s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.onerror = fail;
    document.head.appendChild(s);
  }

  // 読み込めなかったときは、ふつうの埋め込みで再生する
  function plainIframe(id) {
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
    iframe.title = "松尾隆弘の自己紹介動画";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    return iframe;
  }

  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.documentElement.classList.add("js");

  // 歩みの縦線：スクロールに合わせて、上から少しずつ伸びる
  var timeline = document.querySelector(".story .timeline");
  if (timeline) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var r = timeline.getBoundingClientRect();
      var p = (window.innerHeight * 0.7 - r.top) / r.height;
      timeline.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(3));
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }
  var targets = document.querySelectorAll(
    "main section:not(.hero):not(.page-hero):not(.lp-hero) .wrap > *, .timeline > li, .episode, .result-col, .service, .plan, .strength, .can-col, .work-feature, .work"
  );
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });

  // 並んだ項目の入れ物は動かさず、中の項目を1つずつ動かす
  var groups = ".timeline, .episodes, .results, .services, .plans, .strengths, .can, .works";
  targets.forEach(function (el) {
    if (el.matches(groups)) return;
    // 親がすでに動くものは、二重に動かさない
    if (el.parentElement && el.parentElement.closest(".reveal")) return;
    var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.classList.add("reveal");
    el.style.transitionDelay = Math.min(siblings, 5) * 0.06 + "s";
    io.observe(el);
  });
})();
