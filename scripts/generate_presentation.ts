import pptxgen from 'pptxgenjs';
import fs from 'fs';
import path from 'path';

export async function generatePresentation(outputPath?: string): Promise<string> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'TreeDoctor Team';
  pptx.company = 'TreeDoctor Urban Forestry AI';
  pptx.title = 'TreeDoctor - AI Urban Tree Health Platform';
  pptx.subject = 'Hackathon Final Pitch Deck';

  // Palette Tokens (Hex colors without # for pptxgenjs)
  const COLORS = {
    bgDark: '0D1510',
    cardDark: '16221A',
    cardInner: '1D2E23',
    cardBorder: '284030',
    emeraldPrimary: '10B981',
    emeraldLight: '34D399',
    amberAccent: 'F59E0B',
    roseAccent: 'EF4444',
    skyAccent: '38BDF8',
    textWhite: 'FFFFFF',
    textMuted: '94A3B8',
    textDim: '64748B',
  };

  // Helper for slide headers (clean rectangles without rectRadius)
  const addHeader = (slide: pptxgen.Slide, slideNum: string, title: string, subtitle: string) => {
    // Header pill container
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 0.45,
      w: 2.4,
      h: 0.35,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.emeraldPrimary, width: 1 },
    });

    slide.addText(slideNum, {
      x: 0.8,
      y: 0.45,
      w: 2.4,
      h: 0.35,
      fontSize: 10,
      fontFace: 'Arial',
      color: COLORS.emeraldPrimary,
      bold: true,
      align: 'center',
      valign: 'middle',
    });

    // Main title
    slide.addText(title, {
      x: 0.8,
      y: 0.88,
      w: 11.5,
      h: 0.55,
      fontSize: 22,
      fontFace: 'Arial',
      color: COLORS.textWhite,
      bold: true,
      valign: 'top',
    });

    // Subtitle
    slide.addText(subtitle, {
      x: 0.8,
      y: 1.45,
      w: 11.5,
      h: 0.35,
      fontSize: 11.5,
      fontFace: 'Arial',
      color: COLORS.textMuted,
      valign: 'top',
    });

    // Divider line
    slide.addShape(pptx.ShapeType.line, {
      x: 0.8,
      y: 1.88,
      w: 11.7,
      h: 0,
      line: { color: COLORS.cardBorder, width: 1 },
    });
  };

  // =============================================================
  // SLIDE 1: Title Slide (Hero)
  // =============================================================
  const slide1 = pptx.addSlide();
  slide1.background = { color: COLORS.bgDark };

  // Background frame
  slide1.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 0.8,
    w: 11.7,
    h: 5.9,
    fill: { color: COLORS.cardDark },
    line: { color: COLORS.cardBorder, width: 1.5 },
  });

  // Top pill
  slide1.addShape(pptx.ShapeType.rect, {
    x: 1.3,
    y: 1.3,
    w: 5.0,
    h: 0.38,
    fill: { color: '0B3B24' },
    line: { color: COLORS.emeraldPrimary, width: 1 },
  });
  slide1.addText('[AI-POWERED URBAN CANOPY HEALTH PLATFORM]', {
    x: 1.3,
    y: 1.3,
    w: 5.0,
    h: 0.38,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: COLORS.emeraldPrimary,
    bold: true,
    align: 'center',
    valign: 'middle',
  });

  // App Title
  slide1.addText('TreeDoctor', {
    x: 1.3,
    y: 1.85,
    w: 7.0,
    h: 1.1,
    fontSize: 48,
    fontFace: 'Arial',
    color: COLORS.textWhite,
    bold: true,
    valign: 'middle',
  });

  // Tagline
  slide1.addText('"Google Maps tells us where trees are. TreeDoctor tells us which ones need our help."', {
    x: 1.3,
    y: 3.0,
    w: 10.5,
    h: 0.6,
    fontSize: 14,
    fontFace: 'Arial',
    color: COLORS.emeraldLight,
    italic: true,
    valign: 'middle',
  });

  // Summary statement
  slide1.addText(
    'An intelligent early warning and clinical EHR platform combining Multimodal Vision AI (Gemini 2.5 Flash), longitudinal time-series health tracking, real-time microclimate telemetry, and automated municipal field dispatch.',
    {
      x: 1.3,
      y: 3.7,
      w: 9.8,
      h: 0.8,
      fontSize: 12,
      fontFace: 'Arial',
      color: COLORS.textMuted,
    }
  );

  // Feature Highlights
  const pills = [
    { label: 'Gemini 2.5 Flash Vision', color: COLORS.emeraldPrimary },
    { label: 'Longitudinal Trend Alerts', color: COLORS.skyAccent },
    { label: 'Open-Meteo Telemetry Grid', color: COLORS.amberAccent },
  ];
  pills.forEach((p, idx) => {
    slide1.addShape(pptx.ShapeType.rect, {
      x: 1.3 + idx * 3.5,
      y: 4.85,
      w: 3.3,
      h: 0.45,
      fill: { color: COLORS.cardInner },
      line: { color: p.color, width: 1 },
    });
    slide1.addText(p.label, {
      x: 1.3 + idx * 3.5,
      y: 4.85,
      w: 3.3,
      h: 0.45,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: COLORS.textWhite,
      bold: true,
      align: 'center',
      valign: 'middle',
    });
  });

  slide1.addText('Google AI Studio Hackathon Final Submission  |  React 19 + Express + Gemini 2.5 Flash', {
    x: 1.3,
    y: 5.75,
    w: 10.5,
    h: 0.35,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: COLORS.textDim,
  });

  // =============================================================
  // SLIDE 2: 1️⃣ Problem Statement
  // =============================================================
  const slide2 = pptx.addSlide();
  slide2.background = { color: COLORS.bgDark };
  addHeader(
    slide2,
    'SLIDE 1 OF 7: PROBLEM',
    'Urban Trees Are Dying in Plain Sight',
    'Cities invest millions planting trees, yet lose 30% prematurely due to a total lack of clinical health visibility.'
  );

  const problems = [
    {
      badge: 'BLIND SPOT',
      title: 'Static & Stale Inventories',
      desc: 'Municipal registries are static spreadsheets or GIS pins updated only once every 5 to 7 years. Tree pathogens, drought stress, and root decay progress in weeks, rendering records obsolete.',
      color: COLORS.amberAccent,
    },
    {
      badge: 'FINANCIAL DRAIN',
      title: 'The Reactive Cost Trap',
      desc: 'Cities intervene only after a tree collapses on a street or power line. Safe removal and replanting costs over $3,000 per tree, vs. $45 for preventative treatment caught 60 days earlier.',
      color: COLORS.roseAccent,
    },
    {
      badge: 'ENVIRONMENTAL STRESS',
      title: 'The Climate Multiplier',
      desc: 'Urban heat islands (>38C), asphalt root compaction, vapor pressure deficits, and PM2.5 pollution starve canopies before outward symptoms become obvious to the naked eye.',
      color: COLORS.skyAccent,
    },
  ];

  problems.forEach((item, i) => {
    const cardX = 0.8 + i * 3.95;
    slide2.addShape(pptx.ShapeType.rect, {
      x: cardX,
      y: 2.1,
      w: 3.75,
      h: 4.5,
      fill: { color: COLORS.cardDark },
      line: { color: item.color, width: 1.5 },
    });

    slide2.addShape(pptx.ShapeType.rect, {
      x: cardX + 0.3,
      y: 2.4,
      w: 2.2,
      h: 0.3,
      fill: { color: COLORS.bgDark },
      line: { color: item.color, width: 1 },
    });
    slide2.addText(item.badge, {
      x: cardX + 0.3,
      y: 2.4,
      w: 2.2,
      h: 0.3,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: item.color,
      bold: true,
      align: 'center',
      valign: 'middle',
    });

    slide2.addText(item.title, {
      x: cardX + 0.3,
      y: 3.0,
      w: 3.15,
      h: 0.6,
      fontSize: 15,
      fontFace: 'Arial',
      color: COLORS.textWhite,
      bold: true,
      valign: 'top',
    });

    slide2.addText(item.desc, {
      x: cardX + 0.3,
      y: 3.7,
      w: 3.15,
      h: 2.6,
      fontSize: 11,
      fontFace: 'Arial',
      color: COLORS.textMuted,
      valign: 'top',
    });
  });

  // =============================================================
  // SLIDE 3: 2️⃣ Proposed Solution
  // =============================================================
  const slide3 = pptx.addSlide();
  slide3.background = { color: COLORS.bgDark };
  addHeader(
    slide3,
    'SLIDE 2 OF 7: SOLUTION',
    'From Static Inventory to Continuous Clinical Care',
    'TreeDoctor transforms urban forestry into an automated Electronic Health Record (EHR) system.'
  );

  const pillars = [
    {
      num: '01',
      title: 'Multimodal AI Vision',
      sub: 'Gemini 2.5 Flash',
      body: 'Instant arborist pathology from field photos. Quantifies foliar necrosis, canopy thinning percentage, fungal conks, and pest boring holes with a clinical 0-100 score.',
      color: COLORS.emeraldPrimary,
    },
    {
      num: '02',
      title: 'Longitudinal EHR & Alerts',
      sub: 'Time-Series Intelligence',
      body: 'Maintains historical health curves for each specimen. Automatically fires urgent alerts whenever a tree experiences an acute drop (>10 health points) between scans.',
      color: COLORS.skyAccent,
    },
    {
      num: '03',
      title: 'Microclimate Grounding',
      sub: 'Zero-Mock Telemetry',
      body: 'Cross-checks visual decline against real-time ambient heat, 7-day rainfall deficits, relative humidity, and Copernicus AQI (PM2.5/PM10) at exact GPS coordinates.',
      color: COLORS.amberAccent,
    },
    {
      num: '04',
      title: 'Municipal Field Dispatch',
      sub: 'Closed-Loop Action',
      body: 'Converts diagnoses into municipal work orders (deep-root irrigation, micro-injection, pruning) with full lifecycle tracking from Pending to Resolved.',
      color: COLORS.roseAccent,
    },
  ];

  pillars.forEach((p, idx) => {
    const px = 0.8 + idx * 2.95;
    slide3.addShape(pptx.ShapeType.rect, {
      x: px,
      y: 2.1,
      w: 2.8,
      h: 4.5,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1 },
    });

    slide3.addText(p.num, {
      x: px + 0.25,
      y: 2.3,
      w: 1.0,
      h: 0.4,
      fontSize: 18,
      fontFace: 'Arial',
      color: p.color,
      bold: true,
    });

    slide3.addText(p.title, {
      x: px + 0.25,
      y: 2.8,
      w: 2.3,
      h: 0.5,
      fontSize: 13,
      fontFace: 'Arial',
      color: COLORS.textWhite,
      bold: true,
      valign: 'top',
    });

    slide3.addText(p.sub, {
      x: px + 0.25,
      y: 3.35,
      w: 2.3,
      h: 0.3,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: p.color,
      bold: true,
      valign: 'top',
    });

    slide3.addText(p.body, {
      x: px + 0.25,
      y: 3.75,
      w: 2.3,
      h: 2.6,
      fontSize: 10,
      fontFace: 'Arial',
      color: COLORS.textMuted,
      valign: 'top',
    });
  });

  // =============================================================
  // SLIDE 4: 3️⃣ Target Users
  // =============================================================
  const slide4 = pptx.addSlide();
  slide4.background = { color: COLORS.bgDark };
  addHeader(
    slide4,
    'SLIDE 3 OF 7: TARGET USERS',
    'Stakeholders, Pain Points & Value Delivered',
    'Empowering public works departments, certified arborists, university campuses, and civic volunteers.'
  );

  const users = [
    {
      group: 'Municipal Parks & Forestry Departments',
      pain: 'Stretched field teams, emergency tree failures, slow manual audits, citizen complaint backlogs.',
      value: 'Real-time city canopy health map, early warning decline alerts, and prioritized automated field dispatch.',
      badge: 'GOVERNMENT',
      color: COLORS.emeraldPrimary,
    },
    {
      group: 'Certified Arborists & Tree Contractors',
      pain: 'Time-consuming manual paper assessments, difficult client reporting, lack of objective longitudinal records.',
      value: 'AI-assisted pathology scoring (0-100), digital audit trails, and photographic time-series comparison.',
      badge: 'ENTERPRISE',
      color: COLORS.skyAccent,
    },
    {
      group: 'University Campuses & Botanical Gardens',
      pain: 'High-value heritage specimens vulnerable to microclimate heat islands and localized pathogen outbreaks.',
      value: 'Micro-location weather telemetry cross-referencing rainfall deficits to automate preventative care.',
      badge: 'INSTITUTIONS',
      color: COLORS.amberAccent,
    },
    {
      group: 'Civic Volunteers & Citizen Stewards',
      pain: 'Want to protect local neighborhood trees but lack botanical expertise and direct reporting lines to city hall.',
      value: 'Zero-friction camera scanner, instant AI diagnosis, and one-tap community reporting into the city queue.',
      badge: 'COMMUNITY',
      color: COLORS.roseAccent,
    },
  ];

  users.forEach((u, i) => {
    const uy = 2.15 + i * 1.15;
    slide4.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: uy,
      w: 11.7,
      h: 1.02,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1 },
    });

    slide4.addShape(pptx.ShapeType.rect, {
      x: 1.0,
      y: uy + 0.15,
      w: 1.4,
      h: 0.26,
      fill: { color: COLORS.bgDark },
      line: { color: u.color, width: 1 },
    });
    slide4.addText(u.badge, {
      x: 1.0,
      y: uy + 0.15,
      w: 1.4,
      h: 0.26,
      fontSize: 8,
      fontFace: 'Arial',
      color: u.color,
      bold: true,
      align: 'center',
      valign: 'middle',
    });

    slide4.addText(u.group, {
      x: 2.6,
      y: uy + 0.12,
      w: 9.6,
      h: 0.32,
      fontSize: 12,
      fontFace: 'Arial',
      color: COLORS.textWhite,
      bold: true,
      valign: 'top',
    });

    slide4.addText('Pain Point: ' + u.pain, {
      x: 1.0,
      y: uy + 0.48,
      w: 5.3,
      h: 0.45,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: COLORS.textMuted,
      valign: 'top',
    });

    slide4.addText('Value: ' + u.value, {
      x: 6.5,
      y: uy + 0.48,
      w: 5.8,
      h: 0.45,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: COLORS.emeraldLight,
      bold: true,
      valign: 'top',
    });
  });

  // =============================================================
  // SLIDE 5: 4️⃣ Technical Approach
  // =============================================================
  const slide5 = pptx.addSlide();
  slide5.background = { color: COLORS.bgDark };
  addHeader(
    slide5,
    'SLIDE 4 OF 7: ARCHITECTURE',
    'Production-Grade Full-Stack & Multimodal Architecture',
    'Secure server-side AI execution, zero-mock atmospheric telemetry, and high-performance geospatial UI.'
  );

  const techCards = [
    {
      badge: 'AI & VISION LAYER',
      title: 'Google DeepMind Gemini 2.5 Flash',
      bullets: [
        'Multimodal vision analysis of leaves, bark, and canopy structure.',
        'Pathology identification: foliar chlorosis, anthracnose, bracket fungi, borers.',
        'Structured clinical JSON response: 0-100 score, urgency & treatment steps.',
        'Strict server-side isolation: API keys never exposed to client browser.',
      ],
      color: COLORS.emeraldPrimary,
      x: 0.8,
    },
    {
      badge: 'ATMOSPHERIC TELEMETRY',
      title: 'Open-Meteo & Copernicus Grid',
      bullets: [
        'Zero-mock live telemetry grounded to exact tree GPS coordinates.',
        'Ambient temperature and 7-day cumulative rainfall deficit analysis.',
        'Relative humidity & Vapor Pressure Deficit (VPD) evaluation.',
        'Copernicus Air Quality Index (AQI) with PM2.5 & PM10 particulate levels.',
      ],
      color: COLORS.skyAccent,
      x: 4.8,
    },
    {
      badge: 'FRONTEND & SERVER',
      title: 'React 19 + Express + Leaflet',
      bullets: [
        'Zero-typing tree registration with interactive Leaflet map pinning.',
        '3 base map modes: Dark Canvas, Satellite Imagery, Topographic Terrain.',
        'Longitudinal SVG charts with decline detection threshold (>10 pts).',
        'Node.js Express bundled via esbuild into single CommonJS artifact.',
      ],
      color: COLORS.amberAccent,
      x: 8.8,
    },
  ];

  techCards.forEach((c) => {
    slide5.addShape(pptx.ShapeType.rect, {
      x: c.x,
      y: 2.15,
      w: 3.7,
      h: 4.4,
      fill: { color: COLORS.cardDark },
      line: { color: c.color, width: 1.5 },
    });

    slide5.addShape(pptx.ShapeType.rect, {
      x: c.x + 0.3,
      y: 2.4,
      w: 2.4,
      h: 0.28,
      fill: { color: COLORS.bgDark },
      line: { color: c.color, width: 1 },
    });
    slide5.addText(c.badge, {
      x: c.x + 0.3,
      y: 2.4,
      w: 2.4,
      h: 0.28,
      fontSize: 8,
      fontFace: 'Arial',
      color: c.color,
      bold: true,
      align: 'center',
      valign: 'middle',
    });

    slide5.addText(c.title, {
      x: c.x + 0.3,
      y: 2.85,
      w: 3.1,
      h: 0.6,
      fontSize: 13.5,
      fontFace: 'Arial',
      color: COLORS.textWhite,
      bold: true,
      valign: 'top',
    });

    c.bullets.forEach((b, bIdx) => {
      slide5.addText('- ' + b, {
        x: c.x + 0.3,
        y: 3.55 + bIdx * 0.72,
        w: 3.1,
        h: 0.68,
        fontSize: 10,
        fontFace: 'Arial',
        color: COLORS.textMuted,
        valign: 'top',
      });
    });
  });

  // =============================================================
  // SLIDE 6: 5️⃣ Market & Business Potential
  // =============================================================
  const slide6 = pptx.addSlide();
  slide6.background = { color: COLORS.bgDark };
  addHeader(
    slide6,
    'SLIDE 5 OF 7: MARKET & ROI',
    'The $5.8B Opportunity & Quantifiable Municipal ROI',
    'Saving public funds, reducing infrastructure hazard liability, and protecting mature carbon assets.'
  );

  // Left stat block
  slide6.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 2.15,
    w: 4.8,
    h: 4.4,
    fill: { color: COLORS.cardDark },
    line: { color: COLORS.emeraldPrimary, width: 1.5 },
  });

  slide6.addText('QUANTIFIABLE MUNICIPAL IMPACT', {
    x: 1.1,
    y: 2.4,
    w: 4.2,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Arial',
    color: COLORS.emeraldPrimary,
    bold: true,
  });

  const stats = [
    { num: '$250,000+', label: 'Annual savings per 100 rescued trees vs. removal and replanting.' },
    { num: '60% Drop', label: 'Reduction in sapling mortality via early microclimate intervention.' },
    { num: '70x Carbon', label: 'Mature trees store up to 70x more carbon than newly planted saplings.' },
    { num: '$5.8 Billion', label: 'Global Smart City Urban Greening & Tree Inventory Market by 2030.' },
  ];

  stats.forEach((s, sIdx) => {
    slide6.addText(s.num, {
      x: 1.1,
      y: 2.8 + sIdx * 0.9,
      w: 4.2,
      h: 0.45,
      fontSize: 18,
      fontFace: 'Arial',
      color: COLORS.textWhite,
      bold: true,
    });
    slide6.addText(s.label, {
      x: 1.1,
      y: 3.25 + sIdx * 0.9,
      w: 4.2,
      h: 0.4,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: COLORS.textMuted,
    });
  });

  // Right business models
  const bModels = [
    {
      title: 'B2G Municipal SaaS',
      desc: 'Annual tier subscription for city parks and forestry departments ($15k-$80k/year based on tree volume & crew dispatch seats).',
      badge: 'PRIMARY REVENUE',
      color: COLORS.emeraldPrimary,
    },
    {
      title: 'Enterprise Campus Licensing',
      desc: 'Dedicated monitoring for universities, corporate headquarters, golf resorts, and botanical arboretums.',
      badge: 'HIGH MARGIN',
      color: COLORS.skyAccent,
    },
    {
      title: 'Insurance & ESG Carbon Verification API',
      desc: 'Risk data feeds for municipal property insurers and verified canopy health telemetry for urban carbon credit platforms.',
      badge: 'DATA MONETIZATION',
      color: COLORS.amberAccent,
    },
  ];

  bModels.forEach((bm, bmIdx) => {
    const bmy = 2.15 + bmIdx * 1.5;
    slide6.addShape(pptx.ShapeType.rect, {
      x: 5.9,
      y: bmy,
      w: 6.6,
      h: 1.35,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1 },
    });

    slide6.addText(bm.title, {
      x: 6.15,
      y: bmy + 0.15,
      w: 4.5,
      h: 0.35,
      fontSize: 12.5,
      fontFace: 'Arial',
      color: COLORS.textWhite,
      bold: true,
      valign: 'top',
    });

    slide6.addShape(pptx.ShapeType.rect, {
      x: 10.7,
      y: bmy + 0.15,
      w: 1.6,
      h: 0.28,
      fill: { color: COLORS.bgDark },
      line: { color: bm.color, width: 1 },
    });
    slide6.addText(bm.badge, {
      x: 10.7,
      y: bmy + 0.15,
      w: 1.6,
      h: 0.28,
      fontSize: 7.5,
      fontFace: 'Arial',
      color: bm.color,
      bold: true,
      align: 'center',
      valign: 'middle',
    });

    slide6.addText(bm.desc, {
      x: 6.15,
      y: bmy + 0.55,
      w: 6.1,
      h: 0.65,
      fontSize: 10,
      fontFace: 'Arial',
      color: COLORS.textMuted,
      valign: 'top',
    });
  });

  // =============================================================
  // SLIDE 7: 6️⃣ Scalability & Future
  // =============================================================
  const slide7 = pptx.addSlide();
  slide7.background = { color: COLORS.bgDark };
  addHeader(
    slide7,
    'SLIDE 6 OF 7: SCALABILITY',
    'Architected to Expand from Single Parks to Millions of Trees',
    'High-throughput geospatial indexing, edge diagnostics, and seamless GIS software interoperability.'
  );

  const scaleItems = [
    {
      title: 'Geospatial Partitioning & Quadtree Clustering',
      body: 'Leaflet viewport-bounded queries and spatial index clustering ensure sub-second map rendering even with hundreds of thousands of specimens across metropolitan zones.',
      color: COLORS.emeraldPrimary,
    },
    {
      title: 'Decoupled Diagnostic Pipeline',
      body: 'Asynchronous image compression and queue workers prevent bottlenecks during city-wide citizen audit campaigns, maintaining rapid responses under high load.',
      color: COLORS.skyAccent,
    },
    {
      title: 'Interoperable Forestry Standards',
      body: 'Data schemas align with USDA Forest Service & ISA arboricultural standards, enabling two-way sync with legacy tools like Esri ArcGIS and TreePlotter.',
      color: COLORS.amberAccent,
    },
    {
      title: 'Crowdsourced Force Multiplier',
      body: 'By turning every smartphone into an arborist scanner, city inspection bandwidth multiplies by 100x without increasing public municipal headcount.',
      color: COLORS.roseAccent,
    },
  ];

  scaleItems.forEach((s, idx) => {
    const sx = 0.8 + (idx % 2) * 5.95;
    const sy = 2.15 + Math.floor(idx / 2) * 2.25;

    slide7.addShape(pptx.ShapeType.rect, {
      x: sx,
      y: sy,
      w: 5.7,
      h: 2.05,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1 },
    });

    slide7.addShape(pptx.ShapeType.rect, {
      x: sx + 0.3,
      y: sy + 0.2,
      w: 0.35,
      h: 0.35,
      fill: { color: s.color },
    });

    slide7.addText(s.title, {
      x: sx + 0.8,
      y: sy + 0.18,
      w: 4.6,
      h: 0.45,
      fontSize: 12,
      fontFace: 'Arial',
      color: COLORS.textWhite,
      bold: true,
      valign: 'top',
    });

    slide7.addText(s.body, {
      x: sx + 0.3,
      y: sy + 0.75,
      w: 5.1,
      h: 1.15,
      fontSize: 10,
      fontFace: 'Arial',
      color: COLORS.textMuted,
      valign: 'top',
    });
  });

  // =============================================================
  // SLIDE 8: 7️⃣ If We Had More Time
  // =============================================================
  const slide8 = pptx.addSlide();
  slide8.background = { color: COLORS.bgDark };
  addHeader(
    slide8,
    'SLIDE 7 OF 7: NEXT HORIZON',
    'What We Would Build Next with More Time and Resources',
    'Satellite NDVI remote sensing, on-device Gemini Nano, IoT ground sensors, and predictive epidemiology.'
  );

  const futureCards = [
    {
      phase: 'PHASE 1',
      title: 'Satellite NDVI Remote Sensing',
      sub: 'Sentinel-2 & Planet Labs Ingestion',
      body: 'Auto-detect canopy moisture stress and chlorophyll reduction from orbit using Normalized Difference Vegetation Index (NDVI) before field teams even deploy.',
      color: COLORS.emeraldPrimary,
    },
    {
      phase: 'PHASE 2',
      title: 'Offline-First Mobile PWA + Nano',
      sub: 'Zero-Connectivity Wilderness Mode',
      body: 'Deploy on-device Gemini Nano / quantized edge vision models directly onto park ranger devices for zero-reception national parks and nature reserves.',
      color: COLORS.skyAccent,
    },
    {
      phase: 'PHASE 3',
      title: 'IoT Soil Moisture & Sap Flow',
      sub: 'LoRaWAN Smart Irrigation Loop',
      body: 'Sub-surface ground sensor probes that trigger automated municipal drip valves when soil water tension drops below species-specific wilting points.',
      color: COLORS.amberAccent,
    },
    {
      phase: 'PHASE 4',
      title: 'Predictive Pest Spread Models',
      sub: 'Epidemiological Vector Simulation',
      body: 'Machine learning forecasting of pathogen spread trajectories (e.g. Emerald Ash Borer) by cross-referencing wind corridors and tree species density.',
      color: COLORS.roseAccent,
    },
  ];

  futureCards.forEach((fc, idx) => {
    const fx = 0.8 + idx * 2.95;
    slide8.addShape(pptx.ShapeType.rect, {
      x: fx,
      y: 2.15,
      w: 2.8,
      h: 4.4,
      fill: { color: COLORS.cardDark },
      line: { color: fc.color, width: 1.5 },
    });

    slide8.addShape(pptx.ShapeType.rect, {
      x: fx + 0.25,
      y: 2.35,
      w: 1.6,
      h: 0.26,
      fill: { color: COLORS.bgDark },
      line: { color: fc.color, width: 1 },
    });
    slide8.addText(fc.phase, {
      x: fx + 0.25,
      y: 2.35,
      w: 1.6,
      h: 0.26,
      fontSize: 8,
      fontFace: 'Arial',
      color: fc.color,
      bold: true,
      align: 'center',
      valign: 'middle',
    });

    slide8.addText(fc.title, {
      x: fx + 0.25,
      y: 2.75,
      w: 2.3,
      h: 0.6,
      fontSize: 12.5,
      fontFace: 'Arial',
      color: COLORS.textWhite,
      bold: true,
      valign: 'top',
    });

    slide8.addText(fc.sub, {
      x: fx + 0.25,
      y: 3.35,
      w: 2.3,
      h: 0.35,
      fontSize: 9,
      fontFace: 'Arial',
      color: COLORS.amberAccent,
      bold: true,
      valign: 'top',
    });

    slide8.addText(fc.body, {
      x: fx + 0.25,
      y: 3.85,
      w: 2.3,
      h: 2.4,
      fontSize: 10,
      fontFace: 'Arial',
      color: COLORS.textMuted,
      valign: 'top',
    });
  });

  const finalPath = outputPath || path.join(process.cwd(), 'public', 'TreeDoctor_Presentation.pptx');
  const dir = path.dirname(finalPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await pptx.writeFile({ fileName: finalPath });
  return finalPath;
}

// If run directly via tsx
if (process.argv[1] && process.argv[1].includes('generate_presentation')) {
  generatePresentation().then((p) => {
    console.log('Valid presentation generated at:', p);
  });
}
