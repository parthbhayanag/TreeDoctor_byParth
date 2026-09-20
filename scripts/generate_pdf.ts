import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function generatePdfPresentation(outputPath?: string): Promise<string> {
  const finalPath = outputPath || path.join(process.cwd(), 'public', 'TreeDoctor_Pitch_Deck.pdf');
  const dir = path.dirname(finalPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    // 16:9 widescreen presentation: 960 x 540 points
    const doc = new PDFDocument({
      size: [960, 540],
      margin: 0,
      autoFirstPage: true,
      info: {
        Title: 'TreeDoctor - AI Urban Tree Health Platform Pitch Deck',
        Author: 'TreeDoctor Team',
        Subject: 'Google AI Studio Hackathon Final Submission',
        Keywords: 'Urban Forestry, Gemini 2.5 Flash, AI Vision, Smart Cities, Pitch Deck',
      },
    });

    const stream = fs.createWriteStream(finalPath);
    doc.pipe(stream);

    // Color definitions
    const C = {
      bgDark: '#0D1510',
      cardDark: '#16221A',
      cardInner: '#1E2D23',
      cardBorder: '#284030',
      emerald: '#10B981',
      emeraldLight: '#34D399',
      amber: '#F59E0B',
      rose: '#EF4444',
      sky: '#38BDF8',
      purple: '#A855F7',
      textWhite: '#FFFFFF',
      textMuted: '#94A3B8',
      textDim: '#64748B',
    };

    // Helper: Draw Slide Header
    const drawHeader = (badgeText: string, titleText: string, subtitleText: string) => {
      // Background base
      doc.rect(0, 0, 960, 540).fill(C.bgDark);

      // Slide Badge Pill
      doc.roundedRect(48, 28, 180, 26, 6).fillAndStroke(C.cardDark, C.emerald);
      doc
        .fontSize(9.5)
        .font('Helvetica-Bold')
        .fillColor(C.emerald)
        .text(badgeText, 48, 36, { width: 180, align: 'center' });

      // Title
      doc
        .fontSize(22)
        .font('Helvetica-Bold')
        .fillColor(C.textWhite)
        .text(titleText, 48, 64, { width: 864 });

      // Subtitle
      doc
        .fontSize(11)
        .font('Helvetica')
        .fillColor(C.textMuted)
        .text(subtitleText, 48, 96, { width: 864 });

      // Divider line
      doc
        .strokeColor(C.cardBorder)
        .lineWidth(1)
        .moveTo(48, 122)
        .lineTo(912, 122)
        .stroke();

      // Footer pagination & branding
      doc
        .fontSize(8.5)
        .font('Helvetica')
        .fillColor(C.textDim)
        .text('TreeDoctor | Google AI Studio Hackathon Pitch Deck', 48, 510, { width: 500 });
      doc
        .fontSize(8.5)
        .font('Helvetica')
        .fillColor(C.textDim)
        .text('urban-canopy.ai', 750, 510, { width: 162, align: 'right' });
    };

    // =========================================================================
    // SLIDE 0: Hero / Title Slide
    // =========================================================================
    doc.rect(0, 0, 960, 540).fill(C.bgDark);

    // Frame
    doc.roundedRect(48, 40, 864, 460, 16).fillAndStroke(C.cardDark, C.cardBorder);

    // Top Category Pill
    doc.roundedRect(80, 72, 320, 28, 14).fillAndStroke('#0B3822', C.emerald);
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor(C.emerald)
      .text('AI-POWERED URBAN CANOPY HEALTH PLATFORM', 80, 81, { width: 320, align: 'center' });

    // Main App Title
    doc
      .fontSize(52)
      .font('Helvetica-Bold')
      .fillColor(C.textWhite)
      .text('TreeDoctor', 80, 118);

    // Tagline Quote
    doc
      .fontSize(16)
      .font('Helvetica-Oblique')
      .fillColor(C.emeraldLight)
      .text('"Google Maps tells us where trees are. TreeDoctor tells us which ones need our help."', 80, 192, {
        width: 780,
      });

    // Executive summary paragraph
    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor(C.textMuted)
      .text(
        'An intelligent early warning and clinical EHR platform combining Multimodal Vision AI (Gemini 2.5 Flash), longitudinal time-series health tracking, real-time microclimate atmospheric telemetry, and automated municipal field dispatch.',
        80,
        238,
        { width: 780, lineGap: 4 }
      );

    // Feature Badges
    const heroCards = [
      { badge: 'VISION ENGINE', title: 'Gemini 2.5 Flash', color: C.emerald },
      { badge: 'EARLY WARNING', title: 'Longitudinal EHR Alerts', color: C.sky },
      { badge: 'ATMOSPHERIC GRID', title: 'Open-Meteo & Copernicus', color: C.amber },
    ];

    heroCards.forEach((hc, idx) => {
      const cardX = 80 + idx * 265;
      doc.roundedRect(cardX, 335, 245, 78, 10).fillAndStroke(C.cardInner, hc.color);
      doc
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .fillColor(hc.color)
        .text(hc.badge, cardX + 16, 350, { width: 213 });
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor(C.textWhite)
        .text(hc.title, cardX + 16, 372, { width: 213 });
    });

    // Footer note
    doc
      .fontSize(9.5)
      .font('Helvetica')
      .fillColor(C.textDim)
      .text(
        'Google AI Studio Hackathon Final Submission  •  React 19 + Express + Gemini 2.5 Flash  •  7-Slide Pitch Deck',
        80,
        455,
        { width: 780 }
      );

    // =========================================================================
    // SLIDE 1: 1️⃣ Problem Statement
    // =========================================================================
    doc.addPage({ size: [960, 540], margin: 0 });
    drawHeader(
      'SLIDE 1 OF 7: PROBLEM',
      'Urban Trees Are Dying in Plain Sight',
      'Cities spend millions planting trees, yet lose up to 30% prematurely due to a total lack of clinical health visibility.'
    );

    const problemItems = [
      {
        badge: 'BLIND SPOT',
        title: 'Static & Stale Inventories',
        desc: 'Municipal registries are static spreadsheets or GIS pins updated only once every 5 to 7 years.\n\nTree pathogens, drought stress, and root decay progress in weeks, rendering municipal records obsolete.',
        color: C.amber,
      },
      {
        badge: 'FINANCIAL DRAIN',
        title: 'The Reactive Cost Trap',
        desc: 'Cities intervene only after a tree collapses on a sidewalk or power line.\n\nRemoval and replanting costs over $3,200 per tree, vs. just $45 for targeted preventative treatment caught 60 days earlier.',
        color: C.rose,
      },
      {
        badge: 'CLIMATE MULTIPLIER',
        title: 'Environmental Stress',
        desc: 'Urban heat islands (>38°C), asphalt root compaction, vapor pressure deficits, and PM2.5 pollution starve canopies before outward symptoms become obvious to the naked eye.',
        color: C.sky,
      },
    ];

    problemItems.forEach((p, idx) => {
      const px = 48 + idx * 296;
      doc.roundedRect(px, 145, 274, 340, 12).fillAndStroke(C.cardDark, p.color);

      // Pill
      doc.roundedRect(px + 20, 168, 120, 22, 5).fillAndStroke(C.bgDark, p.color);
      doc
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .fillColor(p.color)
        .text(p.badge, px + 20, 174, { width: 120, align: 'center' });

      // Title
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor(C.textWhite)
        .text(p.title, px + 20, 205, { width: 234 });

      // Desc
      doc
        .fontSize(10.5)
        .font('Helvetica')
        .fillColor(C.textMuted)
        .text(p.desc, px + 20, 255, { width: 234, lineGap: 4 });
    });

    // =========================================================================
    // SLIDE 2: 2️⃣ Proposed Solution
    // =========================================================================
    doc.addPage({ size: [960, 540], margin: 0 });
    drawHeader(
      'SLIDE 2 OF 7: SOLUTION',
      'From Static Inventory to Continuous Clinical Care',
      'TreeDoctor transforms urban forestry into an automated Electronic Health Record (EHR) ecosystem.'
    );

    const solutionCards = [
      {
        step: '01',
        title: 'Multimodal AI Vision',
        sub: 'Gemini 2.5 Flash',
        desc: 'Instant arborist pathology from field photos. Quantifies foliar necrosis, canopy thinning percentage, fungal conks, and pest boring holes with a clinical 0-100 score.',
        color: C.emerald,
      },
      {
        step: '02',
        title: 'Longitudinal EHR Alerts',
        sub: 'Time-Series Intelligence',
        desc: 'Maintains historical health curves for each specimen. Automatically fires urgent alerts whenever a tree experiences an acute drop (>10 health points) between scans.',
        color: C.sky,
      },
      {
        step: '03',
        title: 'Microclimate Grounding',
        sub: 'Zero-Mock Telemetry',
        desc: 'Cross-checks visual decline against real-time ambient heat, 7-day rainfall deficits, relative humidity, and Copernicus AQI (PM2.5/PM10) at exact GPS coordinates.',
        color: C.amber,
      },
      {
        step: '04',
        title: 'Municipal Field Dispatch',
        sub: 'Closed-Loop Action',
        desc: 'Converts diagnoses into municipal work orders (deep-root irrigation, micro-injection, pruning) with full lifecycle tracking from Pending to Resolved.',
        color: C.rose,
      },
    ];

    solutionCards.forEach((sc, idx) => {
      const sx = 48 + idx * 220;
      doc.roundedRect(sx, 145, 204, 340, 12).fillAndStroke(C.cardDark, C.cardBorder);

      // Step Number
      doc
        .fontSize(22)
        .font('Helvetica-Bold')
        .fillColor(sc.color)
        .text(sc.step, sx + 18, 165);

      // Title
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor(C.textWhite)
        .text(sc.title, sx + 18, 202, { width: 168 });

      // Subtitle
      doc
        .fontSize(9.5)
        .font('Helvetica-Bold')
        .fillColor(sc.color)
        .text(sc.sub, sx + 18, 240, { width: 168 });

      // Description
      doc
        .fontSize(9.5)
        .font('Helvetica')
        .fillColor(C.textMuted)
        .text(sc.desc, sx + 18, 272, { width: 168, lineGap: 3.5 });
    });

    // =========================================================================
    // SLIDE 3: 3️⃣ Target Users
    // =========================================================================
    doc.addPage({ size: [960, 540], margin: 0 });
    drawHeader(
      'SLIDE 3 OF 7: TARGET USERS',
      'Stakeholders, Pain Points & Value Delivered',
      'Empowering public works departments, certified arborists, university campuses, and civic volunteers.'
    );

    const userRows = [
      {
        badge: 'CITY GOV',
        user: 'Municipal Parks & Forestry Departments',
        pain: 'Stretched field teams, emergency tree failures, slow manual audits, citizen complaint backlogs.',
        value: 'Real-time city canopy health map, early warning decline alerts, and prioritized automated field dispatch.',
        color: C.emerald,
      },
      {
        badge: 'COMMERCIAL',
        user: 'Certified Arborists & Tree Contractors',
        pain: 'Time-consuming manual paper assessments, difficult client reporting, lack of objective longitudinal records.',
        value: 'AI-assisted pathology scoring (0-100), digital audit trails, and photographic time-series comparison.',
        color: C.sky,
      },
      {
        badge: 'CAMPUSES',
        user: 'University Campuses & Botanical Gardens',
        pain: 'High-value heritage specimens vulnerable to microclimate heat islands and localized pathogen outbreaks.',
        value: 'Micro-location weather telemetry cross-referencing rainfall deficits to automate preventative care.',
        color: C.amber,
      },
      {
        badge: 'COMMUNITY',
        user: 'Civic Volunteers & Citizen Stewards',
        pain: 'Want to protect local neighborhood trees but lack botanical expertise and direct reporting lines to city hall.',
        value: 'Zero-friction camera scanner, instant AI diagnosis, and one-tap community reporting into the city queue.',
        color: C.rose,
      },
    ];

    userRows.forEach((ur, idx) => {
      const uy = 145 + idx * 85;
      doc.roundedRect(48, uy, 864, 74, 10).fillAndStroke(C.cardDark, C.cardBorder);

      // Badge
      doc.roundedRect(64, uy + 14, 90, 20, 4).fillAndStroke(C.bgDark, ur.color);
      doc
        .fontSize(8)
        .font('Helvetica-Bold')
        .fillColor(ur.color)
        .text(ur.badge, 64, uy + 19, { width: 90, align: 'center' });

      // Title
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor(C.textWhite)
        .text(ur.user, 168, uy + 17, { width: 680 });

      // Pain Point
      doc
        .fontSize(9.5)
        .font('Helvetica-Bold')
        .fillColor(C.textDim)
        .text('Pain Point: ', 64, uy + 44);
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor(C.textMuted)
        .text(ur.pain, 128, uy + 44, { width: 340 });

      // Value
      doc
        .fontSize(9.5)
        .font('Helvetica-Bold')
        .fillColor(C.emerald)
        .text('Value: ', 490, uy + 44);
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor(C.emeraldLight)
        .text(ur.value, 532, uy + 44, { width: 360 });
    });

    // =========================================================================
    // SLIDE 4: 4️⃣ Technical Approach
    // =========================================================================
    doc.addPage({ size: [960, 540], margin: 0 });
    drawHeader(
      'SLIDE 4 OF 7: ARCHITECTURE',
      'Production-Grade Full-Stack & Multimodal Architecture',
      'Secure server-side AI execution, zero-mock atmospheric telemetry, and high-performance geospatial UI.'
    );

    const techPillars = [
      {
        badge: 'AI & VISION LAYER',
        title: 'Gemini 2.5 Flash',
        bullets: [
          'Multimodal vision analysis of leaves, bark, and canopy.',
          'Pathology identification: chlorosis, anthracnose, bracket fungi, borers.',
          'Structured clinical JSON: 0-100 score, urgency & treatment steps.',
          'Strict server-side isolation: API keys never exposed to client browser.',
        ],
        color: C.emerald,
      },
      {
        badge: 'ATMOSPHERIC TELEMETRY',
        title: 'Open-Meteo & Copernicus',
        bullets: [
          'Zero-mock live telemetry grounded to exact tree GPS coordinates.',
          'Ambient temperature and 7-day cumulative rainfall deficit analysis.',
          'Relative humidity & Vapor Pressure Deficit (VPD) evaluation.',
          'Copernicus Air Quality Index (AQI) with PM2.5 & PM10 particulate levels.',
        ],
        color: C.sky,
      },
      {
        badge: 'FRONTEND & SERVER',
        title: 'React 19 + Express + Leaflet',
        bullets: [
          'Zero-typing tree registration with interactive Leaflet map pinning.',
          '3 base map modes: Dark Canvas, Satellite Imagery, Topographic Terrain.',
          'Longitudinal SVG charts with decline detection threshold (>10 pts).',
          'Node.js Express backend bundled via esbuild into single CommonJS file.',
        ],
        color: C.amber,
      },
    ];

    techPillars.forEach((tp, idx) => {
      const tx = 48 + idx * 296;
      doc.roundedRect(tx, 145, 274, 340, 12).fillAndStroke(C.cardDark, tp.color);

      // Pill
      doc.roundedRect(tx + 18, 165, 160, 22, 5).fillAndStroke(C.bgDark, tp.color);
      doc
        .fontSize(8)
        .font('Helvetica-Bold')
        .fillColor(tp.color)
        .text(tp.badge, tx + 18, 171, { width: 160, align: 'center' });

      // Title
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor(C.textWhite)
        .text(tp.title, tx + 18, 200, { width: 238 });

      // Bullets
      tp.bullets.forEach((b, bIdx) => {
        const by = 240 + bIdx * 56;
        doc
          .fontSize(9)
          .font('Helvetica-Bold')
          .fillColor(tp.color)
          .text('•', tx + 18, by);
        doc
          .fontSize(9.5)
          .font('Helvetica')
          .fillColor(C.textMuted)
          .text(b, tx + 30, by, { width: 224, lineGap: 2.5 });
      });
    });

    // =========================================================================
    // SLIDE 5: 5️⃣ Market & Business Potential
    // =========================================================================
    doc.addPage({ size: [960, 540], margin: 0 });
    drawHeader(
      'SLIDE 5 OF 7: MARKET & ROI',
      'The $5.8B Opportunity & Quantifiable Municipal ROI',
      'Saving public funds, reducing infrastructure hazard liability, and protecting mature carbon assets.'
    );

    // Left Impact Column
    doc.roundedRect(48, 145, 340, 340, 12).fillAndStroke(C.cardDark, C.emerald);
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor(C.emerald)
      .text('QUANTIFIABLE MUNICIPAL IMPACT', 70, 168);

    const statsData = [
      { stat: '$250,000+', desc: 'Annual savings per 100 rescued trees vs. removal and replanting costs.' },
      { stat: '60% Drop', desc: 'Reduction in young sapling mortality through proactive microclimate hydration.' },
      { stat: '70x Carbon', desc: 'Mature trees sequester up to 70x more carbon than newly planted saplings.' },
      { stat: '$5.8 Billion', desc: 'Global Smart City Urban Greening & Tree Inventory Market by 2030.' },
    ];

    statsData.forEach((st, idx) => {
      const sy = 202 + idx * 68;
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .fillColor(C.textWhite)
        .text(st.stat, 70, sy);
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor(C.textMuted)
        .text(st.desc, 70, sy + 22, { width: 295, lineGap: 2 });
    });

    // Right Business Models Column
    const bizModels = [
      {
        badge: 'PRIMARY REVENUE',
        title: 'B2G Municipal SaaS',
        desc: 'Annual tiered subscription for city parks and public works departments ($15,000 to $80,000/year based on tree population volume, GIS polygon tiers, and crew dispatch seats).',
        color: C.emerald,
      },
      {
        badge: 'HIGH MARGIN',
        title: 'Enterprise Campus Licensing',
        desc: 'Dedicated canopy monitoring for corporate HQs, golf resorts, university campuses, and botanical arboretums protecting irreplaceable heritage assets.',
        color: C.sky,
      },
      {
        badge: 'DATA MONETIZATION',
        title: 'Insurance & ESG Carbon Verification API',
        desc: 'Risk data feeds for municipal property insurers to evaluate branch collapse liabilities, and certified carbon telemetry for urban ESG green-bond credits.',
        color: C.amber,
      },
    ];

    bizModels.forEach((bm, idx) => {
      const by = 145 + idx * 116;
      doc.roundedRect(408, by, 504, 102, 10).fillAndStroke(C.cardDark, C.cardBorder);

      // Badge
      doc.roundedRect(770, by + 14, 126, 20, 4).fillAndStroke(C.bgDark, bm.color);
      doc
        .fontSize(7.5)
        .font('Helvetica-Bold')
        .fillColor(bm.color)
        .text(bm.badge, 770, by + 19, { width: 126, align: 'center' });

      // Title
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor(C.textWhite)
        .text(bm.title, 428, by + 16, { width: 330 });

      // Desc
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor(C.textMuted)
        .text(bm.desc, 428, by + 42, { width: 460, lineGap: 3 });
    });

    // =========================================================================
    // SLIDE 6: 6️⃣ Scalability & Future
    // =========================================================================
    doc.addPage({ size: [960, 540], margin: 0 });
    drawHeader(
      'SLIDE 6 OF 7: SCALABILITY',
      'Architected to Expand from Single Parks to Millions of Trees',
      'High-throughput geospatial indexing, edge diagnostics, and seamless GIS software interoperability.'
    );

    const scaleGrid = [
      {
        title: 'Geospatial Partitioning & Quadtree Clustering',
        desc: 'Leaflet viewport-bounded queries and spatial index clustering ensure sub-second map rendering even with hundreds of thousands of specimens across metropolitan zones.',
        color: C.emerald,
      },
      {
        title: 'Decoupled Diagnostic Pipeline',
        desc: 'Asynchronous image compression and queue workers prevent bottlenecks during city-wide citizen audit campaigns, maintaining rapid responses under high load.',
        color: C.sky,
      },
      {
        title: 'Interoperable Forestry Standards',
        desc: 'Data schemas align with USDA Forest Service & ISA arboricultural standards, enabling two-way sync with legacy municipal tools like Esri ArcGIS and TreePlotter.',
        color: C.amber,
      },
      {
        title: 'Crowdsourced Force Multiplier',
        desc: 'By turning every smartphone into an arborist scanner, city inspection bandwidth multiplies by 100x without increasing public municipal headcount.',
        color: C.rose,
      },
    ];

    scaleGrid.forEach((sg, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const gx = 48 + col * 442;
      const gy = 145 + row * 172;

      doc.roundedRect(gx, gy, 422, 156, 12).fillAndStroke(C.cardDark, C.cardBorder);

      // Color accent indicator
      doc.roundedRect(gx + 20, gy + 20, 10, 10, 3).fill(sg.color);

      // Title
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor(C.textWhite)
        .text(sg.title, gx + 40, gy + 18, { width: 360 });

      // Desc
      doc
        .fontSize(9.5)
        .font('Helvetica')
        .fillColor(C.textMuted)
        .text(sg.desc, gx + 20, gy + 48, { width: 382, lineGap: 4 });
    });

    // =========================================================================
    // SLIDE 7: 7️⃣ If We Had More Time
    // =========================================================================
    doc.addPage({ size: [960, 540], margin: 0 });
    drawHeader(
      'SLIDE 7 OF 7: NEXT HORIZON',
      'What We Would Build Next with More Time & Resources',
      'Satellite NDVI remote sensing, on-device Gemini Nano, IoT ground sensors, and predictive epidemiology.'
    );

    const futurePhases = [
      {
        phase: 'PHASE 1',
        title: 'Satellite NDVI',
        sub: 'Sentinel-2 & Planet Labs',
        desc: 'Auto-detect canopy moisture stress and chlorophyll reduction from orbit using Normalized Difference Vegetation Index (NDVI) before field teams even deploy.',
        color: C.emerald,
      },
      {
        phase: 'PHASE 2',
        title: 'Mobile PWA + Nano',
        sub: 'Zero-Connectivity Mode',
        desc: 'Deploy on-device Gemini Nano / quantized edge vision models directly onto park ranger devices for zero-reception national parks and nature reserves.',
        color: C.sky,
      },
      {
        phase: 'PHASE 3',
        title: 'IoT Ground Probes',
        sub: 'LoRaWAN Smart Irrigation',
        desc: 'Sub-surface soil sensor probes that trigger automated municipal drip valves when soil water tension drops below species-specific wilting points.',
        color: C.amber,
      },
      {
        phase: 'PHASE 4',
        title: 'Predictive Models',
        sub: 'Epidemiological Vectors',
        desc: 'Machine learning forecasting of pathogen spread trajectories (e.g. Emerald Ash Borer) by cross-referencing wind corridors and tree species density.',
        color: C.rose,
      },
    ];

    futurePhases.forEach((fp, idx) => {
      const fx = 48 + idx * 220;
      doc.roundedRect(fx, 145, 204, 340, 12).fillAndStroke(C.cardDark, fp.color);

      // Phase Pill
      doc.roundedRect(fx + 18, 165, 80, 20, 4).fillAndStroke(C.bgDark, fp.color);
      doc
        .fontSize(8)
        .font('Helvetica-Bold')
        .fillColor(fp.color)
        .text(fp.phase, fx + 18, 170, { width: 80, align: 'center' });

      // Title
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor(C.textWhite)
        .text(fp.title, fx + 18, 198, { width: 168 });

      // Sub
      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .fillColor(C.amber)
        .text(fp.sub, fx + 18, 238, { width: 168 });

      // Desc
      doc
        .fontSize(9.5)
        .font('Helvetica')
        .fillColor(C.textMuted)
        .text(fp.desc, fx + 18, 270, { width: 168, lineGap: 3.5 });
    });

    // Finalize PDF file
    doc.end();

    stream.on('finish', () => {
      resolve(finalPath);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

// Direct execution CLI runner
if (process.argv[1] && process.argv[1].includes('generate_pdf')) {
  generatePdfPresentation().then((p) => {
    console.log('PDF presentation created successfully at:', p);
  });
}
