const loadCommands = require('@root/commands/load-commands')
const { prefix } = require('@root/config.json')
const { botCommandChannelID, botID } = require('@root/config.json');
const Discord = require('discord.js')

module.exports = {
    commands: ['help2', 'h2'],
    description: "Describes all of this bot's commands",
    callback: (message, arguments, text) => {
        const commandsPerPage = 3;
        const commands = loadCommands()

        let commandList = [];

        for (const command of commands) {
            // Check for permissions
            let permissions = command.permission

            if (permissions) {
                let hasPermission = true
                if (typeof permissions === 'string') {
                    permissions = [permissions]
                }

                for (const permission of permissions) {
                    if (!message.member.hasPermission(permission)) {
                        hasPermission = false
                        break
                    }
                }

                if (!hasPermission) {
                    continue
                }
            }

            // Format the text
            const mainCommand =
            typeof command.commands === 'string'
            ? command.commands
            : command.commands[0]
            const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
            const { description } = command

            commandList.push(`**!${mainCommand}${args}** = ${description}`);
        }

        console.log(commandList);

        let page = 1

        let commandsFields = "";
        const start = page*commandsPerPage;
        const finish = (page*commandsPerPage+commandsPerPage <= commandList-1) ? page*commandsPerPage+commandsPerPage : commandList-1;
        for (let i = start; i < finish; i++) {
            commandsFields += commandList[i] + "\n";
        }
        const embed = new Discord.MessageEmbed() // Define a new embed
        .setTitle("Help Menu")
        .setDescription(`You can scroll through the menus with "➡" and "⬅", or you can close the help menu with the "❌" reaction.`)
        .setFooter(`Page ${page} of ${Math.ceil(commandList.length/commandsPerPage)}`)
        .addField("Commands", commandsFields, false)

        channel.send({embed}).then(msg => {
            msg.react('❌').then( r => {
                msg.react('⬅').then( s => {
                    msg.react('➡')

                    // Filters
                    const removeMessageFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id !== botID
                    const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id !== botID
                    const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id !== botID

                    const removeMessage = msg.createReactionCollector(removeMessageFilter)
                    const backwards = msg.createReactionCollector(backwardsFilter)
                    const forwards = msg.createReactionCollector(forwardsFilter)

                    backwards.on('collect', (r, u) => {
                        if (page === 1) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        page--
                        let commandsFields = "";
                        const start = page*commandsPerPage;
                        const finish = (page*commandsPerPage+commandsPerPage <= commandList-1) ? page*commandsPerPage+commandsPerPage : commandList-1;
                        for (let i = start; i < finish; i++) {
                            commandsFields += commandList[i] + "\n";
                        }
                        embed.fields = [];
                        embed.setTitle("Help Menu")
                        embed.setDescription(`You can scroll through the menus with "➡" and "⬅", or you can close the help menu with the "❌" reaction.`)
                        embed.setFooter(`Page ${page} of ${Math.ceil(commandList.length/commandsPerPage)}`)
                        embed.addField("Commands", commandsFields, false)
                        msg.edit(embed)
                        r.users.remove(r.users.cache.filter(u => u === message.author).first())
                    })

                    forwards.on('collect', (r, u) => {
                        if (page === titleArray.length) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        page++
                        let commandsFields = "";
                        const start = page*commandsPerPage;
                        const finish = (page*commandsPerPage+commandsPerPage <= commandList-1) ? page*commandsPerPage+commandsPerPage : commandList-1;
                        for (let i = start; i < finish; i++) {
                            commandsFields += commandList[i] + "\n";
                        }
                        embed.fields = [];
                        embed.setTitle("Help Menu")
                        embed.setDescription(`You can scroll through the menus with "➡" and "⬅", or you can close the help menu with the "❌" reaction.`)
                        embed.setFooter(`Page ${page} of ${Math.ceil(commandList.length/commandsPerPage)}`)
                        embed.addField("Commands", commandsFields, false)
                        msg.edit(embed)
                        r.users.remove(r.users.cache.filter(u => u === message.author).first())
                    })

                    removeMessage.on('collect', (r, u) => {
                        msg.delete();
                    });
                })
            })
        })
    },
    requiredChannel: botCommandChannelID
}
