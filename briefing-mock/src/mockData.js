export const municipalities = [
  { name: 'Gemeinde Kirchheim', state: 'Bayern', ags: '09175124' },
  { name: 'Kirchheim unter Teck', state: 'Baden-Württemberg', ags: '08116032' },
  { name: 'Kirchheim (Altkreis)', state: 'Hessen', ags: '06435012' },
];

export const kirchheimBriefing = {
  municipality: {
    name: 'Gemeinde Kirchheim',
    ags: '09175124',
    state: 'Bayern',
  },
  meta: {
    status: 'ready',
    durationSeconds: 134,
    rollupComputedAt: '2026-06-14T08:30:00Z',
    assumptionsVersion: 'v3',
    cacheHit: true,
  },
  solarSummary: {
    buildingsAssessed: 847,
    buildingsSuitable: 312,
    suitabilityPct: 37,
    aggregateKwp: 4.2,
    estimatedMwhYear: 3800,
    avgIrradiance: 1050,
    co2TonsYear: 1900,
  },
  topOpportunity: {
    buildingId: 'DE_BY_09175124_RATHAUS',
    address: 'Rathaus, Hauptstraße 12',
    roofAreaM2: 280,
    orientation: 'South-facing',
    kwp: 42,
    paybackYears: 7.2,
    confidence: 'high',
  },
  crm: {
    activeDeals: 2,
    stage: 'Potential Analysis',
    lastContact: '3 weeks ago',
    keyContact: { name: 'Hans Müller', role: 'Bürgermeister' },
  },
  recommendation:
    'High-priority lead. Strong irradiance, existing relationship via 2022 energy audit. Recommend opening with Rathaus as anchor project.',
  rankedBuildings: [
    { rank: 1, name: 'Rathaus', area: 280, kwp: 42, payback: 7.2, suitability: 'high' },
    { rank: 2, name: 'Grundschule', area: 410, kwp: 58, payback: 8.1, suitability: 'high' },
    { rank: 3, name: 'Feuerwehr', area: 190, kwp: 28, payback: 9.0, suitability: 'medium' },
  ],
  assumptions: [
    'Panel efficiency: 21%',
    'System losses: 14%',
    'Electricity price: 0.32 EUR/kWh',
    'Feed-in tariff: 0.082 EUR/kWh',
  ],
};
