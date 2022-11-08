import express from 'express';
import {checkAuth} from '../middlewares/check-auth.mjs'
import { createUser, userLogin, onReload } from '../controllers/auth.mjs'

const authRoute = express.Router();
authRoute.get('/reload', checkAuth, onReload)
authRoute.post('/signup', createUser)
authRoute.post("/login", userLogin)

export default authRoute