// const clients = []
const axios = require('axios')
const url = 'http://localhost:9999/api/v1'

function io(io) {
  io.on('connection', socket => {
    console.log('a user is co')
    socket.on('storeSocket', async id => {
      try {
        return await axios.put(`${url}/user/${id}`, { socket: socket.id })
      } catch (error) {
        console.error(error.response)
      }
    })

    socket.on('conversation', data => {
      // try {
      //   return await axios.get(`${url}/user/${data.user_id}`).then(res => {
      io.to(data.user_id).emit('private', data)
      // io.sockets.connected[res.data.socket].emit('private', data)
      //   })
      // } catch (error) {
      //   console.error(error.response)
      // }
    })

    socket.on('join', id => {
      console.log('ca joiiiin')
      socket.join(id)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
    socket.on('chat message', msg => {
      console.log('msg recu' + msg)
      io.emit('chat message', msg)
    })
  })
}

module.exports = io
