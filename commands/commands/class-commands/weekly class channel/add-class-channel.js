const setupConfig = require('@classConfig/weeklyChannelConfig.json');

module.exports = {
    commands: ['addweek'],
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
        if (!parentCategory.name.includes("class-Text")) {
            message.reply(`This command can only be run from inside a "Classrom-Text Channels" category.`);
            return;
        }

        // Check to make sure week doesn't already exist
        let channelExists = false;
        parentCategory.children.forEach(channel => {
            const channelName = channel.name;
            const targetChannelName = (className+"-week-"+weekNumber);
            if (channelName === targetChannelName) {
                channelExists = true;
            }
        })

        if (channelExists) {
            message.reply(`That weekly channel already exists.`);
            return;
        }

        // Add channel to parent category
        for (let channel in channels) {
            const rolePermissions = channels[channel].rolePermissions;
            const type = channels[channel].type;
            const name =  className + "-" + channels[channel].name + "-" + weekNumber;
            const allow = channels[channel].allow;
            const deny = channels[channel].deny;
            const everyone = guild.roles.everyone;

            let child = await guild.channels.create(name, {
                type: (type) ? type : "text",
                parent: parentCategory.id,
                permissionOverwrites: [
                    {
                        id: everyone.id,
                        allow: (allow) ? allow : [],
                        deny: (deny) ? deny : [],
                    },
                ],
            })

            // Iterate over permissions
            for (let role in rolePermissions) {
                let perms = rolePermissions[role];
                let roleId = guild.roles.cache.find(r => r.name == (className + "-" + role));
                if (roleId && Object.keys(perms).length > 0) {
                    child.createOverwrite(roleId, perms);
                }
            }
        }


        message.reply(`Week ${weekNumber} channel for class, "${className}", was added successfully.`);
    },
    description: "Add a weekly channel for the class, call this command from within the desired class category (any channel)."
}
