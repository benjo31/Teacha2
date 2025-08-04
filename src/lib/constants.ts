export const getTeachingLevels = (t: (key: string) => string) => [
  t('constants.teachingLevels.kindergarten'),
  t('constants.teachingLevels.primary'),
  t('constants.teachingLevels.secondary1'),
  t('constants.teachingLevels.secondary2'),
  t('constants.teachingLevels.tertiary')
] as const

// Keep static version for compatibility
export const TEACHING_LEVELS = [
  'École enfantine',
  'Primaire',
  'Secondaire I',
  'Secondaire II',
  'Tertiaire'
] as const

export const getSubjects = (t: (key: string) => string) => [
  // Langues
  t('constants.subjects.french'),
  t('constants.subjects.german'),
  t('constants.subjects.english'),
  t('constants.subjects.italian'),
  t('constants.subjects.latin'),
  t('constants.subjects.greek'),
  t('constants.subjects.spanish'),

  // Sciences
  t('constants.subjects.mathematics'),
  t('constants.subjects.naturalSciences'),
  t('constants.subjects.biology'),
  t('constants.subjects.physics'),
  t('constants.subjects.chemistry'),
  t('constants.subjects.computerScience'),

  // Sciences humaines et sociales
  t('constants.subjects.history'),
  t('constants.subjects.geography'),
  t('constants.subjects.citizenship'),
  t('constants.subjects.philosophy'),
  t('constants.subjects.economics'),
  t('constants.subjects.law'),
  t('constants.subjects.psychology'),
  t('constants.subjects.pedagogy'),

  // Arts et activités créatrices
  t('constants.subjects.visualArts'),
  t('constants.subjects.music'),
  t('constants.subjects.manualCreativeActivities'),
  t('constants.subjects.textileCreativeActivities'),

  // Sport et santé
  t('constants.subjects.physicalEducation'),
  t('constants.subjects.healthEducation'),

  // Formation générale
  t('constants.subjects.mitic'),
  t('constants.subjects.generalCulture'),

  // Branches professionnelles
  t('constants.subjects.accounting'),
  t('constants.subjects.marketing'),
  t('constants.subjects.businessManagement'),
  t('constants.subjects.technicalSciences'),
  t('constants.subjects.technicalDrawing'),

  // Branches tertiaires spécialisées
  t('constants.subjects.medicine'),
  t('constants.subjects.nursing'),
  t('constants.subjects.architecture'),
  t('constants.subjects.engineering'),
  t('constants.subjects.communication'),
  t('constants.subjects.journalism'),
  t('constants.subjects.design')
].sort() as const

// Keep static version for compatibility
export const SUBJECTS = [
  // Langues
  'Français',
  'Allemand',
  'Anglais',
  'Italien',
  'Latin',
  'Grec',
  'Espagnol',

  // Sciences
  'Mathématiques',
  'Sciences de la nature',
  'Biologie',
  'Physique',
  'Chimie',
  'Informatique',

  // Sciences humaines et sociales
  'Histoire',
  'Géographie',
  'Citoyenneté',
  'Philosophie',
  'Économie',
  'Droit',
  'Psychologie',
  'Pédagogie',

  // Arts et activités créatrices
  'Arts visuels',
  'Musique',
  'Activités créatrices manuelles',
  'Activités créatrices textiles',

  // Sport et santé
  'Éducation physique',
  'Éducation à la santé',

  // Formation générale
  'MITIC',
  'Culture générale',

  // Branches professionnelles
  'Comptabilité',
  'Marketing',
  'Gestion d\'entreprise',
  'Sciences techniques',
  'Dessin technique',

  // Branches tertiaires spécialisées
  'Médecine',
  'Soins infirmiers', 
  'Architecture',
  'Ingénierie',
  'Communication',
  'Journalisme',
  'Design'
].sort() as const

export const getCantons = (t: (key: string) => string) => [
  t('constants.cantons.aargau'),
  t('constants.cantons.appenzellOuterrhoden'),
  t('constants.cantons.appenzellInnerrhoden'),
  t('constants.cantons.baselLandschaft'),
  t('constants.cantons.baselStadt'),
  t('constants.cantons.bern'),
  t('constants.cantons.fribourg'),
  t('constants.cantons.geneva'),
  t('constants.cantons.glarus'),
  t('constants.cantons.graubunden'),
  t('constants.cantons.jura'),
  t('constants.cantons.lucerne'),
  t('constants.cantons.neuchatel'),
  t('constants.cantons.nidwalden'),
  t('constants.cantons.obwalden'),
  t('constants.cantons.stGallen'),
  t('constants.cantons.schaffhausen'),
  t('constants.cantons.schwyz'),
  t('constants.cantons.solothurn'),
  t('constants.cantons.ticino'),
  t('constants.cantons.thurgau'),
  t('constants.cantons.uri'),
  t('constants.cantons.valais'),
  t('constants.cantons.vaud'),
  t('constants.cantons.zug'),
  t('constants.cantons.zurich')
] as const

// Keep static version for compatibility
export const CANTONS = [
  'Argovie',
  'Appenzell Rhodes-Extérieures',
  'Appenzell Rhodes-Intérieures',
  'Bâle-Campagne',
  'Bâle-Ville',
  'Berne',
  'Fribourg',
  'Genève',
  'Glaris',
  'Grisons',
  'Jura',
  'Lucerne',
  'Neuchâtel',
  'Nidwald',
  'Obwald',
  'Saint-Gall',
  'Schaffhouse',
  'Schwytz',
  'Soleure',
  'Tessin',
  'Thurgovie',
  'Uri',
  'Valais',
  'Vaud',
  'Zoug',
  'Zurich'
] as const

export const getSpecialClasses = (t: (key: string) => string) => [
  t('constants.specialClasses.welcomeClass'),
  t('constants.specialClasses.developmentClass'),
  t('constants.specialClasses.reducedSizeClass'),
  t('constants.specialClasses.supportClass'),
  t('constants.specialClasses.mcdi'),
  t('constants.specialClasses.relayClass')
] as const

// Keep static version for compatibility
export const SPECIAL_CLASSES = [
  'Classe d\'accueil',
  'Classe de développement',
  'Classe à effectif réduit',
  'Classe de soutien',
  'MCDI (Maître de classe de développement itinérant)',
  'Classe relais'
] as const

export const getCivility = (t: (key: string) => string) => [
  t('constants.civility.mr'),
  t('constants.civility.mrs'),
  t('constants.civility.neutral'),
  t('constants.civility.unspecified')
] as const

// Keep static version for compatibility
export const CIVILITY = [
  'Monsieur',
  'Madame',
  'Neutre',
  'Non spécifié'
] as const

export const getNativeLanguages = (t: (key: string) => string) => [
  t('constants.nativeLanguages.french'),
  t('constants.nativeLanguages.german'),
  t('constants.nativeLanguages.italian')
] as const

// Keep static version for compatibility
export const NATIVE_LANGUAGES = [
  'Français',
  'Allemand',
  'Italien'
] as const