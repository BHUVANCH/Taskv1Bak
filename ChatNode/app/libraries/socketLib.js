// let app = require('express')();
// let server = require('http').Server(app);
// Importing Token Lib for VerifyClaim 
const tokenLib = require('../libraries/tokenVerify');
const logger = require('../libraries/loogerLib');
const shortid = require('shortid');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const mongoose = require('mongoose');
const chatModel = mongoose.model('Chat');

setServer = (server) => {
    console.log('Socket Lib');
    let allOnLineUsers = [];

    let io = require('socket.io')(server);
    // Namspace Cross Socket Communication  , Global instance of IO
    let myIo = io.of('');

    // Creating socket
    myIo.on('connection', (socket) => {
        console.log('on Connection ...emitting verify User');
        socket.emit('verifyUser', '');

        // code to verify the user and make him online
        socket.on('set-user', (authToken) => {
            console.log('set User Called');
            tokenLib.verifyClaimWithOutSecret(authToken, (err, result) => {
                if (err) {
                    logger.captureError(err.message, 'socketLib: setUser', 10);
                    socket.emit('auth-error', { status: 500, error: 'Please Provide Correct Auth Token' })
                } else {
                    console.log('user Verified');
                    let currentUser = result.data;
                    // setting socket user Id
                    socket.userId = currentUser.userId;
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} is Online`);
                    // socket.emit(socket.userId, 'You are Online');

                    let userObj = { userId: currentUser.userId, fullName: fullName };
                    allOnLineUsers.push(userObj);
                    console.log(allOnLineUsers);
                    socket.emit("online-user-list", allOnLineUsers);

                    //join a room , Chat Room , Unique Room ID
                    // socket.room = 'edChat';
                    // // joining chat group room
                    // socket.join(socket.room);
                    // socket.in(socket.room).broadcast.emit('online-user-list', allOnLineUsers);
                }
            });
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
            console.log(socket.userId);
            let index = allOnLineUsers.findIndex(x => x.userId == socket.userId);
            console.log(index);
            allOnLineUsers.splice(index, 1);
            console.log(allOnLineUsers);
            socket.in(socket.room).broadcast.emit('online-user-list', allOnLineUsers);
            socket.leave(socket.room);
        });

        socket.on('chat-msg', (data) => {
            console.log('socket chat-msg called');
            console.log(data);
            console.log(data.recieverId);
            data.chatId = shortid.generate();

            // event to save Chat
            // we can set assync by settimeOut function
            setTimeout(() => {
                eventEmitter.emit('save-chat', data);
            }, 2000);
            myIo.emit(data.recieverId, data);
        });



        socket.on('typing', (data) => {
            console.log('socket typing-msg called');
            console.log(data);
            // myIo.emit('typing', data);
            socket.to(socket.room).broadcast.emit('typing', data);
        });


    }) // end of socket

    eventEmitter.on('save-chat', (data) => {
        console.log('eventEmitter chat-msg called');

        let newChat = new chatModel({
            chatId: data.chatId,
            senderId: data.senderId,
            senderName: data.senderName,
            recieverId: data.recieverId,
            recieverName: data.recieverName || '',
            message: data.message || '',
            chatRoom: data.chatRoom || '',
            createdOn: data.createdOn
        });

        newChat.save((err, result) => {
            if(err) {
                console.log(`error Occured: ${err}`);
            }else if (result == undefined || result == null || result == ''){
                console.log('Chat is Not Saved');
            }else {
                console.log('Chat Saved');
                console.log(result);
            }
        });

    });
}

module.exports = {
    setServer: setServer
}
