import request from 'supertest'
import express from 'express'

import { prisma } from '../../src/prisma'
import roverRouter from '../../src/routes/rover.routes'

const app = express()
app.use(express.json())
app.use(roverRouter)

describe('Rover List E2E', () => {
  beforeEach(async () => {
    await prisma.$transaction([prisma.rover.deleteMany()])
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should return an empty array when there are no rovers', async () => {
    const response = await request(app).get('/').expect(200)

    expect(response.body).toEqual([])
  })

  it('should return all rovers that are present in the database', async () => {
    const rover1 = await prisma.rover.create({
      data: {
        x: 1,
        y: 2,
        direction: 'N'
      }
    })

    const rover2 = await prisma.rover.create({
      data: {
        x: 3,
        y: 4,
        direction: 'E'
      }
    })

    const response = await request(app).get('/').expect(200)

    expect(response.body).toEqual([
      {
        id: rover1.id,
        x: rover1.x,
        y: rover1.y,
        direction: rover1.direction
      },
      {
        id: rover2.id,
        x: rover2.x,
        y: rover2.y,
        direction: rover2.direction
      }
    ])
  })
})
