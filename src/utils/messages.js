const generateMessage=(username,text)=>{
   return{
    username,
    text,
    createdAt:new Date().getTime()
   }
}

const generatorLocationMessage =(username,url)=>{
    return{
        username,
        url,
        createdAt:new Date().getTime()
    }
}

module.exports={
    generateMessage,
    generatorLocationMessage
}
