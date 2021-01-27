const setupConfig = require('@classConfig/weeklyChannelConfig.json');

module.exports = {
    commands: ['dropweek'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<week number (i.e. 1, 2, 3, etc.)>",
    callback: async (message, arguments) => {
        const channels = setupConfig.Channels;
        const weekNumber = arguments[0];

        const { guild, member, channel } = message;

        // Verify role includes Instructor, or permission is Administrator
        const memberRole = member.roles.cache.filter(role => role.name.includes("Instructor")); // get size > 0
        const memberPermissions = member.hasPermission("ADMINISTRATOR"); // boolean
        if (!(memberRole.size > 0 || memberPermissions)) {
            message.reply(`You do not have the role or permissions to use this command.`);
            return;
        }

        // Determine class name
        const className = channel.name.split('-')[0];

        // Determine parent category
        const parentCategory = channel.parent;

        // Make sure parent category is a classroom
        if (!parentCategory.name.includes("class")) {
            message.reply(`This command can only be run from inside a "Class-💬Text Channels" category.`);
            return;
        }

        // Check to make sure week does already exist
        let channelName = (className+"-📅-week-"+weekNumber);
        const channelsList = parentCategory.children.filter(channel => channel.name === channelName);
        if (channelsList.size > 0) {
            channelsList.forEach(c => {
                c.delete();
            });
        } else {
            message.reply(`No channel with the name, "${weekNumber}", exists.`)
        }

        message.reply(`Week ${weekNumber} channel for class, "${className}", was added removed.`);
    },
    description: "Drop a weekly channel for the class, call this command from within the desired class category (any channel)."
}
