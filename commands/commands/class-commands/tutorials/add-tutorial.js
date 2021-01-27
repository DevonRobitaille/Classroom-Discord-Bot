const setupConfig = require('@classConfig/tutorialConfig.json');

module.exports = {
    commands: ['addtutorial'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<tutorial name>",
    callback: async (message, arguments) => {
        const channels = setupConfig.Channels;
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
        const className = channel.name.split('-')[0];

        // Determine parent category
        const parentCategory = channel.parent;

        // Make sure parent category is a classroom
        if (!parentCategory.name.includes("class-")) {
            message.reply(`This command can only be run from inside a "Class-💬Text Channels" category.`);
            return;
        }

        await addRolesTutorial(guild, className, tutorialName);
        message.reply(`All role(s) for the tutorial, "${tutorialName}", were added successfully.`);;

        await addTutorial(guild, className, tutorialName);
        message.reply(`All channel(s) for the tutorial, "${tutorialName}", were added successfully.`);;
    },
    description: "Add a tutorial channel for the class, call this command from within the desired class category (any channel)."
}

// add class
addTutorial = async (guild, className, tutorialName) => {
    const categories = setupConfig.Categories;
    let classList = {};

    //Create all new channels
    // Iterate over categories
    for (let category in categories) {
        const type = categories[category].type;
        const catName = className + "-" + tutorialName + "-" + categories[category].name;

        // Create a list of all categories that would match the newly created category
        classList[catName] = guild.channels.cache.find((c) => {
            return c.name === catName;
        })
        let parent = undefined;
        // if the category does not already exist, then create it
        if (!classList[catName]) {
            parent = await guild.channels.create(catName, {
                type: type
            })
        }

        const channels = categories[category].Channels;

        // Iterate over channels
        for (let channel in channels) {
            const rolePermissions = channels[channel].rolePermissions;
            const type = channels[channel].type;
            const name =  className + "-" + tutorialName + "-" + channels[channel].name.toLowerCase();
            const allow = channels[channel].allow;
            const deny = channels[channel].deny;
            const everyone = guild.roles.everyone;

            // Create a list of all channels that would match the newly created the channel
            classList[name] = guild.channels.cache.find((c) => {
                return c.name === name && c.parent.name.toLowerCase().includes(type) && c.type === type;
            })

            // if the channel does not already exist, then create it
            if (!classList[name]) {
                let child = await guild.channels.create(name, {
                    type: (type) ? type : "text",
                    parent: (classList[catName]) ? classList[catName].id : parent.id,
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
                    let roleId = guild.roles.cache.find(r => r.name == (className.split("-")[0]+ "-" + tutorialName + "-" + role));
                    if (roleId && Object.keys(perms).length > 0) {
                        child.createOverwrite(roleId, perms);
                    }
                }
                if (rolePermissions["Instructor"]) {
                    let perms = rolePermissions["Instructor"];
                    let roleId = guild.roles.cache.find(r => r.name == (className.split("-")[0]+ "-" + "Instructor"));
                    if (roleId && Object.keys(perms).length > 0) {
                        child.createOverwrite(roleId, perms);
                    }
                }
                if (rolePermissions["TA"]) {
                    let perms = rolePermissions["TA"];
                    let roleId = guild.roles.cache.find(r => r.name == (className.split("-")[0]+ "-" + "TA"));
                    if (roleId && Object.keys(perms).length > 0) {
                        child.createOverwrite(roleId, perms);
                    }
                }
            }
        }
    }
}

// add roles
addRolesTutorial = async (guild, className, tutorialName) => {
    className = className.split("-")[0];
    const roles = setupConfig.Roles;
    let roleList = {};

    // Check to see if roles already exist

    // does tutorial exist
    const tutorialRole = className+"-"+tutorialName+"-"+"Tutorial";
    roleList[tutorialRole] = guild.roles.cache.filter(role => role.name.includes(tutorialRole))

    // Create all new roles
    for (let role in roles) {
        const roleName = className+"-"+tutorialName+ "-" + role;
        if (roleList[roleName].size < 1) {
            console.log(`Added role, "${roleName}".`)
            await guild.roles.create({
                data: {
                    name: roleName ,
                    color: roles[role].Color,
                    permissions: roles[role].Permissions,
                }
            }).catch(console.error);
        } else {
            console.log(`Role, "${roleName}", already exists`)
        }
    }
}
