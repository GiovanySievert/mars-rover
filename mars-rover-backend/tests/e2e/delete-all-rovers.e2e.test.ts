import request from 'supertest'
import express from 'express'

import { prisma } from '../../src/prisma'
import roverRouter from '../../src/routes/rover.routes'

const app = express()
app.use(express.json())
app.use(roverRouter)

describe('Delete All Rovers E2E', () => {
  beforeEach(async () => {
    await prisma.$transaction([prisma.rover.deleteMany()])
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should delete all rovers and return the count of deleted rovers', async () => {
    await prisma.rover.createMany({
      data: [
        { x: 1, y: 2, direction: 'N' },
        { x: 3, y: 4, direction: 'E' }
      ]
    })

    const response = await request(app).delete('/all').expect(200)

    expect(response.body).toEqual({
      message: '2 rovers successfully deleted'
    })

    const remainingRovers = await prisma.rover.findMany()
    expect(remainingRovers.length).toBe(0)
  })

  it('should return 0 when no rovers exist', async () => {
    const response = await request(app).delete('/all').expect(200)

    expect(response.body).toEqual({
      message: '0 rovers successfully deleted'
    })
  })
})
