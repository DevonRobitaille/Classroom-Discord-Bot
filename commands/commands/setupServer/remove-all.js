const setupConfig = require('@root/setupConfig.json');

module.exports = {
    commands: ['ra'],
    maxArgs: 0,
    permission: 'ADMINISTRATORS',
    callback: async (message, arguments) => {

        // Delete all roles
        message.guild.roles.cache.forEach(roles => {
            roles.delete()
            .then(deleted => console.log(`Deleted role ${deleted.name}`))
            .catch(console.error);
        });

        // Delete all channels
        message.guild.channels.cache.forEach(channel => {
            channel.delete()
            .then(deleted => console.log(`Deleted channel ${deleted.name}`))
            .catch(console.error);
        });
    }
}
