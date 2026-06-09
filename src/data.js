export const contact = {
  phone: '9810089389',
  phoneDisplay: '+91 98100 89389',
  whatsappHref: 'https://api.whatsapp.com/send?phone=+91-9810089389',
  email: 'sales@classonesystems.in',
  address: 'Level 4, Rectangle 1, Commercial Complex D-4, Saket, New Delhi, India - 110 017',
}

export const imageAssets = {
  logo: '/img/2025-07-ClassOne-logo.png',
  hero: '/img/2025-11-palmsens-canva.png',
  aboutHero: '/img/2025-07-professional-researcher-lab-scaled.jpg',
  teamGroup: '/img/2025-10-Team-1024x683.jpeg',
  batteryHeroDevice: '/img/2025-07-55.png',
  corrtestCS310M: '/img/2025-07-53.png',
  corrtestCS350M: '/img/2025-07-57.png',
  spectroelectrochemistryHero: '/img/2025-08-5-7.png',
  spectroelectrochemistrySecondary: '/img/2025-08-1-8.png',
  educationalKit: '/img/2025-08-PSEduKit-overview.jpg',
  corrosionPackage: '/img/2025-08-5-7.png',
  eventHero: '/img/2025-07-WhatsApp-Image-2025-07-22-at-11.57.23-AM.jpeg',
  eventGalleryOne: '/img/2025-07-1-3.png',
  eventGalleryTwo: '/img/2025-07-2-7.png',
  enquiryHero: '/img/2025-09-flat-design-illustration-customer-support-e1756900643135-1024x885.png',
  product58: '/img/2025-07-58.png',
  product59: '/img/2025-07-59.png',
  product60: '/img/2025-07-60.png',
  product61: '/img/2025-07-61.png',
  product62: '/img/2025-07-62.png',
  nexus: '/img/2025-07-Nexus-300x300.jpg',
  nexusHero: '/img/2025-07-Nexus.png',
  heroBanner1: '/img/2025-11-class-one-canva-set.png',
  heroBanner2: '/img/2025-11-class-one-canva-two.png',
  heroBanner3: '/img/2025-11-classone-canva-three.png',
  heroBanner4: '/img/2025-11-classone-four-canva.png',
  softwarePreview: '/img/2025-07-Screenshot-2025-07-21-184542.png',
  aboutDirector: '/img/2025-07-WhatsApp-Image-2025-07-22-at-12.07.37-PM-e1760390529261.jpeg',
  aboutMission: '/img/2025-07-WhatsApp-Image-2025-07-22-at-11.57.23-AM-1024x576.jpeg',
  aboutVision: '/img/2025-07-1-3-300x225.png',
  resourcesWebinar: '/img/2025-07-Screenshot-2025-07-19-112807-1024x574.png',
  resourcesUnboxing: '/img/2025-07-Screenshot-2025-07-19-113048.png',
  resourcesExplained: '/img/2025-07-Screenshot-2025-07-19-113200.png',
  resourcesTutorials: '/img/2025-07-business-video-call-laptop-1024x683.jpg',
  contactPoster: '/img/2025-12-WhatsApp-Image-2025-12-15-at-3.46.45-PM.jpeg',
  resourcesHero: '/img/2025-07-pexels-chokniti-khongchum-1197604-2280571-scaled.jpg',
  applicationsHero: '/img/2025-07-professional-researcher-lab-scaled.jpg',
  contactHero: '/img/2025-07-woman-working-call-center-talking-with-clients-using-headphones-microphone-scaled.jpg',
}

export const topStripLinks = [
  { label: 'SENSING', href: '/' },
  { label: 'ENERGY', href: '/batteries' },
]

export const mainNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  {
    label: 'Products',
    href: '#',
    menu: {
      groups: [
        {
          label: 'Sensing',
          items: [
            { label: 'Single Channel EC', href: '/single-channel-electrochemical/' },
            { label: 'Multi Channel EC', href: '/multi-channel-electrochemical/' },
            { label: 'EC Development Kit', href: '/electrochemical-development-kit/' },
          ],
        },
        {
          label: 'Energy',
          items: [
            { label: 'Corrtest', href: '/corrtest/' },
            { label: 'Tob', href: '/tob/' },
          ],
        },
        {
          label: 'Nano Technology',
          href: '/nano-technology/',
        },
        {
          label: 'Accessories',
          items: [
            { label: 'Electrodes', href: '/electrodes/' },
            { label: 'Glass cell', href: '/glass-cell/' },
          ],
        },
      ],
    },
  },
  {
    label: 'Software',
    href: '/software',
    menu: {
      items: [
        { label: 'PSTrace', href: '/ps-trace', image: imageAssets.product58, description: 'Software for our single channel and sensit potentiostats' },
        { label: 'MultiTrace', href: '/multitrace-2', image: imageAssets.product59, description: 'Software for our multi-channel potentiostats' },
        { label: 'PStouch', href: '/pstouch-2', image: imageAssets.product60, description: 'Control your single channel and sensit potentiostat with an Android phone or tablet' },
        { label: 'PSTrace Xpress', href: '/pstrace-xpress-2', image: imageAssets.softwarePreview, description: 'PSTrace Xpress (beta) for use with cloud storage' },
        { label: 'SDKs for .NET', href: 'https://www.palmsens.com/knowledgebase-article/palmsens-sdks-for-net/?compare=2106', image: imageAssets.product61, external: true, description: 'Develop your own application in no time' },
        { label: 'Writing code for our hardware', href: 'https://www.palmsens.com/oem/writing-code-for-our-hardware/', image: imageAssets.product62, external: true, description: 'Start developing your own software, using C#, Python, MATLAB, LabView, etc' },
      ],
    },
  },
  { label: 'Resources', href: '/resources' },
  {
    label: 'Applications',
    href: '/applications',
    menu: {
      items: [
        { label: 'Spectroelectrochemistry', href: '/spectroelectrochemistry/' },
        { label: 'Educational Kit', href: '/educational-kit/' },
        { label: 'Corrosion Package', href: '/corrosion-package/' },
      ],
    },
  },
  {
    label: 'Connect',
    href: '#',
    menu: {
      items: [
        { label: 'Event', href: '/event/' },
        { label: 'Enquiry', href: '/enquiry/' },
        { label: 'Contact', href: '/contact/' },
      ],
    },
  },
]

export const homeSlides = [
  {
    title: 'Nexus 1 Ampere',
    eyebrow: 'Nexus 1 Ampere',
    description: 'Engineered for Electrochemical Excellence',
    cta: 'View Details',
    href: '/product/nexus',
    accent: '#2e94a6',
    gradient: ['#0c2132', '#111826'],
    image: imageAssets.heroBanner1,
    banner: true,
  },
  {
    title: 'EmStat Pico Module',
    eyebrow: 'EmStat Pico Module',
    description: 'The EmStat Pico is a proven stand-alone potentiostat module which enables you to perform electrochemical measurements using your own electrochemical sensor without programming skills.',
    cta: 'View Details',
    href: '/product/emstat-pico-module',
    accent: '#269fb7',
    gradient: ['#10253a', '#08111b'],
    image: imageAssets.heroBanner2,
    banner: true,
  },
  {
    title: 'PalmSens4',
    eyebrow: 'PalmSens4',
    description: 'USB and battery powered Potentiostat, Galvanostat, and optional a Frequency Response Analyser (FRA) for Electrochemical Impedance Spectroscopy (EIS).',
    cta: 'View Details',
    href: '/product/palmsens4',
    accent: '#3ba3d1',
    gradient: ['#103054', '#09131f'],
    image: imageAssets.heroBanner3,
    banner: true,
  },
  {
    title: 'EmStat4S',
    eyebrow: 'EmStat4S',
    description: 'The EmStat4S is a portable USB-powered Potentiostat, Galvanostat, and optional a Frequency Response Analyser (FRA) for Electrochemical Impedance Spectroscopy (EIS).',
    cta: 'View Details',
    href: '/product/emstat4s',
    accent: '#1aa6b9',
    gradient: ['#102b44', '#0a121c'],
    image: imageAssets.heroBanner4,
    banner: true,
  },
  {
    title: 'EmStat Go',
    eyebrow: 'EmStat Go',
    description: 'The EmStat Go is a battery powered*, handheld potentiostat which consists of a base unit and a customer-specific Sensor Extension module.',
    cta: 'View Details',
    href: '/product/emstat-go',
    accent: '#36b48d',
    gradient: ['#0f2a36', '#09131a'],
    image: imageAssets.nexusHero,
    banner: true,
  },
]
export const productCatalog = [
  {
    key: 'nexus',
    title: 'Nexus',
    aliases: ['/nexus', '/nexus/', '/product/nexus', '/product/nexus/'],
    category: 'Biosensor Platform',
    summary: 'A modular potentiostat platform engineered for electrochemical innovation and custom sensor workflows.',
    details: 'Nexus is designed for research-grade sensing, prototype validation, and flexible expansion across laboratory and field deployments.',
    features: ['Modular architecture', 'Custom sensing workflows', 'Research-grade stability', 'Field-ready expansion'],
    accent: '#269fb7',
    image: imageAssets.product59,
  },
  {
    key: 'palmsens4',
    title: 'PalmSens4',
    aliases: ['/product/palmsens4', '/product/palmsens4/', '/palmsens4', '/palmsens4/'],
    category: 'Portable Instrument',
    summary: 'USB and battery powered potentiostat, galvanostat, and optional FRA for electrochemical impedance spectroscopy.',
    details: 'PalmSens4 combines portability with laboratory-grade electrochemistry for labs that need a versatile instrument that travels well.',
    features: ['USB and battery powered', 'Optional FRA', 'Compact enclosure', 'Portable electrochemistry'],
    accent: '#1ea2c8',
    image: '/img/2025-07-1-1-300x300.png',
  },
  {
    key: 'emstat4s',
    title: 'EmStat4S',
    aliases: ['/product/emstat4s', '/product/emstat4s/', '/emstat4s', '/emstat4s/'],
    category: 'Portable Instrument',
    summary: 'Portable USB-powered potentiostat, galvanostat, and optional FRA for electrochemical impedance spectroscopy.',
    details: 'EmStat4S is built for flexible lab and field measurements, making it a practical choice for compact sensing systems.',
    features: ['USB powered', 'Optional FRA', 'Portable form factor', 'Flexible measurement modes'],
    accent: '#2f97d0',
    image: imageAssets.product61,
  },
  {
    key: 'emstat-go',
    title: 'EmStat Go',
    aliases: ['/product/emstat-go', '/product/emstat-go/', '/emstat-go', '/emstat-go/'],
    category: 'Handheld Instrument',
    summary: 'Battery powered handheld potentiostat with a base unit and customer-specific Sensor Extension module.',
    details: 'EmStat Go supports portable sensing work and compact deployment where a lightweight battery-powered setup is needed.',
    features: ['Battery powered', 'Handheld operation', 'Sensor extension module', 'Compact deployment'],
    accent: '#36b48d',
    image: imageAssets.product60,
  },
  {
    key: 'emstat-pico-module',
    title: 'EmStat Pico Module',
    aliases: ['/product/emstat-pico-module', '/product/emstat-pico-module/', '/emstat-pico-module', '/emstat-pico-module/'],
    category: 'Module Platform',
    summary: 'A stand-alone potentiostat module for electrochemical measurements without programming skills.',
    details: 'The EmStat Pico module is used in embedded projects and custom hardware where a compact electrochemical core is required.',
    features: ['Embedded module', 'Stand-alone use', 'Sensor integration', 'Compact footprint'],
    accent: '#1c8eb8',
    image: imageAssets.product58,
  },
  {
    key: 'emstat4t-3',
    title: 'EmStat4T',
    aliases: ['/product/emstat4t-3', '/product/emstat4t-3/'],
    category: 'Touch Device',
    summary: 'A touch-oriented electrochemistry device tailored for interaction-driven laboratory workflows.',
    details: 'EmStat4T is a touch-oriented electrochemistry device tailored for interaction-driven laboratory workflows.',
    features: ['Touch workflow', 'Electrochemistry apps', 'Modular interface', 'Customizable UI'],
    accent: '#f1c84c',
    image: imageAssets.hero,
  },
  {
    key: 'spectroelectrochemistry-starter-kit',
    title: 'Spectroelectrochemistry Starter Kit',
    aliases: ['/product/spectroelectrochemistry-starter-kit', '/product/spectroelectrochemistry-starter-kit/'],
    category: 'Starter Kit',
    summary: 'A practical starter kit for combined optical and electrochemical experiments.',
    details: 'The starter kit showcases how the site presents bundled research instruments for educational and experimental adoption.',
    features: ['Starter kit', 'Combined workflows', 'Research and teaching', 'Fast onboarding'],
    accent: '#7d92ff',
    image: imageAssets.softwarePreview,
  },
  {
    key: 'emstat4x',
    title: 'EmStat 4X',
    aliases: ['/product/emstat4x', '/product/emstat4x/'],
    category: 'Portable Instrument',
    summary: 'Compact electrochemical instrument for flexible sensing and measurement setups.',
    details: 'EmStat 4X is a compact electrochemical instrument for flexible sensing and measurement setups.',
    features: ['Compact', 'Portable', 'Flexible sensing', 'Research use'],
    accent: '#5ab0cf',
    image: imageAssets.product58,
  },
  {
    key: 'sensit-bt',
    title: 'Sensit BT',
    aliases: ['/product/sensit-bt', '/product/sensit-bt/'],
    category: 'Wireless Instrument',
    summary: 'A connected electrochemical device for portable, wireless sensing workflows.',
    details: 'Sensit BT is a connected electrochemical device for portable, wireless sensing workflows.',
    features: ['Bluetooth', 'Portable', 'Wireless use', 'Sensor workflows'],
    accent: '#22b0a0',
    image: imageAssets.product59,
  },
  {
    key: 'sensit-smart',
    title: 'Sensit Smart',
    aliases: ['/product/sensit-smart', '/product/sensit-smart/'],
    category: 'Smart Instrument',
    summary: 'A smart electrochemical platform for portable sensing and quick testing.',
    details: 'Sensit Smart is a smart electrochemical platform for portable sensing and quick testing.',
    features: ['Smart control', 'Portable', 'Fast testing', 'Lab and field use'],
    accent: '#269fb7',
    image: imageAssets.product60,
  },
  {
    key: 'emstat4r',
    title: 'EmStat4R',
    aliases: ['/product/emstat4r', '/product/emstat4r/'],
    category: 'Research Instrument',
    summary: 'A research-focused instrument for portable electrochemistry and development workflows.',
    details: 'EmStat4R is a research-focused instrument for portable electrochemistry and development workflows.',
    features: ['Research focus', 'Portable', 'Flexible software', 'Measurement accuracy'],
    accent: '#1c9cc1',
    image: imageAssets.product61,
  },
  {
    key: 'sensit-wearable',
    title: 'Sensit Wearable',
    aliases: ['/product/sensit-wearable', '/product/sensit-wearable/'],
    category: 'Wearable Instrument',
    summary: 'Wearable electrochemical sensing for compact field and health applications.',
    details: 'Sensit Wearable supports wearable electrochemical sensing for compact field and health applications.',
    features: ['Wearable', 'Compact', 'Field ready', 'Connected sensing'],
    accent: '#36b48d',
    image: imageAssets.product62,
  },
  {
    key: 'emstat-blue',
    title: 'EmStat Blue',
    aliases: ['/product/emstat-blue', '/product/emstat-blue/'],
    category: 'Portable Instrument',
    summary: 'A compact electrochemical instrument for portable sensing and measurement workflows.',
    details: 'EmStat Blue is a compact electrochemical instrument for portable sensing and measurement workflows.',
    features: ['Compact', 'Portable', 'Portable sensing', 'Measurement workflows'],
    accent: '#2f97d0',
    image: imageAssets.product58,
  },
]

