import app from '@adonisjs/core/services/app'
import Ws from '#services/ws_service'
import { HttpContext } from '@adonisjs/core/http'

app.ready(() => {
    Ws.boot()
    Ws.connectSocket()
})

app.terminating(() => {
  const ctx = HttpContext.get()
  if (!ctx) return
  ctx.socket.disconnect()
})