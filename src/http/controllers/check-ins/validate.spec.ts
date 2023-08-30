import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  
  it('should be able to validate check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    const user = await prisma.user.findFirstOrThrow()

    const gym =await prisma.gym.create({
      data: {
        title: 'Javascript gym',
      latitude: -22.4009509,
      longitude: -51.2946075
      }
    })

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id
      }
    })

    const response = await request(app.server).patch(`/check-ins/${checkIn.id}/validate`)
    .set('Authorization', `Bearer ${token}`)
    .send()

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id
      }
    })

    expect(response.statusCode).toEqual(204)

    expect(checkIn.validated_at).toEqual(expect.any(Date))

  })
})