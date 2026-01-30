import {app as AppRouter} from './app'
import AuthRouter from '../modules/auth/auth.routes'

AppRouter.use('/api/v1/auth/', AuthRouter)
AppRouter.get("/health", (req, res) => {res.send("OK")})