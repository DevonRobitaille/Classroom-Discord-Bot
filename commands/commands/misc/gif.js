const fetch = require('node-fetch');
const { tenorAPIKey } = require('@root/config.json');

module.exports = {
    commands: ['gif'],
    expectedArgs: '<keywords>',
    minArgs: 1,
    cooldown: '15',
    description: 'Send a gif to the channel',
    callback: async (message, arguments, text) => {
        message.delete();

        let url = `https://api.tenor.com/v1/search?q=${text}&keys=${tenorAPIKey}&limit=8`;
        let response = await fetch(url);
        let json = await response.json();
        const index = Math.floor(Math.random() * json.results.length);

        await message.channel.send(json.results[index].url);
    },
    category: 'misc',
}
