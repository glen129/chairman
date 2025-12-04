const os = require('os');
const settings = require('../settings.js');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

function getSpeedBar(ping) {
    if (ping < 100) return '▰▰▰▰▰▰▰▰▰▰';
    if (ping < 200) return '▰▰▰▰▰▰▰▰▱▱';
    if (ping < 300) return '▰▰▰▰▰▰▱▱▱▱';
    if (ping < 400) return '▰▰▰▰▱▱▱▱▱▱';
    return '▰▰▱▱▱▱▱▱▱▱';
}

function getStatusEmoji(ping) {
    if (ping < 100) return '🟢🟢🟢🟢🟢';
    if (ping < 200) return '🟢🟢🟢🟢⚫';
    if (ping < 300) return '🟡🟡🟡⚫⚫';
    return '🔴🔴⚫⚫⚫';
}

function getStatusText(ping) {
    if (ping < 100) return '⚡ Blazing Fast!';
    if (ping < 200) return '🚀 Very Good';
    if (ping < 300) return '✨ Normal';
    return '🐢 Slow';
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();
        await sock.sendMessage(chatId, { text: '🏓 𝐏𝐢𝐧𝐠𝐢𝐧𝐠...' }, { quoted: message });
        const end = Date.now();
        const ping = Math.round((end - start) / 2);

        const uptimeInSeconds = process.uptime();
        const uptimeFormatted = formatTime(uptimeInSeconds);
        
        // RAM Usage
        const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        
        // Platform
        const platform = os.platform();

        const botInfo = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ▀▄▀▄▀ 𝐂𝐇𝐀𝐈𝐑𝐌𝐀𝐍 ▀▄▀▄▀   
┃        ⌜ 𝐁𝐎𝐓 ⌟           
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                            
┃  ╭─「 📊 𝐒𝐲𝐬𝐭𝐞𝐦 𝐒𝐭𝐚𝐭𝐬 」    
┃  │                        
┃  │ ⚙️ 𝗣𝗶𝗻𝗴     ∷ ${ping}ms     
┃  │ 🕛 𝗨𝗽𝘁𝗶𝗺𝗲   ∷ ${uptimeFormatted}    
┃  │ 🔢 𝗩𝗲𝗿𝘀𝗶𝗼𝗻  ∷ v${settings.version}    
┃  │ 💽 𝗥𝗔𝗠      ∷ ${ramUsage}MB    
┃  │ 🌐 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺 ∷ ${platform}
┃  │                        
┃  ╰────────────────────     
┃                            
┃  ⟨ 🔋 ${getStatusEmoji(ping)} ⟩
┃  ⟨ ${getSpeedBar(ping)} ⟩
┃  ⟨ ${getStatusText(ping)} ⟩
┃                            
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`.trim();

        await sock.sendMessage(chatId, { text: botInfo }, { quoted: message });

    } catch (error) {
        console.error('Error in ping command:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to get bot status.' });
    }
}

module.exports = pingCommand;