require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
new SlashCommandBuilder()
.setName('ping')
.setDescription('Check bot ping'),

new SlashCommandBuilder()
.setName('join')
.setDescription('Join your voice channel'),

new SlashCommandBuilder()
.setName('leave')
.setDescription('Leave voice channel'),

new SlashCommandBuilder()
.setName('play')
.setDescription('Play a song')
.addStringOption(option =>
option
.setName('song')
.setDescription('Song name')
.setRequired(true)
),

new SlashCommandBuilder()
.setName('pause')
.setDescription('Pause music'),

new SlashCommandBuilder()
.setName('resume')
.setDescription('Resume music'),

new SlashCommandBuilder()
.setName('skip')
.setDescription('Skip current song'),

new SlashCommandBuilder()
.setName('stop')
.setDescription('Stop music'),

new SlashCommandBuilder()
.setName('loop')
.setDescription('Toggle loop'),

new SlashCommandBuilder()
.setName('queue')
.setDescription('Show current queue'),

new SlashCommandBuilder()
.setName('help')
.setDescription('Show help')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
try {
await rest.put(
Routes.applicationCommands(process.env.CLIENT_ID),
{ body: commands }
);


console.log('✅ Slash commands registered!');


} catch (error) {
console.error(error);
}
})();

