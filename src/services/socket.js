import openSocket from 'socket.io-client';
const socket = openSocket(window.location.hostname+':8000');
export default socket