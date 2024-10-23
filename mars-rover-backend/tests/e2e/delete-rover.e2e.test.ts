import request from 'supertest'
import express from 'express'

import { prisma } from '../../src/prisma'
import roverRouter from '../../src/routes/rover.routes'

const app = express()
app.use(express.json())
app.use(roverRouter)

describe('Rover Delete E2E', () => {
  let mockRoverId: number

  beforeEach(async () => {
    await prisma.$transaction([prisma.rover.deleteMany()])

    const mockRover = await prisma.rover.create({
      data: {
        x: 1,
        y: 2,
        direction: 'N'
      }
    })
    mockRoverId = mockRover.id
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should delete the rover by ID successfully', async () => {
    const response = await request(app).delete(`/${mockRoverId}`).expect(200)

    const roverInDb = await prisma.rover.findUnique({ where: { id: mockRoverId } })
    expect(roverInDb).toBeNull()
  })

  it('should return an error when trying to delete a non-existent rover', async () => {
    const nonExistentId = 99999

    const response = await request(app).delete(`/${nonExistentId}`).expect(400)

    expect(response.body.error).toBe('RoverNotFound')
  })
})
