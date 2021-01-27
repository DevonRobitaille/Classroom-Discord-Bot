const loadCommands = require('@root/commands/load-commands')
const { prefix } = require('@root/config.json')
const { botCommandChannelID } = require('@root/config.json');

module.exports = {
  commands: ['withdraw'],
  description: "Disenroll a group of students from a class",
  minArgs: 2,
  expectedArgs: ' <class name> <... @member ...>',
  callback: (message, arguments, text) => {
      const { guild, member } = message;

      // Verify role includes Instructor, or permission is Administrator
      const memberRole = member.roles.cache.filter(role => role.name.includes("Instructor")); // get size > 0
      const memberPermissions = member.hasPermission("ADMINISTRATOR"); // boolean
      if (!(memberRole.size > 0 || memberPermissions)) {
          message.reply(`You do not have the role or permissions to use this command.`);
          return;
      }

      const userList = message.mentions.users;
      const className = arguments[0];

      // See if the student role exists on the server
      const roleStudent = guild.roles.cache.find((role) => {
        return role.name === className+"-Student";
      })
      if (!roleStudent) {
        message.reply(`There is no role with the name "${roleStudent}"`)
        return
      }

      // For each user listed in the command, remove the student role from them
      userList.forEach(user => {
          // remove role from user
          const memberID = guild.members.cache.get(user.id)

          if (memberID.roles.cache.get(roleStudent.id)) {
            memberID.roles.remove(roleStudent)
          }
      })

      message.reply(`All students listed from the class "${className}" have been withdrawn.`)
  },
}
