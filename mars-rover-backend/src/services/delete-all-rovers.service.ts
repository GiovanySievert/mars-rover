import { prisma } from '../prisma'

class DeleteAllRoversService {
  async deleteAllRovers(): Promise<number> {
    const deleteResult = await prisma.rover.deleteMany()
    return deleteResult.count
  }
}

export default new DeleteAllRoversService()
