/* ブラッシュアップ用の動き（トップ・サービス・添削の3ページだけ）
   1. スクロールでヘッダーが少し縮む
   2. 章の中身が、画面に入ったときにふわっと出る（0.06秒ずつずらす） */
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
  var targets = document.querySelectorAll(
    "main section:not(.hero):not(.page-hero):not(.lp-hero) .wrap > *, .timeline > li, .episode, .result-col, .service, .plan, .strength"
  );
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });

  // 並んだ項目の入れ物は動かさず、中の項目を1つずつ動かす
  var groups = ".timeline, .episodes, .results, .services, .plans, .strengths";
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
