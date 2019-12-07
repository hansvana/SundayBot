var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    switch (message) {
        case 'Is het al zondag?': 
            var response = '';

            var now = new Date();
            
            if (now.getDay() == 0) {
                response = 'Ja het is zondag! 🎉';
            } else {
                var nextSunday = nextDay(new Date(), 0, 19, 30);
                response = `Het duurt nog maar ${diff_years(now, nextSunday)} jaar totdat het zondag is, dus het is praktisch al zondag!`;
            }

            bot.sendMessage({
                to: channelID,
                message: response
            });
            break;
        case 'Hoe lang nog?':
            var response = '';    
            var now = new Date();
            if (now.getDay() == 0) {
                response = 'Het is zondag! 🎉';
            } else {
                var nextSunday = nextDay(new Date(), 0, 19, 30);
                var diff = nextSunday - now;
                var diffsecs = diff / 1000;
                var diffmins = diffsecs / 60;
                var diffhrs = diffmins / 60;
                var diffdays = diffhrs / 24;
                var diffyrs = diffdays / 365.25;
                response += 'Volgens mijn interne klok is het: ' + now;
                response += '\nVolgens mij is aanstaande zondag: ' + nextSunday;
                response += '\nNog: \n';
                response += Math.floor(diffsecs) + ' seconden of\n';
                response += Math.floor(diffmins) + ' minuten of \n';
                response += diffhrs.toFixed(1) + ' uur of \n';
                response += diffdays.toFixed(1) + ' dagen of \n';
                response += diffyrs + ' jaar';
            }

            bot.sendMessage({
                to: channelID,
                message: response
            });
    }
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    // if (message.substring(0, 1) == '!') {
    //     var args = message.substring(1).split(' ');
    //     var cmd = args[0];
       
    //     args = args.splice(1);
    //     switch(cmd) {
    //         // !ping
    //         case 'ping':
    //             bot.sendMessage({
    //                 to: channelID,
    //                 message: 'Pong!'
    //             });
    //         break;
    //         // Just add any case commands if you want to..
    //      }
    //  }
});


function diff_years(dt2, dt1) {
    var diff = dt1 - dt2;
    diff /= (1000 * 60 * 60 * 24 * 365.25);
    return diff;
}

function nextDay(d, dow, hrs = 0, min = 0) {
    d.setDate(d.getDate() + (dow + (7 - d.getDay())) % 7);
    d.setHours(hrs);
    d.setMinutes(min);
    return d;
}