export const softwareDetailCatalog = [
  {
    key: 'ps-trace',
    title: 'PS Trace',
    aliases: ['/ps-trace', '/ps-trace/'],
    summary: 'Windows software for single channel instruments, including multiplexer support.',
    details: 'Windows software for single channel instruments (also with multiplexer).',
    features: ['Windows application', 'Single channel support', 'Multiplexer support', 'Workflow control'],
    accent: '#269fb7',
    image: imageAssets.product58,
  },
  {
    key: 'multitrace-2',
    title: 'Multi Trace',
    aliases: ['/multitrace-2', '/multitrace-2/'],
    summary: 'Windows software for multi-channel instruments.',
    details: 'Windows software for multi-channel instruments.',
    features: ['Multi-channel instruments', 'Windows software', 'Experiment control', 'Data capture'],
    accent: '#1ea2c8',
    image: imageAssets.product59,
  },
  {
    key: 'pstouch-2',
    title: 'PS touch',
    aliases: ['/pstouch-2', '/pstouch-2/'],
    summary: 'Android app for single channel instruments, including multiplexer support.',
    details: 'Android app for single channel instruments (also with multiplexer).',
    features: ['Android app', 'Touch workflows', 'Multiplexer support', 'Mobile use'],
    accent: '#36b48d',
    image: imageAssets.product60,
  },
  {
    key: 'pstrace-xpress-2',
    title: 'PSTrace Xpress',
    aliases: ['/pstrace-xpress-2', '/pstrace-xpress-2/'],
    summary: 'Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.',
    details: 'Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.',
    features: ['Cloud storage', 'Advanced workflows', 'Development ready', 'Beta software'],
    accent: '#7d92ff',
    image: imageAssets.softwarePreview,
  },
  {
    key: 'sdks-for-net',
    title: 'SDKs for .NET',
    aliases: ['/knowledgebase-article/palmsens-sdks-for-net', '/knowledgebase-article/palmsens-sdks-for-net/'],
    summary: 'Development kits for .NET integrations and software control.',
    details: 'Development kits for .NET integrations and software control.',
    features: ['.NET support', 'Hardware integration', 'Software control', 'Developer workflow'],
    accent: '#269fb7',
    image: imageAssets.product61,
  },
  {
    key: 'writing-code-for-our-hardware',
    title: 'Writing Code for Our Hardware',
    aliases: ['/oem/writing-code-for-our-hardware', '/oem/writing-code-for-our-hardware/'],
    summary: 'Start developing your own software using C#, Python, MATLAB, LabView, and more.',
    details: 'Start developing your own software using C#, Python, MATLAB, LabView, and more.',
    features: ['C#', 'Python', 'MATLAB', 'LabView'],
    accent: '#2f97d0',
    image: imageAssets.product62,
  },
]

export const aboutMessage = 'is a Delhi-based leader in nanotechnology, semiconductor solutions, electrochemical analysis systems, and related materials and consumables. Since its founding in 2012, the company has expanded with regional offices in Kolkata, Jammu, Bhubaneswar, Pune, Bangalore, and Chennai. We serve prestigious institutions across India-including DRDO, CSIR labs, IISERs, IITs, and central/state universities-supporting researchers, scientists, and educators with cutting-edge electrochemical instruments and services.'

export const missionText = 'Empowering India-s scientific community through innovative electrochemical systems, expert support, and purpose-driven collaboration'

export const visionText = 'Our vision is to become a national and global leader in scientific instrumentation and innovation-fueling advancements in electrochemistry, nanotechnology, and semiconductors through purposeful collaboration, cross-disciplinary insight, and in-house R&D.'

export const expertisePoints = [
  {
    title: 'Electrochemical Analysis Systems',
    description: 'Advanced instruments for electrochemical sensing, testing, and research.',
  },
  {
    title: 'Nanotechnology & Materials Science',
    description: 'Tools and consumables for material characterization and nanoscale innovation.',
  },
  {
    title: 'Semiconductor Solutions',
    description: 'Devices and platforms tailored for semiconductor research and prototyping.',
  },
  {
    title: 'Battery Testing & Development',
    description: 'Systems for charge-discharge cycling, impedance analysis, and material evaluation.',
  },
  {
    title: 'Custom Electrochemical Device Development',
    description: 'In-house design and fabrication of systems tailored to specific research needs.',
  },
  {
    title: 'Scientific Research Support',
    description: 'Collaborations with premier institutions and scientists to develop and optimize scientific instruments and experimental setups.',
  },
]

export const aboutTeam = [
  { name: 'Mr. Rajiv Das', role: 'Managing Director HQ (Delhi)', image: '/img/2025-07-Rajiv-Sir-150x150.jpeg' },
  { name: 'Mr. Anshuman Mallick', role: 'Technical Director HQ (Delhi)', image: '/img/2025-09-Anshuman-e1757135333607-150x150.jpeg' },
  { name: 'Ms. Richa Sharma', role: 'Contract Manager (usA)', image: '/img/2025-07-Ms.-Richa-Sharma.jpg' },
  { name: 'Dr. Ayan Mukherjee', role: 'Director (Kolkata)', image: '/img/2025-09-Ayan-Mukherjee-e1757135464671-150x150.jpeg' },
  { name: 'Mr. Animegh Mandal', role: 'General Manager (Bhubaneshwar)', image: '/img/2025-09-Animegh-Mandal-150x150.jpeg' },
  { name: 'Mr. Syed Iqbal Ahmed Bukhari', role: 'Regional Manager (Kashmir)', image: '/img/2025-07-Mr.-Syed-Iqbal-Ahmed-Bukhari.jpg' },
  { name: 'Mr Mayur Vivek Sakalkale', role: 'Regional Manager (Western Region) Pune', image: '/img/2025-07-Mr-Mayur-Vivek-Sakalkale-1.jpg' },
  { name: 'Dr. Dinesh Deva', role: 'Chief Mentor & Consultant Scientist', image: '/img/2025-07-Dr.-Dinesh-Deva-1.jpg' },
  { name: 'Dr. Zeenat Khatoon', role: 'Research Scientist', image: '/img/elementor-thumbs-Dr.-Zeenat-Khatoon-rb96r2kriphc11h6wpmgjdfyf9hytmvols10cp32ak.jpg' },
  { name: 'Mr. Anurag', role: 'Technical Officer', image: '/img/2025-07-WhatsApp-Image-2025-07-22-at-12.07.37-PM-1-150x150.jpeg' },
  { name: 'Ms. Snuthy MS', role: 'Accounts Manager', image: '/img/2025-07-Ms.-Snuthy-MS-1-150x150.png' },
  { name: 'Ms. Deepa Pandey', role: 'Assistant Manager (Sales)', image: '/img/2025-07-Ms.-Deepa-Pandey-1-150x150.png' },
]

export const biosensorAreas = [
  { title: 'Glucose and Lactate Detection', description: 'Reliable measurement of key metabolic biomarkers for medical diagnostics and sports health monitoring.', icon: imageAssets.product58 },
  { title: 'Cortisol and Hormone Monitoring', description: 'Track stress and endocrine levels using portable, sensitive electrochemical sensors.', icon: imageAssets.product59 },
  { title: 'Virus and Pathogen Biosensors', description: 'On-site detection of infectious agents for rapid diagnosis and environmental screening.', icon: imageAssets.product60 },
  { title: 'Sweat and Saliva-Based Diagnostics', description: 'Non-invasive sensing for personalized health tracking and wearable applications.', icon: imageAssets.product61 },
  { title: 'DNA Hybridization & Paper-Based Sensors', description: 'Cost-effective disposable platforms for genetic testing and field diagnostics.', icon: imageAssets.softwarePreview },
  { title: 'Paper-Based Biosensor Devices', description: 'Cost-effective, portable platforms for field diagnostics and on-site analysis.', icon: imageAssets.product62 },
]

