const { botID } = require('@root/config.json')
const Discord = require("discord.js");

module.exports = {
    commands: ['setupRoleClaimChannel'],
    maxArgs: 0,
    permission: 'ADMINISTRATORS',
    callback: async (message, arguments) => {
        const { guild, channel } = message;

        const embed = new Discord.MessageEmbed() // Define a new embed
        .setTitle("Set your role")
        .setColor(0xFFC300) // Set the color
        .setDescription(`**Use the reactions on this message to opt-in and out of roles.**
            🟢 = Army
            🔵 = Navy
            ⚪ = Air Force
            🟠 = Regular Forces
            🟣 = Primary Reserves
            `)

            channel.send({embed}).then(msg => {
                msg.react('🟢').then( r => {
                    msg.react('🔵').then( s => {
                        msg.react('⚪').then( s => {
                            msg.react('🟠').then( s => {
                                msg.react('🟣')

                                // Filters
                                const armyFilter = (reaction, user) => reaction.emoji.name === '🟢' && user.id !== botID
                                const navyFilter = (reaction, user) => reaction.emoji.name === '🔵' && user.id !== botID
                                const airforceFilter = (reaction, user) => reaction.emoji.name === '⚪' && user.id !== botID
                                const regFFilter = (reaction, user) => reaction.emoji.name === '🟠' && user.id !== botID
                                const pResFilter = (reaction, user) => reaction.emoji.name === '🟣' && user.id !== botID

                                const army = msg.createReactionCollector(armyFilter)
                                const navy = msg.createReactionCollector(navyFilter)
                                const airforce = msg.createReactionCollector(airforceFilter)
                                const regf = msg.createReactionCollector(regFFilter)
                                const pres = msg.createReactionCollector(pResFilter)

                                army.on('collect', (r, u) => {
                                    const armyRole = guild.roles.cache.find((role) => { return role.name === "Army" });

                                    // Add "Army"
                                    const member = guild.members.cache.get(u.id)
                                    member.roles.add(armyRole)
                                })

                                navy.on('collect', (r, u) => {
                                    const navyRole = guild.roles.cache.find((role) => { return role.name === "Navy" });

                                    // Add "Navy"
                                    const member = guild.members.cache.get(u.id)
                                    member.roles.add(navyRole)
                                })

                                airforce.on('collect', (r, u) => {
                                    const airforceRole = guild.roles.cache.find((role) => { return role.name === "Airforce" });

                                    // Add "Air Force"
                                    const member = guild.members.cache.get(u.id)
                                    member.roles.add(airforceRole)
                                })

                                regf.on('collect', (r, u) => {
                                    const regfRole = guild.roles.cache.find((role) => { return role.name === "RegF" });

                                    // Add "Reg F"
                                    const member = guild.members.cache.get(u.id)
                                    member.roles.add(regfRole)
                                })

                                pres.on('collect', (r, u) => {
                                    const presRole = guild.roles.cache.find((role) => { return role.name === "PRes" });

                                    // Add "Army"
                                    const member = guild.members.cache.get(u.id)
                                    member.roles.add(presRole)
                                })
                            })
                        })
                    })
                })
            })
            message.delete();
        }
    }
