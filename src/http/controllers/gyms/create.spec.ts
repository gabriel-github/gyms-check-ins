import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  
  it('should be able to create gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server).post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Javascript gym',
      description: 'Some description',
      phone: '1199999999',
      latitude: -22.4009509,
      longitude: -51.2946075
    })

    expect(response.statusCode).toEqual(201)

  })
})