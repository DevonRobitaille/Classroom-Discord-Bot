const { serverModerationChannelID } = require('@root/config.json');
module.exports = {
    commands: ['dropclass'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<class ID>",
    permission: 'ADMINISTRATORS',
    callback: async (message, arguments) => {
        const { guild } = message;
        const className = arguments[0];

        // Delete all class rooms
        const categoryChannels = guild.channels.cache.filter(channel => channel.type === "category" && channel.name.includes(className+"-"));

        if (categoryChannels.size > 0) {
            categoryChannels.forEach(category => {

                // // Iterate over all channels x unknown number
                category.children.forEach(channel => {
                    // delete channels
                    let channelName = channel.name;
                    channel.delete();
                    console.log(`   Deleted channel ${channelName}`);
                })

                // delete category
                let categoryName = category.name;
                category.delete();
                console.log(`Deleted category ${categoryName}`);
            });
        } else {
            message.reply(`The class name, "${className}", you provided is not a valid class name.`);
            return;
        }

        message.reply(`All channel(s) for the class, "${className}", were dropped.`)

        // Delete all roles
        const roles = guild.roles.cache.filter(role => role.name.includes(className+"-") || (role.name.includes(className+"-") && role.name.includes("Tutorial")));
        roles.forEach(role => {
            role.delete();
        });

        message.reply(`All role(s) for the class, "${className}", were dropped successfully.`);
    },
    requiredChannel: serverModerationChannelID,
    description: "Used to drop the class channels from the servers by class name"
}
