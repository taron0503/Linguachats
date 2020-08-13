import openSocket from 'socket.io-client';
console.log(window.location.hostname)
const socket = openSocket(window.location.hostname+':8000');
export default socket