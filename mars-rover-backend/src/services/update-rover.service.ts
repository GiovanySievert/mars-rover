import { prisma } from '../prisma'

import { Rover } from '../models/rover.model'
import { UpdateRoverDTO } from '../dtos/update-rover.dto'
import { plateauConfig } from '../config/plateau.config'
import {
  RoverOutOfBoundsException,
  RoverPositionOccupiedException,
  InvalidDirectionException,
  InvalidInstructionException
} from '../exceptions/rover.exceptions'
import roverPositionService from './rover-position.service'
import { isValidDirection } from '../utils/is-valid-direction'
import { Direction } from '../models/direction.model'

class RoverUpdateService {
  private movementMap: Record<Direction, { dx: number; dy: number }> = {
    N: { dx: 0, dy: 1 },
    E: { dx: 1, dy: 0 },
    S: { dx: 0, dy: -1 },
    W: { dx: -1, dy: 0 }
  }

  private rotateLeftMap: Record<Direction, Direction> = {
    N: 'W',
    W: 'S',
    S: 'E',
    E: 'N'
  }

  private rotateRightMap: Record<Direction, Direction> = {
    N: 'E',
    E: 'S',
    S: 'W',
    W: 'N'
  }

  async updateRover(id: number, data: UpdateRoverDTO): Promise<Rover> {
    const rover = await prisma.rover.findUnique({ where: { id } })

    if (!rover) {
      throw new Error('Rover not found')
    }

    const validInstructions = ['L', 'R', 'M']
    for (const instruction of data.instructions) {
      if (!validInstructions.includes(instruction)) {
        throw new InvalidInstructionException()
      }
    }

    let { x, y } = rover
    let direction = this.parseDirection(rover.direction)

    for (const instruction of data.instructions) {
      if (instruction === 'L') {
        direction = this.rotateLeft(direction)
      } else if (instruction === 'R') {
        direction = this.rotateRight(direction)
      } else if (instruction === 'M') {
        const newPosition = this.moveForward(x, y, direction)

        const isOccupied = await roverPositionService.isPositionOccupied(newPosition.x, newPosition.y, id)

        if (isOccupied) {
          throw new RoverPositionOccupiedException()
        }

        x = newPosition.x
        y = newPosition.y
      }
    }

    if (x > plateauConfig.width || y > plateauConfig.height || x < 0 || y < 0) {
      throw new RoverOutOfBoundsException()
    }

    return prisma.rover.update({
      where: { id },
      data: {
        x,
        y,
        direction
      }
    })
  }

  private moveForward(x: number, y: number, direction: Direction) {
    const movement = this.movementMap[direction]
    return { x: x + movement.dx, y: y + movement.dy }
  }

  private rotateLeft(direction: Direction): Direction {
    return this.rotateLeftMap[direction]
  }

  private rotateRight(direction: Direction): Direction {
    return this.rotateRightMap[direction]
  }

  private parseDirection(direction: string): Direction {
    if (!isValidDirection(direction)) {
      throw new InvalidDirectionException()
    }
    return direction
  }
}

export default new RoverUpdateService()
