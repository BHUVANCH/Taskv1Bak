// Importing Mongoose
const mongoose = require('mongoose');
// Creating Mongoose Schema instance
let chatSchema = new mongoose.Schema({
    chatId: { type: String, default: '' },
    senderId: { type: String, default: '' },
    senderName: { type: String, default: '' },
    recieverId: { type: String, default: '' },
    recieverName: { type: String, default: '' },
    message: { type: String, default: '' },
    chatRoom: { type: String, default: '' },
    seen: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now },
});

mongoose.model('Chat', chatSchema);