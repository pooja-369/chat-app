const express=require('express')
const http=require('http')
const path = require('path')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generateMessage, generatorLocationMessage}=require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/user')


const app=express() //express generate application 
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT || 3000
const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

let count =0

// server(emit)->client(receive)-countUpdated
// client(emit)->server(receive)-increment

// io.on('connection',(socket)=>{
//     console.log('new websocket connection')

//     socket.emit('countUpdated',count)

//     socket.on('increment',()=>{
//         count++
//         //socket.emit('countUpdated',count)
//         io.emit('countUpdated',count)
//     })
// })


io.on('connection',(socket)=>{
   console.log('new websocket connection')

   socket.on('join',(options,callback)=>{
    const{error,user} = addUser({id:socket.id,...options})

    if(error){
      return callback(error)
    }

      socket.join(user.room)
      
      socket.emit('message',generateMessage('admin','Welcome!'))
      socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`))
      io.to(user.room).emit('roomData',{
         room:user.room,
         users:getUsersInRoom(user.room)
      })

      callback()

      //socket.emit(that send event to specific client),io.emit(to every client),socket.broadcast.emit(except who is sending it sends to all)
      //io.toemit(that send event to all present to specific room) ,
      //socket.broadcast.to.emit(everyone except that specific client within a specific chat room )
   })
   socket.on('sendMessage',(message,callback)=>{
      const user=getUser(socket.id)

       const filter = new Filter()
       if(filter.isProfane(message)){
          return callback('profanity is not allowed')
       }

       io.to(user.room).emit('message',generateMessage(user.username,message))
       callback('delivered')
   })

   socket.on('sendLocation',(coords,callback)=>{
      const user=getUser(socket.id)
    // io.emit('message','location: latitude'+coords.latitude+' longitude'+coords.longitude)
    io.to(user.room).emit('locationMessage',generatorLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    callback()
})

   socket.on('disconnect',()=>{
      const user =removeUser(socket.id)
      if(user){
         io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left!`))
         io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
         })
      }
   })
})



server.listen(port,()=>{
    console.log('server is up on port'+port)
})

