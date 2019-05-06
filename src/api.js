import express from 'express'
import { getStations } from './lib/bikesharelib'
import config from './config'

const app = express()
app.use(express.static('public'))
app.set('json spaces', 2)

app.get('/availability', async (req, res, next) => {
  try {
    const stations = await getStations(config.gbfsUrl + config.gbfsPath)
    res.json(stations)
  } catch (e) {
    next(e)
  }
})

app.use(function (req, res, next) {
  res.status(404).json({
    statusCode: 404,
    message: `endpoint ${req.protocol + '://' + req.get('host') + req.originalUrl} does not exist`
  })
})

app.use(function (_err, req, res, next) {
  res.status(500).json({
    statusCode: 500,
    message: 'server error'
  })
})

export default app.listen(3000, () => console.log('bikeshare-api listening on port 3000!'))
