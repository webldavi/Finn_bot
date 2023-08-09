const { SlashCommandBuilder } = require("discord.js");

const path = require("path");
const saveServer = require("../utils/saveServersModifications.js")

const embedModel = require("../embedMessages/welcomeMessage.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setwelcomemessage")
        .setDescription(
            "Defina uma mensagem para os novos membros do seu servidor!"
        ).addStringOption(option =>
            option.setName('message')
                .setDescription('Escreva sua mensagem!')
                .setRequired(true)

        ),


    execute: async function (interaction) {
        const db = require("../database/servers.json");
        if (db.servers.filter(s => s.id === interaction.guild.id).length >= 0) {
            const currentEmbed = db.servers.find(s => s.id == interaction.guild.id).welcome
            currentEmbed.embeds[0].description = interaction.options.getString("message")
            db.servers.find(s => s.id == interaction.guild.id).welcome = currentEmbed



            const serverDbSettings = {
                path: path.join(__dirname, "..", "database", "servers.json"),
                content: JSON.stringify(db),
                successMsg: interaction.reply("Successo ao cadastrar o canal de boas vindas"),
                errorMsg: interaction.reply("Erro interno ao salvar novo servidor")
            }

            saveServer(
                serverDbSettings.path,
                serverDbSettings.content,
                serverDbSettings.successMsg,
                serverDbSettings.errorMsg
            )

        } else {
            interaction.reply("Este servidor ainda não tem um canal registrado!\npor favor execute `/setwelcomechannel` para adicionar o canal registrado!")
        }
    },
};
