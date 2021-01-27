const { pollsChannelID } = require('@root/config.json');
const Discord = require("discord.js");

module.exports = {
    commands: ['poll'],
    expectedArgs: '<keywords>',
    description: 'Send a poll to the channel',
    callback: async (message, args, text) => {

        await message.delete();

        const { content, channel } = message;
        const eachLine = content.split('\n');

        if (!args || args.length == 0 || eachLine.length <= 1) {
            // did not properly build command
            let embedError = new Discord.MessageEmbed()
            .setTitle("!poll")
            .setDescription("!poll <description>\n<emoji> = <option>\n<emoji> = <option>\n... etc.")
            .setColor(0xFFC300)

            return embedError;
        }

        let pollQuestion = eachLine[0].split(' ').slice(1).join(' ');

        //-----------------------
        let emojiList = [];
        let voteOptions = {};
        for (const line of eachLine) {
            if (line.includes('=')) {
                const split = line.split('=');
                const emoji = split[0].trim();
                const voteDescription = split[1].trim();
                voteOptions[emoji] = {"emoji": emoji, "voteDescription": voteDescription};
                emojiList.push(emoji);
            }
        }

        let voteOptionsString = "";
        for (let x in voteOptions) {
            voteOptionsString += voteOptions[x].emoji + " " + voteOptions[x].voteDescription + ' - **1 Votes**'+ '\n';
        }

        const embed = new Discord.MessageEmbed()
        .setAuthor("Helper")
        .setTitle("Poll Question")
        .setDescription(pollQuestion)
        .addFields(
            { name: "Deadline", value: 'some date...' },
            { name: '\u200B', value: '\u200B' },
            { name: "You can vote for multiple options...", value: voteOptionsString }
        )
        .setColor(0xFFC300)
        .setFooter(`${message.author.username} created this poll`);

        channel.send({embed}).then(async msg => {
            msg.react('❌').then(async r => {

                for (const line of eachLine) {
                    if (line.includes('=')) {
                        const split = line.split('=');
                        const emoji = split[0].trim();

                        await msg.react(emoji);
                    }
                }

                // create collector for reactions
                const filter = (reaction, user) => {
                    return emojiList.includes(reaction.emoji.name);
                };
                const removeMessageFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id !== process.env.BOT_ID

                const collector = msg.createReactionCollector(filter, {dispose: true});
                const removeMessage = msg.createReactionCollector(removeMessageFilter)

                collector.on('collect', (reaction, user) => {
                    voteOptionsString = "";
                    let reactionCollection = reaction.message.reactions.cache;
                    for (let x in voteOptions) {
                        voteOptionsString +=  voteOptions[x].emoji + " " + voteOptions[x].voteDescription + ' -**' + reactionCollection.find(e => e.emoji.name == x).count + ' Votes**'+ '\n';
                    }

                    embed.fields = [];
                    embed.setAuthor("Helper")
                    embed.setTitle("Poll Question")
                    embed.setDescription(pollQuestion)
                    embed.addFields(
                        { name: "Deadline", value: 'some date...' },
                        { name: '\u200B', value: '\u200B' },
                        { name: "You can vote for multiple options...", value: voteOptionsString }
                    )
                    embed.setColor(0xFFC300)
                    embed.setFooter(`${message.author.username} created this poll`);
                    msg.edit(embed)
                });

                collector.on('remove', (reaction, user) => {
                    voteOptionsString = "";
                    let reactionCollection = reaction.message.reactions.cache;
                    for (let x in voteOptions) {
                        voteOptionsString +=  voteOptions[x].emoji + " " + voteOptions[x].voteDescription + ' -**' + reactionCollection.find(e => e.emoji.name == x).count + ' Votes**'+ '\n';
                    }

                    embed.fields = [];
                    embed.setAuthor("Helper")
                    embed.setTitle("Poll Question")
                    embed.setDescription(pollQuestion)
                    embed.addFields(
                        { name: "Deadline", value: 'some date...' },
                        { name: '\u200B', value: '\u200B' },
                        { name: "You can vote for multiple options...", value: voteOptionsString }
                    )
                    embed.setColor(0xFFC300)
                    embed.setFooter(`${message.author.username} created this poll`);
                    msg.edit(embed)
                });

                removeMessage.on('collect', (r, u) => {
                    msg.delete();
                });
            });
        })
    },
    category: 'misc',
    requiredChannel: pollsChannelID
}
