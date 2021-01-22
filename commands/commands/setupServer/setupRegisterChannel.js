const { botID } = require('@root/config.json')
const Discord = require("discord.js");

module.exports = {
    commands: ['setupRegisterChannel'],
    maxArgs: 0,
    permission: 'ADMINISTRATORS',
    callback: async (message, arguments) => {
        const { guild, channel } = message;

        const embed1 = new Discord.MessageEmbed() // Define a new embed
        .setTitle(`Community Guidelines`)
        .setColor(0xFFC300) // Set the color
        .setDescription(`**TL;DR** Use Common Sense. If you think you'll get a warning for it, don't do it!

        **Be respectful** to all members.

        **Actively contribute** to topical discussions, but **avoid discussing things that are generally considered illegal, offensive, insulting, or disturbing**.

        Try to **avoid conflict** as much as possible in your public messages. If you happen to offend someone, politely talking to them via DM is a good way to work out any issues.`)

        const embed2 = new Discord.MessageEmbed() // Define a new embed
        .setColor(0xFFC300) // Set the color
        .addField("General Server Rules", `1) No inappropriate profile pictures.
        2) No sexually explicit profile pictures.
        3) No offensive profile pictures.
        4) Moderators reserve the right to change nicknames.
        5) Moderators reserve the right to use their own discretion regardless of any rule.
        6) No exploiting loopholes in the rules (please report them).
        7) Rules apply to DMing other members of the server.
        8) No inviting unofficial bots.
        9) No bugs, exploits, glitches, hacks, bugs, etc.`, false)

        const embed3 = new Discord.MessageEmbed() // Define a new embed
        .setColor(0xFFC300) // Set the color
        .addField("Text Chat Rules",`1) No sexually explicit content.
        2) No pornographic content.
        3) No NSFW content.
        4) No illegal content.
        5) No hacking (Though this one is up to debate).
        6) No personal attacks.
        7) No witch hunting.
        8) No harassment.
        9) No sexism.
        10) No racism.
        11) No hate speech.
        12) No offensive language/cursing.
        13) No religious discussions.
        14) No political discussions.
        15) No sexual discussions.
        16) Agree to disagree.
        17) Moderators reserve the right to delete any post.
        18) Moderators reserve the right to edit any post.`, false )

        const embed4 = new Discord.MessageEmbed() // Define a new embed
        .setColor(0xFFC300) // Set the color
        .addField("Voice chat rules",`1) Moderators reserve the right to disconnect you from a voice channel if your sound quality is poor.
        2) Moderators reserve the right to disconnect, mute, deafen, or move members to and from voice channels.`, false)

        const embed = new Discord.MessageEmbed() // Define a new embed
        .setColor(0xFFC300) // Set the color
        .addField("**Getting Verified**", `**To agree to the rules and receive permission to view all of our channels and send messages, click on the reaction below.** You are responsible for reading the contents of this channel before agreeing.`, false)
        .addField("**Last Note**", `After you have agreed to the rules visit the "🤖bot-commands" channel to view all possible commands with !help. Also do set your nickname to "Lastname.Rank", and give yourself any necessary roles over at the "🎖role-claim" channel`, false)

        channel.send(embed1);
        channel.send(embed2);
        channel.send(embed3);
        channel.send(embed4);

        channel.send({embed}).then(msg => {
            msg.react('✅');

            // Filters
            const registeredFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id !== botID;

            const registeredMessage = msg.createReactionCollector(registeredFilter);

            registeredMessage.on('collect', (r, u) => {
                // Change role
                const notRegisteredRole = guild.roles.cache.find((role) => { return role.name === "Not Registered"  });
                const registeredRole = guild.roles.cache.find((role) => { return role.name === "Registered" });

                // Add "Registered"
                const member = guild.members.cache.get(u.id)
                member.roles.add(registeredRole)

                // Remove "Not Registed"
                member.roles.remove(notRegisteredRole)
            })
        })
        message.delete();
    }
}
