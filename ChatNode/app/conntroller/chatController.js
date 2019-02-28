const mongoose = require('mongoose');
const chatModel = mongoose.model('Chat')
const logger = require('../libraries/loogerLib');
const response = require('../libraries/standard');


all = (req,res) => {
    chatModel.find({},(err, result) => {
        if (err) {
            logger.captureError(err.message, 'ChatController: all' , 10);
            let apiResponse = response.format(true, 'Error to View Chats' , 500, null);
            res.send(apiResponse);
        } else if(result == null || result == undefined || result == '') {
            logger.captureError('No Chats to View', 'ChatController: all' , 10);
            let apiResponse = response.format(true, 'No Chats to View', 500, null);
            res.send(apiResponse);
        } else {
            logger.captureInfo('Chats Found to View', 'ChatController: all' , 10);
            let apiResponse = response.format(false , 'Found Chats to View', 200, result);
            res.send(apiResponse);
        }
    });
}



getChat = (req,res) => {
    console.log(req.query.senderId, req.query.recieverId, req.query.skip);

    { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] }

    chatModel.find({$or: [{senderId : req.query.senderId, recieverId: req.query.recieverId}, {senderId : req.query.recieverId, recieverId: req.query.senderId}] },(err, result) => {
        if (err) {
            logger.captureError(err.message, 'ChatController: all' , 10);
            let apiResponse = response.format(true, 'Error to View Chats' , 500, null);
            res.send(apiResponse);
        } else if(result == null || result == undefined || result == '') {
            logger.captureError('No Chats to View', 'ChatController: all' , 10);
            let apiResponse = response.format(true, 'No Chats to View', 500, null);
            res.send(apiResponse);
        } else {
            logger.captureInfo('Chats Found to View', 'ChatController: all' , 10);
            let apiResponse = response.format(false , 'Found Chats to View', 200, result);
            res.send(apiResponse);
        }
    }).sort({$natural:-1}).skip(Number(req.query.skip)).limit(10);
}

// { chatId: 'TcRPk_9Tt',
//   senderId: 'n71gzd85O',
//   senderName: 'Vamsi Venkat',
//   recieverId: 'FiRv9jiox',
//   recieverName: 'Chat APp',
//   message: 'hai',
//   chatRoom: '',
//   seen: false,
//   _id: 5c76fbb051d10d73d06b9fb4,
//   createdOn: 2019-02-27T21:05:50.652Z,
//   modifiedOn: 2019-02-27T21:05:52.661Z,
//   __v: 0 }

module.exports = {
    all:all,
    getChat : getChat
}
