require('module-alias/register')

const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('@root/config.json')
const loadCommands = require('@root/commands/load-commands')
const commandBase = require('@root/commands/command-base')
const loadFeatures = require('@root/features/load-features')

client.on('ready', async () => {
  console.log('The client is ready!')

  loadCommands(client)
  loadFeatures(client)

  client.user.setActivity('the mainframe', { type: 'WATCHING' })
  .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
  .catch(console.error);

})

client.login(config.token)
