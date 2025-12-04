// help.js - Chairman Bot Enhanced Menu (All Commands Preserved)
const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    // Bot info with your links
    const botInfo = {
        channelLink: "https://whatsapp.com/channel/0029VbBi0ynFy725j1R1G70S",
        groupLink: "https://chat.whatsapp.com/CEvcxfjrjxQIBcoTMboExy",
        newsletterJid: '0029VbBi0ynFy725j1R1G70S@newsletter',
        newsletterName: '𝐂𝐇𝐀𝐈𝐑𝐌𝐀𝐍 𝐁𝐎𝐓'
    };

    const helpMessage = `
▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂
  ✦ *${settings.botName || 'CHAIRMAN BOT'}* ✦
▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂

┌───〔 *ℹ️ 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎* 〕───⊷
│ ⿻ *Version:* ${settings.version || '4.0.0'}
│ ⿻ *Owner:* ${settings.botOwner || 'Chairman'}
│ ⿻ *YT:* ${global.ytch || 'Chairman Official'}
│ ⿻ *Status:* Online ✅
│ ⿻ *Prefix:* .
└──────────────────⊷

  ═══════════════════
    ✧ *𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓* ✧
  ═══════════════════

┏━━━❰ 🌐 *𝐆𝐄𝐍𝐄𝐑𝐀𝐋* ❱━━━┓
┃ ⌬ .help or .menu
┃ ⌬ .ping
┃ ⌬ .alive
┃ ⌬ .tts <text>
┃ ⌬ .owner
┃ ⌬ .joke
┃ ⌬ .quote
┃ ⌬ .fact
┃ ⌬ .weather <city>
┃ ⌬ .news
┃ ⌬ .attp <text>
┃ ⌬ .lyrics <song_title>
┃ ⌬ .8ball <question>
┃ ⌬ .groupinfo
┃ ⌬ .staff or .admins
┃ ⌬ .vv
┃ ⌬ .trt <text> <lang>
┃ ⌬ .ss <link>
┃ ⌬ .jid
┃ ⌬ .url
┗━━━━━━━━━━━━━━━━━━┛

┏━━━❰ 👮‍♂️ *𝐀𝐃𝐌𝐈𝐍* ❱━━━┓
┃ ⌬ .ban @user
┃ ⌬ .promote @user
┃ ⌬ .demote @user
┃ ⌬ .mute <minutes>
┃ ⌬ .unmute
┃ ⌬ .delete or .del
┃ ⌬ .kick @user
┃ ⌬ .warnings @user
┃ ⌬ .warn @user
┃ ⌬ .antilink
┃ ⌬ .antibadword
┃ ⌬ .clear
┃ ⌬ .tag <message>
┃ ⌬ .tagall
┃ ⌬ .tagnotadmin
┃ ⌬ .hidetag <message>
┃ ⌬ .chatbot
┃ ⌬ .resetlink
┃ ⌬ .antitag <on/off>
┃ ⌬ .welcome <on/off>
┃ ⌬ .goodbye <on/off>
┃ ⌬ .setgdesc <description>
┃ ⌬ .setgname <new name>
┃ ⌬ .setgpp (reply to image)
┗━━━━━━━━━━━━━━━━━━┛

┏━━━❰ 🔒 *𝐎𝐖𝐍𝐄𝐑* ❱━━━┓
┃ ⌬ .mode <public/private>
┃ ⌬ .clearsession
┃ ⌬ .antidelete
┃ ⌬ .cleartmp
┃ ⌬ .update
┃ ⌬ .settings
┃ ⌬ .setpp <reply to image>
┃ ⌬ .autoreact <on/off>
┃ ⌬ .autostatus <on/off>
┃ ⌬ .autostatus react <on/off>
┃ ⌬ .autotyping <on/off>
┃ ⌬ .autoread <on/off>
┃ ⌬ .anticall <on/off>
┃ ⌬ .pmblocker <on/off/status>
┃ ⌬ .pmblocker setmsg <text>
┃ ⌬ .setmention <reply to msg>
┃ ⌬ .mention <on/off>
┗━━━━━━━━━━━━━━━━━━┛

┏━━❰ 🎨 *𝐈𝐌𝐀𝐆𝐄/𝐒𝐓𝐈𝐂𝐊𝐄𝐑* ❱━━┓
┃ ⌬ .blur <image>
┃ ⌬ .simage <reply to sticker>
┃ ⌬ .sticker <reply to image>
┃ ⌬ .removebg
┃ ⌬ .remini
┃ ⌬ .crop <reply to image>
┃ ⌬ .tgsticker <Link>
┃ ⌬ .meme
┃ ⌬ .take <packname>
┃ ⌬ .emojimix <emj1>+<emj2>
┃ ⌬ .igs <insta link>
┃ ⌬ .igsc <insta link>
┗━━━━━━━━━━━━━━━━━━┛

┏━━━❰ 🖼️ *𝐏𝐈𝐄𝐒* ❱━━━┓
┃ ⌬ .pies <country>
┃ ⌬ .china
┃ ⌬ .indonesia
┃ ⌬ .japan
┃ ⌬ .korea
┃ ⌬ .hijab
┗━━━━━━━━━━━━━━━━━━┛

┏━━━❰ 🎮 *𝐆𝐀𝐌𝐄𝐒* ❱━━━┓
┃ ⌬ .tictactoe @user
┃ ⌬ .hangman
┃ ⌬ .guess <letter>
┃ ⌬ .trivia
┃ ⌬ .answer <answer>
┃ ⌬ .truth
┃ ⌬ .dare
┗━━━━━━━━━━━━━━━━━━┛

┏━━━❰ 🤖 *𝐀𝐈* ❱━━━┓
┃ ⌬ .gpt <question>
┃ ⌬ .gemini <question>
┃ ⌬ .imagine <prompt>
┃ ⌬ .flux <prompt>
┃ ⌬ .sora <prompt>
┗━━━━━━━━━━━━━━━━━━┛

┏━━━❰ 🎯 *𝐅𝐔𝐍* ❱━━━┓
┃ ⌬ .compliment @user
┃ ⌬ .insult @user
┃ ⌬ .flirt
┃ ⌬ .shayari
┃ ⌬ .goodnight
┃ ⌬ .roseday
┃ ⌬ .character @user
┃ ⌬ .wasted @user
┃ ⌬ .ship @user
┃ ⌬ .simp @user
┃ ⌬ .stupid @user [text]
┗━━━━━━━━━━━━━━━━━━┛

┏━━━❰ 🔤 *𝐓𝐄𝐗𝐓𝐌𝐀𝐊𝐄𝐑* ❱━━━┓
┃ ⌬ .metallic <text>
┃ ⌬ .ice <text>
┃ ⌬ .snow <text>
┃ ⌬ .impressive <text>
┃ ⌬ .matrix <text>
┃ ⌬ .light <text>
┃ ⌬ .neon <text>
┃ ⌬ .devil <text>
┃ ⌬ .purple <text>
┃ ⌬ .thunder <text>
┃ ⌬ .leaves <text>
┃ ⌬ .1917 <text>
┃ ⌬ .arena <text>
┃ ⌬ .hacker <text>
┃ ⌬ .sand <text>
┃ ⌬ .blackpink <text>
┃ ⌬ .glitch <text>
┃ ⌬ .fire <text>
┗━━━━━━━━━━━━━━━━━━┛

┏━━━❰ 📥 *𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑* ❱━━━┓
┃ ⌬ .play <song_name>
┃ ⌬ .song <song_name>
┃ ⌬ .spotify <query>
┃ ⌬ .instagram <link>
┃ ⌬ .facebook <link>
┃ ⌬ .tiktok <link>
┃ ⌬ .video <song name>
┃ ⌬ .ytmp4 <Link>
┗━━━━━━━━━━━━━━━━━━┛

┏━━━❰ 🧩 *𝐌𝐈𝐒𝐂* ❱━━━┓
┃ ⌬ .heart
┃ ⌬ .horny
┃ ⌬ .circle
┃ ⌬ .lgbt
┃ ⌬ .lolice
┃ ⌬ .its-so-stupid
┃ ⌬ .namecard
┃ ⌬ .oogway
┃ ⌬ .tweet
┃ ⌬ .ytcomment
┃ ⌬ .comrade
┃ ⌬ .gay
┃ ⌬ .glass
┃ ⌬ .jail
┃ ⌬ .passed
┃ ⌬ .triggered
┗━━━━━━━━━━━━━━━━━━┛

┏━━━❰ 🖼️ *𝐀𝐍𝐈𝐌𝐄* ❱━━━┓
┃ ⌬ .nom
┃ ⌬ .poke
┃ ⌬ .cry
┃ ⌬ .kiss
┃ ⌬ .pat
┃ ⌬ .hug
┃ ⌬ .wink
┃ ⌬ .facepalm
┗━━━━━━━━━━━━━━━━━━┛

┏━━━❰ 💻 *𝐆𝐈𝐓𝐇𝐔𝐁* ❱━━━┓
┃ ⌬ .git
┃ ⌬ .github
┃ ⌬ .sc
┃ ⌬ .script
┃ ⌬ .repo
┗━━━━━━━━━━━━━━━━━━┛

  ═══════════════════
      ✧ *𝐋𝐈𝐍𝐊𝐒* ✧
  ═══════════════════

┌───〔 📢 *𝐂𝐇𝐀𝐍𝐍𝐄𝐋* 〕───⊷
│ ${botInfo.channelLink}
└──────────────────⊷

┌───〔 💬 *𝐆𝐑𝐎𝐔𝐏* 〕───⊷
│ ${botInfo.groupLink}
└──────────────────⊷

▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂
  ✦ 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐂𝐇𝐀𝐈𝐑𝐌𝐀𝐍 ✦
▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂▸ ◂`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: botInfo.newsletterJid,
                        newsletterName: botInfo.newsletterName,
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: "𝐂𝐇𝐀𝐈𝐑𝐌𝐀𝐍 𝐁𝐎𝐓 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋",
                        body: "Join Our Channel For Updates!",
                        thumbnailUrl: "https://i.postimg.cc/Wq32gbRt/photo-5875031390372433036-y.jpg",
                        sourceUrl: botInfo.channelLink,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: botInfo.newsletterJid,
                        newsletterName: botInfo.newsletterName,
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: "𝐂𝐇𝐀𝐈𝐑𝐌𝐀𝐍 𝐁𝐎𝐓 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋",
                        body: "Join Our Channel For Updates!",
                        thumbnailUrl: "https://i.postimg.cc/Wq32gbRt/photo-5875031390372433036-y.jpg",
                        sourceUrl: botInfo.channelLink,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;