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

        // Visit tenor.com and request 8 gifs based on the keywords given by the author of the message
        let url = `https://api.tenor.com/v1/search?q=${text}&keys=${tenorAPIKey}&limit=8`;
        let response = await fetch(url);
        let json = await response.json();

        // Create a random index to pick 1 of the 8 messages at random
        const index = Math.floor(Math.random() * json.results.length);
        
        // Send the message
        await message.channel.send(json.results[index].url);
    },
    category: 'misc',
}
