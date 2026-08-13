/* Blotter + ticket views. Plant English: decide, then numbers. */
(function (g) {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pill(decision) {
    const k = String(decision || "").toLowerCase();
    return '<span class="pill ' + k + '">' + esc(decision) + "</span>";
  }

  function counts(all) {
    const n = { SHIP: 0, KILL: 0, HOLD: 0 };
    all.forEach((c) => {
      if (n[c.decision] != null) n[c.decision] += 1;
    });
    return n;
  }

  function integrity(seed) {
    const bad = (seed.cards || []).filter((c) => !/^https:\/\//.test(c.source || ""));
    return {
      pass: bad.length === 0,
      evidence: bad.length ? "unsourced " + bad.map((c) => c.id).join(",") : "all cards sourced",
    };
  }

  function blotter(rows, seed) {
    const n = counts(seed.cards);
    const iq = integrity(seed);
    return `
      <section class="hero">
        <p class="kicker">Local inference blotter</p>
        <h1>Recipes start the server. This desk decides if it stays.</h1>
        <p class="lede">${esc(seed.meta.rule)} ${esc(seed.meta.disclaimer)}</p>
      </section>
      <div class="kpi-grid">
        <article class="kpi ship"><div class="n">${n.SHIP}</div><div class="l">SHIP</div><p>Incumbent or harness. Keep it.</p></article>
        <article class="kpi kill"><div class="n">${n.KILL}</div><div class="l">KILL</div><p>Measured. Do not retry as folklore.</p></article>
        <article class="kpi hold"><div class="n">${n.HOLD}</div><div class="l">HOLD</div><p>Split verdict. Name the job first.</p></article>
        <article class="kpi ${iq.pass ? "ship" : "kill"}"><div class="n">${iq.pass ? "PASS" : "FAIL"}</div><div class="l">Source integrity</div><p>${esc(iq.evidence)}</p></article>
      </div>
      <section class="card respect">
        <p class="kicker">Credit when due</p>
        <p><a href="${esc(seed.respect.url)}" rel="noopener">${esc(seed.respect.who)}</a> — ${esc(seed.respect.what)}</p>
        <p class="hint">${esc(seed.respect.scope)}</p>
      </section>
      <section class="blotter" aria-label="Decision blotter">
        ${rows.map((c) => `
          <button type="button" class="row" data-open="${esc(c.id)}">
            <span class="when">${esc(c.date)}</span>
            ${pill(c.decision)}
            <span class="id">${esc(c.id)}</span>
            <strong>${esc(c.title)}</strong>
            <span class="metric">${esc(c.metric)}</span>
          </button>`).join("")}
      </section>`;
  }

  function detail(c) {
    if (!c) return "<p>Not found.</p>";
    return `
      <p><button type="button" class="btn" data-back>Back to blotter</button></p>
      <section class="hero">
        <p class="kicker">${esc(c.id)} · ${esc(c.date)}</p>
        <h1>${pill(c.decision)} ${esc(c.title)}</h1>
        <p class="lede">${esc(c.instrument)}</p>
      </section>
      <section class="card">
        <h2>Hypothesis</h2>
        <p>${esc(c.hypothesis)}</p>
        <h2>What we measured</h2>
        <p class="metric-lg">${esc(c.metric)}</p>
        <p>${esc(c.also)}</p>
        <h2>Why this decision</h2>
        <p>${esc(c.why)}</p>
        <h2>Lesson</h2>
        <p>${esc(c.lesson)}</p>
        <p class="source">Source: <a href="${esc(c.source)}" rel="noopener">${esc(c.source_label)}</a></p>
        ${c.mia_recipe ? "<p class='hint'>35B serving baseline: MiaAI Labs Spark recipe (scoped credit on the blotter).</p>" : ""}
      </section>`;
  }

  g.LedgerRender = { blotter: blotter, detail: detail, integrity: integrity, esc: esc };
})(window);
