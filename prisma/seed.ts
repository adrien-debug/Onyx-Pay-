import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding ONYX Launch & Ops database...");

  // Hash password
  const hashedPassword = await bcrypt.hash("onyx2025", 10);

  // Create users
  console.log("Creating users...");
  const admin = await prisma.user.upsert({
    where: { email: "admin@onyx.com" },
    update: {},
    create: {
      email: "admin@onyx.com",
      name: "Admin ONYX",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const pm = await prisma.user.upsert({
    where: { email: "pm@onyx.com" },
    update: {},
    create: {
      email: "pm@onyx.com",
      name: "Sarah Chen",
      password: hashedPassword,
      role: "PM",
    },
  });

  const ops = await prisma.user.upsert({
    where: { email: "ops@onyx.com" },
    update: {},
    create: {
      email: "ops@onyx.com",
      name: "Ahmed Al-Rashid",
      password: hashedPassword,
      role: "OPS",
    },
  });

  const legal = await prisma.user.upsert({
    where: { email: "legal@onyx.com" },
    update: {},
    create: {
      email: "legal@onyx.com",
      name: "Marie Dubois",
      password: hashedPassword,
      role: "LEGAL",
    },
  });

  const sales = await prisma.user.upsert({
    where: { email: "sales@onyx.com" },
    update: {},
    create: {
      email: "sales@onyx.com",
      name: "James Miller",
      password: hashedPassword,
      role: "SALES",
    },
  });

  // Create project
  console.log("Creating project...");
  const project = await prisma.project.upsert({
    where: { id: "onyx-dubai-launch" },
    update: {},
    create: {
      id: "onyx-dubai-launch",
      name: "ONYX Dubai Launch",
      description: "Lancement officiel ONYX à Dubaï - Septembre 2025. Déploiement du hardware, partenariats venues, et go-live de la solution de paiement premium.",
      targetDate: new Date("2025-09-15"),
      status: "IN_PROGRESS",
    },
  });

  // Create workstreams
  console.log("Creating workstreams...");
  const workstreams = await Promise.all([
    prisma.workstream.upsert({
      where: { id: "ws-hardware" },
      update: {},
      create: {
        id: "ws-hardware",
        name: "Hardware",
        description: "Sélection et standardisation du matériel (devices, coques, supports)",
        objectives: "Définir le bundle standard ONYX, valider les devices, produire les accessoires",
        projectId: project.id,
      },
    }),
    prisma.workstream.upsert({
      where: { id: "ws-legal" },
      update: {},
      create: {
        id: "ws-legal",
        name: "Legal",
        description: "Pack juridique complet pour le lancement",
        objectives: "MSA venues, SLA, DPA, Terms, coordination avec partenaire régulé",
        projectId: project.id,
      },
    }),
    prisma.workstream.upsert({
      where: { id: "ws-pricing" },
      update: {},
      create: {
        id: "ws-pricing",
        name: "Pricing",
        description: "Définition des offres et tarification",
        objectives: "3 plans (Pilot/Premium/Enterprise), one-pager commercial",
        projectId: project.id,
      },
    }),
    prisma.workstream.upsert({
      where: { id: "ws-reward" },
      update: {},
      create: {
        id: "ws-reward",
        name: "Reward",
        description: "Système d'incentive pour le staff des venues",
        objectives: "Règles de reward, anti-abus, test terrain, validation",
        projectId: project.id,
      },
    }),
    prisma.workstream.upsert({
      where: { id: "ws-ops" },
      update: {},
      create: {
        id: "ws-ops",
        name: "Ops Kit",
        description: "Procédures opérationnelles et runbooks",
        objectives: "Checklists installation, onboarding staff, incident guide",
        projectId: project.id,
      },
    }),
    prisma.workstream.upsert({
      where: { id: "ws-android" },
      update: {},
      create: {
        id: "ws-android",
        name: "Android Release",
        description: "Finalisation de l'app Android pour le launch",
        objectives: "Release candidate, tests terrain, optimisation performance",
        projectId: project.id,
      },
    }),
    prisma.workstream.upsert({
      where: { id: "ws-partnerships" },
      update: {},
      create: {
        id: "ws-partnerships",
        name: "Partnerships",
        description: "Partenariats venues et ecosystem",
        objectives: "Signer 10 venues pilotes, partenariat partenaire régulé",
        projectId: project.id,
      },
    }),
  ]);

  // Create milestones
  console.log("Creating milestones...");
  const milestones = await Promise.all([
    prisma.milestone.create({
      data: {
        title: "Hardware Shortlist",
        description: "Liste restreinte de 3-5 devices candidats avec évaluation",
        targetDate: new Date("2025-06-15"),
        projectId: project.id,
        workstreamId: workstreams[0].id,
        ownerId: ops.id,
        order: 1,
      },
    }),
    prisma.milestone.create({
      data: {
        title: "Hardware Lock",
        description: "Sélection finale du device primaire et backup",
        targetDate: new Date("2025-07-01"),
        projectId: project.id,
        workstreamId: workstreams[0].id,
        ownerId: ops.id,
        order: 2,
      },
    }),
    prisma.milestone.create({
      data: {
        title: "Prototype Coque & Support",
        description: "Premier prototype des accessoires personnalisés ONYX",
        targetDate: new Date("2025-07-15"),
        projectId: project.id,
        workstreamId: workstreams[0].id,
        ownerId: ops.id,
        order: 3,
      },
    }),
    prisma.milestone.create({
      data: {
        title: "Pack Légal V1",
        description: "Première version complète des documents juridiques",
        targetDate: new Date("2025-06-30"),
        projectId: project.id,
        workstreamId: workstreams[1].id,
        ownerId: legal.id,
        order: 4,
      },
    }),
    prisma.milestone.create({
      data: {
        title: "Contrat Prêt à Signer",
        description: "Pack légal finalisé et validé par les avocats",
        targetDate: new Date("2025-08-01"),
        projectId: project.id,
        workstreamId: workstreams[1].id,
        ownerId: legal.id,
        order: 5,
      },
    }),
    prisma.milestone.create({
      data: {
        title: "Pricing V1",
        description: "Première version des 3 plans tarifaires",
        targetDate: new Date("2025-06-15"),
        projectId: project.id,
        workstreamId: workstreams[2].id,
        ownerId: sales.id,
        order: 6,
      },
    }),
    prisma.milestone.create({
      data: {
        title: "Pricing Final",
        description: "Pricing validé avec les premiers retours terrain",
        targetDate: new Date("2025-08-15"),
        projectId: project.id,
        workstreamId: workstreams[2].id,
        ownerId: sales.id,
        order: 7,
      },
    }),
    prisma.milestone.create({
      data: {
        title: "Reward V1",
        description: "Première version du système de reward",
        targetDate: new Date("2025-07-01"),
        projectId: project.id,
        workstreamId: workstreams[3].id,
        ownerId: pm.id,
        order: 8,
      },
    }),
    prisma.milestone.create({
      data: {
        title: "Test Terrain Reward",
        description: "Pilote sur 3 venues pendant 2 semaines",
        targetDate: new Date("2025-08-15"),
        projectId: project.id,
        workstreamId: workstreams[3].id,
        ownerId: pm.id,
        order: 9,
      },
    }),
    prisma.milestone.create({
      data: {
        title: "Reward Final",
        description: "Système de reward validé et prêt pour le rollout",
        targetDate: new Date("2025-09-01"),
        projectId: project.id,
        workstreamId: workstreams[3].id,
        ownerId: pm.id,
        order: 10,
      },
    }),
    prisma.milestone.create({
      data: {
        title: "Release Candidate Android",
        description: "Version finale de l'app pour le launch",
        targetDate: new Date("2025-08-20"),
        projectId: project.id,
        workstreamId: workstreams[5].id,
        ownerId: pm.id,
        order: 11,
      },
    }),
    prisma.milestone.create({
      data: {
        title: "Go Live Dubai",
        description: "Lancement officiel ONYX à Dubaï",
        targetDate: new Date("2025-09-15"),
        projectId: project.id,
        ownerId: admin.id,
        order: 12,
      },
    }),
  ]);

  // Create tasks
  console.log("Creating tasks...");
  const tasks = [
    // Hardware tasks
    { title: "Rechercher devices Android POS compatibles", status: "DONE", priority: "HIGH", workstreamId: workstreams[0].id, assigneeId: ops.id },
    { title: "Évaluer Samsung Galaxy Tab Active", status: "IN_PROGRESS", priority: "HIGH", workstreamId: workstreams[0].id, assigneeId: ops.id },
    { title: "Évaluer Sunmi V2 Pro", status: "IN_PROGRESS", priority: "HIGH", workstreamId: workstreams[0].id, assigneeId: ops.id },
    { title: "Test résistance chaleur (45°C)", status: "TODO", priority: "CRITICAL", workstreamId: workstreams[0].id, assigneeId: ops.id },
    { title: "Définir specs coque personnalisée", status: "TODO", priority: "HIGH", workstreamId: workstreams[0].id, assigneeId: ops.id },
    { title: "Contacter fabricants coques (3 devis)", status: "BACKLOG", priority: "MEDIUM", workstreamId: workstreams[0].id, assigneeId: ops.id },
    { title: "Designer support comptoir/table", status: "BACKLOG", priority: "MEDIUM", workstreamId: workstreams[0].id, assigneeId: ops.id },
    { title: "Valider système de charge sans fil", status: "TODO", priority: "MEDIUM", workstreamId: workstreams[0].id, assigneeId: ops.id },
    
    // Legal tasks
    { title: "Rédiger template MSA venue", status: "IN_PROGRESS", priority: "CRITICAL", workstreamId: workstreams[1].id, assigneeId: legal.id },
    { title: "Définir SLA support standard", status: "TODO", priority: "HIGH", workstreamId: workstreams[1].id, assigneeId: legal.id },
    { title: "Rédiger DPA (GDPR compliant)", status: "IN_PROGRESS", priority: "HIGH", workstreamId: workstreams[1].id, assigneeId: legal.id },
    { title: "Privacy Policy ONYX", status: "TODO", priority: "HIGH", workstreamId: workstreams[1].id, assigneeId: legal.id },
    { title: "Terms of Service", status: "TODO", priority: "HIGH", workstreamId: workstreams[1].id, assigneeId: legal.id },
    { title: "Disclaimer non-custodial", status: "TODO", priority: "CRITICAL", workstreamId: workstreams[1].id, assigneeId: legal.id },
    { title: "Valider pack avec avocats Dubai", status: "BACKLOG", priority: "HIGH", workstreamId: workstreams[1].id, assigneeId: legal.id },
    { title: "Coordination documentation VARA", status: "TODO", priority: "CRITICAL", workstreamId: workstreams[1].id, assigneeId: legal.id },
    
    // Pricing tasks
    { title: "Benchmarker pricing concurrents", status: "DONE", priority: "HIGH", workstreamId: workstreams[2].id, assigneeId: sales.id },
    { title: "Définir plan PILOT", status: "IN_PROGRESS", priority: "HIGH", workstreamId: workstreams[2].id, assigneeId: sales.id },
    { title: "Définir plan PREMIUM", status: "TODO", priority: "HIGH", workstreamId: workstreams[2].id, assigneeId: sales.id },
    { title: "Définir plan ENTERPRISE", status: "TODO", priority: "HIGH", workstreamId: workstreams[2].id, assigneeId: sales.id },
    { title: "Créer pricing one-pager", status: "BACKLOG", priority: "MEDIUM", workstreamId: workstreams[2].id, assigneeId: sales.id },
    { title: "Valider pricing avec finance", status: "BACKLOG", priority: "HIGH", workstreamId: workstreams[2].id, assigneeId: sales.id },
    
    // Reward tasks
    { title: "Définir règle per-transaction", status: "IN_PROGRESS", priority: "HIGH", workstreamId: workstreams[3].id, assigneeId: pm.id },
    { title: "Définir règle volume bonus", status: "TODO", priority: "HIGH", workstreamId: workstreams[3].id, assigneeId: pm.id },
    { title: "Implémenter plafonds daily/monthly", status: "TODO", priority: "CRITICAL", workstreamId: workstreams[3].id, assigneeId: pm.id },
    { title: "Définir conditions anti-abus", status: "TODO", priority: "CRITICAL", workstreamId: workstreams[3].id, assigneeId: pm.id },
    { title: "Créer simulateur reward", status: "TODO", priority: "MEDIUM", workstreamId: workstreams[3].id, assigneeId: pm.id },
    { title: "Planifier test terrain 2 semaines", status: "BACKLOG", priority: "HIGH", workstreamId: workstreams[3].id, assigneeId: pm.id },
    
    // Ops tasks
    { title: "Rédiger checklist installation venue", status: "IN_PROGRESS", priority: "HIGH", workstreamId: workstreams[4].id, assigneeId: ops.id },
    { title: "Créer script onboarding staff", status: "TODO", priority: "HIGH", workstreamId: workstreams[4].id, assigneeId: ops.id },
    { title: "Documenter procédures incident", status: "TODO", priority: "HIGH", workstreamId: workstreams[4].id, assigneeId: ops.id },
    { title: "Définir matrice escalation", status: "TODO", priority: "MEDIUM", workstreamId: workstreams[4].id, assigneeId: ops.id },
    { title: "Créer guide quick-reference staff", status: "BACKLOG", priority: "MEDIUM", workstreamId: workstreams[4].id, assigneeId: ops.id },
    
    // Android tasks
    { title: "Fixer bugs critiques app", status: "IN_PROGRESS", priority: "CRITICAL", workstreamId: workstreams[5].id, assigneeId: pm.id },
    { title: "Optimiser performance UI", status: "TODO", priority: "HIGH", workstreamId: workstreams[5].id, assigneeId: pm.id },
    { title: "Tests sur devices candidats", status: "BLOCKED", priority: "HIGH", workstreamId: workstreams[5].id, assigneeId: pm.id },
    { title: "Intégration partenaire régulé API", status: "IN_PROGRESS", priority: "CRITICAL", workstreamId: workstreams[5].id, assigneeId: pm.id },
    { title: "Tests de charge (100+ venues)", status: "BACKLOG", priority: "HIGH", workstreamId: workstreams[5].id, assigneeId: pm.id },
    
    // Partnership tasks
    { title: "Identifier 20 venues cibles Dubai", status: "DONE", priority: "HIGH", workstreamId: workstreams[6].id, assigneeId: sales.id },
    { title: "Contacter 10 premières venues", status: "IN_PROGRESS", priority: "HIGH", workstreamId: workstreams[6].id, assigneeId: sales.id },
    { title: "Signer 3 venues pilotes", status: "TODO", priority: "CRITICAL", workstreamId: workstreams[6].id, assigneeId: sales.id },
    { title: "Préparer pitch deck venues", status: "DONE", priority: "HIGH", workstreamId: workstreams[6].id, assigneeId: sales.id },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        ...task,
        projectId: project.id,
        creatorId: admin.id,
        dueDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
        tags: task.workstreamId === workstreams[0].id ? JSON.stringify(["hardware"]) : 
              task.workstreamId === workstreams[1].id ? JSON.stringify(["legal", "compliance"]) :
              task.workstreamId === workstreams[2].id ? JSON.stringify(["sales", "pricing"]) : null,
      },
    });
  }

  // Create risks
  console.log("Creating risks...");
  const risks = [
    { title: "Retard livraison devices", description: "Supply chain issues peuvent retarder la livraison des devices", probability: 3, impact: 4, mitigation: "Commander en avance, avoir backup supplier", workstreamId: workstreams[0].id, ownerId: ops.id },
    { title: "Device non adapté chaleur Dubai", description: "Les devices pourraient surchauffer au-dessus de 40°C", probability: 3, impact: 5, mitigation: "Tests extensifs en conditions réelles, ventilation passive coque", workstreamId: workstreams[0].id, ownerId: ops.id },
    { title: "Délai validation légale", description: "Avocats Dubai peuvent prendre plus de temps que prévu", probability: 4, impact: 3, mitigation: "Engager dès maintenant, avoir drafts prêts", workstreamId: workstreams[1].id, ownerId: legal.id },
    { title: "Exigences VARA inattendues", description: "Le partenaire régulé pourrait avoir des requirements supplémentaires", probability: 3, impact: 4, mitigation: "Communication régulière, anticiper les demandes", workstreamId: workstreams[1].id, ownerId: legal.id },
    { title: "Pricing non compétitif", description: "Les venues trouvent notre pricing trop élevé", probability: 2, impact: 4, mitigation: "Benchmark continu, plans flexibles", workstreamId: workstreams[2].id, ownerId: sales.id },
    { title: "Abus système reward", description: "Staff pourrait exploiter des failles dans le système", probability: 4, impact: 3, mitigation: "Plafonds stricts, monitoring, période test", workstreamId: workstreams[3].id, ownerId: pm.id },
    { title: "Bugs critiques app launch", description: "Bugs majeurs découverts proche du launch", probability: 3, impact: 5, mitigation: "Tests extensifs, beta avec venues pilotes", workstreamId: workstreams[5].id, ownerId: pm.id },
    { title: "Venues pilotes se désistent", description: "Venues signées annulent avant le launch", probability: 2, impact: 4, mitigation: "Engagements contractuels, incentives early adopter", workstreamId: workstreams[6].id, ownerId: sales.id },
    { title: "Retard partenaire régulé", description: "L'intégration API du partenaire prend plus de temps", probability: 3, impact: 5, mitigation: "Commencer l'intégration tôt, avoir plan B", workstreamId: workstreams[5].id, ownerId: pm.id },
    { title: "Concurrence lance avant nous", description: "Un concurrent déploie une solution similaire à Dubai", probability: 2, impact: 3, mitigation: "Accélérer le développement, se différencier sur le premium", workstreamId: workstreams[6].id, ownerId: sales.id },
  ];

  for (const risk of risks) {
    await prisma.risk.create({
      data: {
        ...risk,
        projectId: project.id,
        status: "TODO",
      },
    });
  }

  // Create hardware candidates
  console.log("Creating hardware candidates...");
  await prisma.hardwareCandidate.createMany({
    data: [
      {
        name: "Samsung Galaxy Tab Active4 Pro",
        brand: "Samsung",
        model: "SM-T636B",
        price: 599,
        currency: "USD",
        availability: "Disponible",
        specs: JSON.stringify({
          display: "10.1 inch LCD",
          cpu: "Snapdragon 778G",
          ram: "6GB",
          storage: "128GB",
          battery: "7600mAh",
          os: "Android 13",
        }),
        constraints: JSON.stringify({
          maxTemp: "50°C",
          waterResistance: "IP68",
          dropResistance: "1.2m",
        }),
        fieldNotes: "Robuste, testé en milieu hospitalier. Bonne autonomie.",
        score: 8,
        recommendation: "PRIMARY",
        status: "IN_PROGRESS",
      },
      {
        name: "Sunmi V2 Pro",
        brand: "Sunmi",
        model: "V2 Pro",
        price: 349,
        currency: "USD",
        availability: "4-6 semaines",
        specs: JSON.stringify({
          display: "5.99 inch",
          cpu: "Qualcomm",
          ram: "3GB",
          storage: "32GB",
          battery: "7000mAh",
          os: "Android 11",
        }),
        constraints: JSON.stringify({
          maxTemp: "45°C",
          printer: "Intégré",
        }),
        fieldNotes: "Compact, printer intégré. Moins premium.",
        score: 6,
        recommendation: "BACKUP",
        status: "IN_PROGRESS",
      },
    ],
  });

  // Create accessory designs
  console.log("Creating accessory designs...");
  await prisma.accessoryDesign.createMany({
    data: [
      {
        name: "Coque Premium ONYX",
        type: "CASE",
        description: "Coque personnalisée avec branding ONYX, protection maximale",
        materials: "Polycarbonate + TPU, finition soft-touch noire",
        dimensions: "260 x 180 x 15mm",
        branding: "Logo ONYX gravé cuivre",
        supplier: "TBD - 3 devis en cours",
        unitCost: 45,
        currency: "USD",
        leadTime: "6-8 semaines",
        status: "TODO",
      },
      {
        name: "Support Comptoir ONYX",
        type: "SUPPORT",
        description: "Support ajustable pour comptoir/table, angle optimisé",
        materials: "Aluminium anodisé noir, base antidérapante",
        dimensions: "150 x 120 x 80mm",
        branding: "Base avec logo ONYX",
        supplier: "TBD",
        unitCost: 35,
        currency: "USD",
        leadTime: "4-6 semaines",
        status: "BACKLOG",
      },
    ],
  });

  // Create bundles
  console.log("Creating bundles...");
  const bundle = await prisma.bundle.create({
    data: {
      name: "Kit ONYX Standard",
      description: "Bundle complet pour une venue: device + coque + support + chargeur",
      totalCost: 730,
      currency: "USD",
      isStandard: true,
      status: "TODO",
    },
  });

  // Create pricing plans
  console.log("Creating pricing plans...");
  await prisma.pricingPlan.createMany({
    data: [
      {
        name: "PILOT",
        description: "Pour les venues qui veulent tester ONYX",
        hardwareModel: "Rental (inclus)",
        setupFee: 0,
        monthlyFee: 99,
        transactionFee: 1.5,
        feeType: "PERCENTAGE",
        currency: "USD",
        inclusions: JSON.stringify([
          "1 device ONYX",
          "Installation sur site",
          "Formation staff (1h)",
          "Support email",
          "Dashboard basique",
        ]),
        slaLevel: "BASIC",
        supportHours: "9h-18h",
        order: 1,
      },
      {
        name: "PREMIUM",
        description: "Notre offre la plus populaire",
        hardwareModel: "Rental (inclus) ou Achat",
        setupFee: 299,
        monthlyFee: 199,
        transactionFee: 1.2,
        feeType: "PERCENTAGE",
        currency: "USD",
        inclusions: JSON.stringify([
          "Jusqu'à 3 devices ONYX",
          "Installation premium + branding",
          "Formation staff complète (2h)",
          "Support prioritaire (chat + tel)",
          "Dashboard avancé + analytics",
          "Reward system staff",
          "Intégration POS basique",
        ]),
        slaLevel: "STANDARD",
        supportHours: "8h-22h",
        order: 2,
      },
      {
        name: "ENTERPRISE",
        description: "Solution sur mesure pour les grands groupes",
        hardwareModel: "Flexible (location/achat)",
        setupFee: null,
        monthlyFee: null,
        transactionFee: null,
        feeType: "PERCENTAGE",
        currency: "USD",
        inclusions: JSON.stringify([
          "Devices illimités",
          "Installation dédiée + formation sur site",
          "Account manager dédié",
          "Support 24/7",
          "Dashboard personnalisé + API",
          "Reward system custom",
          "Intégration POS avancée",
          "SLA garanti (99.9%)",
        ]),
        slaLevel: "PREMIUM",
        supportHours: "24/7",
        order: 3,
      },
    ],
  });

  // Create reward rules
  console.log("Creating reward rules...");
  await prisma.rewardRule.createMany({
    data: [
      {
        name: "Per Transaction Bonus",
        type: "PER_TX",
        description: "Bonus fixe par transaction traitée",
        formula: "$0.50 par transaction",
        minThreshold: 10,
        maxThreshold: null,
        capPerDay: 50,
        capPerMonth: 1000,
        conditions: "Minimum 10 transactions par jour pour qualifier",
        isActive: true,
        testPeriod: "2025-09-01 to 2025-09-15",
        testLocation: "3 venues pilotes Dubai",
      },
      {
        name: "Volume Bonus",
        type: "PER_VOLUME",
        description: "Pourcentage sur le volume traité",
        formula: "0.1% du volume total",
        minThreshold: 1000,
        maxThreshold: 100000,
        capPerDay: 100,
        capPerMonth: 2000,
        conditions: "Applicable sur volume supérieur à $1000",
        isActive: true,
      },
      {
        name: "Adoption Milestone",
        type: "ADOPTION",
        description: "Bonus pour nouveaux utilisateurs onboardés",
        formula: "$10 par nouveau client premium",
        minThreshold: 1,
        maxThreshold: 50,
        capPerDay: null,
        capPerMonth: 500,
        conditions: "Client doit compléter 3 transactions minimum",
        isActive: true,
      },
    ],
  });

  // Create legal docs
  console.log("Creating legal documents...");
  await prisma.legalDoc.createMany({
    data: [
      {
        title: "Master Service Agreement (Venue)",
        type: "MSA",
        status: "DRAFT",
        version: "0.1",
        notes: "Template initial basé sur best practices UK/UAE",
      },
      {
        title: "SLA Support & Maintenance",
        type: "SLA",
        status: "DRAFT",
        version: "0.1",
        notes: "Définir niveaux de support par plan",
      },
      {
        title: "Data Processing Agreement",
        type: "DPA",
        status: "IN_REVIEW",
        version: "0.2",
        notes: "GDPR + UAE data protection alignment",
      },
      {
        title: "Privacy Policy ONYX",
        type: "Privacy",
        status: "DRAFT",
        version: "0.1",
      },
      {
        title: "Terms of Service",
        type: "Terms",
        status: "DRAFT",
        version: "0.1",
      },
    ],
  });

  // Create content items (HTML examples)
  console.log("Creating content items...");
  await prisma.contentItem.createMany({
    data: [
      {
        title: "Page d'accueil Webflow",
        type: "WEBSITE",
        rawHtml: `<html><head><title>ONYX - Digital Payments for Premium Venues</title></head><body>
<h1>Powering the next era of digital payments</h1>
<h2>Seamless. Secure. Premium.</h2>
<p>ONYX transforms how premium venues handle payments. Our elegant hardware and intuitive app create an unforgettable experience for guests while maximizing revenue for venues.</p>
<h2>How it works</h2>
<p>Simple setup, powerful results. Our team handles everything from installation to training.</p>
<h2>Why ONYX?</h2>
<p>Built for luxury hospitality. Every detail designed for the premium experience your guests expect.</p>
<a class="cta">Get a Demo</a>
<a class="cta">Contact Sales</a>
</body></html>`,
        extractedJson: JSON.stringify({
          h1: ["Powering the next era of digital payments"],
          h2: ["Seamless. Secure. Premium.", "How it works", "Why ONYX?"],
          ctas: ["Get a Demo", "Contact Sales"],
        }),
        markdownProposal: "# Proposition\n\n## Hero\nPowering the next era of digital payments\n\n## Sections\n1. Seamless. Secure. Premium.\n2. How it works\n3. Why ONYX?\n\n## CTAs\n- Get a Demo\n- Contact Sales",
        tags: JSON.stringify(["homepage", "brand"]),
        status: "DONE",
      },
      {
        title: "FAQ Webflow",
        type: "FAQ",
        rawHtml: `<html><head><title>FAQ - ONYX</title></head><body>
<h1>Frequently Asked Questions</h1>
<h2>What is ONYX?</h2>
<p>ONYX is a premium payment solution designed specifically for luxury hospitality venues.</p>
<h2>How does payment work?</h2>
<p>Guests pay via QR code, NFC, or our elegant tablet interface. All payments are processed through our regulated partner.</p>
<h2>Is ONYX secure?</h2>
<p>Absolutely. We work with fully regulated partners (VARA, PSAN) to ensure all transactions are compliant and secure.</p>
<h2>What hardware do I need?</h2>
<p>We provide everything: tablet, custom case, stand, and charger. All included in your plan.</p>
</body></html>`,
        tags: JSON.stringify(["faq", "support"]),
        status: "TODO",
      },
    ],
  });

  // Create runbooks
  console.log("Creating runbooks...");
  await prisma.runbook.createMany({
    data: [
      {
        title: "Venue Launch Checklist",
        type: "venue_launch",
        content: `# Venue Launch Checklist

## Pré-installation (J-7)
- [ ] Confirmer date et heure avec venue manager
- [ ] Vérifier disponibilité du kit ONYX
- [ ] Préparer documentation formation
- [ ] Coordonner avec équipe technique locale

## Installation (15 min)
- [ ] Positionner le support
- [ ] Installer le device dans la coque
- [ ] Connecter le chargeur
- [ ] Vérifier connexion WiFi/4G
- [ ] Tester l'application

## Configuration (15 min)
- [ ] Créer compte venue dans backoffice
- [ ] Configurer paramètres paiement
- [ ] Ajouter staff
- [ ] Configurer notifications

## Formation Staff (30 min)
- [ ] Présentation interface
- [ ] Processus paiement standard
- [ ] Gestion incidents
- [ ] Q&A
`,
        checklist: JSON.stringify([
          { section: "Pré-installation", items: ["Confirmer date", "Kit disponible", "Docs prêts"] },
          { section: "Installation", items: ["Support", "Device", "Chargeur", "Connexion", "Test"] },
        ]),
        version: "1.0",
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
  console.log("\n📧 Test users created:");
  console.log("   admin@onyx.com / onyx2025 (ADMIN)");
  console.log("   pm@onyx.com / onyx2025 (PM)");
  console.log("   ops@onyx.com / onyx2025 (OPS)");
  console.log("   legal@onyx.com / onyx2025 (LEGAL)");
  console.log("   sales@onyx.com / onyx2025 (SALES)");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
