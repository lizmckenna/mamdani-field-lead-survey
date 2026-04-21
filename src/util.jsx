// Shared utilities — colors, chart primitives, scale helpers
// Warm zine / movement aesthetic.

const THEME = {
  // Paper & ink — keep the warm cream
  paper: '#f4ede0',
  paperDeep: '#ebdfc8',
  ink: '#1a1a1a',
  inkSoft: '#2d2d2d',
  inkMute: '#6a6156',
  rule: '#d4c5a8',

  // The palette — bold movement poster. User-specified:
  //   blue   #2818d3  — primary (data, structure)
  //   yellow #fea806  — highlight / sections / accents
  //   red    #e81602  — emphasis / alerts / hero callouts
  blue: '#2818d3',
  blueDeep: '#1a0fa0',
  yellow: '#fea806',
  yellowDeep: '#d18800',
  red: '#e81602',
  redDeep: '#b01001',

  // Aliases for older refs so View A/B/C still work
  ocean: '#2818d3',
  oceanLight: '#5a4de0',
  clay: '#e81602',
  sage: '#2818d3',
  magenta: '#e81602',
  redDeep_LEGACY: '#b01001',
  yellowDeep_LEGACY: '#d18800',

  // Semantic-agree palette (diverging) using the three colors
  agreeStrong: '#2818d3',
  agreeSoft: '#8a81e8',
  neutral: '#d4c5a8',
  disagreeSoft: '#f59b67',
  disagreeStrong: '#e81602',
};

// Fonts: sans-stack plus display serif. Load via Google Fonts in root html.
const FONT_DISPLAY = '"Fraunces", "Cooper", Georgia, serif';  // OK we're using Fraunces despite advice — the warm-zine look wants it, and we'll customize weights.
const FONT_BODY = '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';
const FONT_MONO = '"IBM Plex Mono", "Courier New", monospace';

// -- generic scale
function scale(v, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  return outMin + (outMax - outMin) * ((v - inMin) / (inMax - inMin));
}

// -- horizontal bar row (bar chart row)
function HBar({ label, value, max, color = THEME.ink, width = 260, showValue = true, sublabel, barHeight = 6 }) {
  const w = max > 0 ? (value / max) * width : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: THEME.inkSoft, fontFamily: FONT_BODY }}>
        <span>{label}</span>
        {showValue && <span style={{ fontFamily: FONT_MONO, color: THEME.inkMute }}>{value}</span>}
      </div>
      <div style={{ height: barHeight, background: 'rgba(28,22,19,0.06)', position: 'relative', borderRadius: 0 }}>
        <div style={{ height: '100%', width: w, background: color }} />
      </div>
      {sublabel && <div style={{ fontSize: 10, color: THEME.inkMute, fontFamily: FONT_MONO }}>{sublabel}</div>}
    </div>
  );
}

// Stacked horizontal bar (for scale matrices)
function StackedBar({ row, scale: scaleArr, colors, total, width = 260, showLabel = true, showCount = false }) {
  let cursor = 0;
  const rowTotal = scaleArr.reduce((a, k) => a + (row[k] || 0), 0);
  const useTotal = total || rowTotal;
  return (
    <div style={{ marginBottom: 8 }}>
      {showLabel && (
        <div style={{ fontSize: 11.5, color: THEME.inkSoft, fontFamily: 'Inter, sans-serif', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
          <span>{row.label}</span>
          {showCount && <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: THEME.inkMute, fontSize: 10 }}>n={rowTotal}</span>}
        </div>
      )}
      <div style={{ display: 'flex', height: 10, width, background: 'rgba(28,22,19,0.04)' }}>
        {scaleArr.map((k, i) => {
          const w = (row[k] || 0) / useTotal * width;
          const el = <div key={k} title={`${k}: ${row[k]||0}`} style={{ width: w, background: colors[i] }} />;
          cursor += w;
          return el;
        })}
      </div>
    </div>
  );
}

// Dot grid — N dots, filled k
function DotGrid({ n, k, size = 8, gap = 3, cols = 10, filledColor = THEME.red, emptyColor = 'rgba(28,22,19,0.15)' }) {
  const dots = [];
  for (let i = 0; i < n; i++) {
    dots.push(
      <div key={i} style={{ width: size, height: size, borderRadius: size/2, background: i < k ? filledColor : emptyColor }} />
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap, width: 'max-content' }}>
      {dots}
    </div>
  );
}

