import { RequestHandler } from 'express'

import RoverDeleteService from '../services/delete-rover.service'
import deleteAllRoversService from '../services/delete-all-rovers.service'
import { formatErrorResponse } from '../utils/format-error-response'

class DeleteRoverController {
  deleteRover: RequestHandler = async (req, res) => {
    const roverId = Number(req.params.id)

    if (isNaN(roverId) || roverId <= 0) {
      res.status(400).json({ message: 'Invalid ID provided' })
      return
    }

    try {
      const deletedRover = await RoverDeleteService.deleteRoverById(roverId.toString())

      if (!deletedRover) {
        res.status(404).json({ message: 'Rover not found' })
        return
      }

      res.status(200).json({ message: 'Rover successfully deleted', rover: deletedRover })
    } catch (error) {
      const formattedError = formatErrorResponse(error as Error)
      res.status(400).json(formattedError)
    }
  }

  deleteAllRovers: RequestHandler = async (_, res) => {
    try {
      const deletedCount = await deleteAllRoversService.deleteAllRovers()

      res.status(200).json({ message: `${deletedCount} rovers successfully deleted` })
    } catch (error) {
      const formattedError = formatErrorResponse(error as Error)
      res.status(400).json(formattedError)
    }
  }
}

export default new DeleteRoverController()
