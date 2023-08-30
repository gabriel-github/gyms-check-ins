import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

describe('Featch Nearby Gyms use case', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: FetchNearbyGymsUseCase

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)

  })

  it('should be able to fetch nearby gyms', async () => {

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -22.4009509,
      longitude: -51.2946075
    })

    await gymsRepository.create({
      id: 'gym-02',
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -22.283862,
      longitude: -51.2764276
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.4009509,
      userLongitude: -51.2946075
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym'
      }),
    ])
  })

  
})
