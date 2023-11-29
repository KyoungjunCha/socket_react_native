const express = require("express");
const app = express();

// 23.11.28 추가 라이브러리
require("dotenv").config()
const ioSettings= require("./utils/io")


const http = require("http").Server(app);
const cors = require("cors");


// 23.11.28 추가 라이브러리
const { default: mongoose } = require("mongoose");


const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://10.0.2.2:3000/",
  },
});

// 23.11.28
// const PORT = 4000;

// 23.11.28 추가
mongoose.connect(process.env.DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> console.log("Connected to the database"))
//then promise 임. fetch를 통한 값(콜백함수)이 true 일때 출력 비동기적임. response 객체 타입
//catch 는 false 일때 즉 실패일때 사유를 보여줌


function createUniqueId() {
  return Math.random().toString(20).substring(2, 10);
}

let chatgroups = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

socketIO.on("connection", (socket) => {
  console.log(`${socket.id} user is just connected`);

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

app.get("/api", (req, res) => {
  res.json(chatgroups);
});

// 23.11.28 수정
// http.listen(PORT, () => {
//   console.log(`Server is listeing on ${PORT}`);
// });

// ioSettings(io);

// 23.11.28 추가
http.listen(process.env.PORT,()=>{
    console.log("server listening on port", process.env.PORT);
})




// const express = require("express");
// const mongoose = require("mongoose");
// require("dotenv").config();
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");
// const ioSettings = require("./utils/io");

// const app = express();
// const httpServer = http.createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:3000/",
//   },
// });

// app.use(cors());
// // 23.11.28
// // const PORT = 4000;

// // 23.11.28 추가
// mongoose.connect(process.env.DB,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(()=> console.log("Connected to the database"))
// //then promise 임. fetch를 통한 값(콜백함수)이 true 일때 출력 비동기적임. response 객체 타입
// //catch 는 false 일때 즉 실패일때 사유를 보여줌

// // ioSettings(io);

// // 23.11.28 추가
// httpServer.listen(process.env.PORT,()=>{
//     console.log("server listening on port", process.env.PORT);
// })




