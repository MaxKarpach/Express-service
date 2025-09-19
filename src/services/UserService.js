const User = require('../models/User')
const jwt = require('jsonwebtoken')

class UserService {

  static async register(userData) {

    const existingUser = await User.findByEmail(userData.email)
    if (existingUser) {
      throw new Error('Email already exists')
    }

    const validRoles = ['admin', 'user'];
    const role = validRoles.includes(userData.role) ? userData.role : 'user'

    return await User.create({ ...userData, role })
  }

  static async login(email, password) {
    const user = await User.findByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    const isPasswordValid = await User.checkPassword(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    if (!user.is_active) {
      throw new Error('User is blocked')
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return { user, token }
  }

  static async getUserById(userId, currentUser) {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    if (currentUser.role !== 'admin' && currentUser.userId !== parseInt(userId)) {
      throw new Error('Access denied')
    }

    return user
  }

  static async getAllUsers(currentUser) {
    if (currentUser.role !== 'admin') {
      throw new Error('Admin access required')
    }

    return await User.findAll()
  }

  static async blockUser(userId, currentUser) {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    if (currentUser.role !== 'admin' && currentUser.userId !== parseInt(userId)) {
      throw new Error('Access denied')
    }

    return await User.update(userId, { is_active: false })
  }
}

module.exports = UserService