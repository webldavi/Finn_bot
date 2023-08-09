const { REST, Routes } = require("discord.js");
const config = require("./config/index.json");

const fs = require("fs");
const path = require("path");

const commandPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandPath)
  .filter((file) => file.endsWith(".js"));

const rest = new REST({ version: "10" }).setToken(config.token);

const commands = [];

commandFiles.forEach((file) => {
  const command = require(`./commands/${file}`);
  commands.push(command.data);
});

(async () => {
  try {
    await rest.put(Routes.applicationCommands(config.app_id), {
      body: commands,
    });
    console.log("comando registrado com sucesso");
  } catch (error) {
    console.log(error);
  }
})();
