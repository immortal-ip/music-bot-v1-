const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logger } = require("../../utils/logger");
const playlist = require("../../schemas/playlist");
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pl-create')
        .setDescription('Create a new playlist')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of the playlist')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('private')
                .setDescription('Set playlist as private or public')
                .setRequired(false)
        ),

    run: async ({ interaction }) => {
        const embed = new EmbedBuilder().setColor(config.clientOptions.embedColor);

        try {
            const playlistName = interaction.options.getString('name');
            const isPrivate = interaction.options.getBoolean('private') ?? true; // Default to true if not specified
            const userId = interaction.user.id;
            const userName = interaction.user.username;


            const existingPlaylist = await playlist.findOne({ 
                name: playlistName, 
                userId: userId 
            });

            if (existingPlaylist) return interaction.reply({ 
                embeds: [embed.setDescription("\`❌\` | A playlist with this name already exists.")], 
                ephemeral: true 
            });

            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;

            const newPlaylist = new playlist({
                name: playlistName, 
                songs: [], 
                created: formattedDate,
                userId,
                userName,
                isPrivate
            });

            await newPlaylist.save();

            await interaction.reply({ 
                embeds: [embed.setDescription(
                    `\`✔\` | The playlist \`${playlistName}\` has been created and is set to ${isPrivate ? 'private' : 'public'}.`
                )], 
                ephemeral: true
            });

        } catch (err) {
            logger(err, "error");
            return interaction.reply({ 
                embeds: [embed.setDescription(`\`❌\` | An error occurred: ${err.message}`)], 
                ephemeral: true 
            });
        }
    }
};