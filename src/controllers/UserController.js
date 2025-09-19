const UserService = require('../services/UserService')

class UserController {

  static async register(req, res) {
    try {
      const user = await UserService.register(req.body)
      res.status(201).json({
        status: 'success',
        data: { user }
      })
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      })
    }
  }


  static async login(req, res) {
    try {
      const { email, password } = req.body
      const result = await UserService.login(email, password)
      
      res.status(200).json({
        status: 'success',
        data: result
      })
    } catch (error) {
      res.status(401).json({
        status: 'error',
        message: error.message
      })
    }
  }


  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id, req.user);
      res.status(200).json({
        status: 'success',
        data: { user }
      })
    } catch (error) {
      res.status(error.message === 'Access denied' ? 403 : 404).json({
        status: 'error',
        message: error.message
      })
    }
  }


  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers(req.user)
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
      })
    } catch (error) {
      res.status(403).json({
        status: 'error',
        message: error.message
      })
    }
  }


  static async blockUser(req, res) {
    try {
      const user = await UserService.blockUser(req.params.id, req.user);
      res.status(200).json({
        status: 'success',
        data: { user }
      })
    } catch (error) {
      res.status(error.message === 'Access denied' ? 403 : 404).json({
        status: 'error',
        message: error.message
      })
    }
  }
}

module.exports = UserController