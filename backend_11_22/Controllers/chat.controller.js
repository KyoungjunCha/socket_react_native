//11.28 추가 테스트 채팅 컨트롤러


const Chat = require("../Models/chat")
const chatController={}

chatController.saveChat = async(message,user)=>{
    const newMessage = new Chat({
        chat: message,
        user:{
            //mongodb 문법 _id 새로 생김 , 데이터 생길때마다 생김
            id:user._id,
            name:user.name
        }
    })
    await newMessage.save();
    return newMessage;

}

module.exports=chatController