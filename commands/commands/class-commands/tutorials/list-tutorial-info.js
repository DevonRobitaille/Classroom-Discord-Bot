const { botCommandChannelID } = require('@root/config.json');
const Discord = require("discord.js");

module.exports = {
    commands: ['listtutorialinfo', 'lti'],
    minArgs: 2,
    maxArgs: 2,
    expectedArgs: "<class ID> <tutorial ID>",
    callback: async (message, arguments) => {
        const { guild } = message;
        const tutorialRoleName =  arguments[0] + "-" + arguments[1] + "-Tutorial";
        const tutorialName = arguments[0] + "-" + arguments[1] + "-Tutorial";

        // has roles set
        const roleTutorial = guild.roles.cache.find(role => role.name === tutorialRoleName);

        // has channels set
        const tutorialRoom = guild.channels.cache.find(channel => channel.name === tutorialName);

        // Class does not exist in any form
        if (!roleTutorial && !tutorialRoom) {
            message.reply(`Nothing exists on the server with reference to the tutorial "${arguments[1]}".`);
            return;
        }

        // Instructor list
        let tutorialTotalSize = 0;
        let tutorialOnlineList = [];
        let tutorialOfflineList = [];
        if (roleTutorial) {
            let tutorialList = message.guild.roles.cache.get(roleTutorial.id).members;
            tutorialList.forEach(tutorial => {
                tutorialTotalSize++;
                let name =  tutorial.nickname || tutorial.user.username;

                if (tutorial.user.presence.status === 'online') tutorialOnlineList.push(name);
                else tutorialOfflineList.push(name);
            })
        }
        let tutorialOnlineString = "";
        for (let name in tutorialOnlineList) {
            tutorialOnlineString += '"' + tutorialOnlineList[name] + '", ' ;
        }
        tutorialOnlineString = tutorialOnlineString.substr(0, tutorialOnlineString.length-2);

        let tutorialOfflineString = "";
        for (let name in tutorialOfflineList) {
            tutorialOfflineString += '"' + tutorialOfflineList[name] + '", ' ;
        }
        tutorialOfflineString = tutorialOfflineString.substr(0, tutorialOfflineString.length-2);

        const embed = new Discord.MessageEmbed() // Define a new embed
        .setTitle(`Tutorial: ${arguments[0]} - ${arguments[1]}`)
        .setColor(0xFFC300) // Set the color
        .addField(`Roles Created`, (roleTutorial) ? "Yes" : "No", false)
        .addField(`Classroom Created`, (tutorialRoom) ? "Yes" : "No", false)
        .addField(`Date Created`, (tutorialRoom) ? new Date(tutorialRoom.createdTimestamp).toLocaleDateString() : "Tutorial has not been created", false)
        .addFields(
            {name: `Student(s) of Tutorial ${arguments[1]} - ${tutorialTotalSize}`,value: '\u200B', inline: false},
            {name: `Online`, value: (tutorialOnlineString !== "") ? tutorialOnlineString : "None", inline: true},
            {name: `Offline`, value: (tutorialOfflineString !== "") ? tutorialOfflineString : "None", inline: true}
        )

        message.channel.send({embed});
    },
    requiredChannel: botCommandChannelID,
    description: "List all of the current active roles by class name"
}
