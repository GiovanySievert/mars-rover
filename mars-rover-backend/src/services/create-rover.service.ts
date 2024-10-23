import { prisma } from '../prisma'

import { Rover } from '../models/rover.model'
import { CreateRoverDTO } from '../dtos/create-rover.dto'
import { plateauConfig } from '../config/plateau.config'
import {
  InvalidDirectionException,
  RoverOutOfBoundsException,
  RoverPositionOccupiedException
} from '../exceptions/rover.exceptions'
import roverPositionService from './rover-position.service'
import { isValidDirection } from '../utils/is-valid-direction'

class RoverCreateService {
  async createRover(data: CreateRoverDTO): Promise<Rover> {
    const { x, y, direction } = data

    if (x > plateauConfig.width || y > plateauConfig.height || x < 0 || y < 0) {
      throw new RoverOutOfBoundsException()
    }

    if (!isValidDirection(direction)) {
      throw new InvalidDirectionException()
    }

    const isOccupied = await roverPositionService.isPositionOccupied(x, y)
    if (isOccupied) {
      throw new RoverPositionOccupiedException()
    }

    return prisma.rover.create({
      data: {
        x,
        y,
        direction
      }
    })
  }
}

export default new RoverCreateService()