const CDN = 'https://classonesystems.in/wp-content/uploads/'

export const biosensorProducts = [
  { title: 'EmStat4T', href: '/product/emstat4t-3', image: '/img/2025-12-EmStat4T-SPE-and-SNS-with-cable-and-sensor-300x300.jpg' },
  { title: 'Nexus', href: '/product/nexus', image: '/img/2025-07-Nexus-300x300.jpg' },
  { title: 'Spectroelectrochemistry Starter Kit', href: '/product/spectroelectrochemistry-starter-kit', image: '/img/2025-07-10-1-300x300.png' },
  { title: 'EmStat 4X', href: '/product/emstat-4x', image: '/img/2025-07-9-300x300.png' },
  { title: 'Sensit BT', href: '/product/sensit-bt', image: '/img/2025-07-8-300x300.png' },
  { title: 'Sensit Smart', href: '/product/sensit-smart', image: '/img/2025-07-7-3-300x300.png' },
  { title: 'EmStat4R', href: '/product/emstat4r', image: '/img/2025-07-5-4-300x300.png' },
  { title: 'Sensit Wearable', href: '/product/sensit-wearable', image: '/img/2025-07-3-3-300x300.png' },
  { title: 'EmStat4S', href: '/product/emstat4s', image: '/img/2025-07-2-5-300x300.png' },
  { title: 'PalmSens4', href: '/product/palmsens4', image: '/img/2025-07-1-1-300x300.png' },
]

export const businessSegments = [
  { title: 'Agriculture & Food', image: '/img/2025-07-7-4.png' },
  { title: 'University & Research Centres', image: '/img/2025-07-1-2.png' },
  { title: 'Environmental Monitoring', image: '/img/2025-07-2-6.png' },
  { title: 'Energy Storage & Renewal Energy', image: '/img/2025-07-3-4.png' },
  { title: 'Medical & Pharma', image: '/img/2025-07-4-4.png' },
  { title: 'Biotechnology', image: '/img/2025-07-5-5.png' },
  { title: 'Material Science', image: '/img/2025-07-6-2.png' },
]

export const newestInnovations = [
  { title: 'Spectroelectrochemistry Starter Kit', href: '/product/spectroelectrochemistry-starter-kit', image: '/img/2025-07-10-1-300x300.png' },
  { title: 'EmStat4R', href: '/product/emstat4r', image: '/img/2025-07-5-4-300x300.png' },
  { title: 'Sensit Wearable', href: '/product/sensit-wearable', image: '/img/2025-07-3-3-300x300.png' },
  { title: 'Sensit Smart', href: '/product/sensit-smart', image: '/img/2025-07-7-3-300x300.png' },
]

export const testimonials = [
  { name: 'Prof. Sheeja Jagadevan', role: 'Dept. of Environmental Science & Engineering, IIT (ISM) Dhanbad', quote: 'Excellent system and decent after-sales service.', image: '/img/2025-07-Sheeja.png', rating: 5 },
  { name: 'Dr. Surinder P. Singh', role: 'Senior Scientist, CSIR-NPL, Delhi', quote: 'Very satisfied, the system works efficiently.', image: '/img/2025-07-Surinder.png', rating: 5 },
  { name: 'Dr. Rafiq Ahmad', role: 'Centre for Nanoscience and Nanotechnology, Jamia Millia Islamia, New Delhi', quote: 'Runs smoothly and is very user-friendly.', image: '/img/2025-07-Rafiq-1.png', rating: 5 },
  { name: 'Dr. Sourav Kumar', role: 'Centre for Nano Science & Engineering, IISc Bangalore', quote: 'Very good device at this price range.', image: '/img/2025-07-Sourav.png', rating: 5 },
  { name: 'Prof. M. Ashok', role: 'Dept. of Physics, NIT Tiruchirappalli', quote: 'Reliable system - been using for years with no complaints.', image: '/img/2025-07-Ashok.png', rating: 5 },
  { name: 'Dr. Vinu Mohan A M', role: 'Scientist, CSIR-CECRI, Karaikudi', quote: 'Excellent system with great support before and after purchase.', image: '/img/2025-07-Vinu.png', rating: 5 },
  { name: 'Prof. Archana Mallik', role: 'Metallurgical & Materials Engineering, NIT Rourkela', quote: 'Top-quality system and top-notch support.', image: '/img/2025-07-Archana.png', rating: 5 },
  { name: 'Dr. Arun Kumar', role: 'Scientific Officer-E, NISER Bhubaneswar', quote: 'Good device. Would definitely recommend.', image: '/img/2025-07-Arun.png', rating: 5 },
  { name: 'Prof. Shyamal Kumar Saha', role: 'School of Materials Sciences, IACS Kolkata', quote: 'Technical support provided whenever needed.', image: '/img/2025-07-Shyamal.png', rating: 5 },
  { name: 'Prof. S. Shanmugasundaram', role: 'Head, Planning & Monitoring Cell, IIFPT, Thanjavur', quote: 'Good support and quick access to consumables.', image: '/img/2025-07-Shanmugasundaram.png', rating: 5 },
  { name: 'Dr. Tarun Kumar Sharma', role: 'Senior Research Scientist, THSTI, Faridabad', quote: 'Fast delivery and responsive support.', image: '/img/2025-07-Tarun.png', rating: 5 },
  { name: 'Prof. Siddharth Tallur', role: 'Dept. of Electrical Engineering, IIT Bombay', quote: 'A highly proficient and capable device.', image: '/img/2025-07-Siddharth.png', rating: 5 },
  { name: 'Prof. Kothandaraman Ramanujam', role: 'Department of Chemistry, IIT Madras', quote: 'Impressive device and strong after-sales service.', image: '/img/2025-07-Kothandaraman.png', rating: 5 },
  { name: 'Dr. Rajiv Prakash', role: 'Dean (R&D), IIT (BHU) Varanasi', quote: 'Good device - highly recommended!', image: '/img/2025-07-Rajiv-1.png', rating: 5 },
  { name: 'Prof. Sameer Sapra', role: 'Dept. of Chemistry, IIT Delhi', quote: 'Very responsive team with excellent support.', image: '/img/2025-07-Sameer.png', rating: 5 },
  { name: 'Prof. Santanu Bhattacharya', role: 'Director, IACS Kolkata', quote: 'Smart device; data quality is satisfying.', image: '/img/2025-07-Santanu.png', rating: 5 },
  { name: 'Dr. Preeti Nigam Joshi', role: 'CEO, FastSense Diagnostics, Pune', quote: 'Very satisfied with both PS4 and Sensit Smart.', image: '/img/2025-07-Preeti.png', rating: 5 },
  { name: 'Dr. Pranjal Chandra', role: 'Assistant Professor, IIT (BHU) Varanasi', quote: 'Innovative and expandable system.', image: '/img/2025-07-Pranjal.png', rating: 5 },
  { name: 'Dr. Sonu Gandhi', role: 'Senior Scientist, NIAB, Hyderabad', quote: 'Compact, portable, and affordable solution.', image: '/img/2025-07-Sonu.png', rating: 5 },
  { name: 'Prof. Shiv Govind Singh', role: 'Dept. of Electrical Engineering, IIT Hyderabad', quote: 'Ideal for developing custom devices.', image: '/img/2025-07-Shiv.png', rating: 5 },
  { name: 'Dr. Ananthakrishnan Srinivasan', role: 'Professor, Dept. of Physics, IIT Guwahati', quote: 'Timely delivery and prompt installation.', image: '/img/2025-07-Ananthakrishnan.png', rating: 5 },
]

export const certificateSlides = [
  { key: 'certificate1', image: '/img/2025-08-certificate1.jpg' },
  { key: 'certificate2', image: '/img/2025-08-certificate2.jpg' },
  { key: 'certificate3', image: '/img/2025-08-certificate3.jpg' },
]

export const clientBadges = [
  '/img/2025-07-47ab2ae465904c5917fb5da1fef41e88.jpg',
  '/img/2025-07-35aafdeacf34908eeb3d0f88c6b75c57.jpg',
  '/img/2025-07-991e8ee3a0953786aea5a15fd6f6d561.jpg',
  '/img/2025-07-c1e9fe2ed92397c66b8ab86fec663182.jpg',
  '/img/2025-07-73b24b481f6d1bfce1de76ad78beb541.jpg',
  '/img/2025-07-dd80242b24305987905ab27670dcc888.jpg',
  '/img/2025-07-b4c08f690891ae95013146562dcd9ec9.jpg',
  '/img/2025-07-76b3bc7659c233ae67e80a15b23e9129.png',
  '/img/2025-07-25927c3cf6b265bb767882e4a74f1cd8.png',
  '/img/2025-07-fa932159ecf348e055a2b3ff20751105.png',
  '/img/2025-07-5690eddc1b2f26b18639b5c3c530fd20.png',
]

export const softwareCards = softwareDetailCatalog.map((item) => ({
  title: item.title,
  description: item.summary,
  href: item.aliases[0],
  image: item.image,
}))

export const resourceCards = [
  { title: 'Webinars', description: 'Recorded sessions and introduction material for new users.', href: '/resources/webinars', image: imageAssets.resourcesWebinar },
  { title: 'Unboxing', description: 'First-look setup and delivery walkthroughs.', href: '/resources/unboxing', image: imageAssets.resourcesUnboxing },
  { title: 'Explained', description: 'Short explainers that show the workflow behind each tool.', href: '/resources/explained', image: imageAssets.resourcesExplained },
  { title: 'Tutorials', description: 'Practical guides for getting the most from your instrument.', href: '/resources/tutorials', image: imageAssets.resourcesTutorials },
]

export const applicationCards = [
  {
    title: 'Corrosion Testing',
    href: '/applications',
    description: 'Electrochemical techniques like potentiodynamic polarization and Electrochemical Impedance Spectroscopy (EIS) are essential for evaluating metal durability in corrosive environments.',
    panelTitle: 'CORROSION TESTING',
    panelParagraphs: [
      'Electrochemical techniques like potentiodynamic polarization and Electrochemical Impedance Spectroscopy (EIS) are essential for evaluating metal durability in corrosive environments.',
      'Recommended Instruments:',
      'EmStat4S.HR or Corrtest CS350M - both support potentiodynamic corrosion methods and mid-range EIS.',
    ],
    panelFooter: 'Learn More:',
    youtubeId: '6oJRA6XUsgM',
  },
  {
    title: 'Battery Testing',
    href: '/applications',
    description: 'Charge/discharge cycling and impedance profiling help uncover aging, capacity limits, and internal resistance of batteries.',
    panelTitle: 'BATTERY TESTING',
    panelParagraphs: [
      'Charge/discharge cycling and impedance profiling help uncover aging, capacity limits, and internal resistance of batteries.',
      'Recommended Instruments:',
      'CS350M (2-5 A range) for pouch/coin cells',
      'TOBETEST Battery Analyzer for multi-cell pack validation',
    ],
    panelFooter: 'Learn More:',
    youtubeId: 'zwRVOZdQdzo',
  },
  {
    title: 'Sensors & Biosensors',
    href: '/applications',
    description: 'Potentiostats are critical for measuring small currents and impedance changes in biosensors, enabling detection of analytes from glucose to DNA.',
    panelTitle: 'SENSORS / BIOSENSORS',
    panelParagraphs: [
      'Potentiostats are critical for measuring small currents and impedance changes in biosensors, enabling detection of analytes from glucose to DNA.',
      'Recommended Instruments:',
      'EmStat Pico - compact and suitable for lab/portable sensor setups',
      'PalmSens4 - ideal for multitasking and EIS-based sensing',
    ],
    panelFooter: 'Learn More:',
    youtubeId: 'AaWBO3ylMyA',
  },
  {
    title: 'Education & Teaching',
    href: '/applications',
    description: 'Electrochemistry is a perfect teaching tool for hands-on education-students learn cyclic voltammetry, chronoamperometry, and EIS basics with intuitive software environments.',
    panelTitle: 'ADD YOUR HEADING TEXT HERE',
    panelParagraphs: [
      'Electrochemistry is a perfect teaching tool for hands-on education-students learn cyclic voltammetry, chronoamperometry, and EIS basics with intuitive software environments.',
      'Recommended Kits:',
      'EmStat3 - low-cost module for basic CV and teaching labs',
      'EmStat4M - richer features, PSTrace software, ideal for full lab systems',
    ],
    panelFooter: 'Learn More:',
  },
]

