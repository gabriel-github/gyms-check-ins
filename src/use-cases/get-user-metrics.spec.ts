

import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { GetUserMetricsUseCase } from './get-user-metrics'

describe('Get User Metrics use case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: GetUserMetricsUseCase

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)

  })

  it('should be able to get check-ins count from metrics', async () => {

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01'
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
