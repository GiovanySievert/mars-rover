import { prisma } from '../prisma'
import { Rover } from '../models/rover.model'

class RoverListService {
  async getAllRovers(): Promise<Rover[]> {
    return prisma.rover.findMany()
  }
}

export default new RoverListService()