export const contactOffices = [
  {
    title: 'HEAD OFFICE NEW DELHI',
    mapTitle: 'Level 4, Rectangle 1, CLASS ONE SYSTEMS S&T PVT. LTD., Commercial Complex, D-4, Block L, Saket, New Delhi, Delhi 110017',
    mapSrc: 'https://maps.google.com/maps?q=Level%204%2C%20Rectangle%201%2C%20CLASS%20ONE%20SYSTEMS%20S%26T%20PVT.%20LTD.%2C%20Commercial%20Complex%2C%20D-4%2C%20Block%20L%2C%20Saket%2C%20New%20Delhi%2C%20Delhi%20110017&t=m&z=10&output=embed&iwloc=near',
    lines: ['Class One Systems S&T Pvt. Ltd.', 'Level 4, Rectangle 1, Commercial Complex D-4, Saket, New Delhi, India - 110017'],
  },
  {
    title: 'REGIONAL OFFICE KOLKATA',
    mapTitle: 'Class One Systems S&T Pvt. Ltd., B-241, Survey Park, Santoshpur, Kolkata, West Bengal 700075',
    mapSrc: 'https://maps.google.com/maps?q=Class%20One%20Systems%20S%26T%20Pvt.%20Ltd.%2C%20B-241%2C%20Survey%20Park%2C%20Santoshpur%2C%20Kolkata%2C%20West%20Bengal%20700075&t=m&z=10&output=embed&iwloc=near',
    lines: ['Kolkata Branch (Eastern India) : Class One Systems S&T Pvt. Ltd.', 'B-241, Survey Park, Santoshpur Kolkata - 700075, West Bengal', 'Contact Person : Mr. Ayan Mukherjee', 'Regional Director (East) Contact : 1800 11 6599'],
  },
  {
    title: 'BRANCH OFFICE BANGALORE',
    mapTitle: 'No.25, Subramanaya, Classonesystem S&T Pvt. Ltd 4th main rd,Suddaguntapalya, C V Raman nagar, Bangaluru,Karnataka 560093',
    mapSrc: 'https://maps.google.com/maps?q=No.25%2C%20Subramanaya%2C%20Classonesystem%20S%26T%20Pvt.%20Ltd%204th%20main%20rd%2CSuddaguntapalya%2C%20C%20V%20Raman%20nagar%2C%20Bangaluru%2CKarnataka%20560093&t=m&z=10&output=embed&iwloc=near',
    lines: ['Bangalore  Branch (Southern Branch):Class One System S&t Pvt. Ltd.', 'No. 25,Subramnaya,4th Main SG Palya CV,Raman nagar, Bangalore-560093, Karnataka Contact Person : Mr.Sanjay V Contact : 1800116599'],
  },
  {
    title: 'BRANCH OFFICE PUNE',
    mapTitle: 'Class One Systems S&T Pvt. Ltd. Pune, Dwarika Nagari, C - 403, Katraj - Kondhwa Rd, behind ESCON Temple, Kedareshwar Vasti, Tilekar Nagar, Tilak Nagar, Pune, Maharashtra 411048',
    mapSrc: 'https://maps.google.com/maps?q=Class%20One%20Systems%20S%26T%20Pvt.%20Ltd.%20Pune%2C%20Dwarika%20Nagari%2C%20C%20-%20403%2C%20Katraj%20-%20Kondhwa%20Rd%2C%20behind%20ESCON%20Temple%2C%20Kedareshwar%20Vasti%2C%20Tilekar%20Nagar%2C%20Tilak%20Nagar%2C%20Pune%2C%20Maharashtra%20411048&t=m&z=10&output=embed&iwloc=near',
    lines: ['Pune Branch (Western India): Class One Systems S&T Pvt. Ltd.', 'Dwarika Nagari C - 403, Tilak Nagar Behind ESCON Temple,', 'Katraj - Kondhwa Road Pune - 411048 Maharashtra', 'Contact Person : Mr Mayur Vivek Sakalkale', 'Regional Manager (West)', 'Contact : 1800 11 6599'],
  },
  {
    title: 'BHUBANESHWAR BRANCH (CENTRAL INDIA)',
    mapTitle: 'Class One System S&T Pvt. Ltd. Bhubaneshwar, 305, B-Block, Bishnu Residency, Kalarahanga, Bhubaneswar, Odisha 751024',
    mapSrc: 'https://maps.google.com/maps?q=Class%20One%20System%20S%26T%20Pvt.%20Ltd.%20Bhubaneshwar%2C%20305%2C%20B-Block%2C%20Bishnu%20Residency%2C%20Kalarahanga%2C%20Bhubaneswar%2C%20Odisha%20751024&t=m&z=10&output=embed&iwloc=near',
    lines: ['Class One System S&T Pvt. Ltd.', '305, B-Block Bishnu Residency, Kalarahanga, Bhubaneshwar - 751024 Orissa', 'Contact Person : Mr. Animegh Mandal', 'General Manager (Central)', 'Contact : 1800 11 6599'],
  },
  {
    title: 'BRANCH OFFICE KASHMIR',
    mapTitle: 'CLASS ONE SYSTEMS S&T PVT. LTD. Kashmir Branch, Auqaf Building, R # 12, Budshah Bridge, Chowk, Srinagar, Jammu and Kashmir 190001',
    mapSrc: 'https://maps.google.com/maps?q=CLASS%20ONE%20SYSTEMS%20S%26T%20PVT.%20LTD.%20Kashmir%20Branch%2C%20Auqaf%20Building%2C%20R%20%23%2012%2C%20Budshah%20Bridge%2C%20Chowk%2C%20Srinagar%2C%20Jammu%20and%20Kashmir%20190001&t=m&z=10&output=embed&iwloc=near',
    lines: ['Kashmir Branch (Northern india) :', 'Class One System S&T Pvt. Ltd.', 'R#12,Aquaf Building,budshah Chowk Srinagar,Jammu And Kashmir -19001'],
  },
]

