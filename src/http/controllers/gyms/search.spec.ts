import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  
  it('should be able to search gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server).post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Javascript gym',
      description: 'Some description',
      phone: '1199999999',
      latitude: -22.4009509,
      longitude: -51.2946075
    })

    await request(app.server).post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Typescript gym',
      description: 'Some description',
      phone: '1199999999',
      latitude: -22.4009509,
      longitude: -51.2946075
    })

    const response = await request(app.server).get('/gyms/search')
    .query({
      q: 'Javascript'
    })
    .set('Authorization', `Bearer ${token}`)
    .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript gym'
      })
    ])

  })
})