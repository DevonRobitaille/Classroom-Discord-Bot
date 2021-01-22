const setupConfig = require('@root/setupConfig.json');

module.exports = {
    commands: ['setupChannels'],
    maxArgs: 0,
    permission: 'ADMINISTRATORS',
    callback: async (message, arguments) => {
        const categories = setupConfig.Categories;

        const { guild } = message;

        // Test to make sure roles exist for the channels
        // Create list of needed roles
        const roles = setupConfig.Roles;
        let neededRoles = [];
        for (let role in roles) {
            neededRoles.push(role);
        }
        // Create list of current roles on server
        let existingRoles = [];
        guild.roles.cache.forEach(role => existingRoles.push(role.name));
        // for (let role in guild.roles.cache) {
        //     existingRoles.push(role.name);
        // }
        // Compare lists
        console.log(neededRoles);
        console.log(existingRoles);
        let checker = (arr, target) => target.every(v => arr.includes(v));
        if (!checker(existingRoles, neededRoles)) {
            message.reply(`The necessary roles to create the server do not exist. Please <!setupRoles> first. `);
            return;
        }

        console.log("Adding channels to server...")

        console.log("Creating all channels...");
        //Create all new channels
        // Iterate over categories
        for (let category in categories) {
            const type = categories[category].type;
            const name = categories[category].name;

            let parent = await guild.channels.create(name, {
                type: type
            })

            console.log(`   Added channel ${parent.name}`);

            const channels = categories[category].Channels;

            // Iterate over channels
            for (let channel in channels) {
                const rolePermissions = channels[channel].rolePermissions;
                const type = channels[channel].type;
                const name = channels[channel].name;
                const allow = channels[channel].allow;
                const deny = channels[channel].deny;
                const everyone = guild.roles.everyone;

                let child = await guild.channels.create(name, {
                   type: (type) ? type : "text",
                   parent: parent.id,
                   permissionOverwrites: [
                       {
                            id: everyone.id,
                            allow: (allow) ? allow : [],
                            deny: (deny) ? deny : [],
                        },
                    ],
               })

               console.log(`   Added channel ${child.name}`)

               // Iterate over permissions
               for (let role in rolePermissions) {
                   let perms = rolePermissions[role];
                   let roleId = guild.roles.cache.find(r => r.name == role);
                   if (roleId && Object.keys(perms).length > 0) {
                       console.log(`      Overwriting Permissions for "${role}"`);
                       child.createOverwrite(roleId, perms);
                   }
               }
            }
        }

        console.log("Channels Added");
        message.reply(`All Channel(s) for the server were added successfully. Please delete this channel and its parent category.`)
    }
}
