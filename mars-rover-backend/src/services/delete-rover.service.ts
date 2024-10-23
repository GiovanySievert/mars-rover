import { prisma } from '../prisma'
import { Rover } from '../models/rover.model'
import { RoverNotFound } from '../exceptions/rover.exceptions'

class RoverDeleteService {
  async deleteRoverById(id: string): Promise<Rover | null> {
    const rover = await prisma.rover.findUnique({
      where: { id: Number(id) }
    })

    if (!rover) {
      throw new RoverNotFound()
    }

    return prisma.rover.delete({
      where: { id: Number(id) }
    })
  }
}

export default new RoverDeleteService()
