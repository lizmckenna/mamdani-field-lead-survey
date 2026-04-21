// View C — "Quote Atlas"
// A typographic zine of the narrative responses, organized by theme and chapter.
// Browsing interface: pick a theme, see the quotes.

function ViewC({ data }) {
  // Hand-curated allowlist — the stories worth reading, not the full firehose.
  // Keys are `${source}:${id}`. Anything not in this list is dropped.
  const KEEP = new Set([
    // Canvass stories
    'canvass_story:33', 'canvass_story:68', 'canvass_story:73', 'canvass_story:60',
    'canvass_story:65', 'canvass_story:22', 'canvass_story:21', 'canvass_story:61',
    'canvass_story:7', 'canvass_story:75', 'canvass_story:5', 'canvass_story:91',
    'canvass_story:40', 'canvass_story:37', 'canvass_story:80', 'canvass_story:74',
    'canvass_story:10', 'canvass_story:12', 'canvass_story:45', 'canvass_story:89',
    'canvass_story:31', 'canvass_story:87', 'canvass_story:43', 'canvass_story:54',
    'canvass_story:48', 'canvass_story:58', 'canvass_story:44', 'canvass_story:35',
    'canvass_story:32', 'canvass_story:50', 'canvass_story:81', 'canvass_story:24',
    'canvass_story:20', 'canvass_story:38', 'canvass_story:34',
    // Tipping moments
    'tipping_moment:42', 'tipping_moment:73', 'tipping_moment:66', 'tipping_moment:10',
    'tipping_moment:47', 'tipping_moment:9', 'tipping_moment:56', 'tipping_moment:17',
    'tipping_moment:3', 'tipping_moment:80', 'tipping_moment:23', 'tipping_moment:27',
    'tipping_moment:81', 'tipping_moment:59', 'tipping_moment:74', 'tipping_moment:62',
    'tipping_moment:24', 'tipping_moment:33', 'tipping_moment:68', 'tipping_moment:31',
    'tipping_moment:75', 'tipping_moment:60', 'tipping_moment:45', 'tipping_moment:18',
    'tipping_moment:37', 'tipping_moment:91', 'tipping_moment:2',
    // Final thoughts
    'final_thoughts:68', 'final_thoughts:26', 'final_thoughts:73', 'final_thoughts:91',
    'final_thoughts:44', 'final_thoughts:22', 'final_thoughts:21', 'final_thoughts:54',
    'final_thoughts:75', 'final_thoughts:18', 'final_thoughts:82', 'final_thoughts:31',
    'final_thoughts:7', 'final_thoughts:53', 'final_thoughts:47', 'final_thoughts:62',
    'final_thoughts:50', 'final_thoughts:25', 'final_thoughts:5', 'final_thoughts:60',
    'final_thoughts:83',
  ]);
  const quotes = data.quotes.filter(q => KEEP.has(`${q.source}:${q.id}`));

  // Themes with human labels and ordering
  const THEMES = [
    { key: 'all', label: 'Everything', blurb: 'Every long-form response we collected.' },
    { key: 'hope', label: 'Hope & despair', blurb: 'What drew them in — often a moment after Trump, after Gaza, when they needed something.' },
    { key: 'asked', label: 'Someone asked me', blurb: 'The invitation that tipped them in. A friend, a sibling, a group chat.' },
    { key: 'media', label: 'Through the algorithm', blurb: 'The videos, the tweets, the moment they first noticed him.' },
    { key: 'palestine', label: 'Palestine', blurb: "For many, his unequivocal stance on Gaza was the permission slip." },
    { key: 'canvass', label: 'At the door', blurb: 'Field notes from the shift itself.' },
    { key: 'solidarity', label: 'Across difference', blurb: 'Muslim, Jewish, Latino, Black, young, old — the door-to-door encounters.' },
    { key: 'persuasion', label: 'Changing a mind', blurb: 'The conversations that turned.' },
    { key: 'conflict', label: 'Hostility', blurb: "When it went sideways — and they went back the next day anyway." },
    { key: 'comradeship', label: 'Fellow canvassers', blurb: "What happened between volunteers, not between volunteers and voters." },
    { key: 'transformation', label: 'What changed in them', blurb: 'The self-reported personal transformation.' },
    { key: 'dsa', label: 'On DSA', blurb: 'On the organization the campaign was built through.' },
    { key: 'place', label: 'On New York', blurb: 'On the city they fell back in love with.' },
    { key: 'career', label: 'Career change', blurb: 'People who are now doing this for real.' },
    { key: 'aftermath', label: "After the win", blurb: 'What they took away. What they plan to do next.' },
  ];

  const [theme, setTheme] = React.useState('all');
  const [sourceFilter, setSourceFilter] = React.useState('all');

  const SOURCES = [
    { key: 'all', label: 'All moments' },
    { key: 'tipping_moment', label: 'Tipping moment' },
    { key: 'canvass_story', label: 'Canvass story' },
    { key: 'final_thoughts', label: 'Final thoughts' },
  ];

  const shown = quotes.filter(q => {
    if (theme !== 'all' && !q.theme.includes(theme)) return false;
    if (sourceFilter !== 'all' && q.source !== sourceFilter) return false;
    return true;
  });

  // Shuffle deterministic — sort by length asc + id for varied layout
  const ordered = [...shown].sort((a, b) => {
    if (a.text.length !== b.text.length) return a.text.length - b.text.length;
    return String(a.id||'').localeCompare(String(b.id||''));
  });

  // Layout: mix sizes — small (<200), mid (200-400), large (400+)
  function sizeOf(q) {
    if (q.text.length < 180) return 'sm';
    if (q.text.length < 420) return 'md';
    return 'lg';
  }

  // Render **bold** markers in quote text. Bolded phrases get a subtle highlighter
  // treatment keyed to the card accent so they pop against any background.
  function renderBold(text, { accent } = {}) {
    const highlight =
      accent === 'dark' ? THEME.yellow :
      accent === 'red'  ? THEME.paper  :
      THEME.ink;
    const bg =
      accent === 'dark' ? 'rgba(240,194,78,0.18)' :
      accent === 'red'  ? 'rgba(244,237,224,0.18)' :
      'rgba(193,38,36,0.12)';
    const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return (
          <strong key={i} style={{
            fontWeight: 700, fontStyle: 'normal', color: highlight,
            background: bg, padding: '0 2px', boxDecorationBreak: 'clone',
          }}>{p.slice(2, -2)}</strong>
        );
      }
      return p;
    });
  }

  function QuoteCard({ q, size, accent }) {
    const isLg = size === 'lg';
    const isSm = size === 'sm';
    const fontSize = isLg ? 17 : isSm ? 15 : 15.5;
    const span = isLg ? 'span 2' : 'span 1';
    return (
      <div style={{
        gridColumn: span,
        padding: isLg ? '22px 26px' : '16px 18px',
        background: accent === 'dark' ? THEME.ink : accent === 'red' ? THEME.red : accent === 'yellow' ? THEME.yellow : 'rgba(255, 253, 246, 0.5)',
        border: accent ? 'none' : `1px solid ${THEME.rule}`,
        color: accent === 'dark' ? THEME.paper : accent === 'red' ? THEME.paper : THEME.ink,
        display: 'flex', flexDirection: 'column', gap: 10,
        breakInside: 'avoid',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <span style={{
            fontFamily: FONT_MONO, fontSize: 8.5, letterSpacing: 1.2, textTransform: 'uppercase',
            color: accent === 'dark' ? THEME.yellow : accent === 'red' ? THEME.paper : THEME.red,
            opacity: accent ? 0.9 : 1,
          }}>
            {q.source.replace('_', ' ')}
          </span>
          <span style={{
            fontFamily: FONT_MONO, fontSize: 8.5, letterSpacing: 0.8,
            color: accent === 'dark' ? 'rgba(244,237,224,0.6)' : accent === 'red' ? 'rgba(244,237,224,0.8)' : THEME.inkMute,
            textAlign: 'right',
          }}>
            {q.theme.slice(0, 2).join(' · ')}
          </span>
        </div>

        <p style={{
          fontFamily: FONT_DISPLAY, fontWeight: isLg ? 500 : 400,
          fontStyle: isLg ? 'normal' : 'italic',
          fontSize, lineHeight: 1.4, margin: 0,
          color: accent === 'dark' ? THEME.paper : accent === 'red' ? THEME.paper : THEME.ink,
        }}>
          {isLg ? <span style={{ fontFamily: FONT_DISPLAY, fontSize: fontSize * 2.2, lineHeight: 0.6, verticalAlign: '-10px', marginRight: 4, color: accent === 'dark' ? THEME.red : accent === 'red' ? THEME.yellow : THEME.red }}>"</span> : '"'}
          {renderBold(q.text, { accent })}
          {!isLg && '"'}
        </p>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 6,
          borderTop: `1px ${accent ? 'solid' : 'dashed'} ${accent === 'dark' ? 'rgba(244,237,224,0.2)' : accent === 'red' ? 'rgba(244,237,224,0.3)' : THEME.rule}`,
          fontFamily: FONT_MONO, fontSize: 9.5, letterSpacing: 0.5,
          color: accent === 'dark' ? 'rgba(244,237,224,0.8)' : accent === 'red' ? 'rgba(244,237,224,0.9)' : THEME.inkSoft,
        }}>
          <span>— {q.name || 'anon'}</span>
          <span>{q.borough || '?'} · {q.age ? q.age + 'y' : '?'} · {q.ideology || '?'}</span>
        </div>
      </div>
    );
  }

  // Distribution of accents to add visual rhythm
  function accentFor(i, size) {
    if (size === 'lg') return i % 5 === 0 ? 'dark' : i % 7 === 0 ? 'red' : null;
    if (size === 'md') return i % 11 === 0 ? 'yellow' : null;
    return null;
  }

  const themeCount = (t) => quotes.filter(q => t === 'all' ? true : q.theme.includes(t)).length;

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'auto',
      background: THEME.paper, color: THEME.ink, fontFamily: FONT_BODY,
      padding: '32px 40px 60px', boxSizing: 'border-box',
    }}>
      <header style={{ borderBottom: `2px solid ${THEME.ink}`, paddingBottom: 12, marginBottom: 18 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: THEME.red, textTransform: 'uppercase' }}>§ Quote Atlas · In their own words</div>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: -1, margin: '6px 0 0', color: THEME.ink, lineHeight: 1 }}>
          A reader of voices. <span style={{ color: THEME.red, fontStyle: 'italic' }}>Pick a thread; follow it through.</span>
        </h2>
      </header>

      {/* Theme picker */}
      <section style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute, letterSpacing: 1, marginBottom: 8 }}>THEME</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {THEMES.map(t => {
            const active = theme === t.key;
            return (
              <button key={t.key} onClick={() => setTheme(t.key)}
                style={{
                  padding: '6px 12px',
                  fontFamily: FONT_BODY, fontSize: 12, fontWeight: active ? 600 : 400,
                  border: `1px solid ${active ? THEME.red : THEME.rule}`,
                  background: active ? THEME.red : 'transparent',
                  color: active ? THEME.paper : THEME.ink,
                  cursor: 'pointer', borderRadius: 0,
                }}>
                {t.label} <span style={{ fontFamily: FONT_MONO, fontSize: 9, opacity: 0.7, marginLeft: 4 }}>{themeCount(t.key)}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 18, marginTop: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute, letterSpacing: 1 }}>SOURCE</div>
          {SOURCES.map(s => {
            const active = sourceFilter === s.key;
            return (
              <button key={s.key} onClick={() => setSourceFilter(s.key)}
                style={{
                  padding: '4px 10px', fontFamily: FONT_MONO, fontSize: 10,
                  border: `1px solid ${active ? THEME.ink : THEME.rule}`,
                  background: active ? THEME.ink : 'transparent',
                  color: active ? THEME.paper : THEME.inkSoft,
                  cursor: 'pointer', borderRadius: 0, letterSpacing: 0.5, textTransform: 'uppercase',
                }}>
                {s.label}
              </button>
            );
          })}
          <span style={{ marginLeft: 'auto', fontFamily: FONT_MONO, fontSize: 10, color: THEME.inkMute }}>
            {shown.length} quotes shown
          </span>
        </div>
      </section>

      {/* Theme blurb */}
      {theme !== 'all' && (
        <section style={{ marginBottom: 20, padding: '14px 18px', background: THEME.paperDeep, borderLeft: `4px solid ${THEME.red}` }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 600, fontStyle: 'italic', color: THEME.ink, letterSpacing: -0.5 }}>
            {THEMES.find(t => t.key === theme).label}
          </div>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: THEME.inkSoft, margin: '4px 0 0', lineHeight: 1.45 }}>
            {THEMES.find(t => t.key === theme).blurb}
          </p>
        </section>
      )}

      {/* Quote grid — masonry-ish with CSS grid auto-rows */}
      {shown.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: FONT_DISPLAY, fontSize: 18, fontStyle: 'italic', color: THEME.inkMute }}>
          No quotes for this combination.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          gridAutoFlow: 'dense',
        }}>
          {ordered.map((q, i) => {
            const size = sizeOf(q);
            const accent = accentFor(i, size);
            return <QuoteCard key={q.id + '-' + i} q={q} size={size} accent={accent} />;
          })}
        </div>
      )}

      <footer style={{ marginTop: 40, borderTop: `1px solid ${THEME.rule}`, paddingTop: 12, fontFamily: FONT_MONO, fontSize: 10, color: THEME.inkMute, letterSpacing: 1, display: 'flex', justifyContent: 'space-between' }}>
        <span>Quotes collected from open-ended survey responses · names preserved as given</span>
        <span>Themes are inferred from content · many quotes carry multiple themes</span>
      </footer>
    </div>
  );
}

window.ViewC = ViewC;
