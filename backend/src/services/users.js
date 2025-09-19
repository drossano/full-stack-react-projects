import bcrypt from 'bcrypt'
import { User } from '../db/models/user.js'

export async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ username, password: hashedPassword })
  return await user.save()
}
