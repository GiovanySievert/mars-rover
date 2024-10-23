import { Direction } from '../models/direction.model'

export function isValidDirection(direction: string): direction is Direction {
  return ['N', 'E', 'S', 'W'].includes(direction)
}
