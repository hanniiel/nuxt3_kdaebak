import {User} from "../models/user"
import admin  from 'firebase-admin'
import { Request, Response } from "express"

const authFire = async (req, res, next) => {
  try {
    let token = req.header("Authorization").replace("Bearer ", "")
    let authUser = await admin
      .auth()
      .verifyIdToken(token)
   

    const user = await User.findById(authUser.uid)

    if (!user) {
      const fireUser = await admin.auth().getUser(authUser.uid)
      const newUser = new User({
        email: authUser.email,
        name:fireUser.displayName,
      })
      newUser._id= fireUser.uid
      req.user = await newUser.save()
    } else {
      req.user = user
    }

    next()
  } catch (e) {
    res.status(401).send({ error: "Failed to authenticate"})
  }
};

export default authFire
