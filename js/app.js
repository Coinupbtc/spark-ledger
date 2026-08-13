/* Spark Ledger shell: filter, open, integrity check. */
(function (g) {
  const state = {
    filter: "ALL",
    selected: null,
  };

  function cards() {
    return (g.LEDGER_SEED && g.LEDGER_SEED.cards) || [];
  }

  function visible() {
    if (state.filter === "ALL") return cards();
    return cards().filter((c) => c.decision === state.filter);
  }

  function paint() {
    document.querySelectorAll("nav [data-filter]").forEach((b) => {
      b.classList.toggle("on", b.getAttribute("data-filter") === state.filter);
    });
    const main = document.getElementById("main");
    main.innerHTML = state.selected
      ? g.LedgerRender.detail(cards().find((c) => c.id === state.selected))
      : g.LedgerRender.blotter(visible(), g.LEDGER_SEED);
    const foot = document.getElementById("foot");
    if (foot && g.LEDGER_SEED) {
      foot.textContent =
        "v" + g.LEDGER_SEED.meta.version + " · " + cards().length + " cards · every figure cites a public URL";
    }
  }

  document.addEventListener("click", (e) => {
    const filt = e.target.closest("[data-filter]");
    if (filt) {
      state.filter = filt.getAttribute("data-filter");
      state.selected = null;
      paint();
      window.scrollTo(0, 0);
      return;
    }
    const open = e.target.closest("[data-open]");
    if (open) {
      state.selected = open.getAttribute("data-open");
      paint();
      window.scrollTo(0, 0);
      return;
    }
    if (e.target.closest("[data-back]")) {
      state.selected = null;
      paint();
      window.scrollTo(0, 0);
    }
  });

  g.LedgerUi = { paint: paint, state: state };
  paint();
  const q = new URLSearchParams(location.search);
  if (q.get("id")) {
    state.selected = q.get("id");
    paint();
  }
  if (q.get("filter")) {
    state.filter = q.get("filter");
    state.selected = null;
    paint();
  }
})(window);
