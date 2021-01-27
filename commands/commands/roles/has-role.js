const { serverModerationChannelID } = require('@root/config.json');

module.exports = {
  commands: 'hasrole',
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

    // Check to see if role exists on server
    const role = guild.roles.cache.find((role) => {
      return role.name === roleName
    })

    // role does not exist on server
    if (!role) {
      message.reply(`There is no role with the name "${roleName}"`)
      return
    }

    // Get the member based off the mention in the command
    const member = guild.members.cache.get(targetUser.id)

    // reply whether the member has the role or not
    if (member.roles.cache.get(role.id)) {
      message.reply(`That user has the ${roleName} role`)
    } else {
      message.reply(`That user does not have the ${roleName} role`)
    }
  },
      requiredChannel: serverModerationChannelID
}
