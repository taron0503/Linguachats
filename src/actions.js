export const newPartner = (partnerId) => ({ type: 'newPartner',partnerId:partnerId });
export const leftChat = (socketid) => ({ type: 'leftChat',socketid:socketid});
export const setUser = (user) => ({ type: 'setUser',user:user });
export const toggleInitReg = (show) => ({ type: 'toggleInitReg',show:show });
export const toggleInitRegToEdit = (edit) => ({ type: 'toggleInitRegToEdit',edit:edit });
export const toggleUsersWindow = (show) => ({ type: 'toggleUsersWindow',show:show });
export const toggleMessagesWindow = (show) => ({ type: 'toggleMessagesWindow',show:show });
export const toggleHeader = (show) => ({ type: 'toggleHeader',show:show });
export const addUser = (user) => ({ type: 'addUser',user:user });
export const AllOnlineUsers = (users) => ({ type: 'AllOnlineUsers',users:users });
export const deleteUser = (user) => ({ type: 'deleteUser',user:user });
export const sortUsers = (field,reverse) => ({ type: 'sortUsers',field:field,reverse:reverse });
export const addMessage = (msg) => ({ type: 'addMessage',msg:msg });
export const startTyping = (partnerId) => ({ type: 'startTyping',partnerId:partnerId });
export const endTyping = (partnerId) => ({ type: 'endTyping',partnerId:partnerId });

export const EXAMPLE = () => ({ type: 'EXAMPLE'});

export const show_EmojiPicker = () => ({ type: 'show'});
export const hide_EmojiPicker = () => ({ type: 'hide'});



