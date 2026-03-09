
const fs = require("fs-extra");
const moment = require("moment-timezone");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "2.3",
    author: "APON DICAPRIO",
    countDown: 5,
    role: 0,
    description: "Show and change the bot prefix (chat or global)",
    category: "⚙️ Configuration"
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData }) {
    if (!args[0]) return message.SyntaxError();

    if (args[0] === "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(`✅ Reset to default prefix: ${global.GoatBot.config.prefix}`);
    }

    const newPrefix = args[0];
    const setGlobal = args[1] === "-g";

    if (setGlobal && role < 2)
      return message.reply("⛔ Only bot admins can change the global prefix!");

    return message.reply(
      setGlobal
        ? "⚙️ React to confirm global prefix update."
        : "⚙️ React to confirm this chat’s prefix update.",
      (err, info) => {
        global.GoatBot.onReaction.set(info.messageID, {
          commandName,
          author: event.senderID,
          newPrefix,
          setGlobal,
          messageID: info.messageID,
        });
      }
    );
  },

  onReaction: async function ({ message, threadsData, event, Reaction }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author) return;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(`✅ Global prefix changed to: **${newPrefix}**`);
    }

    await threadsData.set(event.threadID, newPrefix, "data.prefix");
    return message.reply(`✅ Chat prefix changed to: **${newPrefix}**`);
  },

  onChat: async function ({ event, message, threadsData }) {
    const globalPrefix = global.GoatBot.config.prefix;
    const threadPrefix = (await threadsData.get(event.threadID, "data.prefix")) || globalPrefix;

    if (event.body && event.body.toLowerCase() === "prefix") {
      const currentTime = moment().tz("Asia/Dhaka").format("hh:mm A");
      const uptimeMs = process.uptime() * 1000;

      function formatUptime(ms) {
        const sec = Math.floor(ms / 1000) % 60;
        const min = Math.floor(ms / (1000 * 60)) % 60;
        const hr = Math.floor(ms / (1000 * 60 * 60));
        return `${hr}h ${min}m ${sec}s`;
      }

      const uptime = formatUptime(uptimeMs);

      return message.reply({
        body:
`꧁⩺ 𝗣𝗥𝗘𝗙𝗜𝗫 𝗜𝗡𝗙𝗢 ⩹꧂

⌬ **Global Prefix:** ${globalPrefix}
⚿ **Chat Prefix:** ${threadPrefix}
⌗ **Help Command:** ${threadPrefix}help
✦ **Current Time:** ${currentTime}
⌛ **Bot Uptime:** ${uptime}
⍟ **Your ID:** ${event.senderID}
⚙ **Dev:** APON DICAPRIO`,
        attachment: await utils.getStreamFromURL("https://files.catbox.moe/wio2hd.mp4")
      });
    }
  }
};