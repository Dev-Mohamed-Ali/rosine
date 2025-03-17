import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1] // Get token from header

      const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verify token

      req.user = await User.findById(decoded.id).select('-password') // Attach user to request

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

export { protect }


const admin = (req, res, next) => {
  // with admin authentication
  next()
  
  // without admin authentication
  /*if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  } */
}

export { admin }
