import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  
  it('should be able to create check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym =await prisma.gym.create({
      data: {
        title: 'Javascript gym',
      latitude: -22.4009509,
      longitude: -51.2946075
      }
    })

    const response = await request(app.server).post(`/gyms/${gym.id}/check-ins`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      latitude: -22.4009509,
      longitude: -51.2946075
    })

    expect(response.statusCode).toEqual(201)

  })
})