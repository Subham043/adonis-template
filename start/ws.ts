import app from '@adonisjs/core/services/app'
import Ws from '#services/ws_service'

app.ready(() => {
    Ws.boot()
    const io = Ws.io
    io?.on('connection', (socket) => {
        console.log(socket.id)
        socket.emit('ping', socket.data.user)
        socket.on('pong', (data) => {
          socket.broadcast.emit('msg', data)
        })
    })
})