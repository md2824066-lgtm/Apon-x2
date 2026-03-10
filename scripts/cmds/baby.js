const axios = require('axios');

const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe", "বট", "bot", "বেবি"],
    version: "6.9.0",
    author: "dipto | nexo_here",
    countDown: 0,
    role: 0,
    description: "better than all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage]\nteach [msg] - [reply1], [reply2]...\nteach react [msg] - [react1], [react2]\nremove [msg]\nrm [msg] - [index]\nmsg [msg]\nlist\nlist all [limit]\nedit [msg] - [new]"
    }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        // REMOVE
        if (args[0] === "remove") {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${encodeURIComponent(fina)}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        // RM with index
        if (args[0] === "rm" && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${encodeURIComponent(fi)}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        // LIST
        if (args[0] === "list") {
            const d = (await axios.get(`${link}?list=all`)).data;

            if (args[1] === "all") {
                const limit = parseInt(args[2]) || 100;
                const limited = d?.teacher?.teacherList?.slice(0, limit);

                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number);
                    return { name, value };
                }));

                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}. ${t.name}: ${t.value}`).join("\n");

                return api.sendMessage(
                    `👑 Total Teach: ${d.length}\n👥 Teacher List:\n${output}`,
                    event.threadID,
                    event.messageID
                );
            }

            return api.sendMessage(
                `❇️ Total Teach = ${d.length || "api off"}\n♻️ Total Response = ${d.responseLength || "api off"}`,
                event.threadID,
                event.messageID
            );
        }

        // MSG
        if (args[0] === "msg") {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${encodeURIComponent(fuk)}`)).data.data;
            return api.sendMessage(`Message '${fuk}' = ${d}`, event.threadID, event.messageID);
        }

        // EDIT
        if (args[0] === "edit") {
            const parts = dipto.split(/\s*-\s*/);
            if (parts.length < 2)
                return api.sendMessage("❌ Format: edit [msg] - [new reply]", event.threadID, event.messageID);

            const dA = (await axios.get(
                `${link}?edit=${encodeURIComponent(args[1])}&replace=${encodeURIComponent(parts[1])}&senderID=${uid}`
            )).data.message;

            return api.sendMessage(`Changed: ${dA}`, event.threadID, event.messageID);
        }

        // TEACH REACT
        if (args[0] === "teach" && args[1] === "react") {
            const parts = dipto.replace("teach react ", "").split(/\s*-\s*/);
            if (parts.length < 2)
                return api.sendMessage("❌ Format: teach react message - ❤️, 😀", event.threadID, event.messageID);

            const msg = parts[0].trim();
            const reacts = parts[1].trim();
            const res = await axios.get(`${link}?teach=${encodeURIComponent(msg)}&react=${encodeURIComponent(reacts)}`);

            return api.sendMessage(`✅ Reacts added: ${res.data.message}`, event.threadID, event.messageID);
        }

        // TEACH AMAR
        if (args[0] === "teach" && args[1] === "amar") {
            const parts = dipto.split(/\s*-\s*/);
            if (parts.length < 2)
                return api.sendMessage("❌ Format: teach amar message - reply", event.threadID, event.messageID);

            const msg = parts[0].replace("teach amar ", "").trim();
            const reply = parts[1].trim();

            const res = await axios.get(
                `${link}?teach=${encodeURIComponent(msg)}&senderID=${uid}&reply=${encodeURIComponent(reply)}&key=intro`
            );

            return api.sendMessage(`✅ Intro reply added: ${res.data.message}`, event.threadID, event.messageID);
        }

        // TEACH NORMAL
        if (args[0] === "teach") {
            const parts = dipto.split(/\s*-\s*/);
            if (parts.length < 2)
                return api.sendMessage("❌ Format: teach message - reply1, reply2", event.threadID, event.messageID);

            const msg = parts[0].replace("teach ", "").trim();
            const replies = parts[1].trim();

            const res = await axios.get(
                `${link}?teach=${encodeURIComponent(msg)}&reply=${encodeURIComponent(replies)}&senderID=${uid}&threadID=${event.threadID}`
            );

            const teacherName = (await usersData.getName(res.data.teacher).catch(() => "Unknown"));

            return api.sendMessage(
                `✅ Replies added: ${res.data.message}\n👤 Teacher: ${teacherName}\n📚 Total Teachs: ${res.data.teachs}`,
                event.threadID,
                event.messageID
            );
        }

        // "AMAR NAME KI"
        if (
            dipto.includes("amar name ki") ||
            dipto.includes("amr name ki") ||
            dipto.includes("amr nam ki") ||
            dipto.includes("amar nam ki") ||
            dipto.includes("whats my name")
        ) {
            const data = (await axios.get(`${link}?text=${encodeURIComponent("amar name ki")}&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        // NORMAL AI REPLY
        const d = (await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}`)).data.reply;

        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: module.exports.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

// ON REPLY
module.exports.onReply = async ({ api, event }) => {
    try {
        if (event.type === "message_reply") {
            const url = `${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}`;
            const a = (await axios.get(url)).data.reply;

            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: module.exports.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

// AUTO CHAT
module.exports.onChat = async ({ api, event, message }) => {
    try {
        const body = event.body ? event.body.toLowerCase() : "";

        if (
            body.startsWith("baby") ||
            body.startsWith("bby") ||
            body.startsWith("bot") ||
            body.startsWith("jan") ||
            body.startsWith("babu") ||
            body.startsWith("janu")
        ) {
            const arr = body.replace(/^\S+\s*/, "");

            const randomReplies = [
                "𝙖𝙢𝙖𝙠𝙚 𝙙𝙖𝙠𝙡𝙖 𝙢𝙤𝙣𝙚 𝙝𝙤𝙞?🙆",
                "Bol suntechi 🐍",
                "KI ᑭᖇOᗷᒪEᗰ ᗷᗷY?🙂",
                "~𝙔𝙖𝙢𝙚𝙩𝙚 𝙆𝙪𝙙𝙖𝙨𝙖𝙞🐶",
                "𝙅𝙖 𝙗𝙤𝙡𝙗𝙞 𝙚𝙠𝙨𝙝𝙖𝙩𝙚 𝙗𝙤𝙡𝙚 𝙛𝙚𝙡🤷",
                "𝙀𝙮 𝙩𝙤 𝙖𝙢𝙞 𝙚 𝙙𝙞𝙠𝙚🙋",
                "𝙃𝙖 𝙗𝙤𝙡𝙤 𝙠𝙞 𝙗𝙤𝙡𝙗𝙖- 𝘼𝙢𝙞 𝙨𝙝𝙪𝙣𝙩𝙚𝙨𝙞👂"
            ];

            if (!arr) {
                return api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: module.exports.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID);
            }

            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}`)).data.reply;

            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: module.exports.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};