export const routePages = {
  spectroelectrochemistry: {
    layout: 'application',
    title: 'SPECTROELECTROCHEMISTRY',
    summary: 'Gain more insight into electrochemistry with a spectrometer',
    gallery: [
      { src: '/img/2025-08-1-8.png', alt: 'Spectroelectrochemistry setup' },
      { src: '/img/2025-08-2-8.png', alt: 'Spectroelectrochemistry cell' },
      { src: '/img/2025-08-3-9.png', alt: 'Spectroelectrochemistry components' },
    ],
    bullets: [
      'Measure current, potential and spectrum simultaneously',
      'Tested Spectroelectrochemistry setup',
      'Synchronized measurements',
      'Combine results in PSTrace',
      'Available as a complete kit with spectrometer accessories, or starter kit if you already have a spectrometer',
    ],
    form: {
      selects: [
        { label: 'Kit options' },
        { label: 'Potentiostat included' },
        { label: 'Spectrometer' },
      ],
      inputs: [{ label: 'Quantity' }],
      contact: [
        { label: 'Your Name', required: true },
        { label: 'Your Email', required: true, type: 'email' },
      ],
      message: { label: 'Your Message', required: true },
      submit: 'SEND REQUEST',
    },
    description: {
      paragraphs: [
        'Scientific methods can deliver a lot of information about your molecule, solution, or reaction, however, a single method will only provide a limited amount of information based on a single interaction. For this reason, scientists try to create hyphenated techniques that allow observing the same system at the same time with multiple techniques. A popular hyphenated technique is spectroelectrochemistry, where electrochemical reactions or products are characterized by electrochemical methods and spectroscopy at the same time.',
      ],
    },
    tabs: [
      { id: 'contents', label: 'Contents' },
      { id: 'photoelectrochemical-cell', label: 'Photoelectrochemical cell' },
      { id: 'downloads', label: 'Downloads' },
    ],
    body: [
      {
        type: 'contents',
        id: 'contents',
        title: 'Contents',
        intro: 'The Starter kit includes:',
        items: [
          'A potentiostat of your preference: Nexus, PalmSens4 or EmStat4X (select none if you wish to use an existing potentiostat)',
          'Photoelectrochemical Cell ItalSens K300 with wires soldered to the electrodes',
          'Special cable to connect the Auxiliary port of a potentiostat to the Avantes spectrometer',
          'Easy-to-use PSTrace software',
        ],
        subIntro: 'In addition to the starter kit, we have partnered with Avantes to offer you:',
        subItems: [
          'Spectrometer the AvaSpec-Mini2048CL-EVO, or the AvaSpec-Varius 2k (VIR2048EL-EVO) with improved optical bench design',
          'Light source AvaLight-DHc',
          'Fibers 2x FC-UVMG50-1',
          'Cuvette holder CUV-UV/VIS',
          'AvaSoft software',
        ],
        footer: 'Together, this complete spectroelectrochemistry setup will look like this (laptop, pipettes and vials not included):',
      },
      {
        type: 'photoCell',
        id: 'photoelectrochemical-cell',
        title: 'Photoelectrochemical Cell',
        paragraphs: [
          'Cell Specifications: 8 mm x 6.5 mm x 1 mm',
          'Features: shaped like a cuvette, surrounded by light. Made of full quartz melt with PTFE lid.',
          'Application: suitable for electrochemical testing in the process of in situ UV-visible spectroscopy, fluorescence spectroscopy and other spectral signal response.',
          'Matching electrode: a platinum mesh electrode as the working electrode, a platinum wire electrode as counter electrode, a silver/silver chloride in KCl 3M electrode as the reference electrode.',
        ],
        image: imageAssets.spectroelectrochemistrySecondary,
        imageAlt: 'Electrochemical cell',
      },
      {
        type: 'downloads',
        id: 'downloads',
        title: 'Downloads',
        items: [
          {
            title: 'Spectroelectrochemistry',
            detail: 'Get more insight into electrochemistry by adding a spectrometer to your potentiostat.',
            href: 'https://classonesystems.in/wp-content/uploads/2025/08/PSAN0410-Spectroelectrochemistry.pdf',
          },
        ],
      },
    ],
  },
  educationalKit: {
    layout: 'application',
    title: 'EDUCATIONAL KIT',
    summary: 'Your foundation for an electrochemistry course, lab class or similar teaching event',
    gallery: [{ src: imageAssets.educationalKit, alt: 'Educational kit overview' }],
    bullets: [
      'Combines with a potentiostat of your choice',
      'Great foundation for your electrochemistry course',
      'Includes a copy of the Teachers guide, and the Student guide',
    ],
    form: {
      selects: [{ label: 'Version' }],
      contact: [
        { label: 'Your Name', required: true },
        { label: 'Your Email', required: true, type: 'email' },
        { label: 'Phone Number', required: true, type: 'tel' },
      ],
      message: { label: 'Your Message', required: true },
      submit: 'SEND REQUEST',
    },
    description: {
      paragraphs: [
        'The PalmSens Educational Kit is designed as the foundation for an electrochemistry course, lab class or similar teaching events.',
      ],
      sections: [
        {
          title: 'Save Time',
          paragraphs: [
            'We know that teaching electrochemistry is the only way to give students the opportunity to discover a passion for that discipline, bring fresh ideas to this field of research and in the end secure the future of this science. Unfortunately educational institutes face more and more challenges these days. Lecturers and professors have to apply for projects and compete for funding, thus having little time left for course preparation. Teachers have to do management tasks and have very little support for implementing new topics into the curriculum.',
          ],
        },
        {
          title: 'Save on Costs',
          paragraphs: [
            'PalmSens BV offers economical potentiostats that show research grade quality and capability. This makes our EmStat Series very suitable for teaching courses. The compact format of the EmStat also allows having multiple workstations even in very confined course rooms.',
            'We combined our potentiostat with the necessary equipment and electrodes for a series of educational electrochemical experiments. To make sure that the instructor and students have the essential theoretical background for the experiments, we deliver a detailed teachers guide and a student manual with the kit. The guide and the manual contain a general introduction to potentiostats, common electrodes and for each experiment a motivation, theoretical background and the instructions for the experiment. This is followed by expected results and additional information.',
          ],
        },
      ],
    },
    tabs: [
      { id: 'contents', label: 'Contents' },
      { id: 'downloads', label: 'Downloads' },
    ],
    body: [
      {
        type: 'contents',
        id: 'contents',
        title: 'Contents',
        intro: 'The Educational Kit includes:',
        items: [
          '20x ItalSens Graphite Sensors',
          '20x ItalSens Sensors for Heavy Metals',
          '26x ItalSens Gold Sensors',
          '1x 2 mm diameter Platinum Working Electrode',
          '1x Ag/AgCl Aqueous Reference Electrode',
          '1x Platinum Wire Counter Electrode',
          '1x Electrode Polishing Kit, teflon cap, stand, clamp, moffel, beaker',
          '1x Teachers guide and Student manual',
          '1x Magnetic stirrer including switchbox',
          '1x Sensor connector for screen printed electrodes',
        ],
      },
      {
        type: 'downloads',
        id: 'downloads',
        title: 'Downloads',
        items: [
          {
            title: 'PSTrace PC software for all single channel instruments',
            detail: 'The software provides support for all techniques and device functionalities.',
            href: 'https://classonesystems.in/wp-content/uploads/2025/08/PalmSens4-Brochure-1-1.pdf',
          },
          {
            title: 'Sample from Teachers Guide to the PalmSens Educational Kit',
            detail: 'Source page download reference.',
            href: '/img/2025-08-PSEduKit-overview.jpg',
          },
        ],
      },
    ],
  },
  corrosionPackage: {
    layout: 'application',
    title: 'EIS PLUS CORROSION PACKAGE',
    summary: 'Create polarization curves, Tafel plots, EIS and more',
    gallery: [
      { src: '/img/2025-08-4-7.png', alt: 'Corrosion package' },
      { src: '/img/2025-08-5-7.png', alt: 'Corrosion cell' },
      { src: '/img/2025-08-6-6.png', alt: 'Corrosion setup' },
      { src: '/img/2025-08-7-5.png', alt: 'Corrosion components' },
    ],
    bullets: [
      'Supports all common corrosion techniques',
      'Includes cell, cables, and handbook',
      'Includes PalmSens4 potentiostat with EIS up to 1 MHz',
    ],
    form: {
      contact: [
        { label: 'Your Name', required: true },
        { label: 'Your Email', required: true, type: 'email' },
        { label: 'Phone Number', required: true, type: 'tel' },
      ],
      message: { label: 'Your Message', required: true },
      submit: 'SEND REQUEST',
    },
    description: {
      paragraphs: [
        'This EIS Plus Corrosion Package includes everything you need to get started with corrosion measurements.',
      ],
      callout: {
        title: 'Electrochemical Impedance Spectroscopy (EIS)',
        text: 'EIS enables the observation of surface property changes, protective oxide uptake in coatings, estimation of delamination area, and prediction of time to failure.',
      },
      list: {
        title: 'STANDARD INCLUDED WITH AN EIS PLUS CORROSION PACKAGE',
        items: [
          'Corrosion Cell',
          'Corrosion Handbook',
          'PalmSens4',
          'Rugged carrying case',
          'High quality, double shielded cell cable with 2 mm banana connectors for Working, Counter, Reference electrode, Sense and Ground',
          'Crocodile clips',
          'USB cable',
          'Manual and Quick Start document',
          'PSTrace software for Windows',
        ],
      },
    },
    tabs: [
      { id: 'techniques', label: 'Techniques' },
      { id: 'specifications', label: 'Specifications' },
      { id: 'software', label: 'Software' },
      { id: 'downloads', label: 'Downloads' },
    ],
    body: [
      {
        type: 'columns',
        id: 'techniques',
        title: 'Techniques',
        groups: [
          {
            title: 'CORROSION TECHNIQUES',
            items: ['Potentiostatic Polarization', 'Galvanostatic Polarization', 'Linear Polarization', 'Cyclic Polarization', 'Corrosion Potential', 'Electrochemical Impedance Spectroscopy (EIS)'],
          },
          {
            title: 'TECHNIQUE AS A FUNCTION OF TIME',
            items: ['Corrosion Potential Measurement', 'Chronoamperometry (CA)', 'Pulsed Amperometric Detection (PAD)', 'Multiple Pulse Amperometry (MPAD)', 'Fast amperometry (FAM)', 'Chronopotentiometry (CP)', 'Multistep Amperometry (MA)', 'Multistep Potentiometry (MP)', 'Mixed Mode (MM)'],
          },
          {
            title: 'VOLTAMMETRIC TECHNIQUES',
            items: ['Linear Sweep Voltammetry (LSV)', 'Cyclic Voltammetry (CV)', 'Differential Pulse Voltammetry (DPV)', 'Square Wave Voltammetry (SWV)', 'Normal Pulse Voltammetry (NPV)', 'AC Voltammetry (ACV)', 'Stripping chronopotentiometry (PSA or SCP)'],
          },
          {
            title: 'IMPEDANCE SPECTROSCOPY / EIS',
            items: ['Potential scan', 'Time scan', 'Fixed potential'],
          },
        ],
        callouts: [
          { title: 'Stripping Modes', text: 'The voltametric and pulsed techniques can all be used in their stripping modes, which are applied for (ultra-) trace analysis.' },
          { title: 'Two Types of Scans', text: 'Scans can be made at a fixed frequency or with a frequency scan.' },
        ],
      },
      {
        type: 'specs',
        id: 'specifications',
        title: 'Specifications',
        groups: [
          { title: 'General', rows: ['dc-potential range: 10 V (or 5 V)', 'compliance voltage: 10 V', 'maximum current: 30 mA (typical)', 'max. acquisition rate: 150,000 data points/s'] },
          { title: 'Potentiostat (controlled potential mode)', rows: ['applied dc-potential resolution', 'applied potential accuracy', 'current ranges', 'current accuracy', 'measured current resolution'] },
          { title: 'Potentiostat (controlled current mode)', rows: ['current ranges', 'applied dc-current range', 'applied dc-current resolution', 'measured dc-potential resolution', 'measured dc-potential accuracy'] },
          { title: 'FRA / EIS (impedance measurement)', rows: ['frequency range: 10 uHz to 1 MHz', 'ac-amplitude range'] },
          { title: 'GEIS (galvanostatic impedance measurement)', rows: ['frequency range', 'ac-amplitude range'] },
          { title: 'Electrometer', rows: ['electrometer amplifier input', 'bandwidth'] },
          { title: 'Other', rows: ['housing', 'weight', 'temperature range', 'power supply', 'communication', 'battery time', 'internal storage space'] },
          { title: 'Auxiliary port (G-Sub 15)', rows: ['analog input', 'analog output', '4 digital outputs', '1 digital input', 'i-out and E-out', 'power'] },
        ],
      },
      {
        type: 'text',
        id: 'software',
        title: 'Software',
        paragraphs: [
          'PSTrace for Windows',
          'PSTrace corrosion mode provides support for all common corrosion techniques and device functionalities.',
          'Functions include Tafel analysis, determine corrosion potential and current, circuit fitting, and determine corrosion rate.',
        ],
      },
      {
        type: 'downloads',
        id: 'downloads',
        title: 'Downloads',
        items: [
          {
            title: 'PalmSens4 Brochure',
            detail: 'Type: Documentation. Last updated: 10-03-25.',
            href: 'https://classonesystems.in/wp-content/uploads/2025/08/PalmSens4-Brochure-1-1.pdf',
          },
        ],
      },
    ],
  },
  event: {
    title: 'EVENT',
    heroImage: imageAssets.eventHero,
    sections: [
      {
        title: 'OUR EXHIBITION AT iSAEST-13, 2025',
        paragraphs: [
          'Dr. (Mrs.) N. Kalaiselvi, Director General of the Council of Scientific and Industrial Research (CSIR), inaugurated our exhibition counter during the 13th International Symposium on Advances in Electrochemical Science and Technology (iSAEST-13), held in Kovalam, Kerala, in 2025.',
          'Director General of CSIR (Council of Scientific & Industrial Research) Dr. (Mrs.) N. Kalaiselvi inaugurating our exhibition counter during iSAEST-13, Kovalam, Kerala in 2025.',
        ],
      },
    ],
    gallery: [
      { src: '/img/2025-07-1-3.png', alt: 'Inauguration at iSAEST-13' },
      { src: '/img/2025-07-2-7.png', alt: 'Award ceremony' },
      { src: '/img/2025-12-classone-nov-4-1024x877.jpeg', alt: 'Exhibition booth' },
      { src: '/img/2025-12-classone-nov4-1-1024x877.jpeg', alt: 'Exhibition stall' },
      { src: '/img/2025-12-classone-nov-2-1024x877.jpeg', alt: 'Event visitors' },
      { src: '/img/2025-12-classone-nov-4-3-1024x576.jpeg', alt: 'Exhibition presentation' },
      { src: '/img/2025-12-classone-nov-4-4-1024x576.jpeg', alt: 'Exhibition team' },
    ],
    flyersTitle: 'Flyers & Announcements',
    flyers: [
      { src: '/img/2025-11-event-image1canva-20th-nov.jpg', alt: 'Announcement flyer one' },
      { src: '/img/2025-11-event-image2-20th-nov-canva-1.jpg', alt: 'Announcement flyer two' },
      { src: '/img/2025-11-event-image3-20th-nov.jpg', alt: 'Announcement flyer three' },
    ],
  },
  enquiry: {
    layout: 'enquiry',
    title: 'ENQUIRY',
    summary: 'Please complete the following enquiry form to help us understand your requirements for the Single Channel Electrochemistry System.',
    mediaSrc: imageAssets.enquiryHero,
    mediaAlt: 'Customer support illustration',
    intro: 'Please complete the following enquiry form to help us understand your requirements for the Single Channel Electrochemistry System. Providing accurate details will allow us to recommend the most suitable configuration, accessories, and pricing for your research or industrial application.',
    formTitle: 'QUESTIONNER OF SINGLE CHANNEL ELECTROCHEMISTRY SYSTEM',
    textFields: [
      { label: 'Name of the Customer' },
      { label: 'Designation' },
      { label: 'Department' },
      { label: 'Organization' },
      { label: 'Funding Agency' },
      { label: 'Contact Number' },
      { label: 'Email ID', type: 'email' },
      { label: 'Application / Research Area', textarea: true },
    ],
    sections: [
      {
        title: 'QUESTIONNER OF SINGLE CHANNEL ELECTROCHEMISTRY SYSTEM',
        groups: [
          {
            title: 'Application Area (select all that apply):',
            items: ['Thin film Coating', 'Electrodepositing / Electroplating', 'Corrosion', 'Paint / Coating', 'Battery/Fuel/Solar cell', 'Super capacitor', 'New materials, Photoelectronic materials', 'Bio Sensing', 'Human Biology / Medical Device', 'Environmental Study', 'Glove Box Application', 'Point of Care / Customized POC Application'],
          },
          {
            title: 'System Specification',
            items: ['Power Booster (-10 A)', 'PC', 'Bluetooth', 'Internal Storage for data saving'],
          },
          {
            title: 'Software Supported Techniques',
            items: ['Voltammetry', 'Pulse Techniques', 'Amperometry', 'Galvanostatic', 'Charging/Discharging', 'Corrosion Test', 'Impedance', 'Equivalent Circuit Fitting'],
          },
          {
            title: 'Accessories & Extensions',
            items: ['Conventional Electrodes', 'Multiplexer (8/16 Channel)', 'Up to 128 Channel', 'Working Electrodes (Gold / Pt / GC)', 'Reference Electrodes (AgCl / SCE / HgO)', 'Counter Electrodes (Pt wire / Pt Disk / Pt Mesh)', 'Quartz Crystal Microbalance (QCM)', 'Bi Potentiostat', 'USB galvanic isolator', 'Differential Electrome...'],
          },
        ],
      },
    ],
    submitLabel: 'SUBMIT',
  },
}

