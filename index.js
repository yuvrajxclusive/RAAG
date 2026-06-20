require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const {
  joinVoiceChannel,
  getVoiceConnection
} = require('@discordjs/voice');

const queues = require('./music/queue');
const { createQueue } = require('./music/player');

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
      return message.reply('❌ First join the vc.');
    }

    joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    return message.reply('🎵 RAAG has sucessfully joined the vc !!');
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    return interaction.reply('🏓 Pong!');
  }

  if (interaction.commandName === 'help') {
    return interaction.reply(`
🎵 RAAG Commands

/join - Join VC
/leave - Leave VC
/play - Play music
/pause - Pause music
/resume - Resume music
/skip - Skip song
/stop - Stop music
/loop - Toggle loop
/help - Show commands
    `);
  }

  if (interaction.commandName === 'join') {
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: '❌ First join the vc.',
        ephemeral: true
      });
    }

    joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    return interaction.reply('🎵 RAAG has sucessfully joined the vc !!');
  }

  if (interaction.commandName === 'leave') {
  const connection = getVoiceConnection(interaction.guild.id);

  if (!connection) {
    return interaction.reply('❌ Bot voice channel me nahi hai.');
  }

  connection.destroy();

  return interaction.reply('👋 RAAG has left the vc !!');
}

  if (interaction.commandName === 'play') {
  const song = interaction.options.getString('song');

  const queue = createQueue(interaction.guild.id);

  if (queue.songs.length >= 20) {
    return interaction.reply('❌ Queue full (20 songs max).');
  }

  queue.songs.push(song);

  return interaction.reply(
    `🎵 Added to queue: ${song}\n📃 Position: ${queue.songs.length}`
  );
}

  if (interaction.commandName === 'pause') {
    return interaction.reply('⏸️ Music paused.');
  }

  if (interaction.commandName === 'resume') {
    return interaction.reply('▶️ Music resumed.');
  }

  if (interaction.commandName === 'skip') {
  const queue = queues.get(interaction.guild.id);

  if (!queue || queue.songs.length === 0) {
    return interaction.reply('📭 Queue is empty.');
  }

  const skippedSong = queue.songs.shift();

  return interaction.reply(
    `⏭️ Skipped: ${skippedSong}`
  );
}

  if (interaction.commandName === 'stop') {
  const queue = queues.get(interaction.guild.id);

  if (!queue || queue.songs.length === 0) {
    return interaction.reply('📭 Queue is already empty.');
  }

  queue.songs = [];

  return interaction.reply('⏹️ Queue cleared.');
}

if (interaction.commandName === 'queue') {
  const queue = queues.get(interaction.guild.id);

  if (!queue || queue.songs.length === 0) {
    return interaction.reply('📭 Queue is empty.');
  }

  const list = queue.songs
    .map((song, i) => `${i + 1}. ${song}`)
    .join('\n');

  return interaction.reply(`📃 Current Queue\n\n${list}`);
}

  if (interaction.commandName === 'loop') {
  const queue = createQueue(interaction.guild.id);

  queue.loop = !queue.loop;

  return interaction.reply(
    `🔁 Loop ${queue.loop ? 'Enabled' : 'Disabled'}`
  );
}
});
client.login(process.env.TOKEN);
