const Room = require("../Models/room");
const roomController = {};

roomController.createRoom = async (currentGroupName) => {
    const newRoom = new Room({
      currentGroupName,
      messages: [],
    });
    await newRoom.save();
    return newRoom;
  };

roomController.getAllRooms = async ()=>{
    const roomList = await Room.find({});
    return roomList;
};

module.exports = roomController;