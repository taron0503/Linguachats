export const newPartner = (partnerId) => ({ type: 'newPartner',partnerId:partnerId });
export const leftChat = (partnerId) => ({ type: 'leftChat',partnerId:partnerId });
export const setUser = (user) => ({ type: 'setUser',user:user });
export const toggleInitReg = (show) => ({ type: 'toggleInitReg',show:show });
export const toggleInitRegToEdit = (edit) => ({ type: 'toggleInitRegToEdit',edit:edit });
export const toggleUsersWindow = (show) => ({ type: 'toggleUsersWindow',show:show });
export const addUser = (user) => ({ type: 'addUser',user:user });
export const AllOnlineUsers = (users) => ({ type: 'AllOnlineUsers',users:users });
export const deleteUser = (user) => ({ type: 'deleteUser',user:user });
export const addMessage = (msg) => ({ type: 'addMessage',msg:msg });

export const EXAMPLE = () => ({ type: 'EXAMPLE'});

export const show_EmojiPicker = () => ({ type: 'show'});
export const hide_EmojiPicker = () => ({ type: 'hide'});



