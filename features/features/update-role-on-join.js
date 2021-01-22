module.exports = (client) => {
  client.on('guildMemberAdd', (member) => {

      const role = member.guild.roles.cache.find((role) => { return role.name === "Not Registered" });

      member.roles.add(role)
  })
}
