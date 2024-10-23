import { Router } from 'express'

import CreateRoverController from '../controllers/create.rover.controller'
import EditRoverController from '../controllers/edit.rover.controller'
import DeleteRoverController from '../controllers/delete.rover.controller'
import ListRoverController from '../controllers/list.rover.controller'

const router = Router()

router.post('/', CreateRoverController.createRover)
router.put('/:id', EditRoverController.editRover)
router.get('/', ListRoverController.listRover)

router.delete('/all', DeleteRoverController.deleteAllRovers)
router.delete('/:id', DeleteRoverController.deleteRover)

export default router