export const batteryApplicationAreas = [
  { title: 'Charge/Discharge Testing', description: 'Analyze battery performance over multiple cycles to assess capacity, efficiency, and degradation behaviour.' },
  { title: 'Impedance Analysis', description: 'Measure internal resistance and electrochemical properties using EIS for performance diagnostics.' },
  { title: 'Material Characterization', description: 'Study electrode and electrolyte materials to optimize battery chemistry and composition.' },
  { title: 'Small Cell Evaluation', description: 'Test coin and pouch cells for voltage, current, and cycle life during early-stage development.' },
  { title: 'Battery Pack Validation', description: 'Ensure safety, consistency, and reliability of assembled battery packs under real-world conditions.' },
  { title: 'Academic & Industrial R&D', description: 'Support innovation in battery technology through flexible testing setups for both teaching and research labs.' },
]

export const batteryInstruments = [
  {
    title: 'CS310M',
    href: 'https://www.corrtestinstruments.com/en/09205.html',
    external: true,
    description: 'Model CS310M Potentiostat with EIS is a widely-used model for corrosion, battery etc thanks to its excellent function as well as cost-effectiveness.',
    image: imageAssets.corrtestCS310M,
  },
  {
    title: 'CS350M',
    href: 'https://www.corrtestinstruments.com/en/08201.html',
    external: true,
    description: 'CS350M is the most advanced single-channel potentiostat with all 40+ techniques: EIS, CV, LSV, GCD, Tafel, OCP, CA, CP, i-v, i-t, E-t, etc.',
    image: imageAssets.corrtestCS350M,
  },
]

export const searchIndex = [
  { title: 'Home', href: '/', group: 'Page', description: 'Homepage with carousel, application areas, products, testimonials, and clients.' },
  { title: 'About Us', href: '/about', group: 'Page', description: 'Director message, mission, vision, expertise, and team.' },
  { title: 'Software', href: '/software', group: 'Page', description: 'Software overview and development tools.' },
  { title: 'Resources', href: '/resources', group: 'Page', description: 'Knowledge base and learning materials.' },
  { title: 'Applications', href: '/applications', group: 'Page', description: 'Application areas and corrosion testing guidance.' },
  { title: 'News', href: '/news', group: 'Page', description: 'Blog and company updates.' },
  { title: 'Contact', href: '/contact', group: 'Page', description: 'Contact details, phone, email, address, and social links.' },
  { title: 'Batteries', href: '/batteries', group: 'Page', description: 'Energy and battery testing overview.' },
  ...productCatalog.map((item) => ({ title: item.title, href: item.aliases[0], group: 'Product', description: item.summary })),
  ...softwareDetailCatalog.map((item) => ({ title: item.title, href: item.aliases[0], group: 'Software', description: item.summary })),
  ...applicationCards.map((item) => ({ title: item.title, href: item.href, group: 'Applications', description: item.description })),
  ...resourceCards.map((item) => ({ title: item.title, href: item.href, group: 'Resources', description: item.description })),
]

