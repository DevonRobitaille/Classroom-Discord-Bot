const { voiceGeneralChannelID } = require('@root/config.json');

const getVoiceChannels = (guild) => {
  return guild.channels.cache.filter((channel) => {
    return channel.type === 'voice' && channel.name === voiceGeneralChannelID
  })
}

module.exports = (client) => {
  client.on('voiceStateUpdate', (oldState, newState) => {
    const { guild } = oldState
    const joined = !!newState.channelID

    const channelId = joined ? newState.channelID : oldState.channelID
    let channel = guild.channels.cache.get(channelId)

    console.log(
      `${newState.channelID} vs ${oldState.channelID} (${channel.name})`
    )

    if (channel.name === voiceGeneralChannelID) {
      if (joined) {
        const channels = getVoiceChannels(guild)

        let hasEmpty = false

        channels.forEach((channel) => {
          if (!hasEmpty && channel.members.size === 0) {
            hasEmpty = true
          }
        })

        if (!hasEmpty) {
          const {
            type,
            userLimit,
            bitrate,
            parentID,
            permissionOverwrites,
            rawPosition,
          } = channel

          guild.channels.create(voiceGeneralChannelID, {
            type,
            bitrate,
            userLimit,
            parent: parentID,
            permissionOverwrites,
            position: rawPosition,
          })
        }
      } else if (
        channel.members.size === 0 &&
        getVoiceChannels(guild).size > 1
      ) {
        channel.delete()
      }
    } else if (oldState.channelID) {
      channel = guild.channels.cache.get(oldState.channelID)
      if (
        channel.name === voiceGeneralChannelID &&
        channel.members.size === 0 &&
        getVoiceChannels(guild).size > 1
      ) {
        channel.delete()
      }
    }
  })
}
