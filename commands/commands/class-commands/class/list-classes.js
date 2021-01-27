const { serverModerationChannelID } = require('@root/config.json');
module.exports = {
    commands: ['listclasses', 'lc'],
    maxArgs: 0,
    permission: 'ADMINISTRATORS',
    callback: async (message, arguments) => {
        const { guild } = message;

        // Create a list of all classrooms
        const classListChannels = guild.channels.cache.filter(channel => channel.type === "category" && channel.name.includes("-class-💬 Text Channels 💬"));
        let classList = "";
        classListChannels.forEach(c => {
            classList += '"' + c.name.split("-")[0] + '", ' ;
        })
        let classes = classList.substr(0, classList.length-2);

        if (classListChannels.size < 1) {
            message.reply("There are no currently active classes.");
            return;
        }

        // Reply list of all classrooms
        message.reply(`A list of all the currently active classrooms:
${classes}`);
    },
    requiredChannel: serverModerationChannelID,
    description: "List all of the current active classrooms"
}
