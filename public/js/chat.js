// const { disable } = require("express/lib/application")

const socket = io()

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput= $messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

//templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationMessageTemplate=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML


const autoscroll=()=>{
   //new message
   const $newMessage=$messages.lastElementChild

   //height of the message
   const newMessageStyles=getComputedStyle($newMessage)
   const newMessageMargin=parseInt(newMessageStyles.marginBottom)
   const newMessageHeight=$newMessage.offsetHeight+newMessageMargin

  //  console.log(newMessageStyles)
  const visibleHeight=$messages.offsetHeight

  //height of messages container
  const containerHeight=$messages.scrollHeight

  //how far have i scrolled?
  const scrollOffset=$messages.scrollTop+visibleHeight

  if(containerHeight-newMessageHeight+visibleHeight){
    $messages.scrollTop=$messages.scrollHeight
  }
  }
//option 
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix : true})

socket.on('message',(message)=>{
  console.log(message)
  const html = Mustache.render(messageTemplate,{
      username:message.username,
      message :message.text,
      createdAt:moment(message.createdAt).format('h:mm A')
  })
  $messages.insertAdjacentHTML('beforeend',html)
  autoscroll()
})

socket.on('locationMessage',(message)=>{
  console.log(message)
  const html=Mustache.render(locationMessageTemplate,{
    username:message.username,
    url:message.url,
    createdAt:moment(message.createdAt).format('h:mm A')
  })
  $messages.insertAdjacentHTML('beforeend',html)
  autoscroll()
})

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
      room,
      users
    })
    document.querySelector('#sidebar').innerHTML=html
})

$messageForm.addEventListener('submit',(e)=>{
   e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
   //disable
   const message=e.target.elements.message.value

   socket.emit('sendMessage',message,(error)=>{

    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value=''
    $messageFormInput.focus()
    //enable
    if(error){
      return console.log(error)
    }
    console.log('Message Delivered!')
   })
})

$sendLocationButton.addEventListener('click',()=>{
     if(!navigator.geolocation){
        return alert('go location is not support by your location')
     }

     $sendLocationButton.setAttribute('disabled','disabled')
     navigator.geolocation.getCurrentPosition((position)=>{
       console.log(position)
       socket.emit('sendLocation',{
         latitude:position.coords.latitude,
         longitude:position.coords.longitude
       }, ()=>{
        $sendLocationButton.removeAttribute('disabled')
          console.log('location shared!')
       })
     })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
      alert(error)
      location.href='/'
    }
})
//serve(emit)->client(receive) --acknowledgement-->server

//client(emit)->server(receive)--acknowledgement-->client

