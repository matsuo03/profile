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
