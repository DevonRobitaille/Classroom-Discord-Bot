const { serverModerationChannelID } = require('@root/config.json');
const setupConfig = require('@classConfig/classroomConfig.json');

module.exports = {
    commands: ['addclass'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<class ID>",
    permission: 'ADMINISTRATORS',
    callback: async (message, arguments) => {
        const className = arguments[0] + "-class";
        const { guild } = message;

        await addRoles(guild, className);
        message.reply(`All role(s) for the class, "${className.split("-")[0]}", were added successfully.`);;

        await addClass(guild, className);
        message.reply(`All channel(s) for the class, "${className.split("-")[0]}", were added successfully.`);;
    },
    requiredChannel: serverModerationChannelID,
    description: "To build a classroom, run this command second to add all the necessary roles to the list, run !addclassrole first"
}

// add class
addClass = async (guild, className) => {
    const categories = setupConfig.Categories;
    let classList = {};

    //Create all new channels
    // Iterate over categories
    for (let category in categories) {
        const type = categories[category].type;
        const catName = className + "-" + categories[category].name;

        // Return all channels on the server the equal the category name (should only be 0 or 1)
        classList[catName] = guild.channels.cache.find((c) => {
            return c.name === catName;
        })
        let parent = undefined;
        // if the category doesn't exist, create it
        if (!classList[catName]) {
            parent = await guild.channels.create(catName, {
                type: type
            })
        }

        // Create a list of all the channels that are below the parent category (i.e. a size of 0 to a lot)
        const channels = categories[category].Channels;

        // Iterate over channels
        for (let channel in channels) {
            // Store all the attributes for ease of reading
            const rolePermissions = channels[channel].rolePermissions;
            const type = channels[channel].type;
            const name =  className.split("-")[0] + "-" + channels[channel].name.toLowerCase();
            const allow = channels[channel].allow;
            const deny = channels[channel].deny;
            const everyone = guild.roles.everyone;

            // See if the current channel already exsists
            classList[name] = guild.channels.cache.find((c) => {
                return c.name === name && c.parent.name.toLowerCase().includes(type);
            })

            // Current channel does not already exist, so create it
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
                    let roleId = guild.roles.cache.find(r => r.name == (className.split("-")[0] + "-" + role));
                    if (roleId && Object.keys(perms).length > 0) {
                        child.createOverwrite(roleId, perms);
                    }
                }
            }
        }
    }
}

// add roles
addRoles = async (guild, className) => {
    className = className.split("-")[0];
    const roles = setupConfig.Roles;
    let roleList = {};

    // Check to see if roles already exist

    // does instructor exist
    const instructorRole = className+"-Instructor";
    roleList[instructorRole] = guild.roles.cache.filter(role => role.name.includes(instructorRole))

    // does student exist
    const studentRole = className+"-"+"Student";
    roleList[studentRole] = guild.roles.cache.filter(role => role.name.includes(studentRole))

    // does TA exist
    const TARole = className+"-TA";
    roleList[TARole] = guild.roles.cache.filter(role => role.name.includes(TARole))

    // Create all new roles
    console.log(roleList[studentRole].size);
    for (let role in roles) {
        const roleName = className + "-" + role;
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
