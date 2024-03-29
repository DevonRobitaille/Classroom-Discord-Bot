const { botCommandChannelID } = require('@root/config.json');

module.exports = {
  commands: 'ping',
  callback: (message, arguments, text, client) => {
    message.reply('Calculating ping...').then((resultMessage) => {
      const ping = resultMessage.createdTimestamp - message.createdTimestamp

      resultMessage.edit(`Bot latency: ${ping}, API Latency: ${client.ws.ping}`)
    })
  },
  description: "Reply with bot latency.",
  requiredChannel: botCommandChannelID
}
