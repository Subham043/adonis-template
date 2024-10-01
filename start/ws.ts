import app from '@adonisjs/core/services/app'
import Ws from '#services/ws_service'

app.ready(() => {
    Ws.boot()
    Ws.connectSocket()
})