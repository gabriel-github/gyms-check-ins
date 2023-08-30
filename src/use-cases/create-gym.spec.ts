import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register.usecase'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

describe('Create Gym use case', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: CreateGymUseCase

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -22.4009509,
      longitude: -51.2946075
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
