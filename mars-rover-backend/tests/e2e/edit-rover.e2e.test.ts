import request from 'supertest'
import express from 'express'

import { prisma } from '../../src/prisma'
import { Rover } from '../../src/models/rover.model'
import roverRouter from '../../src/routes/rover.routes'

const app = express()
app.use(express.json())
app.use(roverRouter)

describe('Rover Edit E2E', () => {
  let mockRover: Rover

  beforeEach(async () => {
    await prisma.rover.deleteMany()

    mockRover = await prisma.rover.create({
      data: {
        x: 1,
        y: 1,
        direction: 'N'
      }
    })
  })

  afterAll(async () => {
    await prisma.rover.deleteMany()
    await prisma.$disconnect()
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  it('should update rover position successfully', async () => {
    const updateData = {
      instructions: 'MMR'
    }

    const response = await request(app).put(`/${mockRover.id}`).send(updateData).expect(200)

    expect(response.body).toEqual({
      id: mockRover.id,
      x: 1,
      y: 3,
      direction: 'E'
    })
  })

  it('should rotate rover to the left successfully', async () => {
    const updateData = {
      instructions: 'L'
    }

    const response = await request(app).put(`/${mockRover.id}`).send(updateData).expect(200)

    expect(response.body).toEqual({
      id: mockRover.id,
      x: 1,
      y: 1,
      direction: 'W'
    })
  })

  it('should rotate the rover multiple times successfully', async () => {
    const updateData = {
      instructions: 'LLRR'
    }
    const response = await request(app).put(`/${mockRover.id}`).send(updateData).expect(200)

    expect(response.body).toEqual({
      id: mockRover.id,
      x: 1,
      y: 1,
      direction: 'N'
    })
  })

  it('should return an error when the rover moves to an occupied space', async () => {
    await prisma.rover.create({
      data: {
        x: 1,
        y: 3,
        direction: 'N'
      }
    })

    const updateData = {
      instructions: 'MM'
    }

    const response = await request(app).put(`/${mockRover.id}`).send(updateData).expect(400)

    expect(response.body.error).toBe('RoverPositionOccupiedException')
  })

  it('should return an error when the rover moves out of bounds', async () => {
    const updateData = {
      instructions: 'MMMMMMMMMMMMMMMMMMMMM'
    }

    const response = await request(app).put(`/${mockRover.id}`).send(updateData).expect(400)

    expect(response.body.error).toBe('RoverOutOfBoundsException')
  })

  it('should return an error when invalid instructions are given', async () => {
    const updateData = {
      instructions: 'ABC'
    }

    const response = await request(app).put(`/${mockRover.id}`).send(updateData).expect(400)

    expect(response.body.error).toBe('InvalidInstructionException')
  })

  it('should move the rover forward one step', async () => {
    const updateData = {
      instructions: 'M'
    }

    const response = await request(app).put(`/${mockRover.id}`).send(updateData).expect(200)

    expect(response.body).toEqual({
      id: mockRover.id,
      x: 1,
      y: 2,
      direction: 'N'
    })
  })
})
