const { botCommandChannelID } = require('@root/config.json');

module.exports = {
  commands: ['setrole'],
  minArgs: 1,
  expectedArgs: " <The role name, valid options: Army, AirForce, Navy, PRes, RegF>",
  callback: (message, arguments) => {
      const validRoles = ["Army", "AirForce", "Navy", "PRes", "RegF"];

    const targetUser = message.author;

    const roleName = arguments.join(' ')
    const { guild } = message

    // Check to make that it is a valid role from the list
    if (!validRoles.includes(roleName)) {
        message.reply(`please choose a valid role <valid options: Army, AirForce, Navy, PRes, RegF>.`)
        return;
    }

    // Check to see if role exists on server
    const role = guild.roles.cache.find((role) => {
      return role.name === roleName
    })

    // Role does not exist on server
    if (!role) {
      message.reply(`There is no role with the name "${roleName}"`)
      return
    }

    // Add role to member if they do not already have the role
    const member = guild.members.cache.get(targetUser.id)
    if (!member.roles.cache.get(role.id)) {
        member.roles.add(role);
    } else {
        message.reply(`You already have the role with the name "${roleName}"`)
    }
  },
  requiredRoles: ['Registered'],
  requiredChannel: botCommandChannelID,
  description: "A user can set their own role from the allowed list"
}
