import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFound } from './errors/resource-not-found-error'

describe('Get User Profile use case', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: GetUserProfileUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John doe',
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6)
    })

    const { user } = await sut.execute({userId: createdUser.id})

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual(createdUser.name)
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() => sut.execute({
      userId: 'non-existing-id'
    })).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
