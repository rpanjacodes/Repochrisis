const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { performance } = require('perf_hooks');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('bot')
    .setDescription(`Shows Nexus' information.`)
    .addSubcommand(command => command.setName('stats').setDescription('Shows some basic statistics about Nexus.'))
    .addSubcommand(command => command.setName('ping').setDescription(`Displays the bot's ping... Pong.. PANG!!`)),
    async execute(interaction, client) {

        const sub = interaction.options.getSubcommand();

        switch (sub) {

        case 'stats':

        let servercount = await client.guilds.cache.reduce((a,b) => a+b.memberCount, 0);

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `**${days}**d **${hours}**h **${minutes}**m **${seconds}**s`;

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Support Server')
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/yvvCVrj2AS"),

            new ButtonBuilder()
            .setLabel('Bot Invite')
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.com/api/oauth2/authorize?client_id=1102156950889836564&permissions=8&scope=bot%20applications.commands")
        )

        const embed = new EmbedBuilder()
        .setColor("Purple")
        .setTitle(`> Bot's Statistics`)
        .setAuthor({ name: '🤖 Bot Statistics Tool'})
        .setThumbnail('https://media.discordapp.net/attachments/1088740397406244896/1102607564115542056/IMG_20230430_182925.png')
        .setFooter({ text: `🤖 Nexus' statistics`})
        .setTimestamp()
        .addFields({ name: '• Servers Count', value: `> ${client.guilds.cache.size}`, inline: true})
        .addFields({ name: '• Members Count', value: `> ${servercount}`, inline: true})
        .addFields({ name: '• Latency', value: `> ${Math.round(client.ws.ping)}ms`, inline: false})
        .addFields({ name: '• Uptime', value: `> ${uptime}`, inline: false})

        await interaction.reply({ embeds: [embed], components: [button] })

        break;
        case 'ping':
                 const icon = interaction.user.displayAvatarURL();
        const tag = interaction.user.tag;
        // Get Mongoose pi

        const pingembed = new EmbedBuilder()
          .setTitle("<:pingpong_blue:1107233975904256010> **PONG!**")
          .setDescription(
            `<:latency:1106918665552658497> | **Latency:** \`${client.ws.ping}ms\`\n<:data:1107235112141193256>  | **Database Latency:** 267ms`
          )
          .setColor("Blue")
          .setFooter({ text: `Requested by ${tag}`, iconURL: icon })
          .setTimestamp();

        const btn = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("btn")
            .setStyle(ButtonStyle.Secondary)
            .setLabel(`Reload`)
            .setEmoji("<a:loading:1088346989160321044>")
        );

        const msg = await interaction.reply({
          embeds: [pingembed],
          components: [btn],
        });

        const collector = msg.createMessageComponentCollector();
        collector.on("collect", async (i) => {
          if (i.customId == "btn") {
            i.update({
              content: `Refreshed The Ping Stats!`,
              embeds: [
                new EmbedBuilder()
                  .setTitle("<:uo_ping_pong:1015551332414930994> **PONG!**")
                  .setDescription(
                    `<:latency:1106918665552658497> | **Latency:** \`${client.ws.ping}ms\`\n<:data:944588615403597824> | **Database Latency:** 169ms`
                  )
                  .setColor("Blue")
                  .setFooter({ text: `Requested by ${tag}`, iconURL: icon })
                  .setTimestamp(),
              ],
              components: [btn],
            });
          }
        });

        
    }
    }
}
