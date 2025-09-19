import mongoose from 'mongoose'
import { describe, expect, test } from '@jest/globals'
import { User } from '../db/models/user.js'
import { createUser } from '../services/users.js'

describe('creating users', () => {
  test('should succeed with all params', async () => {
    const user = { username: 'testUsername', password: 'testPassword' }
    const createdUser = await createUser(user)

    expect(createdUser._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundUser = await User.findById(createdUser._id)
    expect(foundUser._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
  test('should fail without username', async () => {
    const user = { password: 'testPassword' }

    try {
      await createUser(user)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`username` is required')
    }
  })
  test('should fail without password', async () => {
    const user = { username: 'testUsername' }
    try {
      await createUser(user)
    } catch (err) {
      expect(err.message).toContain('data and salt arguments required')
    }
  })
  test('should fail with duplicate username', async () => {
    const user1 = { username: 'testUsername', password: 'testPassword' }
    const user2 = { username: 'testUsername', password: 'testPassword' }

    try {
      await createUser(user1)
      await createUser(user2)
    } catch (err) {
      await expect(err).toBeInstanceOf(mongoose.mongo.MongoServerError)
      expect(err.message).toContain('duplicate key')
    }
  })
  test('should suceed with different usernames but duplecate passwords', async () => {
    const user1 = { username: 'testUsername1', password: 'testPassword' }
    const user2 = { username: 'testUsername2', password: 'testPassword' }

    const createdUser1 = await createUser(user1)
    const createdUser2 = await createUser(user2)

    expect(createdUser1._id).toBeInstanceOf(mongoose.Types.ObjectId)
    expect(createdUser2._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundUser1 = await User.findById(createdUser1._id)
    expect(foundUser1._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundUser2 = await User.findById(createdUser2._id)
    expect(foundUser2._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})
