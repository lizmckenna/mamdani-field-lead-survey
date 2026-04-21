// View A — "Cover / Takeaways"
// Scrolling long-form summary organized around 9 analytical findings.
// Bold poster palette: blue (primary), yellow (highlight), red (emphasis).
// Preliminary — n=91 of ~700, survey open ~3 days.

function ViewA({ data }) {
  const { agg } = data;

  // ---------- Helpers ----------
  const PaletteBand = ({ color = THEME.blue, label, children, tone = 'light', tall = false }) => {
    const bg = tone === 'dark' ? THEME.ink : tone === 'blue' ? THEME.blue : tone === 'red' ? THEME.red : tone === 'yellow' ? THEME.yellow : THEME.paper;
    const fg = tone === 'dark' || tone === 'blue' || tone === 'red' ? THEME.paper : THEME.ink;
    return (
      <section style={{ background: bg, color: fg, padding: tall ? '80px 0' : '56px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 56px' }}>
          {children}
        </div>
      </section>
    );
  };

  const Chapter = ({ num, kicker, color = THEME.blue }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
      <span style={{
        fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color,
        padding: '3px 8px', border: `1.5px solid ${color}`, textTransform: 'uppercase',
      }}>§ Finding {num}</span>
      <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: 'currentColor', opacity: 0.6, textTransform: 'uppercase' }}>{kicker}</span>
    </div>
  );

  const HeadlineSerif = ({ children, size = 56, color, italic = false }) => (
    <h2 style={{
      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: size,
      lineHeight: 1.0, letterSpacing: -1.5, margin: 0,
      color: color || 'inherit', fontStyle: italic ? 'italic' : 'normal',
    }}>{children}</h2>
  );

  const Lede = ({ children, color }) => (
    <p style={{
      fontFamily: FONT_DISPLAY, fontSize: 22, lineHeight: 1.4, margin: '20px 0 0',
      color: color || 'inherit', maxWidth: 760, fontWeight: 400,
    }}>{children}</p>
  );

  const Body = ({ children, color }) => (
    <p style={{
      fontFamily: FONT_BODY, fontSize: 15.5, lineHeight: 1.6, margin: '14px 0 0',
      color: color || 'inherit', maxWidth: 680,
    }}>{children}</p>
  );

  // BIG NUMBER with label
  const Stat = ({ value, unit, label, color = THEME.red, inverse = false }) => (
    <div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 96,
        lineHeight: 0.88, letterSpacing: -3, color,
      }}>
        {value}{unit && <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1, marginLeft: 2, color: inverse ? 'rgba(244,237,224,0.5)' : 'rgba(26,26,26,0.5)' }}>{unit}</span>}
      </div>
      {label && <div style={{ fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.4, marginTop: 10, color: inverse ? 'rgba(244,237,224,0.8)' : THEME.inkSoft, maxWidth: 280, fontWeight: 500 }}>{label}</div>}
    </div>
  );

  // Reason rank plot
  const ReasonRank = () => (
    <div>
      {agg.reasonPoints.slice(0, 8).map(([k, v], i) => {
        const rank1Count = (agg.rank1.find(r => r[0] === k) || [0, 0])[1];
        const max = agg.reasonPoints[0][1];
        return (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 80px', gap: 12, alignItems: 'center', marginBottom: 10, padding: '6px 0', borderBottom: `1px solid ${THEME.rule}` }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: i < 3 ? THEME.red : THEME.inkMute, fontWeight: 700 }}>#{String(i+1).padStart(2,'0')}</span>
            <div>
              <div style={{ fontSize: 13, color: THEME.ink, marginBottom: 4, fontFamily: FONT_BODY }}>{k}</div>
              <div style={{ height: 6, background: i < 3 ? THEME.blue : `${THEME.blue}80`, width: `${(v/max)*100}%` }} />
            </div>
            <div style={{ textAlign: 'right', fontFamily: FONT_MONO, fontSize: 11, color: THEME.inkMute }}>
              <span style={{ color: THEME.red, fontWeight: 600 }}>{rank1Count}</span> #1s · {v}pt
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{
      width: '100%', minHeight: '100%',
      background: THEME.paper, color: THEME.ink, fontFamily: FONT_BODY,
    }}>

      {/* ========== HERO ========== */}
      <PaletteBand tone="paper" tall>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 40, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: THEME.blue, textTransform: 'uppercase' }}>
            Field Lead Survey · Preliminary Findings
          </div>
          <Stamp color={THEME.red} rotate={-4} style={{ fontSize: 10, fontWeight: 700 }}>
            Preliminary · n=91 of ~700
          </Stamp>
        </div>

        <h1 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 96, lineHeight: 0.95, letterSpacing: -3,
          margin: 0, color: THEME.ink, maxWidth: 1080,
        }}>
          Who were the <span style={{ color: THEME.red }}>core volunteers</span> for Zohran,<br/>
          <span style={{ fontStyle: 'italic', color: THEME.blue }}>and what was their experience on the campaign?</span>
        </h1>

        <div style={{ maxWidth: 820, marginTop: 40, fontFamily: FONT_DISPLAY, fontSize: 24, lineHeight: 1.35, color: THEME.inkSoft }}>
          A preliminary look at the first 91 responses to a survey of the field leads and volunteers who canvassed, led, and organized for Zohran Mamdani's 2025 NYC mayoral campaign. <span style={{ color: THEME.red, fontWeight: 600 }}>Nine tentative findings</span> about mobilization, the canvassing experience, and what may get built when a campaign is also a site of leadership development.
        </div>

        <div style={{
          marginTop: 44, padding: '20px 24px', background: THEME.yellow,
          borderLeft: `6px solid ${THEME.ink}`,
          display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, alignItems: 'center',
        }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.ink, fontWeight: 700 }}>
            READ ME<br/>FIRST
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.5, color: THEME.ink }}>
            These are <b>preliminary findings</b> from the first three days of fielding. Of roughly 700 volunteers invited, 91 have responded so far; the survey launched on April 18, 2026. Early respondents to a long post-campaign survey tend to be the most engaged, so the numbers below should be read as a portrait of the committed core of respondents, not the full volunteer base. Later respondents may look different, and the findings here should be treated as tentative.
          </div>
        </div>

        <div style={{
          marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
          borderTop: `2px solid ${THEME.ink}`, paddingTop: 32,
        }}>
          <Stat value="91" unit="/~700" label="Respondents as of fielding day 3" color={THEME.ink} />
          <Stat value="32" label="Median age of respondents" color={THEME.blue} />
          <Stat value="87" unit="%" label="Of respondents are DSA-affiliated" color={THEME.red} />
          <Stat value="67" unit="%" label="Reported their involvement increased substantially over the course of the campaign" color={THEME.blue} />
        </div>
      </PaletteBand>

      {/* ========== FINDING 01 ========== */}
      <PaletteBand tone="blue">
        <Chapter num="01" kicker="Reframing the question" color={THEME.yellow} />
        <HeadlineSerif size={72} italic color={THEME.paper}>
          Less a <span style={{ color: THEME.yellow }}>mobilization</span> story<br/>
          than a <span style={{ color: THEME.yellow }}>deepening</span> one.
        </HeadlineSerif>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, marginTop: 40 }}>
          <Body color="rgba(244,237,224,0.9)">
            Only <b style={{ color: THEME.yellow }}>2%</b> of respondents reported no prior political involvement. 93% had previously attended a protest or rally, 81% had signed a petition, and <b style={{ color: THEME.yellow }}>73% had already volunteered on a prior campaign</b>. For this set of respondents, the Mamdani campaign does not appear to have been a point of initial political entry. The more productive question may be what the campaign <i>added</i> on top of an already-engaged base (skill development, escalation, identity, and durable organizational ties), which shifts the analytic frame from "how campaigns mobilize people" toward <b style={{ color: THEME.yellow }}>how campaigns develop people who are already in motion</b>.
          </Body>

          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.yellow, marginBottom: 16 }}>SHARE WHO HAD ALREADY…</div>
            {[
              ['Attended a protest or rally', 93],
              ['Posted political content online', 87],
              ['Signed a petition', 81],
              ['Donated to a campaign or cause', 80],
              ['Contacted elected officials', 77],
              ['Volunteered for a campaign', 73],
              ['Been a member of a political organization', 49],
              ['Been a union member', 29],
            ].map(([label, pct]) => (
              <div key={label} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_BODY, fontSize: 12, color: 'rgba(244,237,224,0.9)', marginBottom: 3 }}>
                  <span>{label}</span>
                  <span style={{ fontFamily: FONT_MONO, color: THEME.yellow, fontWeight: 600 }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(244,237,224,0.15)' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: THEME.yellow }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PaletteBand>

      {/* ========== FINDING 02 ========== */}
      <PaletteBand tone="paper">
        <Chapter num="02" kicker="The headline pattern" color={THEME.red} />
        <HeadlineSerif size={72} color={THEME.ink}>
          A <span style={{ color: THEME.red }}>leadership-development ratchet</span>.
        </HeadlineSerif>
        <Lede color={THEME.inkSoft}>
          Volunteer attrition is the norm in most campaigns that have been studied. Among these respondents, <b>89% reported that their involvement increased over time</b>, and two out of three said it increased <i>substantially</i>.
        </Lede>

        <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          {/* Giant stacked ratchet bar */}
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.inkMute, marginBottom: 16 }}>HOW INVOLVEMENT CHANGED OVER TIME</div>
            <div style={{ border: `2px solid ${THEME.ink}`, padding: 3, display: 'flex', height: 90 }}>
              {[
                { label: 'Increased substantially', pct: 67, color: THEME.red },
                { label: 'Increased somewhat', pct: 22, color: '#f59b67' },
                { label: 'Stayed same', pct: 8, color: THEME.neutral },
                { label: 'Decreased', pct: 2, color: THEME.blue },
              ].map(b => (
                <div key={b.label} style={{ width: `${b.pct}%`, background: b.color, display: 'flex', alignItems: 'flex-end', padding: 6, color: b.pct > 15 ? THEME.paper : 'transparent', fontSize: 10, fontFamily: FONT_MONO, fontWeight: 700 }}>
                  {b.pct}%
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11, fontFamily: FONT_BODY, color: THEME.inkSoft }}>
              <div><span style={{ display: 'inline-block', width: 10, height: 10, background: THEME.red, marginRight: 6 }} />Substantially (67%)</div>
              <div><span style={{ display: 'inline-block', width: 10, height: 10, background: '#f59b67', marginRight: 6 }} />Somewhat (22%)</div>
              <div><span style={{ display: 'inline-block', width: 10, height: 10, background: THEME.neutral, marginRight: 6 }} />Same (8%)</div>
              <div><span style={{ display: 'inline-block', width: 10, height: 10, background: THEME.blue, marginRight: 6 }} />Decreased (2%)</div>
            </div>

            <Body color={THEME.inkSoft}>
              Something about this campaign's model appears to have <b>pulled respondents deeper rather than burning them out</b>. That pattern is the thing worth trying to explain.
            </Body>
          </div>

          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.inkMute, marginBottom: 16 }}>WHY THEY KEPT COMING BACK</div>
            {[
              { label: 'Commitment to the mission', pct: 90, color: THEME.red },
              { label: 'Enjoyed the experience', pct: 84, color: THEME.red },
              { label: 'Felt the work mattered', pct: 84, color: THEME.red },
              { label: 'It became routine', pct: 69, color: THEME.blue },
              { label: 'Relationships with other volunteers', pct: 68, color: THEME.blue },
              { label: 'Responsibility to the team', pct: 65, color: THEME.blue },
              { label: 'Wanted more leadership', pct: 62, color: THEME.blue },
            ].map(r => (
              <div key={r.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: FONT_BODY, color: THEME.ink, marginBottom: 3 }}>
                  <span>{r.label}</span>
                  <span style={{ fontFamily: FONT_MONO, color: r.color, fontWeight: 700 }}>{r.pct}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(26,26,26,0.06)' }}>
                  <div style={{ height: '100%', width: `${r.pct}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PaletteBand>

      {/* ========== FINDING 03 ========== */}
      <PaletteBand tone="paper">
        <Chapter num="03" kicker="Who the respondents are" color={THEME.blue} />
        <HeadlineSerif size={64} color={THEME.ink}>
          Largely a study of the <span style={{ color: THEME.blue }}>DSA pipeline</span>.
        </HeadlineSerif>
        <Lede color={THEME.inkSoft}>
          87% of respondents report a DSA affiliation. Nearly half were members before the campaign began; another third joined <i>during</i> it. Other endorsing organizations appear much less frequently in respondent profiles.
        </Lede>

        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          <div style={{ background: THEME.blue, color: THEME.paper, padding: 24 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, opacity: 0.8, marginBottom: 6 }}>MEMBERS BEFORE</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 72, fontWeight: 700, lineHeight: 0.9, letterSpacing: -2 }}>45<span style={{ fontSize: 32 }}>%</span></div>
            <div style={{ fontSize: 12, fontFamily: FONT_BODY, opacity: 0.85, marginTop: 12, lineHeight: 1.4 }}>Already NYC-DSA members when they started volunteering.</div>
          </div>
          <div style={{ background: THEME.yellow, color: THEME.ink, padding: 24 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, opacity: 0.7, marginBottom: 6 }}>JOINED DURING</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 72, fontWeight: 700, lineHeight: 0.9, letterSpacing: -2 }}>35<span style={{ fontSize: 32 }}>%</span></div>
            <div style={{ fontSize: 12, fontFamily: FONT_BODY, marginTop: 12, lineHeight: 1.4 }}>Reported joining NYC-DSA over the course of the campaign (recruited through the canvass).</div>
          </div>
          <div style={{ background: THEME.red, color: THEME.paper, padding: 24 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, opacity: 0.8, marginBottom: 6 }}>NOT DSA</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 72, fontWeight: 700, lineHeight: 0.9, letterSpacing: -2 }}>12<span style={{ fontSize: 32 }}>%</span></div>
            <div style={{ fontSize: 12, fontFamily: FONT_BODY, opacity: 0.85, marginTop: 12, lineHeight: 1.4 }}>Report no DSA affiliation. Other endorsers appear rarely (Sunrise 5%, JVP/JFREJ 8%).</div>
          </div>
        </div>

        <Body color={THEME.inkSoft}>
          This respondent pool is therefore not a cross-section of NYC campaign volunteers. It is closer to a study of <b>the DSA-aligned volunteer pipeline</b> on a particular high-profile campaign. That framing is not a flaw in the data, but it does scope the claims: what follows describes patterns among DSA-aligned respondents and should not be read as generalizable to the full volunteer base.
        </Body>
      </PaletteBand>

      {/* ========== FINDING 04 ========== */}
      <PaletteBand tone="dark">
        <Chapter num="04" kicker="At the door" color={THEME.yellow} />
        <HeadlineSerif size={68} italic color={THEME.paper}>
          Canvassing may have worked <span style={{ color: THEME.yellow }}>because</span><br/>it was hard (not despite it).
        </HeadlineSerif>
        <Lede color="rgba(244,237,224,0.8)">
          71% of respondents reported feeling anxious or somewhat anxious before their first shift. Once canvassing, 90% reported feeling confident "often" or "always," and 94% reported feeling supported. The more notable pattern is a tension in how respondents characterize the activity itself: 72% agreed that canvassing felt <b style={{ color: THEME.yellow }}>easy and natural</b>, and roughly the same share (72%) agreed that it <b style={{ color: THEME.yellow }}>pushed them outside their comfort zone</b>.
        </Lede>

        <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div style={{ padding: 24, border: `1px solid rgba(244,237,224,0.2)` }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.yellow, marginBottom: 10 }}>BEFORE FIRST CANVASS</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 48, fontWeight: 700, lineHeight: 0.9, color: THEME.paper, letterSpacing: -1.5 }}>
              71<span style={{ fontSize: 22, opacity: 0.5 }}>%</span>
            </div>
            <div style={{ fontSize: 13, fontFamily: FONT_BODY, color: 'rgba(244,237,224,0.8)', marginTop: 8 }}>felt anxious or somewhat anxious.</div>
          </div>
          <div style={{ padding: 24, border: `1px solid ${THEME.yellow}` }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.yellow, marginBottom: 10 }}>DURING CANVASSING</div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 48, fontWeight: 700, color: THEME.yellow, letterSpacing: -1.5, lineHeight: 0.9 }}>90<span style={{ fontSize: 22, opacity: 0.8 }}>%</span></div>
                <div style={{ fontSize: 12, color: 'rgba(244,237,224,0.8)', marginTop: 4 }}>confident</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 48, fontWeight: 700, color: THEME.yellow, letterSpacing: -1.5, lineHeight: 0.9 }}>92<span style={{ fontSize: 22, opacity: 0.8 }}>%</span></div>
                <div style={{ fontSize: 12, color: 'rgba(244,237,224,0.8)', marginTop: 4 }}>energized</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 48, fontWeight: 700, color: THEME.yellow, letterSpacing: -1.5, lineHeight: 0.9 }}>94<span style={{ fontSize: 22, opacity: 0.8 }}>%</span></div>
                <div style={{ fontSize: 12, color: 'rgba(244,237,224,0.8)', marginTop: 4 }}>supported</div>
              </div>
            </div>
          </div>
        </div>

        {/* the both/and callout */}
        <div style={{ marginTop: 44, background: THEME.red, color: THEME.paper, padding: '32px 36px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: 'rgba(244,237,224,0.75)', marginBottom: 8 }}>72% AGREE</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontStyle: 'italic', lineHeight: 1.2 }}>"Canvassing felt easy and natural."</div>
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, fontStyle: 'italic', color: THEME.yellow }}>+</div>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: 'rgba(244,237,224,0.75)', marginBottom: 8 }}>72% AGREE</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontStyle: 'italic', lineHeight: 1.2 }}>"It pushed me outside my comfort zone."</div>
          </div>
        </div>

        <Body color="rgba(244,237,224,0.85)">
          92% of respondents agreed that canvassing made them feel they could influence politics, 87% that it helped them develop new organizing skills, and 82% that it made them more confident talking about politics. Taken together, these patterns are consistent with the view that <b style={{ color: THEME.yellow }}>the canvass functioned as a site of political development, not solely as a voter-contact operation</b>, though a causal reading would require further work.
        </Body>
      </PaletteBand>

      {/* ========== FINDING 05 ========== */}
      <PaletteBand tone="yellow">
        <Chapter num="05" kicker="Why respondents did not quit" color={THEME.red} />
        <HeadlineSerif size={68} color={THEME.ink}>
          <span style={{ color: THEME.red }}>58%</span> considered quitting.<br/>
          <span style={{ fontStyle: 'italic' }}>Relationships appear to have kept them in.</span>
        </HeadlineSerif>
        <Lede color={THEME.ink}>
          The attrition pressure was real among respondents. What appears to have kept it from turning into actual attrition is the <b>relational infrastructure</b> around the canvass.
        </Lede>

        <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 36 }}>
          <div style={{ background: THEME.paper, padding: 24, border: `2px solid ${THEME.ink}` }}>
            <Stat value="93" unit="%" label="Reported making a friend on the campaign" color={THEME.red} />
          </div>
          <div style={{ background: THEME.paper, padding: 24, border: `2px solid ${THEME.ink}` }}>
            <Stat value="86" unit="%" label="Made concrete commitments to show up (with other volunteers)" color={THEME.blue} />
          </div>
          <div style={{ background: THEME.paper, padding: 24, border: `2px solid ${THEME.ink}` }}>
            <Stat value="75" unit="%" label="Had someone follow up to hold them accountable" color={THEME.red} />
          </div>
          <div style={{ background: THEME.paper, padding: 24, border: `2px solid ${THEME.ink}` }}>
            <Stat value="69" unit="%" label="Someone else's expectations influenced whether they showed up" color={THEME.blue} />
          </div>
        </div>

        <div style={{ marginTop: 36, padding: '20px 24px', background: THEME.ink, color: THEME.paper, borderLeft: `6px solid ${THEME.red}` }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.yellow, marginBottom: 8 }}>A TENTATIVE READING</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, lineHeight: 1.45, fontStyle: 'italic' }}>
            Mutual commitments, follow-ups, and social accountability may be mechanisms through which volunteers remained engaged when they wanted to leave.
          </div>
        </div>
      </PaletteBand>

      {/* ========== FINDING 06 ========== */}
      <PaletteBand tone="blue">
        <Chapter num="06" kicker="Something larger" color={THEME.yellow} />
        <HeadlineSerif size={72} italic color={THEME.paper}>
          <span style={{ color: THEME.yellow }}>Ours</span>, not his.
        </HeadlineSerif>
        <Lede color="rgba(244,237,224,0.9)">
          On the collective-identity items, respondent agreement clusters unusually hard at <i>strongly agree</i>, at levels that appear high relative to what the published campaign-volunteer literature typically reports. These items are not satisfaction measures. They are standard markers of <b style={{ color: THEME.yellow }}>collective identity formation</b>, which the literature treats as difficult to produce.
        </Lede>

        <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {[
            { label: '"I felt a shared sense of struggle with other volunteers"', strong: 80, total: 92 },
            { label: '"The campaign was building something larger than a single election"', strong: 79, total: 93 },
            { label: '"The campaign felt like ours, not just something I volunteered for"', strong: 78, total: 93 },
            { label: '"I felt personally responsible for the campaign\'s success"', strong: 58, total: 91 },
          ].map(r => (
            <div key={r.label}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontStyle: 'italic', color: THEME.paper, marginBottom: 10, lineHeight: 1.4 }}>
                {r.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 64, fontWeight: 700, color: THEME.yellow, letterSpacing: -2, lineHeight: 0.9 }}>
                  {r.strong}<span style={{ fontSize: 28, opacity: 0.8 }}>%</span>
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: 'rgba(244,237,224,0.75)', paddingBottom: 10 }}>
                  strongly agree<br/>
                  <span style={{ color: 'rgba(244,237,224,0.5)' }}>({r.total}% agree net)</span>
                </div>
              </div>
              <div style={{ marginTop: 6, display: 'flex', height: 6 }}>
                <div style={{ width: `${r.strong}%`, background: THEME.yellow }} />
                <div style={{ width: `${r.total - r.strong}%`, background: 'rgba(254,168,6,0.35)' }} />
                <div style={{ width: `${100 - r.total}%`, background: 'rgba(244,237,224,0.1)' }} />
              </div>
            </div>
          ))}
        </div>
      </PaletteBand>

      {/* ========== FINDING 07 ========== */}
      <PaletteBand tone="paper">
        <Chapter num="07" kicker="Composition" color={THEME.blue} />
        <HeadlineSerif size={60} color={THEME.ink}>
          The respondent pool does not look<br/>like the voter <span style={{ color: THEME.red }}>coalition</span>.
        </HeadlineSerif>
        <Lede color={THEME.inkSoft}>
          Among respondents: median age 32, 89% college-educated, 63% white, 48% residing in Brooklyn. Mamdani's electoral base (heavily South Asian, immigrant, outer-borough) looks quite different from the composition of this respondent set. That gap is itself worth noting.
        </Lede>

        <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.inkMute, marginBottom: 10 }}>BOROUGH</div>
            {agg.borough.map(([k, v]) => (
              <div key={k} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontFamily: FONT_BODY, color: THEME.ink, display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span>{k}</span>
                  <span style={{ fontFamily: FONT_MONO, color: THEME.blue, fontWeight: 600 }}>{Math.round(v/agg.n*100)}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(26,26,26,0.08)' }}>
                  <div style={{ height: '100%', width: `${v/agg.n*100}%`, background: THEME.blue }} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.inkMute, marginBottom: 10 }}>AGE</div>
            {agg.ageDist.map(d => (
              <div key={d.label} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontFamily: FONT_BODY, color: THEME.ink, display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span>{d.label}</span>
                  <span style={{ fontFamily: FONT_MONO, color: THEME.red, fontWeight: 600 }}>{Math.round(d.count/agg.n*100)}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(26,26,26,0.08)' }}>
                  <div style={{ height: '100%', width: `${d.count/agg.n*100}%`, background: THEME.red }} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.inkMute, marginBottom: 10 }}>RACE / ETHNICITY</div>
            {[
              ['White', 63], ['Asian', 16], ['Hispanic/Latino', 14], ['Black', 3], ['Other', 4],
            ].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontFamily: FONT_BODY, color: THEME.ink, display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span>{k}</span>
                  <span style={{ fontFamily: FONT_MONO, color: THEME.blue, fontWeight: 600 }}>{v}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(26,26,26,0.08)' }}>
                  <div style={{ height: '100%', width: `${v}%`, background: THEME.blue }} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.inkMute, marginBottom: 10 }}>TENURE IN NYC</div>
            {[
              ['Born & raised in NYC', 22],
              ['10+ year residents', 33],
              ['5–10 years', 28],
              ['<5 years', 17],
            ].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontFamily: FONT_BODY, color: THEME.ink, display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span>{k}</span>
                  <span style={{ fontFamily: FONT_MONO, color: THEME.red, fontWeight: 600 }}>{v}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(26,26,26,0.08)' }}>
                  <div style={{ height: '100%', width: `${v}%`, background: THEME.red }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PaletteBand>

      {/* ========== FINDING 08 ========== */}
      <PaletteBand tone="red">
        <Chapter num="08" kicker="A central caveat" color={THEME.yellow} />
        <HeadlineSerif size={64} color={THEME.paper}>
          <span style={{ color: THEME.yellow }}>91 of ~700</span> is the<br/>
          central caveat.
        </HeadlineSerif>
        <Lede color="rgba(244,237,224,0.9)">
          The survey launched on April 18, 2026. The 91 respondents captured so far are unlikely to be representative of the roughly 700 volunteers invited. Respondents who complete a long post-campaign survey in the first three days of fielding are likely to skew toward the <b style={{ color: THEME.yellow }}>more committed end of the volunteer distribution</b> (field leads, organizers, and volunteers who sustained participation through the primary).
        </Lede>

        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
          <div style={{ padding: 24, background: 'rgba(244,237,224,0.08)', border: `1px solid rgba(244,237,224,0.2)` }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.yellow, marginBottom: 8 }}>LIKELY UNDER-REPRESENTED SO FAR</div>
            <ul style={{ fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.6, color: THEME.paper, margin: 0, paddingLeft: 20 }}>
              <li>One-shift volunteers who drifted away</li>
              <li>Volunteers who burned out mid-primary</li>
              <li>Respondents who ended the campaign disillusioned</li>
              <li>Volunteers with less free time day-to-day</li>
            </ul>
          </div>
          <div style={{ padding: 24, background: 'rgba(244,237,224,0.08)', border: `1px solid rgba(244,237,224,0.2)` }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.yellow, marginBottom: 8 }}>HOW TO READ THESE FINDINGS</div>
            <ul style={{ fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.6, color: THEME.paper, margin: 0, paddingLeft: 20 }}>
              <li>Results describe the <b>most engaged respondents</b> to date</li>
              <li>Claims should be scoped to this subset (not to the full invited sample)</li>
              <li>Later respondents may look different on key measures</li>
              <li>Point estimates may shift as the final sample fills in</li>
            </ul>
          </div>
        </div>
      </PaletteBand>

      {/* ========== FINDING 09 ========== */}
      <PaletteBand tone="paper">
        <Chapter num="09" kicker="A possible implication" color={THEME.blue} />
        <HeadlineSerif size={64} color={THEME.ink}>
          Evidence, for respondents, of<br/>
          <span style={{ color: THEME.red }}>durable political formation</span><br/>
          <span style={{ fontStyle: 'italic' }}>beyond election-day turnout.</span>
        </HeadlineSerif>
        <Lede color={THEME.inkSoft}>
          For arguments that campaigns can function as sites of democratic capacity-building (in addition to vehicles for winning elections), the post-campaign items offer suggestive evidence among these respondents.
        </Lede>

        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.inkMute, marginBottom: 16 }}>SINCE THE CAMPAIGN ENDED</div>
            {[
              ['Volunteered for another campaign or org', 77, THEME.red],
              ['Donated to political causes', 80, THEME.red],
              ['Joined a political organization', 62, THEME.blue],
              ['Joined DSA', 57, THEME.blue],
              ['Volunteered for Our Time', 51, THEME.blue],
              ['Assumed a formal leadership role', 45, THEME.blue],
              ['Took a job in politics, organizing, or public service', 18, THEME.red],
            ].map(([k, v, c]) => (
              <div key={k} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontFamily: FONT_BODY, color: THEME.ink, marginBottom: 4 }}>
                  <span>{k}</span>
                  <span style={{ fontFamily: FONT_MONO, color: c, fontWeight: 700 }}>{v}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(26,26,26,0.06)' }}>
                  <div style={{ height: '100%', width: `${v}%`, background: c }} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.inkMute, marginBottom: 16 }}>LASTING CHANGES (SELF-REPORTED)</div>
            {[
              ['Feel more connected to NYC', 90],
              ['Pay more attention to local government', 84],
              ['Encouraged someone else to get involved', 81],
              ['Follow local politics more closely', 69],
              ['Talk politics with people I wouldn\'t have before', 62],
              ['Took on a political role I wouldn\'t have before', 60],
              ['Consider myself part of a broader political movement', 54],
            ].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontFamily: FONT_BODY, color: THEME.ink, marginBottom: 4 }}>
                  <span>{k}</span>
                  <span style={{ fontFamily: FONT_MONO, color: THEME.blue, fontWeight: 700 }}>{v}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(26,26,26,0.06)' }}>
                  <div style={{ height: '100%', width: `${v}%`, background: THEME.blue }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PaletteBand>

      {/* ========== CLOSE ========== */}
      <PaletteBand tone="dark">
        <div style={{ display: 'flex', gap: 40, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: THEME.yellow, textTransform: 'uppercase', marginBottom: 10 }}>Keep reading</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 700, color: THEME.paper, lineHeight: 1.1, letterSpacing: -0.5 }}>
              Two more ways to read the data →
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 560 }}>
            <div style={{ padding: 18, background: THEME.blue, color: THEME.paper }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.yellow }}>TAB 2</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, marginTop: 6, lineHeight: 1.1 }}>Cohort Explorer</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, opacity: 0.8, marginTop: 8, lineHeight: 1.4 }}>Filter respondents by borough, age, ideology, and entry point. Every chart re-slices.</div>
            </div>
            <div style={{ padding: 18, background: THEME.red, color: THEME.paper }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: THEME.yellow }}>TAB 3</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, marginTop: 6, lineHeight: 1.1 }}>Quote Atlas</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, opacity: 0.8, marginTop: 8, lineHeight: 1.4 }}>A curated selection of the most notable long-form responses, organized by theme.</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid rgba(244,237,224,0.2)`, display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 10, color: 'rgba(244,237,224,0.5)', letterSpacing: 1 }}>
          <span>Methodology: Qualtrics field-lead survey, launched April 18, 2026 · preliminary results after ~3 days of fielding · n=91 of ~700 · response rate ≈13%</span>
          <span>§ ∞</span>
        </div>
      </PaletteBand>
    </div>
  );
}

window.ViewA = ViewA;
