const { SlashCommandBuilder, WelcomeChannel } = require("discord.js");

const path = require("path");
const saveServer = require("../utils/saveServersModifications.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("removewelcomechannel")
    .setDescription(
      "remova o canal padrão que irá aparecer as mensagens de boas vindas"
    ),

  execute: async function (interaction) {
    const db = require("../database/servers.json");

    if (db.servers.filter((s) => s.id === interaction.guild.id).length >= 1) {
      db.servers = db.servers.filter(s => s.id != interaction.guild.id)

      console.log(db)
      const serverDbSettings = {
        path: path.join(__dirname, "..", "database", "servers.json"),
        content: JSON.stringify(db),
        successMsg: interaction.reply("Successo ao remover o canal de boas vindas"),
        errorMsg: interaction.reply("Erro interno ao remover novo servidor"),
      };

      saveServer(
        serverDbSettings.path,
        serverDbSettings.content,
        serverDbSettings.successMsg,
        serverDbSettings.errorMsg
      );
    } else {
      interaction.reply(
        "Este servidor ainda não tem um canal registrado!\npor favor execute `/setwelcomechannel` para definir o canal registrado!"
      );
    }
  },
};