export const productCategories = {
  "single-channel-electrochemical": {
    "title": "Single Channel Electrochemical",
    "products": [
      {
        "title": "PalmSens4",
        "href": "/product/palmsens4",
        "image": "/img/2025-07-1-1-300x300.png"
      },
      {
        "title": "EmStat4S",
        "href": "/product/emstat4s",
        "image": "/img/2025-07-2-5-300x300.png"
      },
      {
        "title": "Sensit Wearable",
        "href": "/product/sensit-wearable",
        "image": "/img/2025-07-3-3-300x300.png"
      },
      {
        "title": "EmStat4R",
        "href": "/product/emstat4r",
        "image": "/img/2025-07-5-4-300x300.png"
      },
      {
        "title": "Sensit Smart",
        "href": "/product/sensit-smart",
        "image": "/img/2025-07-7-3-300x300.png"
      },
      {
        "title": "Sensit BT",
        "href": "/product/sensit-bt",
        "image": "/img/2025-07-8-300x300.png"
      },
      {
        "title": "EmStat 4X",
        "href": "/product/emstat-4x",
        "image": "/img/2025-07-9-300x300.png"
      },
      {
        "title": "Spectroelectrochemistry Starter Kit",
        "href": "/product/spectroelectrochemistry-starter-kit",
        "image": "/img/2025-07-10-1-300x300.png"
      },
      {
        "title": "Nexus",
        "href": "/product/nexus",
        "image": "/img/2025-07-Nexus-300x300.jpg"
      },
      {
        "title": "EmStat4T",
        "href": "/product/emstat4t-3",
        "image": "/img/2025-12-EmStat4T-SPE-and-SNS-with-cable-and-sensor-300x300.jpg"
      }
    ]
  },
  "multi-channel-electrochemical": {
    "title": "Multi Channel Electrochemical",
    "products": [
      {
        "title": "EmStat MUX",
        "href": "/product/emstat-mux",
        "image": "/img/2025-07-EmStat4-MUX-sensor-side-300x300.jpg"
      },
      {
        "title": "MultiPalmSens4",
        "href": "/product/multipalmsens4",
        "image": "/img/2025-07-11-300x300.png"
      },
      {
        "title": "MultiEmStat4",
        "href": "/product/multi-emstat4",
        "image": "/img/2025-07-MES4-LR-left-1000px-300x300.jpg"
      }
    ]
  },
  "electrochemical-development-kit": {
    "title": "Electrochemical Development Kit",
    "products": [
      {
        "title": "EmStat Pico Core",
        "href": "/product/emstat-pico-core",
        "image": "/img/2025-07-13-1-300x300.png"
      },
      {
        "title": "EmStat4M Module",
        "href": "/product/emstat4m-module",
        "image": "/img/2025-07-14-300x300.png"
      },
      {
        "title": "EmStat3 Module",
        "href": "/product/emstat3-module",
        "image": "/img/2025-07-15-1-300x300.png"
      },
      {
        "title": "EmStat Pico Development Kit",
        "href": "/product/emstat-pico-development-kit",
        "image": "/img/2025-07-16-300x300.png"
      },
      {
        "title": "OEM EmStat Pico MUX16",
        "href": "/product/oem-emstat-pico-mux16",
        "image": "/img/2025-07-17-1-300x300.png"
      },
      {
        "title": "EmStat4M Development Kit",
        "href": "/product/oem-emstat4m-development-kit",
        "image": "/img/2025-07-18-1-300x300.png"
      },
      {
        "title": "EmStat Go",
        "href": "/product/emstat-go",
        "image": "/img/2025-07-19-300x300.png"
      },
      {
        "title": "OEM Sensit BT",
        "href": "/product/oem-sensit-bt",
        "image": "/img/2025-07-20-300x300.png"
      },
      {
        "title": "Sensit Smart for OEM",
        "href": "/product/oem-sensit-smart",
        "image": "/img/2025-07-21-1-300x300.png"
      },
      {
        "title": "EmStat Pico Module",
        "href": "/product/emstat-pico-module",
        "image": "/img/2025-07-22-300x300.png"
      }
    ]
  },
  "tob": {
    "title": "Tob",
    "products": [
      {
        "title": "Manual Rolling Press Machine 100mm Width",
        "href": "/product/manual-rolling-press-machine-100mm-width",
        "image": "/img/2025-07-Manual-Rolling-Press-Machine-300x300.jpg"
      },
      {
        "title": "Manual Coin Cell Electrode Disc Cutting Machine",
        "href": "/product/manual-coin-cell-electrode-disc-cutting-machine",
        "image": "/img/2025-07-10-4-300x300.png"
      },
      {
        "title": "Hydraulic Manual Coin Cell Crimper",
        "href": "/product/hydraulic-manual-coin-cell-crimper",
        "image": "/img/2025-07-9-3-300x300.png"
      },
      {
        "title": "Semi-Automatic Lithium Battery Winding Machine",
        "href": "/product/semi-automatic-lithium-battery-winding-machine",
        "image": "/img/2025-07-8-4-300x300.png"
      },
      {
        "title": "TOB Pouch Cell Hot and Cold Press Machine",
        "href": "/product/tob-pouch-cell-hot-and-cold-press-machine",
        "image": "/img/2025-07-7-8-300x300.png"
      },
      {
        "title": "Calendering Machine For Sodium-Ion Battery Electrode",
        "href": "/product/calendering-machine-for-sodium-ion-battery-electrode",
        "image": "/img/2025-07-5-9-300x300.png"
      },
      {
        "title": "Sodium Ion Battery Electrode Cutting Machine",
        "href": "/product/sodium-ion-battery-electrode-cutting-machine",
        "image": "/img/2025-07-6-6-300x300.png"
      },
      {
        "title": "TOB Solid State Battery Split Cell Test Kit",
        "href": "/product/tob-solid-state-battery-split-cell-test-kit",
        "image": "/img/2025-07-4-8-300x300.png"
      },
      {
        "title": "5V50mA Coin Cell Battery Test Equipment",
        "href": "/product/5v50ma-coin-cell-battery-test-equipment",
        "image": "/img/2025-07-5V50mA-Coin-Cell-Battery-Test-Equipment-300x300.jpg"
      },
      {
        "title": "Temperature Control System for Battery Testing",
        "href": "/product/temperature-control-system-for-battery-testing",
        "image": "/img/2025-07-2-11-300x300.png"
      },
      {
        "title": "Single Workstation Lab Equipment Glove Box",
        "href": "/product/single-workstation-lab-equipment-glove-box",
        "image": "/img/2025-07-3-8-300x300.png"
      },
      {
        "title": "High Speed Planetary Ball Mill",
        "href": "/product/high-speed-planetary-ball-mill",
        "image": "/img/2025-07-1-7-300x300.png"
      }
    ]
  },
  "nano-technology": {
    "title": "Nano Technology",
    "products": [
      {
        "title": "RF Plasma Generator",
        "href": "/product/rf-plasma-generator",
        "image": "/img/2025-07-RF-Plasma-Generator-1-300x300.jpg"
      },
      {
        "title": "Desktop Sputter & Carbon Coater",
        "href": "/product/desktop-sputter-carbon-coater",
        "image": "/img/2025-07-48-300x300.png"
      },
      {
        "title": "Sputtering & Thermal Evaporation Coater",
        "href": "/product/sputtering-thermal-evaporation-coater",
        "image": "/img/2025-07-Sputtering-Thermal-Evaporation-Coater-300x300.jpg"
      },
      {
        "title": "Pulsed Laser Deposition System",
        "href": "/product/pulsed-laser-deposition-system",
        "image": "/img/2025-07-48-300x300.png"
      },
      {
        "title": "Quartz Crystal Microbalance",
        "href": "/product/quartz-crystal-microbalance",
        "image": "/img/2025-07-52-300x300.png"
      }
    ]
  },
  "electrodes": {
    "title": "Electrodes",
    "products": [
      {
        "title": "Platinum Gauze Electrode",
        "href": "/product/platinum-gauze-electrode",
        "image": "/img/2025-08-1-300x300.png"
      },
      {
        "title": "Graphite Counter Electrode",
        "href": "/product/graphite-counter-electrode",
        "image": "/img/2025-08-5-300x300.png"
      },
      {
        "title": "Helix Platinum Wire Electrode",
        "href": "/product/helix-platinum-wire-electrode",
        "image": "/img/2025-08-2-300x300.png"
      },
      {
        "title": "Platinum Mesh Electrode",
        "href": "/product/platinum-mesh-electrode",
        "image": "/img/2025-08-4-300x300.png"
      },
      {
        "title": "Platinum Wire Electrode",
        "href": "/product/platinum-wire-electrode",
        "image": "/img/2025-08-3-300x300.png"
      },
      {
        "title": "L Type Glassy Carbon Electrode Clamp",
        "href": "/product/l-type-glassy-carbon-electrode-clamp",
        "image": "/img/2025-08-L-Type-Glassy-Carbon-Electrode-Clamp-300x300.png"
      },
      {
        "title": "Gold Specimen Clamp",
        "href": "/product/gold-specimen-clamp",
        "image": "/img/2025-08-7-4-300x300.png"
      },
      {
        "title": "Stainless steel Specimen Clamp",
        "href": "/product/stainless-steel-specimen-clamp",
        "image": "/img/2025-08-Stainless-steel-Specimen-Clamp-300x300.jpg"
      },
      {
        "title": "Graphite Specimen Clamp",
        "href": "/product/graphite-specimen-clamp",
        "image": "/img/2025-08-2-6-300x300.png"
      },
      {
        "title": "Glassy Carbon Specimen Clamp",
        "href": "/product/glassy-carbon-specimen-clamp",
        "image": "/img/2025-08-Glassy-Carbon-Specimen-Clamp-300x300.jpg"
      },
      {
        "title": "Platinum Specimen clamp",
        "href": "/product/platinum-specimen-clamp",
        "image": "/img/2025-08-7-4-300x300.png"
      },
      {
        "title": "Specimen holder",
        "href": "/product/specimen-holder",
        "image": "/img/2025-08-Specimen-holder-300x300.jpg"
      },
      {
        "title": "Electrode Polishing Kit",
        "href": "/product/electrode-polishing-kit-2",
        "image": "/img/2025-08-Electrode-Polishing-Kit-300x300.jpeg"
      },
      {
        "title": "MEA cell",
        "href": "/product/mea-cell",
        "image": "/img/2025-08-MEA-cell-300x300.jpeg"
      },
      {
        "title": "MEA Cell",
        "href": "/product/mea-cell-2",
        "image": "/img/2025-08-13-1-300x300.png"
      },
      {
        "title": "Hg/HgO Reference Electrode",
        "href": "/product/hg-hgo-reference-electrode",
        "image": "/img/2025-07-Hg-HgO-Reference-Electrode-300x300.jpg"
      },
      {
        "title": "Hg/Hg2SO4 Reference Electrode",
        "href": "/product/hg-hg2so4-reference-electrode",
        "image": "/img/2025-07-Hg-Hg2SO4-Reference-Electrode-300x300.jpg"
      },
      {
        "title": "Reversible Hydrogen Electrode",
        "href": "/product/reversible-hydrogen-electrode",
        "image": "/img/2025-07-Reversible-Hydrogen-Electrode-300x300.jpg"
      },
      {
        "title": "Non-aqueous Ag/Ag+ Reference Electrode",
        "href": "/product/non-aqueous-ag-ag-reference-electrode-2",
        "image": "/img/2025-07-Non-aqueous-Ag-Ag-Reference-Electrode-300x300.jpg"
      },
      {
        "title": "Double Salt Bridge Saturated Calomel Electrode",
        "href": "/product/double-salt-bridge-saturated-calomel-electrode",
        "image": "/img/2025-07-4-7-300x300.png"
      },
      {
        "title": "Saturated Calomel Electrode",
        "href": "/product/saturated-calomel-electrode-2",
        "image": "/img/2025-07-Saturated-Calomel-Electrode-300x300.jpg"
      },
      {
        "title": "Ag/AgCl Reference Electrode",
        "href": "/product/ag-agcl-reference-electrode-2",
        "image": "/img/2025-07-1-6-300x300.png"
      },
      {
        "title": "Platinum Plate Working Electrode",
        "href": "/product/platinum-plate-working-electrode",
        "image": "/img/2025-07-Platinum-Plate-Working-Electrode-300x300.jpg"
      },
      {
        "title": "L Type Glassy Carbon Working Electrode",
        "href": "/product/l-type-glassy-carbon-working-electrode",
        "image": "/img/2025-07-L-Type-Glassy-Carbon-Working-Electrode-300x300.jpg"
      },
      {
        "title": "Carbon Paste Electrode",
        "href": "/product/carbon-paste-electrode",
        "image": "/img/2025-07-Carbon-Paste-Electrode-300x300.jpg"
      },
      {
        "title": "Platinum Working Electrode",
        "href": "/product/platinum-working-electrode-2",
        "image": "/img/2025-07-1-5-300x300.png"
      },
      {
        "title": "Glassy Carbon Working Electrode",
        "href": "/product/glassy-carbon-working-electrode-2",
        "image": "/img/2025-07-1-5-300x300.png"
      },
      {
        "title": "Silver Working Electrode",
        "href": "/product/silver-working-electrode",
        "image": "/img/2025-07-1-5-300x300.png"
      },
      {
        "title": "Aluminum Working Electrode",
        "href": "/product/aluminum-working-electrode",
        "image": "/img/2025-07-1-5-300x300.png"
      },
      {
        "title": "Copper Working Electrode",
        "href": "/product/copper-working-electrode",
        "image": "/img/2025-07-1-5-300x300.png"
      },
      {
        "title": "Titanium Working Electrode",
        "href": "/product/titanium-working-electrode",
        "image": "/img/2025-07-1-5-300x300.png"
      },
      {
        "title": "Gold Working Electrode",
        "href": "/product/gold-working-electrode-2",
        "image": "/img/2025-07-1-5-300x300.png"
      }
    ]
  },
  "corrtest": {
    "title": "Corrtest",
    "products": [
      {
        "title": "Single-channel potentiostat galvanostat",
        "href": "https://www.corrtestinstruments.com/en/03200.html",
        "external": true,
        "description": "Corrtest brand Single-channel potentiostat/galvanostat.",
        "image": null
      },
      {
        "title": "CS350M Potentiostat/Galvanostat",
        "href": "https://www.corrtestinstruments.com/en/08201.html",
        "external": true,
        "description": "CS350M is the most advanced single-channel potentiostat with all 40+ techniques: EIS, CV, LSV, GCD, Tafel, OCP, CA, CP, i-v, i-t, E-t, etc.",
        "image": null
      },
      {
        "title": "CS350Pro Potentiostat /Galvanostat/ EIS(5MHz)",
        "href": "https://www.corrtestinstruments.com/en/09460.html",
        "external": true,
        "description": "CS350Pro is an upgraded version of the CS350M single-channel electrochemical workstation. EIS frequency can be as high as 5MHz.",
        "image": null
      },
      {
        "title": "CS1350Pro Potentiostat /Galvanostat/EIS (5A)",
        "href": "https://www.corrtestinstruments.com/en/09461.html",
        "external": true,
        "description": "CS1350 pro is an upgraded version of the conventional single-channel electrochemical workstation CS350M. Maximum current can be as high as 5A (without any booster).",
        "image": null
      },
      {
        "title": "CS310M Potentiostat/Galvanostat with EIS",
        "href": "https://www.corrtestinstruments.com/en/09205.html",
        "external": true,
        "description": "Model CS310M Potentiostat with EIS is a widely-used model for corrosion, battery etc thanks to its excellent function as well as cost-effectiveness.",
        "image": null
      },
      {
        "title": "CS2350M Bipotentiostat(2-channel, with EIS)",
        "href": "https://www.corrtestinstruments.com/en/08202.html",
        "external": true,
        "description": "2-Channel potentiostat with EIS in each channel",
        "image": null
      },
      {
        "title": "CS2150M Bipotentiostat (2-channel,without EIS)",
        "href": "https://www.corrtestinstruments.com/en/09206.html",
        "external": true,
        "description": "2-channel potentiostat without EIS.",
        "image": null
      },
      {
        "title": "CS300M Potentiostat/Galvanostat(without EIS)",
        "href": "https://www.corrtestinstruments.com/en/09204.html",
        "external": true,
        "description": "CS300M Potentiostat includes all the techniques for voltammetry",
        "image": null
      },
      {
        "title": "Portable potentiostat/galvanostat/EIS CS100ME",
        "href": "https://www.corrtestinstruments.com/en/09462.html",
        "external": true,
        "description": "CS100ME supports full electrochemical methods. It has built-in chargeable li-ion battery and Bluetooth communication, ideal for field test, sensor application.",
        "image": null
      }
    ]
  },
  "glass-cell": {
    "title": "Glass Cell",
    "products": []
  }
}
export const softwareDetails = {
  'ps-trace': {
    eyebrow: 'SOFTWARE',
    title: 'PSTrace for Windows',
    description: 'PSTrace software is shipped as standard with all single channel and multiplexed instruments. The software provides support for all techniques and device functionalities.',
    button: 'Download',
    heroImage: '/img/sw-hero-sofware-pstrace.png',
    cards: [
      { title: 'Easy and Versatile', text: 'Dedicated modes make PSTrace easy to use. The Scientific mode allows you to run all the techniques our instruments have to offer, whereas the Corrosion and Analytical modes provide a specific set of techniques and tools.' },
      { title: 'Advanced Electrochemistry', text: 'Create a complex series of experiments using the Scripting window. The Scripting window allows for automated batch measurements and analysis.' },
      { title: 'One-click Export to Excel', text: 'If you feel more comfortable using your own spreadsheets, use the one-click export to Excel. Or export your data to Origin or Matlab.' },
    ],
    sections: [
      { title: 'Easy and Versatile', paragraphs: ['PSTrace is designed to be productive immediately after installation, without going through a long learning period. It has three modes; the Scientific mode which allows you to run all the techniques our instruments have to offer, the Corrosion mode which provides a specific set of corrosion techniques and tools, and the Analytical mode for a specific set of techniques and tools. Making it easy for a beginner to quickly pick a technique and start a measurement. For those who want more, the Advanced PSTrace mode gives a user full control over their measurements.', 'Picking a tip for a single measurement does not cover complex experiments without repeating the setup manually. In PSTrace you can batch measurements and analysis. The interactive scripting window allows you to define the order and timing of measurements, making it easy to automate measurements.'], image: '/img/palmsens-2021-11-PSTrace5-overview.png' },
      { title: 'Setting up your Measurement', paragraphs: ['The method editor provides instant feedback on parameters that are either invalid or do not match the instruments capabilities:'], image: '/img/palmsens-2016-11-method-editor-small.gif' },
      { title: 'Measurement Data', paragraphs: ['All measurement data and curves are stored in a single .pssession file. Peaks are detected automatically or can be marked by hand. Exporting data to Excel including generation of a native Excel graph is a matter of a single click.'], image: '/img/palmsens-2016-11-load-data-cv-export-excel3.gif' },
    ],
  },
  'multitrace-2': {
    eyebrow: 'SOFTWARE',
    title: 'MultiTrace for Windows',
    description: 'The MultiTrace software controls the individual channels of our multi-channel instruments and the individual working electrodes of polypotentiostats.',
    button: 'Download',
    heroImage: '/img/sw-hero-sofware-pstrace.png',
    cards: [
      { title: 'Individual Mode', text: 'All potentiostats are used independently. Measurements can be started on all channels with one click, or on each channel individually. Each measured curve is shown in its own plot.' },
      { title: 'Simultaneous Mode', text: 'In the Simultaneous mode, all channels run the same measurement. The measured curves are displayed in a single plot and are stored in a single data file.' },
      { title: 'Scripting', text: 'In the Individual mode of MultiTrace you can create automated complex experiments for each separate channel. In the scripting window you can easily arrange your building blocks for automated experiments.' },
    ],
    sections: [
      { title: 'Individual Mode', paragraphs: ['All potentiostats are used independently. Measurements can be started on all channels with one click, or on each channel individually. Each measured curve is shown in its own plot. Data acquired by the individual channels is saved in separate files. A timer can be set to apply a waiting time between multiple measurements on the same channel.'], image: '/img/palmsens-2021-03-MultiTrace-Indiv-Mode-optimized.gif' },
      { title: 'Simultaneous Mode', paragraphs: ['In the Simultaneous mode, all channels run the same measurement. The measured curves are displayed in a single plot and are stored in a single data file.'], image: '/img/palmsens-2016-12-MultiTrace4-1SimulMode-screenshot.jpg' },
      { title: 'Scripting', paragraphs: ['In the Individual mode of MultiTrace you can create automated complex experiments for each separate channel. In the scripting window you can easily arrange your building blocks for automated experiments, and then run them all from the multichannel interface. It also allows for extended measurements and long-term automated protocols using multiple datasets from different channels.'], image: '/img/palmsens-2021-03-Scripting-with-PS4-optimized.gif' },
      { title: 'Combining Multi- and Single Channel Instruments', paragraphs: ['MultiTrace also allows you to combine different multi-channel or single-channel potentiostats. Each single instrument can be assigned with a channel number. The instruments can be grouped and controlled together or they can be used individually. MultiChannelPalmSens software makes it possible to work together with all these instruments.'], image: '/img/palmsens-2021-03-combine-single-multichannels.png' },
      { title: 'Tutorial Videos', paragraphs: ['MultiTrace allows you to control multiple PalmSens potentiostats / galvanostats / impedance analyzers. This can be a multichannel device such as the MultiPalmSens4 or the Multi EmStat4, or this can be multiple individual instruments. Find out more in our tutorial videos.'] },
      { title: 'Minimum System Requirements', paragraphs: ['Windows 7 SP1, 8, 10 or 11', '1 GHz or faster 32-bit (x86) or 64-bit (x64) processor with at least 2 processor cores (4 or more cores recommended)', '2 GB RAM (32-bit) or 4 GB RAM (64-bit)', '.NET 4.7.2 framework', '1280 × 768 screen resolution'] },
    ],
  },
  'pstouch-2': {
    eyebrow: 'SOFTWARE',
    title: 'PStouch for Android',
    description: 'PStouch is a free app for Android devices that can be used with PalmSens, Sensit and EmStat potentiostats. PStouch works with your potentiostat via USB or via Bluetooth.',
    button: 'Download',
    heroImage: '/img/palmsens-2023-04-pstouch.png',
    features: {
      eyebrow: 'Features',
      title: 'PStouch contains the following features',
      items: [
        'Setting up and running measurements',
        'Loading and saving measured curves',
        'Analysing and manipulating peaks',
        'Sharing data directly via e-mail, Dropbox, or any other file sharing service',
        'Support for PalmSens accessories such as a multiplexer, stirrer or bipot',
      ],
      note: 'All method and curve files are fully compatible with our PSTrace software for Windows. The power provided by the USB is sufficient to power an EmStat or Sensit Smart. This way it is possible to carry an electrochemical lab with you that weighs 50g (Samsung Galaxy S9 with Sensit Smart).',
      image: '/img/palmsens-2020-04-pstouch-screens-2020-1-400x400.jpg',
    },
    techniques: {
      eyebrow: 'Available techniques',
      title: 'The following techniques are supported by PStouch',
      groups: [
        {
          heading: 'Voltammetric techniques:',
          items: ['Linear sweep voltammetry (LSV)', 'Differential pulse voltammetry (DPV)', 'Square wave voltammetry (SWV)', 'Normal pulse voltammetry (NPV)', 'AC voltammetry (ACV)', 'Cyclic voltammetry (CV)', 'Chronopotentiometric stripping (SCP/PSA)'],
        },
        {
          heading: 'Technique as a function of time:',
          items: ['Chronoamperometry (CA)', 'Pulsed amperometric detection (PAD)', 'Multiple pulse amperometry (MPAD)', 'Fast amperometry (FAmp)', 'Potentiometry (POT)', 'Open circuit potentiometry (OCP)', 'Multistep potentiometry (MS)'],
        },
        {
          heading: 'Impedance spectroscopy / EIS:',
          items: ['Potential scan', 'Time scan', 'Scans can be made at a fixed frequency or with a frequency scan.', 'Fixed potential'],
        },
      ],
    },
    sections: [
      { title: 'Sharing Measurement Results', paragraphs: ['Perform measurements in the field and share data immediately with colleagues in the lab. Data can be stored locally, of course, but PStouch offers share functions to send your data with your email applications to any place you need it. Also the dropbox app, google drive or any other app supporting sharing functionalities is supported by PStouch. So directly after your measurement, your data is safe and backed up before you are back in the lab.'], image: '/img/palmsens-2020-04-pstouch-share-400x400.jpg' },
      { title: 'Data Processing', paragraphs: ['PStouch offers you the basic tools to analyse your data. You can look at single points or have automatic peak detection. Detected peaks are analysed for their potential, peak current, peak height, width and area. A survey of the parameters for all peaks is available with one touch.', 'PStouch saves the data in same format as our windows software PSTrace does. Accordingly all data recorded with PStouch can directly be opened with PSTrace without any conversion.'], image: '/img/palmsens-2020-04-pstouch-peak-heights-400x400.jpg' },
    ],
  },
  'pstrace-xpress-2': {
    eyebrow: 'SOFTWARE',
    title: 'PSTrace Xpress',
    description: 'With the new PSTrace Xpress you can control single and multi-channel instruments. An Open Beta is now available for all PalmSens users. Install PSTrace Xpress directly from the Microsoft Store.',
    button: 'Download',
    heroImage: '/img/palmsens-2023-10-PSTraceExpress-on-notebook-copy-590x331.png',
    cards: [
      { title: 'Get a grip on your measurement data with MyPalmSens', text: 'Account creation enables automatic transfer of measurement data to MyPalmSens Projects, streamlining data organization and colleague collaboration.' },
      { title: 'For single and multi-channel', text: 'A single control panel manages both single and multi-channel instruments with grouping capabilities, allowing simultaneous operation of various instrument combinations.' },
      { title: 'Working with Workspaces', text: 'PSTrace Xpress is built for productivity, designed to handle extensive data generation during numerous measurements.' },
    ],
    sections: [
      { title: 'Working with Multiple Instruments', paragraphs: ['To get a grip on your measurement data with MyPalmSens, create a MyPalmSens account via Microsoft, Google, Dropbox, or email/password. The project-based autosave and sharing capabilities allow you to keep all the data from your project in MyPalmSens Projects, share and access data from different locations and collaborate easily with colleagues.'], image: '/img/palmsens-2023-10-PSTraceXpress-Instruments.gif' },
      { title: 'Seamless MyPalmSens Integration', paragraphs: ['Creating a MyPalmSens account is a simple process that offers multiple authentication options. Once complete you can use a traditional email address and password combination, or you can link it with an existing Microsoft, Google or Dropbox account for easy single-sign-on. After creating an account you can start using PSTrace Xpress to save measurement data directly to MyPalmSens Projects, share with colleagues, enabling them to view, edit, or add their own data and thus creating a seamless collaboration experience.'], image: '/img/palmsens-2023-10-PSTraceXpress-MyPS-1000px.gif' },
      { title: 'Using Workspaces', paragraphs: ['Workspaces are essentially a display area that offers multiple instances of PSTrace Xpress for any working environment to stay in. You can have a separate workspace for each of your research topics. Clicking a workspace shows the latest view you had there. This way you can easily switch between your projects, without the need of opening and closing files.'], image: '/img/palmsens-2023-10-PSTX-workspaces.gif' },
      { title: 'Minimum System Requirements', paragraphs: ['Windows 10 or 11', '1 GHz 64-bit processor', '4 GB RAM', '1366 × 768 minimum display resolution'] },
    ],
  },
}

