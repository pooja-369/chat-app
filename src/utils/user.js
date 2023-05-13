const users=[]

//addUser, removeUser ,getUser,getUserInRooms

const addUser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate the data 
    if(!username||!room){
        return{
            error:'user name and room is required'
        }
    }

    //check for the existing user
    const existingUser = users.find((user)=>{
        return user.room===room && user.username ===username
    })
    
    //validate username
    if(existingUser){
        return{
            error:'username is in use!',
        }
    }

    //store user
    const user={id,username,room}
    users.push(user)
    return{user}
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })

    if(index!== -1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
   return users.find((user)=> user.id===id)
}

const getUsersInRoom =(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=> user.room===room)
}

// addUser({
//     id:22,
//     username:'andrew',
//     room:'south'
// })

// addUser({
//     id:42,
//     username:'mike',
//     room:'south'
// })

// addUser({
//     id:32,
//     username:'mike',
//     room:'center'
// })
// console.log(users)

// const user=getUser(312)
// console.log(user)

// const userList = getUsersInRoom('center')
// console.log(userList)

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}