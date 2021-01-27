const loadCommands = require('@root/commands/load-commands')
const { prefix } = require('@root/config.json')
const { botCommandChannelID } = require('@root/config.json');

module.exports = {
  commands: ['leaveclass'],
  description: "Leaves a class as both a student and instructor",
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '<class name>',
  callback: (message, arguments, text) => {
      const { guild, member } = message;

      // See if the intructor role exists on the server
      const roleInstructor = guild.roles.cache.find((role) => {
        return role.name === arguments[0]+"-Instructor";
      })
      if (!roleInstructor) {
        message.reply(`There is no role with the name "${roleInstructor}"`)
        return
      }

      // See if the student role exists on the server
      const roleStudent = guild.roles.cache.find((role) => {
        return role.name === arguments[0]+"-Student";
      })
      if (!roleStudent) {
        message.reply(`There is no role with the name "${roleStudent}"`)
        return
      }

      // See if the TA role exists on the server
      const roleTA = guild.roles.cache.find((role) => {
        return role.name === arguments[0]+"-TA";
      })
      if (!roleTA) {
        message.reply(`There is no role with the name "${roleTA}"`)
        return
      }

      // Remove roles from server
      if (roleInstructor) {
          if (member.roles.cache.get(roleInstructor.id)) {
            member.roles.remove(roleInstructor)
            message.reply(`You no longer have the ${roleInstructor} role`)
          }
      }
      if (roleStudent) {
          if (member.roles.cache.get(roleStudent.id)) {
            member.roles.remove(roleStudent)
            message.reply(`You no longer have the ${roleStudent} role`)
          }
      }
      if (roleTA) {
          if (member.roles.cache.get(roleStudent.id)) {
            member.roles.remove(roleStudent)
            message.reply(`You no longer have the ${roleStudent} role`)
          }
      }
  },
  requiredChannel: botCommandChannelID
}
