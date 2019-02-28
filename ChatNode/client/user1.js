// import io from 'socket.io-client';
// connection with Socket on Server
const socket = io('http://localhost:3000');
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Illkb3N3WWZISyIsImlhdCI6MTU1MDExNTAwMTExOSwiZXhwIjoxNTUwMjAxNDAxLCJkYXRhIjp7InVzZXJJZCI6ImJOWUZ5WUR4VSIsImZpcnN0TmFtZSI6IkN1c3RvbSBGaXJzdE5hbWUiLCJsYXN0TmFtZSI6IkN1c3RvbSBsYXN0TmFtZUVkaXRlZCIsImVtYWlsIjoiamtsQGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6ODc5NTQ2MzIxNTQsImNyZWF0ZWRPbiI6IjIwMTktMDItMTJUMTg6NTA6MDkuOTA2WiJ9LCJpc3MiOiJOb2RlQ2hhdCIsInN1YiI6ImF1dGhUb2tlbiJ9.-ZU9_Nt2dcxPNWyKNOgyMRUDjLDED40pVRmvZfpLOyw';
const userId = 'bNYFyYDxU';

let chatMessage = {
    createdOn: Date.now(),
    recieverId: '4kLqFhH3b',
    recieverName: 'Mr Xyz',
    senderId: userId,
    senderName: 'Mr Abc'
};

let chatSocket = () => {
        socket.on('verifyUser',(data) => {
            console.log('socket trying to verify user');
            socket.emit('set-user', authToken);
        });

        socket.on(userId,(data) => {
            console.log('you recieved message from '+ data.senderName);
            console.log(data.message);
        });

        socket.on('auth-error',(data) => {
            console.log('you recieved message from '+ data.senderName);
            console.log(data.message);
        });

        socket.on("online-user-list", (data) => {

            console.log("Online user list is updated. some user can online or went offline")
            console.log(data)
        
          });

        //   socket.emit("online-user-list", () => {

        //     console.log("Online user list is updated. some user can online or went offline")
        //     console.log(data)
        
        //   });

          //room
          socket.on("someevent", (data) => {
            console.log("message is broadcasted")
            console.log(data)
          });

          // Send Message on Button  Click
          $('#send').on('click', () => {
              let messageText = $('#messageToSend').val();
              chatMessage.message = messageText;
              socket.emit('chat-msg' , chatMessage);
          });

          // Typing Event
          $('#messageToSend').on('keypress', () => {
              socket.emit('typing', 'Mr Abc');
          });

          socket.on('typing', (data) => {
              console.log(`${data} is Typing`);
          });


}

chatSocket();
