const { serverModerationChannelID } = require('@root/config.json');

module.exports = {
  commands: ['removerole', 'delrole', 'deleterole'],
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

    // See if role exists on server
    const role = guild.roles.cache.find((role) => {
      return role.name === roleName
    })

    // Role does not exist on server
    if (!role) {
      message.reply(`There is no role with the name "${roleName}"`)
      return
    }

    // Get user based off of mention in message
    const member = guild.members.cache.get(targetUser.id)

    // Remove role from user, if they have the role
    if (member.roles.cache.get(role.id)) {
      member.roles.remove(role)
      message.reply(`That user no longer has the ${roleName} role`)
    } else {
      message.reply(`That user does not have the ${roleName} role`)
    }
  },
      requiredChannel: serverModerationChannelID
}
