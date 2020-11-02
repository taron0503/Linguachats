import socket from "./services/socket.js"

export const newPartner = (partnerId) => {
    return { type: 'newPartner',partnerId:partnerId }
};
export const deletePartner = ()=>({type:"deletePartner"})
export const meLeftChat = () => ({ type: 'meLeftChat'});
export const userLeftChat = (socketid) => ({ type: 'userLeftChat',socketid:socketid});
export const setUser = (user) => ({ type: 'setUser',user:user });
export const toggleInitReg = (show) => ({ type: 'toggleInitReg',show:show });
export const toggleInitRegToEdit = (edit) => ({ type: 'toggleInitRegToEdit',edit:edit });
export const toggleUsersWindow = (show) => ({ type: 'toggleUsersWindow',show:show });
export const toggleMessagesWindow = (show) => ({ type: 'toggleMessagesWindow',show:show });
export const toggleHeader = (show) => ({ type: 'toggleHeader',show:show });
export const turnLoggedIn = (loggedIn) => ({ type: 'turnLoggedIn',loggedIn:loggedIn });
// export const toggleCallingModal = (show) => ({ type: 'toggleCallingModal',show:show });
export const changeStatus = (socketid,status) => {
    socket.emit("changeStatus",{socketid:socketid,status:status})
    return { type: 'changeStatus',socketid:socketid,status:status}
};
export const changeUserStatus = (socketid,status) => ({type: 'changeUserStatus',socketid:socketid,status:status});
export const addUser = (user) => ({ type: 'addUser',user:user });
export const addUserToVideoChat = (socketid) => ({ type: 'addUserToVideoChat',socketid:socketid });
export const deleteUserFromVideoChat = (socketid) => ({ type: 'deleteUserFromVideoChat',socketid:socketid });
export const AllOnlineUsers = (users) => ({ type: 'AllOnlineUsers',users:users });
export const deleteUser = (user) => ({ type: 'deleteUser',user:user });
export const sortUsers = (field,reverse) => ({ type: 'sortUsers',field:field,reverse:reverse });
export const changeUserPosition = (userId) => ({type: 'changeUserPosition',userId:userId})

export const addMessage = (msg) => ({ type: 'addMessage',msg:msg });
export const startTyping = (partnerId) => ({ type: 'startTyping',partnerId:partnerId });
export const endTyping = (partnerId) => ({ type: 'endTyping',partnerId:partnerId });

export const EXAMPLE = () => ({ type: 'EXAMPLE'});

export const show_EmojiPicker = () => ({ type: 'show'});
export const hide_EmojiPicker = () => ({ type: 'hide'});



