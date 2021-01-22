module.exports = {
    commands: ['droptutorial'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<tutorial name>",
    callback: async (message, arguments) => {
        const tutorialName = arguments[0];

        const { guild, member, channel } = message;

        // Verify role includes Instructor, or permission is Administrator
        const memberRole = member.roles.cache.filter(role => role.name.includes("Instructor")); // get size > 0
        const memberPermissions = member.hasPermission("ADMINISTRATOR"); // boolean
        if (!(memberRole.size > 0 || memberPermissions)) {
            message.reply(`You do not have the role or permissions to use this command.`);
            return;
        }

        // Determine class name based on channel called inside of
        const channelClassName = channel.name.split('-')[0];

        // Determine parent category
        const parentCategory = channel.parent;

        // Make sure parent category is a class or the valid tutorial room
        if (!parentCategory.name.includes("class-Text") && !parentCategory.name.includes(channelClassName + "-" + tutorialName + "-")){
            message.reply(`This command can only be run from inside a "Classrom-Text Channels" or inside the tutorial "${tutorialName}" category.`);
            return;
        }

        // get tutorial category
        const tutorialCategoryName =  channelClassName + "-" + tutorialName + "-Tutorial";
        let tutorialChannels = guild.channels.cache.filter(c => c.name === tutorialCategoryName);
        if (tutorialChannels.size > 0) {
            tutorialChannels.forEach(category => {

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
        }
        message.reply(`All channel(s) for the tutorial, "${tutorialName}", were dropped.`)

        // Delete all roles
        const roles = guild.roles.cache.filter(role => role.name === channelClassName + "-"+ tutorialName + "-"+ "Tutorial");
        roles.forEach(role => {
            role.delete();
        });
        message.reply(`All role(s) for the tutorial, "${tutorialName}", were dropped successfully.`);
    },
    description: "Drop a tutorial channel for the class, call this command from within the desired class category (any channel)."
}
