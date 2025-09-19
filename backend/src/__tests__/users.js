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
})
