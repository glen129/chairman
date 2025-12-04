const settings = require('../settings.js');

async function repoCommand(sock, chatId, message) {
    try {
        const repoInfo = `
╔══════════════════════════════════╗
║   🔐 𝐏𝐑𝐈𝐕𝐀𝐓𝐄 𝐑𝐄𝐏𝐎𝐒𝐈𝐓𝐎𝐑𝐘 🔐   ║
╠══════════════════════════════════╣
║  This repository is confidential   ║
║  and only accessible to authorized ║
║  developers. Access is restricted. ║
║                                    ║
║  💼 For inquiries, contact owner   ║
╚══════════════════════════════════╝`.trim();

        await sock.sendMessage(chatId, { text: repoInfo }, { quoted: message });

    } catch (error) {
        console.error('Error in repo command:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to get repository info.' });
    }
}

module.exports = repoCommand;
