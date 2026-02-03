export type IssueType =
  | 'blocking'
  | 'lights'
  | 'emergency'
  | 'door-open'
  | 'flat-tire'
  | 'damage'
  | 'leak'
  | 'wrong-spot'

export interface Issue {
  id: IssueType
  emoji: string
  title: string
  description: string
}

export const issues: Issue[] = [
  {
    id: 'blocking',
    emoji: '🚗',
    title: 'Blocking my vehicle',
    description: 'Vehicle is blocking my spot',
  },
  {
    id: 'wrong-spot',
    emoji: '🅿️',
    title: 'Wrong parking spot',
    description: 'Parked in my assigned spot',
  },
  {
    id: 'lights',
    emoji: '💡',
    title: 'Lights are ON',
    description: 'Headlights left on',
  },
  {
    id: 'door-open',
    emoji: '⚠️',
    title: 'Door left open',
    description: 'Door or window open',
  },
  {
    id: 'flat-tire',
    emoji: '🛞',
    title: 'Flat tire',
    description: 'Tire appears flat',
  },
  {
    id: 'leak',
    emoji: '💧',
    title: 'Fluid leaking',
    description: 'Leaking oil or fluids',
  },
  {
    id: 'damage',
    emoji: '💥',
    title: 'Vehicle damage',
    description: 'Accident or damage occurred',
  },
  {
    id: 'emergency',
    emoji: '⚠️',
    title: 'Emergency',
    description: 'Urgent attention needed',
  },
]

export const VALID_ISSUE_IDS = issues.map((i) => i.id)
export const VALID_ACTION_IDS = ['message', 'call'] as const
export type ActionType = (typeof VALID_ACTION_IDS)[number]
