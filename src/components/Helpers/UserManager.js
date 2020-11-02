import axios from 'axios';



async function getUser(){
    let res = await axios.post(`/getUser`,{},{withCredentials: true})
    if(res.data.user){
        let user = res.data.user
        delete user.__v
        user.id=user._id
        delete user._id
        user.fullname=user.name+" "+user.surname
        user.img = user.profile_image_src
        user.rooms = ["textChat"]
        user.status="free"
        return user
    }
    return ""
};

async function saveUser(user){
    let res = await axios.post("/saveUser",{user:user},{withCredentials: true})
    console.log(res.data)
    if(res.data.saved)
        return true;
    return false
}

async function updateUser(id,user){
    let res = await axios.post(`/updateUser`, { id,user })
    if(res.data.updated)
        return true
    return false
}

async function deleteUser(){
    let res = await axios.post(`/deleteUser`,{}, {withCredentials: true})
}

export default  {
    getUser:getUser,
    saveUser:saveUser,
    updateUser:updateUser,
    deleteUser:deleteUser,
};