const check = '✅'
let registered = false
const { botCommandChannelID, ticketChannelID } = require('@root/config.json');


const registerEvent = (client) => {
  if (registered) {
    return
  }

  registered = true

  console.log('REGISTERING EVENTS')

  client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) {
      return
    }

    console.log('HANDLING REACTION')
    const { message } = reaction
    let channelId = message.guild.channels.cache.find((channel) => { return channel.name === ticketChannelID });

    if (message.channel.id === channelId.id) {
      message.delete()
    }
  })
}

module.exports = {
  commands: ['ticket', 'support'],
  minArgs: 1,
  expectedArgs: '<message>',
  description: 'Creates a support ticket.',
  callback: (userMessage, arguments, text, client) => {
    const { guild, member } = userMessage

    registerEvent(client)

    // Find the ticket channel id
    let channelId = guild.channels.cache.find((channel) => { return channel.name === ticketChannelID });
    const channel = guild.channels.cache.get(channelId.id)
    // Send a message to the channel containing the ticket info
    channel
      .send(
        `A new ticket has been created by <@${member.id}>

"${text}"

Click the ${check} icon when this issue has been resolved.`
      )
      .then((ticketMessage) => {
          // reply to user that their ticket has been sent
        ticketMessage.react(check)

        userMessage.reply(
          'Your ticket has been sent! Expect a reply within 24 hours.'
        )
      })
  },
  requiredChannel: botCommandChannelID
}
