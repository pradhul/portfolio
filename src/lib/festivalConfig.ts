export interface FestivalColors {
  primary: string
  secondary: string
  accent: string
  tertiary?: string
  quaternary?: string
}

export interface FestivalEffect {
  type: 'snow' | 'confetti' | 'petals' | 'lights' | 'fireworks' | 'colorPowder' | 'none'
  intensity?: 'low' | 'medium' | 'high'
}

export interface FestivalConfig {
  id: string
  name: string
  colors: FestivalColors
  effects: FestivalEffect[]
  approximateStartMonth: number // 0-11 (0 = January)
  approximateStartDay: number // 1-31
  approximateEndMonth: number // 0-11
  approximateEndDay: number // 1-31
  textDecoration?: 'snow' | 'confetti' | 'sparkles' | 'lights' | 'none'
}

export const FESTIVAL_CONFIGS: FestivalConfig[] = [
  {
    id: 'christmas',
    name: 'Christmas',
    colors: {
      primary: '#b91c1c', // Deep red
      secondary: '#dc2626', // Bright red
      accent: '#16a34a', // Green
      tertiary: '#fbbf24', // Gold
    },
    effects: [{ type: 'snow', intensity: 'high' }],
    approximateStartMonth: 11, // December
    approximateStartDay: 1,
    approximateEndMonth: 0, // January
    approximateEndDay: 2,
    textDecoration: 'snow',
  },
  {
    id: 'chinese-new-year',
    name: 'Chinese New Year',
    colors: {
      primary: '#dc2626', // Red
      secondary: '#fbbf24', // Gold
      accent: '#f59e0b', // Amber
    },
    effects: [{ type: 'fireworks', intensity: 'medium' }, { type: 'confetti', intensity: 'low' }],
    approximateStartMonth: 0, // January
    approximateStartDay: 21,
    approximateEndMonth: 1, // February
    approximateEndDay: 20,
    textDecoration: 'sparkles',
  },
  {
    id: 'valentines',
    name: "Valentine's Day",
    colors: {
      primary: '#dc2626', // Red
      secondary: '#ec4899', // Pink
      accent: '#ffffff', // White
    },
    effects: [{ type: 'petals', intensity: 'medium' }],
    approximateStartMonth: 1, // February
    approximateStartDay: 14,
    approximateEndMonth: 1,
    approximateEndDay: 14,
    textDecoration: 'sparkles',
  },
  {
    id: 'mardi-gras',
    name: 'Mardi Gras',
    colors: {
      primary: '#9333ea', // Purple
      secondary: '#16a34a', // Green
      accent: '#fbbf24', // Gold
    },
    effects: [{ type: 'confetti', intensity: 'high' }],
    approximateStartMonth: 1, // February
    approximateStartDay: 13,
    approximateEndMonth: 2, // March
    approximateEndDay: 4,
    textDecoration: 'confetti',
  },
  {
    id: 'holi',
    name: 'Holi',
    colors: {
      primary: '#dc2626', // Red
      secondary: '#16a34a', // Green
      accent: '#3b82f6', // Blue
      tertiary: '#fbbf24', // Yellow
      quaternary: '#ec4899', // Pink
    },
    effects: [{ type: 'colorPowder', intensity: 'high' }],
    approximateStartMonth: 2, // March
    approximateStartDay: 13,
    approximateEndMonth: 2,
    approximateEndDay: 14,
    textDecoration: 'confetti',
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    colors: {
      primary: '#ec4899', // Pink
      secondary: '#f9a8d4', // Light pink
      accent: '#ffffff', // White
    },
    effects: [{ type: 'petals', intensity: 'high' }],
    approximateStartMonth: 2, // March
    approximateStartDay: 20,
    approximateEndMonth: 3, // April
    approximateEndDay: 15,
    textDecoration: 'petals',
  },
  {
    id: 'easter',
    name: 'Easter',
    colors: {
      primary: '#f9a8d4', // Light pink
      secondary: '#fef08a', // Yellow
      accent: '#86efac', // Green
      tertiary: '#93c5fd', // Blue
    },
    effects: [{ type: 'confetti', intensity: 'low' }],
    approximateStartMonth: 2, // March
    approximateStartDay: 22,
    approximateEndMonth: 3, // April
    approximateEndDay: 25,
    textDecoration: 'sparkles',
  },
  {
    id: 'ramadan-eid',
    name: 'Ramadan / Eid al-Fitr',
    colors: {
      primary: '#16a34a', // Green
      secondary: '#fbbf24', // Gold
      accent: '#ffffff', // White
    },
    effects: [{ type: 'lights', intensity: 'medium' }],
    approximateStartMonth: 2, // March (varies by lunar calendar)
    approximateStartDay: 10,
    approximateEndMonth: 3, // April
    approximateEndDay: 10,
    textDecoration: 'lights',
  },
  {
    id: 'oktoberfest',
    name: 'Oktoberfest',
    colors: {
      primary: '#1e40af', // Blue
      secondary: '#ffffff', // White
      accent: '#fbbf24', // Gold
    },
    effects: [{ type: 'confetti', intensity: 'low' }],
    approximateStartMonth: 8, // September
    approximateStartDay: 16,
    approximateEndMonth: 9, // October
    approximateEndDay: 3,
    textDecoration: 'none',
  },
  {
    id: 'halloween',
    name: 'Halloween',
    colors: {
      primary: '#ea580c', // Orange
      secondary: '#000000', // Black
      accent: '#9333ea', // Purple
    },
    effects: [{ type: 'confetti', intensity: 'medium' }],
    approximateStartMonth: 9, // October
    approximateStartDay: 25,
    approximateEndMonth: 9,
    approximateEndDay: 31,
    textDecoration: 'sparkles',
  },
  {
    id: 'diwali',
    name: 'Diwali',
    colors: {
      primary: '#fbbf24', // Gold
      secondary: '#f59e0b', // Amber
      accent: '#dc2626', // Red
      tertiary: '#ea580c', // Orange
    },
    effects: [{ type: 'lights', intensity: 'high' }, { type: 'fireworks', intensity: 'high' }],
    approximateStartMonth: 9, // October
    approximateStartDay: 20,
    approximateEndMonth: 10, // November
    approximateEndDay: 15,
    textDecoration: 'lights',
  },
  {
    id: 'day-of-the-dead',
    name: 'Day of the Dead',
    colors: {
      primary: '#ec4899', // Pink
      secondary: '#ea580c', // Orange
      accent: '#fbbf24', // Yellow
      tertiary: '#9333ea', // Purple
    },
    effects: [{ type: 'confetti', intensity: 'medium' }],
    approximateStartMonth: 10, // November
    approximateStartDay: 1,
    approximateEndMonth: 10,
    approximateEndDay: 2,
    textDecoration: 'sparkles',
  },
  {
    id: 'hanukkah',
    name: 'Hanukkah',
    colors: {
      primary: '#1e40af', // Blue
      secondary: '#ffffff', // White
      accent: '#fbbf24', // Gold
    },
    effects: [{ type: 'lights', intensity: 'medium' }],
    approximateStartMonth: 10, // November
    approximateStartDay: 28,
    approximateEndMonth: 11, // December
    approximateEndDay: 6,
    textDecoration: 'lights',
  },
  {
    id: 'new-year',
    name: 'New Year',
    colors: {
      primary: '#fbbf24', // Gold
      secondary: '#e5e7eb', // Silver/Gray
      accent: '#ffffff', // White
    },
    effects: [{ type: 'fireworks', intensity: 'high' }, { type: 'confetti', intensity: 'high' }],
    approximateStartMonth: 11, // December
    approximateStartDay: 31,
    approximateEndMonth: 0, // January
    approximateEndDay: 1,
    textDecoration: 'sparkles',
  },
]

export function getFestivalConfig(id: string): FestivalConfig | undefined {
  return FESTIVAL_CONFIGS.find((festival) => festival.id === id)
}

export function getAllFestivalConfigs(): FestivalConfig[] {
  return FESTIVAL_CONFIGS
}
