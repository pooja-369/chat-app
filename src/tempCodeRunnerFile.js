   console.log('new websocket connection')

   socket.on('join',(options,callback)=>{
    const{error,user} = addUser({id:socket.id,...options})

    if(error){
      return callback(error)
    }

      socket.join(user.room)
      
      socket.emit('message',generateMessage('Welcome!'))
      socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`))

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

       io.to(user.room).emit('message