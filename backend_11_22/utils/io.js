// 23.11.28

const userController = require("../Controllers/user.controller");
const userGroup = require("../Models/user");
const chatController = require("../Controllers/chat.controller");
const chatGroup = require("../Models/chat");
const roomController = require("../Controllers/room.controller");

// utils/io.js
// module.exports = function(io){
//   io.on("connection", async (socket)=>{
//     console.log('client is connected', socket.id)
//   })
// }

// 23.11.29 통신 관련 작업은 전부 여기서 한다.

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('client is connected', socket.id);


    //23.11.29
    //login 이라는 이름으로 불러옴
    // socket.on("login", async (userName, cb) => {
    //   //유저정보를 저장하는 함수
    //   // 통신과 관련없기 떄문에 controller 에서 처리
    //   console.log("유저네임",userName)
    // })



    // 메시지 수신
    socket.on('sendMessage', (message) => {
      console.log('Received message from client:', message);

      // 받은 메시지를 다시 클라이언트에게 전송
      io.emit('message', { name: 'Server', chat: `Received: ${message}` });
    });

    // 연결 해제
    socket.on('disconnect', () => {
      console.log('user is disconnected');
    });

    // 기존 코드에 추가한 부분
    socket.on("getAllGroups", () => {
      socket.emit("groupList", chatgroups);
    });

    socket.on("createNewGroup", (currentGroupName) => {
      console.log(currentGroupName);
      chatgroups.unshift({
        id: chatgroups.length + 1,
        currentGroupName,
        messages: [],
      });
      socket.emit("groupList", chatgroups);
    });

    socket.on("findGroup", (id) => {
      const filteredGroup = chatgroups.filter((item) => item.id === id);
      socket.emit("foundGroup", filteredGroup[0].messages);
    });

    socket.on("newChatMessage", (data) => {
      const { currentChatMesage, groupIdentifier, currentUser, timeData } = data;
      const filteredGroup = chatgroups.filter(
        (item) => item.id === groupIdentifier
      );
      const newMessage = {
        id: createUniqueId(),
        text: currentChatMesage,
        currentUser,
        time: `${timeData.hr}:${timeData.mins}`,
      };

      socket
        .to(filteredGroup[0].currentGroupName)
        .emit("groupMessage", newMessage);
      filteredGroup[0].messages.push(newMessage);
      socket.emit("groupList", chatgroups);
      socket.emit("foundGroup", filteredGroup[0].messages);
    });
  });
};
