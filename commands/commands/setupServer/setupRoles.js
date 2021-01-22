const setupConfig = require('@root/setupConfig.json');

module.exports = {
    commands: ['setupRoles'],
    maxArgs: 0,
    permission: 'ADMINISTRATORS',
    callback: async (message, arguments) => {
        const roles = setupConfig.Roles;

        const { guild } = message;

        console.log("Adding Roles to server...")

        // Create all new roles
        console.log("Creating all roles...")
        for (let role in roles) {
            await guild.roles.create({
                data: {
                    name: role,
                    color: roles[role].Color,
                    hoist: false,
                    permissions: roles[role].Permissions,
                    mentionable: false
                },
                reason: 'Setup initial state of server',
            }).then (added => console.log(`   Added role ${added.name}`))
            .catch(console.error);

        }

        console.log("Roles Added");
        message.reply(`All role(s) for the server were added successfully.`);
    }
}
