const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invites')
    .setDMPermission(false)
    .setDescription('Displays the number of invites of specified user.')
    .addUserOption(option => 
      option.setName('user')
      .setDescription('Specified user will be used to display their invites.')
      .setRequired(false)
    ),
  async execute(interaction) {
    await interaction.deferReply()
    const inviter = interaction.options.getUser('user') ?? interaction.user;

    const invites = await interaction.guild.invites.fetch();

    const userInvites = invites.filter(invite => invite.inviter.id === inviter.id);

    let remainingInvites = 0;
    let fakeInvites = 0;
    let bonusInvites = 0;

    userInvites.forEach(invite => {
      const uses = invite.uses;
      const maxUses = invite.maxUses;

      if (uses === 0) {
        remainingInvites++;
      } else if (uses > maxUses) {
        fakeInvites++;
      } else if (uses <= maxUses) {
        bonusInvites += (maxUses - uses);
      }
    });

    const embed = new EmbedBuilder()
      .setColor('Purple')
      .setFooter({ text: `${inviter.username}'s Invites` })
      .setThumbnail('hhttps://cdn.discordapp.com/avatars/943788447980724274/467d9554cb7f74002daf0e2a788ee64e.webp?size=512')
      .setTimestamp()
      .setTitle(`> Fetched ${inviter.tag}'s Invites`)
      .setAuthor({ name: `🔗 Invites Tool`})
      .addFields(
        { name: '• Total Invites', value: `> ${userInvites.size}`},
        { name: '• Remaining Invites', value: `> ${remainingInvites}`},
        { name: '• Fake Invites', value: `> ${fakeInvites}`},
        { name: '• Bonus Invites', value: `> ${bonusInvites}`},
      );

    return interaction.editReply({ embeds: [embed]});
  },
};
