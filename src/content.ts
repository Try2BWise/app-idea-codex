import type { Copy, Language } from './types';

export const toothLabels = [
  'Top right back',
  'Top right middle',
  'Top front right',
  'Top front left',
  'Top left middle',
  'Top left back',
  'Bottom left back',
  'Bottom left middle',
  'Bottom front left',
  'Bottom front right',
  'Bottom right middle',
  'Bottom right back',
];

export const copyByLanguage: Record<Language, Copy> = {
  en: {
    appName: 'SmileSteps',
    tagline: 'Healthy smile habits for kids, teens, and parents.',
    heroTitle: 'Small routines, stronger smiles',
    heroBody:
      'SmileSteps is a local-first proof of concept for pediatric dental and orthodontic routines. Everything here stays on this device unless you choose otherwise in a future version.',
    createProfile: 'Create profile',
    languageLabel: 'App language',
    parentView: 'Parent view',
    childView: 'Kid view',
    tabs: {
      home: 'Home',
      brushing: 'Brush',
      teeth: 'Teeth',
      ortho: 'Ortho',
      learn: 'Learn',
      parent: 'Parent',
    },
    home: {
      welcome: 'Today is a great day to take care of your smile.',
      dailyPlan: 'Pick one small win: brush, log a tooth update, track aligner time, or learn something new.',
      startHereTitle: 'Start here',
      startHereBody: 'This demo works best like a mobile app. Pick a profile, choose one quick task, and move through the tabs at the bottom.',
      nextSteps: ['Brush for 2 minutes.', 'Update a tooth milestone.', 'Track aligner time.', 'Learn one new tool.'],
      onboardingTitle: 'Welcome to SmileSteps',
      onboardingBody: 'This is a calm, kid-friendly place for brushing habits, tooth milestones, and orthodontic routines.',
      onboardingPoints: [
        'Choose a kid or teen profile.',
        'Use the brush screen for a guided 2-minute routine.',
        'Tap through teeth, ortho, and learn at your own pace.',
      ],
      onboardingButton: 'Let’s begin',
      timerCard: 'Start a 2-minute brushing session with upbeat coaching.',
      toothCard: 'Track baby teeth, permanent teeth, and fun smile milestones.',
      orthoCard: 'Keep aligner routines steady with simple reminders and progress.',
      learnCard: 'Explore calm, kid-friendly explainers about common dental tools.',
    },
    brushing: {
      title: '2-minute brushing timer',
      body: 'Move slowly, switch sides when prompted, and aim for gentle circles.',
      start: 'Start timer',
      reset: 'Reset',
      pause: 'Pause',
      resume: 'Resume',
      finished: 'Nice work. Two minutes complete.',
      encouragement: ['Tiny circles.', 'Front teeth time.', 'Chewing surfaces next.', 'Almost there.', 'Sparkly finish.'],
      quadrants: ['Top right', 'Top left', 'Bottom left', 'Bottom right'],
      helperFinished: 'You finished every section of your smile.',
      helperPrefix: 'Focus on',
      helperSuffix: 'with gentle circles.',
    },
    teeth: {
      title: 'Tooth tracker',
      body: 'Tap a spot to mark a baby tooth that has wiggled out or to clear it again.',
      hint: 'This tracker is for family education only and does not give medical advice.',
      labels: toothLabels,
    },
    ortho: {
      title: 'Orthodontic habits',
      body: 'Track aligner hours and keep tray changes from sneaking up on you.',
      goal: 'Goal hours today',
      nextChange: 'Next tray change',
      comfortTitle: 'Comfort tips',
      comfortTips: [
        'Use a fresh case so aligners stay clean.',
        'Cold water can feel soothing after a tray change.',
        'Take aligners out before meals unless your orthodontist says otherwise.',
        'If something feels sharp or unusual, contact your orthodontic team.',
      ],
      addHour: '+1 hour',
      subtractHour: '-1 hour',
    },
    learn: {
      title: 'Meet the tools',
      body: 'Short explainers can make a dental visit feel more predictable and less stressful. These are learning notes, not medical advice.',
      cards: [
        {
          title: 'Mirror',
          tag: 'Dental tool',
          body: 'A tiny mirror helps the dentist peek around corners and shine light where it is hard to see.',
          art: '/art/mirror.svg'
        },
        {
          title: 'Suction straw',
          tag: 'Dental tool',
          body: 'The suction straw is like a little vacuum for water, so it is easier to stay comfortable during a visit.',
          art: '/art/suction.svg'
        },
        {
          title: 'Explorer',
          tag: 'Dental tool',
          body: 'The explorer is a checking tool. It helps the dentist feel the tooth surface and look for spots that need attention.',
          art: '/art/explorer.svg'
        },
        {
          title: 'Scaler',
          tag: 'Dental tool',
          body: 'A scaler helps clean away stuck-on buildup that a toothbrush cannot always reach.',
          art: '/art/scaler.svg'
        },
        {
          title: 'Toothpaste size',
          tag: 'Healthy habit',
          body: 'Use a grain-of-rice smear before age 3 and a pea-sized amount from ages 3 to 6.',
          art: '/art/toothpaste.svg'
        },
        {
          title: 'First dental visit',
          tag: 'Parent tip',
          body: 'The first dental visit should happen by the first tooth or first birthday, whichever comes first.',
          art: '/art/visit.svg'
        },
        {
          title: 'Sealants',
          tag: 'Smile fact',
          body: 'Sealants are like a raincoat for the bumpy tops of back teeth. They help protect molars from cavities.',
          art: '/art/sealant.svg'
        },
        {
          title: 'Braces wax',
          tag: 'Ortho help',
          body: 'Orthodontic wax can cover a spot that rubs until your orthodontic team can check it.',
          art: '/art/wax.svg'
        },
      ],
    },
    parent: {
      title: 'Parent dashboard',
      body: 'Keep quick notes, watch routines, and switch between profiles without creating online accounts.',
      notesLabel: 'Family notes',
      saveNotes: 'Notes saved on this device.',
      profilesTitle: 'Profiles',
      addProfile: 'Add another profile',
    },
    profileForm: {
      title: 'Create a profile',
      name: 'Name',
      type: 'Profile type',
      ageGroup: 'Age group',
      save: 'Save profile',
      child: 'Child',
      teen: 'Teen',
      littleKid: 'Ages 4 to 7',
      bigKid: 'Ages 8 to 12',
      teenager: 'Ages 13 to 17',
    },
  },
  es: {
    appName: 'SmileSteps',
    tagline: 'Habitos saludables para ninos, adolescentes y padres.',
    heroTitle: 'Pequenas rutinas, sonrisas mas fuertes',
    heroBody:
      'SmileSteps es una prueba de concepto local para rutinas dentales pediatricas y de ortodoncia. Todo se queda en este dispositivo a menos que una version futura cambie eso.',
    createProfile: 'Crear perfil',
    languageLabel: 'Idioma de la app',
    parentView: 'Vista para padres',
    childView: 'Vista infantil',
    tabs: {
      home: 'Inicio',
      brushing: 'Cepillar',
      teeth: 'Dientes',
      ortho: 'Orto',
      learn: 'Aprender',
      parent: 'Padres',
    },
    home: {
      welcome: 'Hoy es un buen dia para cuidar tu sonrisa.',
      dailyPlan: 'Elige un pequeno logro: cepillarte, registrar un cambio dental, contar tiempo con alineadores o aprender algo nuevo.',
      startHereTitle: 'Empieza aqui',
      startHereBody: 'Esta demo funciona mejor como una app movil. Elige un perfil, toma una tarea rapida y usa las pestanas de abajo para moverte.',
      nextSteps: ['Cepillate 2 minutos.', 'Actualiza un diente.', 'Registra tiempo de alineadores.', 'Aprende una herramienta.'],
      onboardingTitle: 'Bienvenido a SmileSteps',
      onboardingBody: 'Este es un lugar tranquilo y amigable para habitos de cepillado, cambios dentales y rutinas de ortodoncia.',
      onboardingPoints: [
        'Elige un perfil infantil o adolescente.',
        'Usa la pantalla de cepillado para una rutina guiada de 2 minutos.',
        'Explora dientes, ortodoncia y aprendizaje con calma.',
      ],
      onboardingButton: 'Empezar',
      timerCard: 'Inicia una sesion de cepillado de 2 minutos con guia positiva.',
      toothCard: 'Lleva un registro de dientes de leche, dientes permanentes y logros.',
      orthoCard: 'Mantén tus rutinas de alineadores con recordatorios simples y progreso visible.',
      learnCard: 'Explora explicaciones tranquilas y faciles sobre herramientas dentales comunes.',
    },
    brushing: {
      title: 'Temporizador de 2 minutos',
      body: 'Cepilla con calma, cambia de lado cuando se indique y usa movimientos suaves en circulos.',
      start: 'Iniciar',
      reset: 'Reiniciar',
      pause: 'Pausar',
      resume: 'Seguir',
      finished: 'Muy bien. Terminaste dos minutos.',
      encouragement: ['Circulos pequenos.', 'Ahora enfrente.', 'Ahora las muelas.', 'Ya casi.', 'Final brillante.'],
      quadrants: ['Arriba derecha', 'Arriba izquierda', 'Abajo izquierda', 'Abajo derecha'],
      helperFinished: 'Terminaste cada parte de tu sonrisa.',
      helperPrefix: 'Concentrate en',
      helperSuffix: 'con circulos suaves.',
    },
    teeth: {
      title: 'Registro dental',
      body: 'Toca un lugar para marcar un diente de leche que se cayo o para quitar la marca.',
      hint: 'Este registro es solo educativo para la familia y no ofrece consejo medico.',
      labels: toothLabels,
    },
    ortho: {
      title: 'Habitos de ortodoncia',
      body: 'Registra horas de alineadores y evita olvidar el cambio de bandejas.',
      goal: 'Meta de horas hoy',
      nextChange: 'Proximo cambio',
      comfortTitle: 'Consejos de comodidad',
      comfortTips: [
        'Usa un estuche limpio para mantener los alineadores seguros.',
        'El agua fria puede sentirse bien despues de un cambio de bandeja.',
        'Quita los alineadores para comer, a menos que tu ortodoncista diga otra cosa.',
        'Si algo se siente raro o muy molesto, llama a tu equipo de ortodoncia.',
      ],
      addHour: '+1 hora',
      subtractHour: '-1 hora',
    },
    learn: {
      title: 'Conoce las herramientas',
      body: 'Las explicaciones cortas pueden hacer que una visita dental se sienta menos estresante. Son notas educativas, no consejo medico.',
      cards: [
        {
          title: 'Espejo',
          tag: 'Herramienta dental',
          body: 'Un pequeno espejo ayuda a ver rincones y a llevar luz a lugares dificiles de mirar.',
          art: '/art/mirror.svg'
        },
        {
          title: 'Succion',
          tag: 'Herramienta dental',
          body: 'La succion funciona como una pequena aspiradora de agua para que la boca se sienta mas comoda.',
          art: '/art/suction.svg'
        },
        {
          title: 'Explorador',
          tag: 'Herramienta dental',
          body: 'El explorador ayuda a revisar la superficie del diente y encontrar zonas que necesitan atencion.',
          art: '/art/explorer.svg'
        },
        {
          title: 'Escariador',
          tag: 'Herramienta dental',
          body: 'El escariador ayuda a quitar acumulacion pegada que un cepillo no siempre puede alcanzar.',
          art: '/art/scaler.svg'
        },
        {
          title: 'Cantidad de pasta',
          tag: 'Habito',
          body: 'Usa una mancha del tamano de un grano de arroz antes de los 3 anos y una cantidad del tamano de un guisante entre 3 y 6 anos.',
          art: '/art/toothpaste.svg'
        },
        {
          title: 'Primera visita dental',
          tag: 'Consejo para padres',
          body: 'La primera visita dental debe ser cuando salga el primer diente o antes del primer cumpleanos.',
          art: '/art/visit.svg'
        },
        {
          title: 'Selladores',
          tag: 'Dato',
          body: 'Los selladores son como un impermeable para la parte con surcos de las muelas. Ayudan a proteger de caries.',
          art: '/art/sealant.svg'
        },
        {
          title: 'Cera',
          tag: 'Ayuda orto',
          body: 'La cera de ortodoncia puede cubrir una zona que roza hasta que el equipo la revise.',
          art: '/art/wax.svg'
        },
      ],
    },
    parent: {
      title: 'Panel para padres',
      body: 'Guarda notas rapidas, revisa rutinas y cambia entre perfiles sin crear cuentas en linea.',
      notesLabel: 'Notas familiares',
      saveNotes: 'Las notas se guardaron en este dispositivo.',
      profilesTitle: 'Perfiles',
      addProfile: 'Agregar otro perfil',
    },
    profileForm: {
      title: 'Crear un perfil',
      name: 'Nombre',
      type: 'Tipo de perfil',
      ageGroup: 'Grupo de edad',
      save: 'Guardar perfil',
      child: 'Nino',
      teen: 'Adolescente',
      littleKid: 'Edades 4 a 7',
      bigKid: 'Edades 8 a 12',
      teenager: 'Edades 13 a 17',
    },
  },
};
