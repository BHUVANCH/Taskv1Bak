// connecting with sockets.
const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IkM1NWRYUlVqcCIsImlhdCI6MTU1MDEzODUwMTYzNywiZXhwIjoxNTUwMjI0OTAxLCJkYXRhIjp7InVzZXJJZCI6IjRrTHFGaEgzYiIsImZpcnN0TmFtZSI6IkN1c3RvbSBGaXJzdE5hbWUiLCJsYXN0TmFtZSI6IkN1c3RvbSBsYXN0TmFtZUVkaXRlZCIsImVtYWlsIjoiYWJjQGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6ODc5NTQ2MzIxNTQsImNyZWF0ZWRPbiI6bnVsbH0sImlzcyI6Ik5vZGVDaGF0Iiwic3ViIjoiYXV0aFRva2VuIn0.JjF2EYbOe04Med_eycVGhFsLEfTSjAKlFHz295lfJJA"
const userId = "4kLqFhH3b"

let chatMessage = {
  createdOn: Date.now(),
  recieverId: 'bNYFyYDxU',//putting user1's id here 
  recieverName: "Mr Xyz",
  senderId: userId,
  senderName: "Aditya Kumar"
}

let chatSocket = () => {

  socket.on('verifyUser', (data) => {

    console.log("socket trying to verify user");

    socket.emit("set-user", authToken);

  });

  socket.on(userId, (data) => {

    console.log("you received a message from " + data.senderName)
    console.log(data.message)

  });

  socket.on("online-user-list", (data) => {

    console.log("Online user list is updated. some user can online or went offline")
    console.log(data)

  });

  //room
  socket.on("someevent", (data) => {
    console.log("message is broadcasted")
    console.log(data)
  });


  $("#send").on('click', function () {

    let messageText = $("#messageToSend").val()
    chatMessage.message = messageText;
    socket.emit("chat-msg", chatMessage)

  })

  $("#messageToSend").on('keypress', function () {

    socket.emit("typing", "Aditya Kumar")

  })

  socket.on("typing", (data) => {

    console.log(data + " is typing")


  });



}// end chat socket function

chatSocket();