export const batteryHero = {
  title: 'CS350M',
  description: 'Model CS350M single-channel potentiostat/galvanostat consists of a DDS arbitrary function generator, a potentiostat/galvanostat and an FRA. With the help of built-in dual 24-bit Delta-sigma AD converters, it achieves excellent stability and high potential and current resolutions.',
  cta: 'View Details',
  href: 'https://www.corrtestinstruments.com/en/08201.html',
  external: true,
  image: imageAssets.batteryHeroDevice,
}

export const batteryHeroSlides = [
  {
    title: 'CS350M',
    description: 'Model CS350M single-channel potentiostat/galvanostat consists of a DDS arbitrary function generator, a potentiostat/galvanostat and an FRA. With the help of built-in dual 24-bit Delta-sigma AD converters, it achieves excellent stability and high potential and current resolutions.',
    cta: 'View Details',
    href: 'https://www.corrtestinstruments.com/en/08201.html',
    external: true,
    image: imageAssets.batteryHeroDevice,
  },
  {
    title: 'CS310M',
    description: 'Model CS310M Potentiostat with EIS is a widely-used model for corrosion, battery etc thanks to its excellent function as well as cost-effectiveness. It delivers reliable performance for both research and routine testing.',
    cta: 'View Details',
    href: 'https://www.corrtestinstruments.com/en/09205.html',
    external: true,
    image: imageAssets.corrtestCS310M,
  },
]

export const batteryTabs = [
  {
    label: 'CORRTEST',
    products: [
      { title: 'CS310M', description: 'Model CS310M Potentiostat with EIS is a widely-used model for corrosion, battery etc thanks to its excellent function as well as cost-effectiveness.', image: imageAssets.corrtestCS310M, href: 'https://www.corrtestinstruments.com/en/09205.html', external: true },
      { title: 'CS350M', description: 'CS350M is the most advanced single-channel potentiostat with all 40+techniques: EIS, CV, LSV, GCD, Tafel, OCP, CA, CP, i-v, i-t, E-t, etc.', image: imageAssets.corrtestCS350M, href: 'https://www.corrtestinstruments.com/en/08201.html', external: true },
    ],
  },
  {
    label: 'TOB',
    products: productCategories.tob.products,
  },
]
