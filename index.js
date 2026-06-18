require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log(`🎵 RAAG Music Online: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!ping') {
    return message.reply('🏓 Pong!');
  }

  if (message.content === '!play') {
    return message.reply('🎵 Music system installed successfully!');
  }

  if (message.content === '!join') {
    if (!message.member.voice.channel) {
      return message.reply('❌ Pehle voice channel join karo.');
    }

    joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    return message.reply('🎵 RAAG voice channel join kar gaya!');
  }
});

client.login('process.env.TOKEN');
