const { SlashCommandBuilder } = require("discord.js");

const path = require("path");
const saveServer = require("../utils/saveServersModifications.js")

const embedModel = require("../embedMessages/welcomeMessage.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setwelcomechannel")
    .setDescription(
      "Defina o canal padrão que irá aparecer as mensagens de boas vindas"
    ),


  execute: async function (interaction) {
    const db = require("../database/servers.json");
    if (db.servers.filter(s => s.id === interaction.guild.id).length <= 0) {
      db.servers.push({
        name: interaction.guild.name,
        id: interaction.guild.id,
        welcomeChannel: interaction.channel.id,
        welcome: embedModel
      });


      const serverDbSettings = {
        path: path.join(__dirname, "..", "database", "servers.json"),
        content: JSON.stringify(db),
        successMsg: interaction.reply("Successo ao cadastrar mensagem de boas vindas"),
        errorMsg: interaction.reply("Erro interno ao salvar mensagem")
      }

      saveServer(
        serverDbSettings.path,
        serverDbSettings.content,
        serverDbSettings.successMsg,
        serverDbSettings.errorMsg
      )

    } else {
      interaction.reply("Este servidor já tem um canal registrado!\npor favor execute `/removewelcomechannel` para remover o canal registrado!")
    }
  },
};
