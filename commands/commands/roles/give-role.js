const { serverModerationChannelID } = require('@root/config.json');

module.exports = {
  commands: 'giverole',
  minArgs: 2,
  expectedArgs: "<Target user's @> <The role name>",
  permissions: 'ADMINISTRATOR',
  callback: (message, arguments) => {
    const targetUser = message.mentions.users.first()
    if (!targetUser) {
      message.reply('Please specify someone to give a role to.')
      return
    }

    arguments.shift()

    const roleName = arguments.join(' ')
    const { guild } = message

    // Check to see if role exists on the server
    const role = guild.roles.cache.find((role) => {
      return role.name === roleName
    })
    
    // Role does not exist on server
    if (!role) {
      message.reply(`There is no role with the name "${roleName}"`)
      return
    }

    // Add role to user
    const member = guild.members.cache.get(targetUser.id)
    member.roles.add(role)

    message.reply(`that user now has the "${roleName}" role`)
  },
      requiredChannel: serverModerationChannelID
}
