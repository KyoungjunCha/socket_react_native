//11.28 추가 테스트 유저 컨트롤러
//11.23.29 controller 에서 데이터 관련 작업을 한다.

const User = require("../Models/user")
const userController={}

//유저정보 저장함수
userController.saveUser=async(userName,sid)=>{
    // 이미 있는 유저인지 확인
    let user = await User.findOne({name:userName});

    // 없다면 새로 유저정보 만들기
    if(!user){
        user = new User({
            name:userName,
            token:sid,
            online:true
        })
    }
    // 이미 있는 유저라면 token 값 sid 만 변경
    user.token = sid;
    user.online = true;

    await user.save();
    return user;
}

userController.checkUser= async(sid)=>{
    const user = await User.findOne({token:sid});
    if(!user) throw new Error("user not found");
    return user;
};
module.exports = userController