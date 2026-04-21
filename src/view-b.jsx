// View B — "Cohort Explorer"
// Interactive: filter respondents by cohort, see how every answer re-slices.
// Lives inside an artboard, so it must be self-contained with its own scroll.

function ViewB({ data }) {
  const { agg, quotes } = data;
  const raw = window.__RAW__ || [];

  // Available filter dimensions
  const BOROUGHS = ['Brooklyn','Manhattan','Queens','Bronx','Staten Island'];
  const IDEOLOGIES = [...new Set(raw.map(r => r.ideology).filter(Boolean))];
  const AGES = [
    { label: '17–24', test: a => a != null && a >= 17 && a <= 24 },
    { label: '25–29', test: a => a != null && a >= 25 && a <= 29 },
    { label: '30–34', test: a => a != null && a >= 30 && a <= 34 },
    { label: '35–44', test: a => a != null && a >= 35 && a <= 44 },
    { label: '45+', test: a => a != null && a >= 45 },
  ];
  const START_WINDOWS = [
    { label: 'Early (Pre-Mar 2025)', months: ['Pre-October 2024','October 2024','November 2024','December 2024','January 2025','February 2025'] },
    { label: 'Primary push (Mar–Jun 2025)', months: ['March 2025','April 2025','May 2025','June 2025'] },
    { label: 'General election (Jul–Sep 2025)', months: ['July 2025','August 2025','September 2025'] },
  ];

  const [filters, setFilters] = React.useState({
    borough: null,
    age: null,
    ideology: null,
    startWindow: null,
    fieldLead: null,
    firstCampaign: null,
  });

  function toggle(key, value) {
    setFilters(f => ({ ...f, [key]: f[key] === value ? null : value }));
  }
  function clear() {
    setFilters({ borough: null, age: null, ideology: null, startWindow: null, fieldLead: null, firstCampaign: null });
  }

  const filtered = raw.filter(r => {
    if (filters.borough && r.borough !== filters.borough) return false;
    if (filters.age) {
      const age = r.birth_year ? 2025 - r.birth_year : null;
      const bucket = AGES.find(b => b.label === filters.age);
      if (!bucket || !bucket.test(age)) return false;
    }
    if (filters.ideology && r.ideology !== filters.ideology) return false;
    if (filters.startWindow) {
      const w = START_WINDOWS.find(x => x.label === filters.startWindow);
      if (!w || !w.months.includes(r.when_started)) return false;
    }
    if (filters.fieldLead != null) {
      const wasLead = r.field_lead && /Yes|Sometimes|Frequently|field lead/i.test(r.field_lead);
      if (filters.fieldLead === 'lead' && !wasLead) return false;
      if (filters.fieldLead === 'nonlead' && wasLead) return false;
    }
    if (filters.firstCampaign != null) {
      const wasFirst = r.prior_involvement && /never/i.test(r.prior_involvement);
      if (filters.firstCampaign === 'first' && !wasFirst) return false;
      if (filters.firstCampaign === 'veteran' && wasFirst) return false;
    }
    return true;
  });

  const N = filtered.length;
  const ALL = raw.length;

  // ---------- aggregate on filtered set ----------
  function countField(field, limit = 10) {
    const c = {};
    filtered.forEach(r => {
      const v = r[field];
      if (Array.isArray(v)) v.forEach(x => { if (x) c[x]=(c[x]||0)+1; });
      else if (v !== null && v !== undefined && v !== '') c[v] = (c[v]||0)+1;
    });
    return Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0, limit);
  }
  function countAll(field, limit = 10) {
    const c = {};
    raw.forEach(r => {
      const v = r[field];
      if (Array.isArray(v)) v.forEach(x => { if (x) c[x]=(c[x]||0)+1; });
      else if (v !== null && v !== undefined && v !== '') c[v] = (c[v]||0)+1;
    });
    return Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0, limit);
  }

  // Comparative bar — filtered vs overall. Two stacked rows; shared 0–100% scale so
  // equal values show equal-length bars (not "flush" / overlapping). Delta in mono.
  function CompareBar({ label, filtValue, allValue, filtTotal, allTotal, width = 220 }) {
    const fp = filtTotal > 0 ? filtValue / filtTotal : 0;
    const ap = allTotal > 0 ? allValue / allTotal : 0;
    const delta = Math.round((fp - ap) * 100);
    const deltaStr = delta === 0 ? '±0' : (delta > 0 ? '+' + delta : String(delta));
    const deltaColor = delta > 3 ? THEME.red : delta < -3 ? THEME.ocean : THEME.inkMute;
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontFamily: FONT_BODY, color: THEME.ink, marginBottom: 3 }}>
          <span>{label}</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: deltaColor, fontWeight: Math.abs(delta) > 3 ? 600 : 400 }}>
            {deltaStr} pts
          </span>
        </div>
        {/* Cohort bar (red) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.red, width: 24, letterSpacing: 0.5 }}>this</span>
          <div style={{ position: 'relative', width, height: 6, background: 'rgba(28,22,19,0.06)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: 6, width: fp * width, background: THEME.red }} />
          </div>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: THEME.red, width: 30, textAlign: 'right' }}>{Math.round(fp*100)}%</span>
        </div>
        {/* All bar (ocean) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.ocean, width: 24, letterSpacing: 0.5 }}>all</span>
          <div style={{ position: 'relative', width, height: 6, background: 'rgba(28,22,19,0.06)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: 6, width: ap * width, background: THEME.ocean, opacity: 0.75 }} />
          </div>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: THEME.inkSoft, width: 30, textAlign: 'right' }}>{Math.round(ap*100)}%</span>
        </div>
      </div>
    );
  }

  const filteredActivities = countField('activities', 12);
  const filteredReasons = (() => {
    // Compute top-3 points per reason on filtered set
    const pts = {};
    filtered.forEach(r => {
      for (const [reason, rank] of Object.entries(r.volunteer_reasons||{})) {
        if (rank <= 3) pts[reason] = (pts[reason]||0) + (4 - rank);
      }
    });
    return Object.entries(pts).sort((a,b)=>b[1]-a[1]).slice(0, 10);
  })();

  const filteredSince = (() => {
    const out = {};
    const labels = new Set();
    filtered.forEach(r => Object.keys(r.since_campaign||{}).forEach(k => labels.add(k)));
    for (const l of labels) {
      const yes = filtered.filter(r => (r.since_campaign||{})[l] === 'Yes').length;
      const total = filtered.filter(r => (r.since_campaign||{})[l]).length;
      out[l] = { yes, total, pct: total > 0 ? yes/total : 0 };
    }
    return out;
  })();

  const allSince = (() => {
    const out = {};
    const labels = new Set();
    raw.forEach(r => Object.keys(r.since_campaign||{}).forEach(k => labels.add(k)));
    for (const l of labels) {
      const yes = raw.filter(r => (r.since_campaign||{})[l] === 'Yes').length;
      const total = raw.filter(r => (r.since_campaign||{})[l]).length;
      out[l] = { yes, total, pct: total > 0 ? yes/total : 0 };
    }
    return out;
  })();

  // Find some standout filtered quotes
  const filteredQuotes = quotes.filter(q => {
    if (N === 0) return false;
    const inSet = filtered.some(r => r.id === q.id);
    return inSet;
  }).slice(0, 4);

  // ---------- Filter chip ----------
  function Chip({ active, onClick, children, color = THEME.red }) {
    return (
      <button
        onClick={onClick}
        style={{
          padding: '4px 10px', fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.8,
          border: `1px solid ${active ? color : THEME.rule}`,
          background: active ? color : 'transparent',
          color: active ? THEME.paper : THEME.inkSoft,
          cursor: 'pointer', borderRadius: 0, textTransform: 'uppercase',
        }}>
        {children}
      </button>
    );
  }

  const activeFilterCount = Object.values(filters).filter(v => v !== null).length;

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'auto',
      background: THEME.paper, color: THEME.ink, fontFamily: FONT_BODY,
      padding: '32px 40px 60px', boxSizing: 'border-box',
    }}>
      {/* header */}
      <header style={{ borderBottom: `2px solid ${THEME.ink}`, paddingBottom: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: THEME.red, textTransform: 'uppercase' }}>§ Cohort Explorer · Interactive</div>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: -1, margin: '6px 0 0', color: THEME.ink, lineHeight: 1 }}>
              Filter the cadre. <span style={{ color: THEME.red, fontStyle: 'italic' }}>Watch the answers move.</span>
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: THEME.inkMute, letterSpacing: 1 }}>RESPONDENTS IN SELECTION</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 56, color: N === ALL ? THEME.ink : THEME.red, lineHeight: 0.9 }}>
              {N}<span style={{ fontSize: 22, color: THEME.inkMute }}> / {ALL}</span>
            </div>
          </div>
        </div>
      </header>

      {/* filter panel */}
      <section style={{ background: THEME.paperDeep, padding: '18px 20px', marginBottom: 22, border: `1px solid ${THEME.rule}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.red }}>↓ FILTERS · {activeFilterCount} active</span>
          <button
            onClick={clear}
            disabled={activeFilterCount === 0}
            style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1, padding: '4px 10px',
              border: `1px solid ${THEME.ink}`, background: activeFilterCount > 0 ? THEME.ink : 'transparent',
              color: activeFilterCount > 0 ? THEME.paper : THEME.inkMute,
              cursor: activeFilterCount > 0 ? 'pointer' : 'default', textTransform: 'uppercase',
            }}>
            Clear all
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute, marginBottom: 6, letterSpacing: 1 }}>BOROUGH</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {BOROUGHS.map(b => <Chip key={b} active={filters.borough === b} onClick={() => toggle('borough', b)}>{b}</Chip>)}
            </div>

            <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute, marginBottom: 6, letterSpacing: 1 }}>AGE</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {AGES.map(a => <Chip key={a.label} active={filters.age === a.label} onClick={() => toggle('age', a.label)}>{a.label}</Chip>)}
            </div>

            <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute, marginBottom: 6, letterSpacing: 1 }}>IDEOLOGY</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {IDEOLOGIES.map(i => <Chip key={i} active={filters.ideology === i} onClick={() => toggle('ideology', i)}>{i}</Chip>)}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute, marginBottom: 6, letterSpacing: 1 }}>WHEN THEY STARTED</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {START_WINDOWS.map(w => <Chip key={w.label} active={filters.startWindow === w.label} onClick={() => toggle('startWindow', w.label)}>{w.label}</Chip>)}
            </div>

            <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute, marginBottom: 6, letterSpacing: 1 }}>FIELD LEAD ROLE</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              <Chip active={filters.fieldLead === 'lead'} onClick={() => toggle('fieldLead','lead')}>Yes, led shifts</Chip>
              <Chip active={filters.fieldLead === 'nonlead'} onClick={() => toggle('fieldLead','nonlead')}>Never led</Chip>
            </div>

            <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute, marginBottom: 6, letterSpacing: 1 }}>PRIOR POLITICAL WORK</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Chip active={filters.firstCampaign === 'first'} onClick={() => toggle('firstCampaign','first')}>First campaign ever</Chip>
              <Chip active={filters.firstCampaign === 'veteran'} onClick={() => toggle('firstCampaign','veteran')}>Had volunteered before</Chip>
            </div>
          </div>
        </div>
      </section>

      {N === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: FONT_DISPLAY, fontSize: 20, fontStyle: 'italic', color: THEME.inkMute }}>
          No respondents match this selection. Loosen a filter.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>

          {/* Col 1: Why they came */}
          <div>
            <SectionLabel num="B·01" title="Why they came" right="Top-3 rank points" />
            <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: THEME.inkMute, marginBottom: 8 }}>
              What this cohort ranked in their top 3 reasons to volunteer.
            </div>
            {filteredReasons.map(([k, v], i) => (
              <HBar key={k} label={k.length > 48 ? k.slice(0, 48) + '…' : k} value={v} max={filteredReasons[0][1]} width={260}
                color={i === 0 ? THEME.red : i < 3 ? THEME.clay : THEME.ocean} />
            ))}
          </div>

          {/* Col 2: Activities */}
          <div>
            <SectionLabel num="B·02" title="What they did" right={`% of ${N}`} />
            <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: THEME.inkMute, marginBottom: 10 }}>
              Red = this cohort; ocean = everyone. The delta is the point difference — positive means this cohort over-indexes on the activity.
            </div>
            {filteredActivities.slice(0, 7).map(([k, v]) => {
              const allCount = agg.activities.find(a => a[0] === k)?.[1] || 0;
              return <CompareBar key={k} label={k.slice(0, 38)} filtValue={v} allValue={allCount} filtTotal={N} allTotal={ALL} width={220} />;
            })}
          </div>

          {/* Col 3: After the campaign */}
          <div>
            <SectionLabel num="B·03" title="After the campaign" right="% yes" />
            <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: THEME.inkMute, marginBottom: 8 }}>
              Did this cohort keep going? vs everyone.
            </div>
            {Object.entries(filteredSince).map(([k, v]) => (
              <CompareBar key={k} label={k} filtValue={v.yes} allValue={allSince[k]?.yes || 0} filtTotal={v.total} allTotal={allSince[k]?.total || 1} width={220} />
            ))}
          </div>
        </div>
      )}

      {N > 0 && (
        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28 }}>
          {/* Who */}
          <div>
            <SectionLabel num="B·04" title="Who is in this selection" right={`n=${N}`} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 8 }}>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute, marginBottom: 4 }}>BOROUGH</div>
                {countField('borough').map(([k, v]) => (
                  <div key={k} style={{ fontSize: 11, fontFamily: FONT_BODY, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{k}</span><span style={{ fontFamily: FONT_MONO, color: THEME.inkMute }}>{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute, marginBottom: 4 }}>IDEOLOGY</div>
                {countField('ideology').map(([k, v]) => (
                  <div key={k} style={{ fontSize: 11, fontFamily: FONT_BODY, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{k}</span><span style={{ fontFamily: FONT_MONO, color: THEME.inkMute }}>{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute, marginBottom: 4 }}>WEEKLY TIME</div>
                {countField('weekly_time').map(([k, v]) => (
                  <div key={k} style={{ fontSize: 11, fontFamily: FONT_BODY, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{k}</span><span style={{ fontFamily: FONT_MONO, color: THEME.inkMute }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Respondent tags — small dots showing matched respondents */}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute, marginBottom: 6, letterSpacing: 1 }}>
                RESPONDENTS · EACH DOT = ONE PERSON
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, maxWidth: 500 }}>
                {raw.map(r => {
                  const inSet = filtered.some(f => f.id === r.id);
                  return (
                    <div key={r.id}
                      title={inSet ? `${r.first_name||'anon'}, ${r.borough||'?'}, ${r.birth_year ? 2025-r.birth_year : '?'}y` : ''}
                      style={{
                        width: 10, height: 10, borderRadius: 5,
                        background: inSet ? THEME.red : 'rgba(28,22,19,0.08)',
                        border: inSet ? 'none' : `1px solid rgba(28,22,19,0.12)`,
                      }} />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Voices */}
          <div>
            <SectionLabel num="B·05" title="Voices from this cohort" right={`${filteredQuotes.length} surfaced`} />
            <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: THEME.inkMute, marginBottom: 12 }}>
              Snippets from people in your current selection.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filteredQuotes.length === 0 && (
                <div style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: 14, color: THEME.inkMute, padding: 14, border: `1px dashed ${THEME.rule}` }}>
                  No narrative responses from this cohort.
                </div>
              )}
              {filteredQuotes.map((q, i) => (
                <div key={q.id + i} style={{ borderLeft: `3px solid ${THEME.red}`, paddingLeft: 12 }}>
                  <Stamp color={THEME.inkSoft} rotate={-2} style={{ fontSize: 8.5, padding: '2px 6px' }}>
                    {q.source.replace('_', ' ').toUpperCase()}
                  </Stamp>
                  <p style={{ fontFamily: FONT_DISPLAY, fontSize: 14, lineHeight: 1.4, fontStyle: 'italic', color: THEME.ink, margin: '8px 0 6px' }}>
                    "{q.text.length > 320 ? q.text.slice(0, 320) + '…' : q.text}"
                  </p>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute, letterSpacing: 0.5 }}>
                    — {q.name || 'anon'} · {q.borough || '?'} · {q.age || '?'}y · {q.ideology || '?'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Presets at the bottom */}
      <section style={{ marginTop: 40, borderTop: `1px solid ${THEME.rule}`, paddingTop: 18 }}>
        <SectionLabel num="B·06" title="Try a preset cohort" />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
          {[
            { label: 'Early believers', filters: { startWindow: 'Early (Pre-Mar 2025)' }, subtitle: 'Started before March 2025' },
            { label: 'First-time volunteers', filters: { firstCampaign: 'first' }, subtitle: 'Never before worked on a campaign' },
            { label: 'Brooklyn DSA 20s', filters: { borough: 'Brooklyn', age: '25–29', ideology: 'Democratic Socialist' } },
            { label: 'Over 35', filters: { age: '35–44' } },
            { label: 'Late general-election joiners', filters: { startWindow: 'General election (Jul–Sep 2025)' } },
          ].map(p => (
            <button
              key={p.label}
              onClick={() => setFilters({ borough: null, age: null, ideology: null, startWindow: null, fieldLead: null, firstCampaign: null, ...p.filters })}
              style={{
                padding: '8px 12px', border: `1px solid ${THEME.ink}`, background: THEME.paperDeep,
                fontFamily: FONT_MONO, fontSize: 10, cursor: 'pointer', color: THEME.ink, letterSpacing: 0.5,
                textAlign: 'left', minWidth: 140,
              }}>
              <div style={{ fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{p.label}</div>
              {p.subtitle && <div style={{ fontSize: 9, color: THEME.inkMute, marginTop: 2, textTransform: 'none', letterSpacing: 0 }}>{p.subtitle}</div>}
            </button>
          ))}
        </div>
      </section>

      <footer style={{ marginTop: 40, borderTop: `1px solid ${THEME.rule}`, paddingTop: 12, fontFamily: FONT_MONO, fontSize: 10, color: THEME.inkMute, letterSpacing: 1, display: 'flex', justifyContent: 'space-between' }}>
        <span>Red bar = this cohort · Blue bar = full respondent set (n={ALL})</span>
        <span>Quotes only from long-form responses (N={quotes.length} across dataset)</span>
      </footer>
    </div>
  );
}

window.ViewB = ViewB;
