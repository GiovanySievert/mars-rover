import request from 'supertest'
import express from 'express'
import { prisma } from '../../src/prisma'
import roverRouter from '../../src/routes/rover.routes'

const app = express()
app.use(express.json())
app.use(roverRouter)

describe('Rover Create E2E with Transactions', () => {
  beforeEach(async () => {
    await prisma.$transaction([prisma.rover.deleteMany()])
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  it('should create a rover successfully', async () => {
    const roverData = {
      x: 1,
      y: 1,
      direction: 'N'
    }

    const response = await request(app).post('/').send(roverData).expect(201)
    expect(response.body).toEqual({
      id: expect.any(Number),
      x: roverData.x,
      y: roverData.y,
      direction: roverData.direction
    })
  })

  it('should return an error when the rover is out of bounds', async () => {
    const roverData = {
      x: 21,
      y: 1,
      direction: 'N'
    }

    const response = await request(app).post('/').send(roverData).expect(400)

    expect(response.body.error).toBe('RoverOutOfBoundsException')
  })

  it('should return an error when the position is occupied by another rover', async () => {
    await prisma.rover.create({
      data: {
        x: 1,
        y: 1,
        direction: 'N'
      }
    })

    const roverData = {
      x: 1,
      y: 1,
      direction: 'E'
    }

    const response = await request(app).post('/').send(roverData).expect(400)

    expect(response.body.error).toBe('RoverPositionOccupiedException')
  })

  it('should return an error when the rover has invalid direction', async () => {
    const roverData = {
      x: 1,
      y: 1,
      direction: 'INVALID'
    }

    const response = await request(app).post('/').send(roverData).expect(400)

    expect(response.body.error).toBe('InvalidDirectionException')
  })

  it('should return an error when the rover has negative coordinates', async () => {
    const roverData = {
      x: -1,
      y: 1,
      direction: 'N'
    }

    const response = await request(app).post('/').send(roverData).expect(400)

    expect(response.body.error).toBe('RoverOutOfBoundsException')
  })

  it('should return an error when the rover exceeds the plateau height', async () => {
    const roverData = {
      x: 1,
      y: 21,
      direction: 'N'
    }

    const response = await request(app).post('/').send(roverData).expect(400)

    expect(response.body.error).toBe('RoverOutOfBoundsException')
  })

  it('should create multiple rovers successfully without collision', async () => {
    const rover1 = {
      x: 1,
      y: 1,
      direction: 'N'
    }

    const rover2 = {
      x: 2,
      y: 2,
      direction: 'S'
    }

    const response1 = await request(app).post('/').send(rover1).expect(201)
    expect(response1.body).toEqual({
      id: expect.any(Number),
      x: rover1.x,
      y: rover1.y,
      direction: rover1.direction
    })

    const response2 = await request(app).post('/').send(rover2).expect(201)
    expect(response2.body).toEqual({
      id: expect.any(Number),
      x: rover2.x,
      y: rover2.y,
      direction: rover2.direction
    })
  })
})
