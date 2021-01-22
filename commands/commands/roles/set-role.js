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

    if (!validRoles.includes(roleName)) {
        message.reply(`please choose a valid role <valid options: Army, AirForce, Navy, PRes, RegF>.`)
        return;
    }

    const role = guild.roles.cache.find((role) => {
      return role.name === roleName
    })
    if (!role) {
      message.reply(`There is no role with the name "${roleName}"`)
      return
    }

    const member = guild.members.cache.get(targetUser.id)
    if (!member.roles.cache.get(role.id)) {
        member.roles.add(role);
    } else {
        message.reply(`You already have the role with the name "${roleName}"`)
    }
  },
  requiredRoles: ['Registered'],
  requiredChannel: botCommandChannelID,
  description: "By setting the role, the user will have access to the relevant role chatrooms"
}
