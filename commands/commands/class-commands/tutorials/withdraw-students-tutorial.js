const loadCommands = require('@root/commands/load-commands')
const { prefix } = require('@root/config.json')
const { botCommandChannelID } = require('@root/config.json');

module.exports = {
  commands: ['withdrawtutorial'],
  description: "Disenroll a group of students from a tutorial",
  minArgs: 3,
  expectedArgs: '<class name> <tutorial name> <... @member ...> ',
  callback: (message, arguments, text) => {
      const { guild, member } = message;

      // Verify role includes Instructor, or permission is Administrator
      const memberRole = member.roles.cache.filter(role => role.name.includes("Instructor")); // get size > 0
      const memberPermissions = member.hasPermission("ADMINISTRATOR"); // boolean
      if (!(memberRole.size > 0 || memberPermissions)) {
          message.reply(`You do not have the role or permissions to use this command.`);
          return;
      }

      const className = arguments[0];
      const role = arguments[0]+ "-" + arguments[1] + "-Tutorial";
      const userList = message.mentions.users;

      const roleTutorial = guild.roles.cache.find((r) => { return r.name === role })
      if (!roleTutorial) {
          message.reply("Either the class name or tutorial name is invalid.");
        return
      }

      userList.forEach(user => {
          // remove role from user
          const memberID = guild.members.cache.get(user.id)

          if (memberID.roles.cache.get(roleTutorial.id)) {
            memberID.roles.remove(roleTutorial)
          }
      })

      message.reply(`All students listed from the tutorial "${className}" have been withdrawn.`)
  },
}