// Sparkline-ish area path for timeline
function Timeline({ series, width = 280, height = 70, color = THEME.red, labels = true, compareSeries, compareColor = THEME.ocean }) {
  const max = Math.max(...series.map(s => s.count), ...(compareSeries||[]).map(s => s.count), 1);
  const step = series.length > 1 ? width / (series.length - 1) : width;
  const pts = series.map((s, i) => [i*step, height - (s.count/max)*height]);
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  
  let cmpPath = '';
  if (compareSeries) {
    const cmpPts = compareSeries.map((s, i) => [i*step, height - (s.count/max)*height]);
    cmpPath = cmpPts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  }
  return (
    <svg width={width} height={height + (labels ? 24 : 0)}>
      {/* baseline */}
      <line x1={0} x2={width} y1={height} y2={height} stroke={THEME.rule} strokeWidth="1" />
      {compareSeries && <path d={cmpPath} fill="none" stroke={compareColor} strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />}
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={series[i].count ? 3 : 0} fill={color} />
      ))}
      {labels && series.map((s, i) => (
        <text key={i} x={pts[i][0]} y={height + 12} fontSize="8" fill={THEME.inkMute} textAnchor="middle" fontFamily={FONT_MONO}>
          {s.month.replace(/20(24|25)/, "'$1").replace('Pre-', '<').replace("'24", "24").replace("'25", "25").slice(0, 3)}
        </text>
      ))}
      {labels && pts.map((p, i) => (
        series[i].count ? <text key={'v'+i} x={p[0]} y={p[1] - 6} fontSize="9" fill={THEME.ink} textAnchor="middle" fontFamily={FONT_MONO}>{series[i].count}</text> : null
      ))}
    </svg>
  );
}

// Small rule divider
function Rule({ width = '100%', style = 'solid', color = THEME.rule }) {
  return <div style={{ width, height: 1, background: color, margin: '8px 0', ...(style === 'dashed' ? { backgroundImage: `repeating-linear-gradient(to right, ${color} 0, ${color} 4px, transparent 4px, transparent 8px)`, background: 'none' } : {}) }} />;
}

// Section label
function SectionLabel({ num, title, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {num && <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.red, letterSpacing: 1 }}>{num}</span>}
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 14, color: THEME.ink, letterSpacing: -0.2 }}>{title}</span>
      </div>
      {right && <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: THEME.inkMute }}>{right}</span>}
    </div>
  );
}

// Stamp / annotation (like a red stamp / margin note)
function Stamp({ children, color = THEME.red, rotate = -4, style = {} }) {
  return (
    <div style={{
      display: 'inline-block', padding: '3px 8px', border: `1.5px solid ${color}`,
      color, fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase',
      transform: `rotate(${rotate}deg)`, ...style,
    }}>{children}</div>
  );
}

// Big percent/number display
function BigStat({ value, unit = '', label, color = THEME.ink, size = 44 }) {
  return (
    <div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: size, color, lineHeight: 0.95, letterSpacing: -1 }}>
        {value}<span style={{ fontSize: size * 0.5, color: THEME.inkSoft, marginLeft: 2 }}>{unit}</span>
      </div>
      {label && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: THEME.inkSoft, marginTop: 4, maxWidth: 220 }}>{label}</div>}
    </div>
  );
}

// Diverging stacked row (AGREE scale)
const AGREE_COLORS = [THEME.red, '#f59b67', THEME.neutral, '#8a81e8', THEME.blue];
const AGREE_SCALE = ['Strongly disagree','Somewhat disagree','Neither agree nor disagree','Somewhat agree','Strongly agree'];
const FEELING_SCALE = ['Never','Rarely','Sometimes','Often','Always'];
const FEELING_COLORS = ['#e0d4bd', '#f5c390', THEME.neutral, THEME.yellow, THEME.red];
const CONF_SCALE = ['About the same','Somewhat more confident','Much more confient'];
const CONF_COLORS = [THEME.neutral, THEME.yellow, THEME.red];

Object.assign(window, {
  THEME, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  HBar, StackedBar, DotGrid, Timeline, Rule, SectionLabel, Stamp, BigStat, scale,
  AGREE_COLORS, AGREE_SCALE, FEELING_SCALE, FEELING_COLORS, CONF_SCALE, CONF_COLORS,
});
