import io from 'socket.io-client';
import { CONST } from "../../appRedux/sagas/HTTP"
import { localstorage_id, socketDomain } from '../../constants/global';

let socket = null;

let userId = JSON.parse(localStorage.getItem(`user_id_${localstorage_id}`))?.data?.userId

let domain = socketDomain
  



export const initSocket = () => {
    if (!socket) {
        socket = io(CONST.SOCKET_URL, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: Infinity, 
            reconnectionDelay: 1000, 
            reconnectionDelayMax: 5000, 
            randomizationFactor: 0.5 
        });


        socket.emit('reconnect', {userId, domain}, () => {
            console.warn('Socket reConnect');
        });


        socket.on('connect', () => {
            console.warn('Socket connected');
        });

        socket.on('disconnect', () => {
            console.warn('Socket disconnected');
            reconnectSocket();
        });

        socket.on('reconnect', (attemptNumber) => {
            console.warn(`Socket reconnected after ${attemptNumber} attempts`);
        });

        socket.on('reconnect_attempt', () => {
            console.warn('Attempting to reconnect...');
        });

        socket.on('reconnect_error', (error) => {
            console.error('Reconnection attempt failed:', error);
        });
    }

    return socket;
};

const reconnectSocket = () => {
    if (socket) {
        socket.connect();
        console.warn('Socket reconnected');
    }
};
export const getSocket = () => {
    return socket;
};
