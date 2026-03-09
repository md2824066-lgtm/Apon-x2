const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const supportedDomains = [
  "facebook.com","fb.watch",
  "youtube.com","youtu.be",
  "tiktok.com",
  "instagram.com","instagr.am",
  "likee.com","likee.video",
  "capcut.com",
  "spotify.com",
  "terabox.com",
  "twitter.com","x.com",
  "drive.google.com",
  "soundcloud.com",
  "ndown.app",
  "pinterest.com","pin.it"
];

module.exports = {
  config: {
    name: "autodl",
    version: "2.0",
    author: "Saimx69x",
    role: 0,
    shortDescription: "Auto video downloader",
    category: "utility"
  },

  onChat: async function({ api, event }) {
    const content = event.body ? event.body.trim() : "";
    if (!content.startsWith("https://")) return;
    if (!supportedDomains.some(domain => content.includes(domain))) return;

    try {
      const API = `https://xsaim8x-xxx-api.onrender.com/api/auto?url=${encodeURIComponent(content)}`;
      const res = await axios.get(API);

      const mediaURL = res.data.high_quality || res.data.low_quality;
      const title = res.data.title || "";

      if (!mediaURL) return;

      const ext = mediaURL.includes(".mp3") ? "mp3" : "mp4";
      const buffer = (await axios.get(mediaURL, { responseType: "arraybuffer" })).data;

      const filePath = path.join(__dirname, "cache", `auto_${Date.now()}.${ext}`);
      await fs.ensureDir(path.dirname(filePath));
      fs.writeFileSync(filePath, Buffer.from(buffer));

      api.sendMessage(
        {
          body: title,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );

    } catch (e) {}
  }
};