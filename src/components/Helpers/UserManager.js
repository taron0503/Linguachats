import axios from 'axios';

async function getUser(id){
    let res = await axios.post(`http://localhost:8080/getUser`, {id:id})
    if(res.data.user){
        let user = res.data.user
        delete user.__v
        user.id=user._id
        delete user._id
        user.fullname=user.name+" "+user.surname
        user.img = user.gender==="Male"?"avatarM.png":"avatarF.png"
        user.rooms = ["textChat"]
        user.status="free"
        return user
    }
    return ""
};

async function saveUser(user){
    let res = await axios.post(`http://localhost:8080/saveUser`, { user })
    if(res.data.saved)
        return res.data.id;
    return ""
}

async function updateUser(id,user){
    let res = await axios.post(`http://localhost:8080/updateUser`, { id,user })
    if(res.data.updated)
        return true
    return false
}

export default  {
    getUser:getUser,
    saveUser:saveUser,
    updateUser:updateUser
};