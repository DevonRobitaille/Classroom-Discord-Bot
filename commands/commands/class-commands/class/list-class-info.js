const { botCommandChannelID } = require('@root/config.json');
const Discord = require("discord.js");

module.exports = {
    commands: ['listclassesinfo', 'lci'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<class ID>",
    callback: async (message, arguments) => {
        const { guild } = message;
        const studentRoleName = arguments[0]+"-Student";
        const instructorRoleName = arguments[0]+"-Instructor";
        const TARoleName = arguments[0]+"-TA";
        const classroomName = arguments[0]+"-class-💬 Text Channels 💬";

        // has roles set
        const roleInstructor = guild.roles.cache.find(role => role.name === instructorRoleName);
        const roleStudent = guild.roles.cache.find(role => role.name === studentRoleName);
        const roleTA = guild.roles.cache.find(role => role.name === TARoleName);

        // has channels set
        const classroom = guild.channels.cache.find(channel => channel.name === classroomName);

        // Class does not exist in any form
        if (!roleInstructor && !roleStudent && !classroom && !roleTA) {
            message.reply(`Nothing exists on the server with reference to "${arguments[0]}".`);
            return;
        }

        // Instructor list
        let instructorTotalSize = 0;
        let instructorOnlineList = [];
        let instructorOfflineList = [];
        if (roleInstructor) {
            let instructorList = message.guild.roles.cache.get(roleInstructor.id).members;
            instructorList.forEach(instructor => {
                instructorTotalSize++;
                let name =  instructor.nickname || instructor.user.username;

                if (instructor.user.presence.status === 'online') instructorOnlineList.push(name);
                else instructorOfflineList.push(name);
            })
        }
        let instructorOnlineString = "";
        for (let name in instructorOnlineList) {
            instructorOnlineString += '"' + instructorOnlineList[name] + '", ' ;
        }
        instructorOnlineString = instructorOnlineString.substr(0, instructorOnlineString.length-2);

        let instructorOfflineString = "";
        for (let name in instructorOfflineList) {
            instructorOfflineString += '"' + instructorOfflineList[name] + '", ' ;
        }
        instructorOfflineString = instructorOfflineString.substr(0, instructorOfflineString.length-2);



        // Student List
        let studentTotalSize = 0;
        let studentOnlineList = [];
        let studentOfflineList = [];
        if (roleStudent) {
            let studentList = message.guild.roles.cache.get(roleStudent.id).members;
            studentList.forEach(student => {
                studentTotalSize++;
                let name =  student.nickname || student.user.username;

                if (student.user.presence.status === 'online') studentOnlineList.push(name);
                else studentOfflineList.push(name);
            })
        }
        let studentOnlineString = "";
        for (let name in studentOnlineList) {
            studentOnlineString += '"' + studentOnlineList[name] + '", ' ;
        }
        studentOnlineString = studentOnlineString.substr(0, studentOnlineString.length-2);

        let studentOfflineString = "";
        for (let name in studentOfflineList) {
            studentOfflineString += '"' + studentOfflineList[name] + '", ' ;
        }
        studentOfflineString = studentOfflineString.substr(0, studentOfflineString.length-2);



        // TA List
        let TATotalSize = 0;
        let TAOnlineList = [];
        let TAOfflineList = [];
        if (roleTA) {
            let TAList = message.guild.roles.cache.get(roleTA.id).members;
            TAList.forEach(TA => {
                TATotalSize++;
                let name =  TA.nickname || TA.user.username;

                if (TA.user.presence.status === 'online') TAOnlineList.push(name);
                else TAOfflineList.push(name);
            })
        }
        let TAOnlineString = "";
        for (let name in TAOnlineList) {
            TAOnlineString += '"' + TAOnlineList[name] + '", ' ;
        }
        TAOnlineString = TAOnlineString.substr(0, TAOnlineString.length-2);

        let TAOfflineString = "";
        for (let name in TAOfflineList) {
            TAOfflineString += '"' + TAOfflineList[name] + '", ' ;
        }
        TAOfflineString = TAOfflineString.substr(0, TAOfflineString.length-2);



        const embed = new Discord.MessageEmbed() // Define a new embed
        .setTitle(`Class: ${arguments[0]}`)
        .setColor(0xFFC300) // Set the color
        // .addField(`Roles Created`, (roleInstructor || roleStudent) ? "Yes" : "No", false)
        // .addField(`Classroom Created`, (classroom) ? "Yes" : "No", false)
        .addField(`Date Created`, (classroom) ? new Date(classroom.createdTimestamp).toLocaleDateString() : "Classroom has not been created", false)
        .addFields(
            {name: '\u200B',value: '\u200B', inline:false},
            {name: `Instructor(s) - ${instructorTotalSize}`,value: '\u200B' , inline: false},
            {name: `Online`, value: (instructorOnlineString !== "") ? instructorOnlineString : "None", inline: true },
            {name: `Offline`, value: (instructorOfflineString !== "") ? instructorOfflineString : "None", inline: true }
        )
        .addFields(
            {name: '\u200B',value: '\u200B', inline:false},
            {name: `TA(s) - ${TATotalSize}`,value: '\u200B' , inline: false},
            {name: `Online`, value: (TAOnlineString !== "") ? TAOnlineString : "None", inline: true },
            {name: `Offline`, value: (TAOnlineString !== "") ? TAOnlineString : "None", inline: true }
        )
        .addFields(
            {name: '\u200B',value: '\u200B', inline:false},
            {name: `Student(s) - ${studentTotalSize}`,value: '\u200B', inline: false},
            {name: `Online`, value: (studentOnlineString !== "") ? studentOnlineString : "None", inline: true},
            {name: `Offline`, value: (studentOfflineString !== "") ? studentOfflineString : "None", inline: true}
        )

        message.channel.send({embed});
    },
    requiredChannel: botCommandChannelID,
    description: "List all of the current active roles by class name"
}
