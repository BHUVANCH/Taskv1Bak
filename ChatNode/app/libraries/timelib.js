const moment = require('moment');
const momenttz = require('moment-timezone');
const timeZone  = 'Asia/Calcutta'


now = () => {
    return moment.utc().format();
}

getLocalTime = () => {
    return moment().tz(timeZone).format("LLLL");
}

convertToLocalTime = (time) => {
    return moment.tz(time, timeZone).format('LLLL');
}

module.exports ={
    now:now,
    getLocalTime:getLocalTime,
    convertToLocalTime:convertToLocalTime
}