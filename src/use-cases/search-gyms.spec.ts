import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { SearchGymsUseCase } from './search-gyms'

describe('Seach Gyms use case', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: SearchGymsUseCase

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)

  })

  it('should be able to fetch search for gyms', async () => {

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -22.4009509,
      longitude: -51.2946075
    })

    await gymsRepository.create({
      id: 'gym-02',
      title: 'Typescript Gym',
      description: null,
      phone: null,
      latitude: -22.4009509,
      longitude: -51.2946075
    })

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym'
      }),
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Typescript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -22.4009509,
        longitude: -51.2946075
      })
    }


    const { gyms } = await sut.execute({
      query: 'Typescript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Typescript Gym 21'
      }),
      expect.objectContaining({
        title: 'Typescript Gym 22'
      })
    ])
  })
})
