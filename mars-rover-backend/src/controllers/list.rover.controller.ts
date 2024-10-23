import { RequestHandler } from 'express'

import RoverListService from '../services/list-rover.service'

class ListRoverController {
  listRover: RequestHandler = async (req, res, next) => {
    try {
      const rovers = await RoverListService.getAllRovers()
      res.status(200).json(rovers)
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve rovers', error: (error as Error).message })
    }
  }
}

export default new ListRoverController()
