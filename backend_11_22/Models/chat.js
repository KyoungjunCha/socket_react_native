//11.28 추가 테스트 채팅 모델

const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    chat: String,
    user: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        name: String,
    },
    room:{
        type:mongoose.Schema.ObjectId,
        ref:"Room",
    }
},
    { timestamps: true } // 수정: "timestamp" → "timestamps"
);

module.exports = mongoose.model("Chat", chatSchema);
