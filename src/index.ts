import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import routeAuth from './routes/auth'
import routeUser from './routes/user'
import routeChemical from './routes/chemical'
import routeChemicalLog from './routes/chemicalLog'
import routeInstrument from './routes/instrument'
import routeInstrumentLog from './routes/instrumentLog'
import routeReservation from './routes/reservation'
import middlewareError from './middlewares/error'
import './configs/passport'

mongoose.set('sanitizeFilter', true)

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('資料庫連線成功')
  })
  .catch((error) => {
    console.error(error)
    console.error('資料庫連線失敗')
  })

const app = express()

app.use(helmet())

app.use(
  cors({
    // origin 請求來源網域
    // callback(錯誤, 是否允許)
    origin: (origin, callback) => {
      if (
        origin &&
        [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'https://erinameng0720.github.io',
        ].includes(origin)
      ) {
        callback(null, true)
      } else {
        callback(new Error('CORS'), false)
      }
    },
    // 允許跨網域請求攜帶 cookie
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())

app.use('/auth', routeAuth)
app.use('/user', routeUser)
app.use('/chemical', routeChemical)
app.use('/chemical-log', routeChemicalLog)
app.use('/instrument', routeInstrument)
app.use('/instrument-log', routeInstrumentLog)
app.use('/reservation', routeReservation)

app.use(middlewareError)

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})
