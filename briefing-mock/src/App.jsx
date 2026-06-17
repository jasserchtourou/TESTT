import { useState } from 'react';
import { municipalities, kirchheimBriefing } from './mockData';

const STEPS = ['Resolve', 'CRM', 'Solar batch', 'Rank', 'Narrative'];

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function App() {
  const [query, setQuery] = useState('Gemeinde Kirchheim');
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [stepIndex, setStepIndex] = useState(0);
  const [briefing, setBriefing] = useState(null);

  const matches = query.length >= 2
    ? municipalities.filter((m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.state.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const startBriefing = (municipality) => {
    setSelected(municipality);
    setPhase('loading');
    setStepIndex(0);
    setBriefing(null);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setStepIndex(step);
      if (step >= STEPS.length) {
        clearInterval(interval);
        setTimeout(() => {
          setBriefing(kirchheimBriefing);
          setPhase('ready');
        }, 400);
      }
    }, 600);
  };

  const handleGo = () => {
    if (matches.length === 1) {
      startBriefing(matches[0]);
    } else if (matches.length > 1 && selected) {
      startBriefing(selected);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand">ADMI · Sales Briefing</div>
        <span className="badge">Mock prototype</span>
      </header>

      <section className="search-panel">
        <label htmlFor="search">Search municipality</label>
        <div className="search-row">
          <input
            id="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
              setPhase('idle');
              setBriefing(null);
            }}
            placeholder="e.g. Gemeinde Kirchheim"
          />
          <button type="button" onClick={handleGo} disabled={matches.length === 0}>
            Generate briefing
          </button>
        </div>

        {matches.length > 1 && phase === 'idle' && (
          <ul className="disambiguation">
            {matches.map((m) => (
              <li key={m.ags}>
                <button
                  type="button"
                  className={selected?.ags === m.ags ? 'selected' : ''}
                  onClick={() => setSelected(m)}
                >
                  {m.name} · {m.state} · AGS {m.ags}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {phase === 'loading' && (
        <section className="progress-panel">
          <h2>Generating briefing for {selected?.name}</h2>
          <div className="steps">
            {STEPS.map((label, i) => (
              <div key={label} className={`step ${i <= stepIndex ? 'active' : ''}`}>
                <span className="dot" />
                {label}
              </div>
            ))}
          </div>
        </section>
      )}

      {phase === 'ready' && briefing && (
        <main className="briefing">
          <div className="briefing-header">
            <div>
              <h1>
                {briefing.municipality.name} · AGS {briefing.municipality.ags} ·{' '}
                {briefing.municipality.state}
              </h1>
              <p className="meta">
                Ready in {formatDuration(briefing.meta.durationSeconds)}
                {briefing.meta.cacheHit && ' · cache hit'}
                {' · '}Assumptions {briefing.meta.assumptionsVersion}
              </p>
            </div>
            <button type="button" className="secondary">Refresh</button>
          </div>

          <div className="kpis">
            <Kpi label="Assessed" value={briefing.solarSummary.buildingsAssessed} />
            <Kpi
              label="Suitable"
              value={`${briefing.solarSummary.buildingsSuitable} (${briefing.solarSummary.suitabilityPct}%)`}
            />
            <Kpi label="Est. size" value={`~${briefing.solarSummary.aggregateKwp} MWp`} />
            <Kpi label="Est. yield" value={`~${briefing.solarSummary.estimatedMwhYear.toLocaleString()} MWh/yr`} />
            <Kpi label="CO₂ savings" value={`~${briefing.solarSummary.co2TonsYear.toLocaleString()} t/yr`} />
          </div>

          <div className="grid-two">
            <article className="card highlight">
              <h2>Top opportunity</h2>
              <p className="address">{briefing.topOpportunity.address}</p>
              <p>
                {briefing.topOpportunity.roofAreaM2} m² {briefing.topOpportunity.orientation} · ~
                {briefing.topOpportunity.kwp} kWp
              </p>
              <p>
                Payback: ~{briefing.topOpportunity.paybackYears} years ·{' '}
                <span className={`confidence ${briefing.topOpportunity.confidence}`}>
                  {briefing.topOpportunity.confidence} confidence
                </span>
              </p>
            </article>

            <article className="card">
              <h2>CRM status</h2>
              <p>
                {briefing.crm.activeDeals} active deals ({briefing.crm.stage})
              </p>
              <p>Last contact: {briefing.crm.lastContact}</p>
              <p>
                Key contact: {briefing.crm.keyContact.name}, {briefing.crm.keyContact.role}
              </p>
            </article>
          </div>

          <article className="card recommendation">
            <h2>Recommendation</h2>
            <p>{briefing.recommendation}</p>
            <button type="button" className="secondary">Copy talking points</button>
          </article>

          <article className="card">
            <h2>Ranked buildings</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Building</th>
                  <th>Area</th>
                  <th>kWp</th>
                  <th>Payback</th>
                  <th>Suitability</th>
                </tr>
              </thead>
              <tbody>
                {briefing.rankedBuildings.map((b) => (
                  <tr key={b.rank}>
                    <td>{b.rank}</td>
                    <td>{b.name}</td>
                    <td>{b.area} m²</td>
                    <td>{b.kwp}</td>
                    <td>{b.payback}y</td>
                    <td>
                      <span className={`confidence ${b.suitability}`}>{b.suitability}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <footer className="assumptions">
            Assumptions {briefing.meta.assumptionsVersion}: {briefing.assumptions.join(' · ')}
          </footer>
        </main>
      )}
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="kpi">
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}
