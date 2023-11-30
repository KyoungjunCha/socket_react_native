// 23.11.28

const userController = require("../Controllers/user.controller");
// const userGroup = require("../Models/user");
const chatController = require("../Controllers/chat.controller");
// const chatGroup = require("../Models/chat");
const roomController = require("../Controllers/room.controller");
const room = require("../Models/room");

// utils/io.js
// module.exports = function(io){
//   io.on("connection", async (socket)=>{
//     console.log('client is connected', socket.id)
//   })
// }

// 23.11.29 통신 관련 작업은 전부 여기서 한다.

module.exports = function (io) {
  io.on('connection', async (socket) => {
    console.log('client is connected', socket.id);

    socket.emit("rooms", await roomController.getAllRooms());

    //23.11.29
    //23.11.30
    //login 이라는 이름으로 불러옴
    socket.on("login", async (userName, cb) => {
      //유저정보를 저장하는 함수
      // 통신과 관련없기 떄문에 controller 에서 처리
      // token 은 접속된 유저 아이디 socket.id
      try {
        const user = await userController.saveUser(userName, socket.id);
        cb({ ok: true, data: user })
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    socket.on("sendMessage", async (message, cb) => {
      try {

        //유저찾기 socket.id
        const user = await userController.checkUser(socket.id);

        //메시지 저장
        const newMessage = await chatController.saveChat(message, user);
        //유저정보 저장과는 형식이 다름.
        //브로드캐스팅? 개념으로 전송해야하는 듯
        io.emit("message", newMessage)
        cb({ ok: true })

      } catch (error) {
        cb({ ok: false, error: error.message })
      }
    })


    


    // // 메시지 수신
    // socket.on('sendMessage', (message) => {
    //   console.log('Received message from client:', message);

    //   // 받은 메시지를 다시 클라이언트에게 전송
    //   io.emit('message', { name: 'Server', chat: `Received: ${message}` });
    // });

    // 연결 해제
    socket.on('disconnect', () => {
      console.log('user is disconnected');
    });


    // MongoDB에서 모든 그룹을 가져와서 클라이언트에게 전송
    socket.on('getAllGroups', async () => {
      try {
        const groups = await Chat.find();
        socket.emit('groupList', groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    });


    // 새로운 그룹을 MongoDB에 추가하고 클라이언트에게 전송
    socket.on('createNewGroup', async (currentGroupName) => {
      try {
        // room.controller의 메서드를 사용하여 새로운 그룹을 추가
        const newRoom = await roomController.createRoom(currentGroupName);
    
        // 변경된 그룹 목록을 모든 클라이언트에게 전송
        const rooms = await roomController.getAllRooms();
        io.emit('groupList', rooms);
      } catch (error) {
        console.error('Error creating new group:', error);
      }
    });


   // MongoDB에서 특정 그룹을 찾아서 클라이언트에게 전송
    socket.on('findGroup', async (id) => {
      try {
        const group = await Chat.findById(id);
        if (group) {
          socket.emit('foundGroup', group.messages);
        }
      } catch (error) {
        console.error('Error finding group:', error);
      }
    });


   // MongoDB에 새로운 채팅 메시지 추가하고 클라이언트에게 전송
   socket.on('newChatMessage', async (data) => {
    const { currentChatMesage, groupIdentifier, currentUser, timeData } = data;
    try {
      const group = await Chat.findById(groupIdentifier);
      if (group) {
        const newMessage = {
          id: createUniqueId(),
          text: currentChatMesage,
          currentUser,
          time: `${timeData.hr}:${timeData.mins}`,
        };

        group.messages.push(newMessage);
        await group.save();

        // 해당 그룹에 속한 클라이언트에게 메시지 전송
        io.to(group.currentGroupName).emit('groupMessage', newMessage);

        // 변경된 그룹 목록을 모든 클라이언트에게 전송
        const groups = await Chat.find();
        io.emit('groupList', groups);
      }
    } catch (error) {
      console.error('Error adding new chat message:', error);
    }
  });
  });
};
