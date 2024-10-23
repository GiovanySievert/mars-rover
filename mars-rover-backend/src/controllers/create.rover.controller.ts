import { RequestHandler } from 'express'
import { validate } from 'class-validator'

import { CreateRoverDTO } from '../dtos/create-rover.dto'
import RoverCreateService from '../services/create-rover.service'
import { formatErrorResponse } from '../utils/format-error-response'

class RoverController {
  createRover: RequestHandler = async (req, res) => {
    const data = new CreateRoverDTO()
    data.x = req.body.x
    data.y = req.body.y
    data.direction = req.body.direction

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
      const rover = await RoverCreateService.createRover(data)
      res.status(201).json(rover)
      return
    } catch (error) {
      const formattedError = formatErrorResponse(error as Error)
      res.status(400).json(formattedError)
    }
  }
}

export default new RoverController()
