// //23.11.28 app.js 추가본 굳이 쓸 이유는 없을 듯

// // server.js

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
//     origin: "http://10.0.2.2:3000/",
//   },
// });

// app.use(cors());

// mongoose.connect(process.env.DB, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log("Connected to the database"));

// // ioSettings를 호출하여 Socket.IO 설정
// ioSettings(io);

// // 포트 설정 변경
// httpServer.listen(process.env.PORT, () => {
//   console.log("server listening on port", process.env.PORT);
// });
