import { axiosInstance } from '../http/axios-instance'

class RoverService {
  private axios

  constructor() {
    this.axios = axiosInstance()
  }

  public async getRovers() {
    return this.axios.get('/rovers')
  }

  public async createRover(data: { x: string; y: string; direction: string }) {
    return this.axios.post('/rovers', {
      x: Number(data.x),
      y: Number(data.y),
      direction: data.direction
    })
  }

  public async updateRover(roverId: string, instructions: string) {
    return this.axios.put(`/rovers/${Number(roverId)}`, { instructions })
  }

  public async deleteRover(id: string) {
    return this.axios.delete(`/rovers/${Number(id)}`)
  }

  public async deleteAllRovers() {
    return this.axios.delete(`/rovers/all`)
  }
}

export const roverService = new RoverService()
