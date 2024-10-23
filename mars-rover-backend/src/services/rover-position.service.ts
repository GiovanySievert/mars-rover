import { prisma } from '../prisma'

class RoverPositionService {
  async isPositionOccupied(x: number, y: number, roverId?: number): Promise<boolean> {
    const query: any = { x, y }

    if (roverId) {
      query.id = { not: roverId }
    }

    const otherRover = await prisma.rover.findFirst({
      where: query
    })

    return !!otherRover
  }
}

export default new RoverPositionService()
