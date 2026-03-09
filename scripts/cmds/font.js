const axios = require("axios");

module.exports = {
  config: {
    name: "font",
    aliases: ["fonts", "style"],
    version: "1.0",
    author: "Saimx69x",
    countDown: 5,
    role: 0,
    category: "tools",
    shortDescription: "Convert text to fancy fonts via API",
    longDescription: "Use /font <id> <text> or /font list",
    guide: "{pn} list | {pn} 16 Saim"
  },

  onStart: async function ({ message, event, api, threadPrefix }) {
    try {
      const prefix = threadPrefix || "/font";
      const body = event.body || "";
      const args = body.split(" ").slice(1);

      if (!args.length) {
        return api.sendMessage(
          `❌ Invalid usage!\nUse ${prefix} list to see available fonts\nor ${prefix} [number] [text] to convert`,
          event.threadID,
          event.messageID
        );
      }

      if (args[0].toLowerCase() === "list") {
        const preview = `✨ 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐅𝐨𝐧𝐭 𝐒𝐭𝐲𝐥𝐞𝐬 ✨
━━━━━━━━━━━━━━━━━━━━☆
1 ⟶ Ă̈p̆̈ŏ̈n̆̈ D̆̈ĭ̈C̆̈ă̈p̆̈r̆̈ĭ̈ŏ̈
2 ⟶ A̷p̷o̷n̷ D̷i̷C̷a̷p̷r̷i̷o̷
3 ⟶ 𝗔𝗽𝗼𝗻 𝗗𝗶𝗖𝗮𝗽𝗿𝗶𝗼
4 ⟶ 𝘈𝘱𝘰𝘯 𝘋𝘪𝘊𝘢𝘱𝘳𝘪𝘰
5 ⟶ [A][p][o][n] [D][i][C][a][p][r][i][o]
6 ⟶ 𝕬𝖕𝖔𝖓 𝕯𝖎𝕮𝖆𝖕𝖗𝖎𝖔
7 ⟶ Ａｐｏｎ ＤｉＣａｐｒｉｏ
8 ⟶ ᴬᵖᵒⁿ ᴰⁱᶜᵃᵖʳⁱᵒ
9 ⟶ ɐdoᴎ bᴉɔɐdɹᴉo
10 ⟶ 🄰🄿🄾🄽 🄳🄸🄲🄰🄿🅁🄸🄾
11 ⟶ 🅰🅿🅾🅽 🅳🅸🅲🅰🅿🆁🅸🅾
12 ⟶ 𝒜𝓅𝑜𝓃 𝒟𝒾𝒞𝒶𝓅𝓇𝒾𝑜
13 ⟶ Ⓐⓟⓞⓝ ⒹⓘⒸⓐⓟⓡⓘⓞ
14 ⟶ 🅐🅟🅞🅝 🅓🅘🅒🅐🅟🅡🅘🅞
15 ⟶ 𝘼𝙥𝙤𝙣 𝘿𝙞𝘾𝙖𝙥𝙧𝙞𝙤
16 ⟶ 𝐀𝐩𝐨𝐧 𝐃𝐢𝐂𝐚𝐩𝐫𝐢𝐨
17 ⟶ 𝔄𝔭𝔬𝔫 𝔇𝔦ℭ𝔞𝔭𝔯𝔦𝔬
18 ⟶ 𝓐𝓹𝓸𝓷 𝓓𝓲𝓒𝓪𝓹𝓻𝓲𝓸
19 ⟶ 𝙰𝚙𝚘𝚗 𝙳𝚒𝙲𝚊𝚙𝚛𝚒𝚘
20 ⟶ ᴀᴘᴏɴ ᴅɪᴄᴀᴘʀɪᴏ
21 ⟶ 𝐴𝑝𝑜𝑛 𝐷𝑖𝐶𝑎𝑝𝑟𝑖𝑜
22 ⟶ 𝑨𝒑𝒐𝒏 𝑫𝒊𝑪𝒂𝒑𝒓𝒊𝒐
23 ⟶ 𝔸𝕡𝕠𝕟 𝔻𝕚ℂ𝕒𝕡𝕣𝕚𝕠
24 ⟶ ꪖρꪮꪀ ᦔ꠸ᥴꪖρ᥅꠸ꪮ
25 ⟶ αρση ∂ιcαρяισ
26 ⟶ ᎪᏢᎾᏁ ᎠᎥᏟᎪᏢᎡᎥᎾ
27 ⟶ 卂卩ㄖ几 ᗪ丨匚卂卩尺丨ㄖ
28 ⟶ ᗩᑭOᑎ ᗪIᑕᗩᑭᖇIO
29 ⟶ ǟքօռ ɖɨƈǟքʀɨօ
30 ⟶ 𐌀𐌐𐌏𐌍 𐌃𐌉𐌂𐌀𐌐𐌓𐌉𐌏
31 ⟶ ΛPӨП DIᄃΛPЯIӨ
━━━━━━━━━━━━━━━━━━━━━☆`;
        return api.sendMessage(preview, event.threadID, event.messageID);
      }

      const id = args[0];
      const text = args.slice(1).join(" ");
      if (!text) return api.sendMessage(`❌ Invalid usage! Provide text to convert.`, event.threadID, event.messageID);

      const apiUrl = `https://xsaim8x-xxx-api.onrender.com/api/font?id=${id}&text=${encodeURIComponent(text)}`;
      const response = await axios.get(apiUrl);

      if (response.data.output) {
        return api.sendMessage(response.data.output, event.threadID, event.messageID);
      } else {
        return api.sendMessage(`❌ Font ${id} not found!`, event.threadID, event.messageID);
      }

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ An error occurred! Please try again later.", event.threadID, event.messageID);
    }
  }
};