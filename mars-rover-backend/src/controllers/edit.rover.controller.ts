import { RequestHandler } from 'express'
import { validate } from 'class-validator'

import RoverUpdateService from '../services/update-rover.service'
import { UpdateRoverDTO } from '../dtos/update-rover.dto'
import { formatErrorResponse } from '../utils/format-error-response'

class EditRoverController {
  editRover: RequestHandler = async (req, res) => {
    const roverId = Number(req.params.id)
    const data = new UpdateRoverDTO()
    data.instructions = req.body.instructions

    const errors = await validate(data)
    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints
      }))
      res.status(400).json({ errors: formattedErrors })
      return
    }

    try {
      const updatedRover = await RoverUpdateService.updateRover(roverId, data)
      res.status(200).json(updatedRover)
      return
    } catch (error) {
      const formattedError = formatErrorResponse(error as Error)
      res.status(400).json(formattedError)
    }
  }
}

export default new EditRoverController()
