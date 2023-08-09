const { Client, Events, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

const config = require("./config/index.json");

const fs = require("fs");
const path = require("path");
const commandPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandPath)
  .filter((file) => file.endsWith(".js"));

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {

    if (commandFiles.includes(`${interaction.commandName}.js`)) {
      const command = require(`./commands/${interaction.commandName}.js`);
      command.execute(interaction);
    } else {
      interaction.reply("Comando invalido!");
    }
  }

});

client.on("guildMemberAdd", member => {
  const db = require("./database/servers.json")
  const welcomeGuild = db.servers.find(s => s.id == member.guild.id)
  const welcomeChannel = welcomeGuild.welcomeChannel
  if (welcomeChannel) {
    const memberDate = new Date(member.joinedTimestamp)
    const memberDateFormat = `${memberDate.getDay()}/${memberDate.getMonth()}/${memberDate.getFullYear()}`
    welcomeGuild.welcome.embeds[0].author.icon_url = member.guild.iconURL()
    welcomeGuild.welcome.embeds[0].author.name = member.guild.name
    welcomeGuild.welcome.embeds[0].thumbnail.url = member.displayAvatarURL()
    welcomeGuild.welcome.embeds[0].fields[0].value += member.id
    welcomeGuild.welcome.embeds[0].fields[1].value += member.user.tag
    welcomeGuild.welcome.embeds[0].fields[2].value += memberDateFormat
    member.guild.channels.cache.get(welcomeChannel).send({ embeds: welcomeGuild.welcome.embeds })
  }
})
client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.token);
