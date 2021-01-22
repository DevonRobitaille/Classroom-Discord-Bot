module.exports = {
  commands: ['enrolltutorial'],
  description: "Enrolls a group of students to a tutorial",
  minArgs: 3,
  expectedArgs: '<class name> <tutorial name> <... @member ...>',
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

      // test to see if role exists
      const roleExists = guild.roles.cache.find((r) => { return r.name === role })
      if (!roleExists) {
          message.reply("Either the class name or tutorial name supplied are not valid.");
        return
      }

       // Add role to user
       userList.forEach(user => {
           const memberID = guild.members.cache.get(user.id)
           memberID.roles.add(roleExists)
       })

       message.reply(`The user(s) now has the "${role}" role`)
  },
}
