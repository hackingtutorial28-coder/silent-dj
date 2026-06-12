module.exports = {
  name: 'ping',
  description: 'Check bot response time',
  async execute(sock, message, args) {
    const start = Date.now();
    await sock.sendMessage(message.key.remoteJid, { text: '🏓 Pong!' });
    const end = Date.now();
    console.log(`Ping: ${end - start}ms`);
  }
};

const yts = require('yt-search');
const ytdl = require('ytdl-core');

module.exports = {
  name: 'play',
  description: 'Play a song from YouTube',
  async execute(sock, message, args) {
    const query = args.join(' ');
    if (!query) {
      await sock.sendMessage(message.key.remoteJid, { 
        text: '🎵 Usage: !play <song name or URL>' 
      });
      return;
    }
    
    await sock.sendMessage(message.key.remoteJid, { 
      text: `🔍 Searching for "${query}"...` 
    });
    
    try {
      const result = await yts(query);
      const video = result.videos[0];
      
      if (!video) {
        await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ No results found!' 
        });
        return;
      }
      
      await sock.sendMessage(message.key.remoteJid, {
        text: `🎵 *Now Playing:*\n\n📌 *Title:* ${video.title}\n⏱️ *Duration:* ${video.duration.timestamp}\n👁️ *Views:* ${video.views}\n🔗 *Link:* ${video.url}`
      });
      
      // Note: To send actual audio, you'd need to download and convert
      // This is a simplified version
      
    } catch (error) {
      console.error(error);
      await sock.sendMessage(message.key.remoteJid, { 
        text: '❌ Error playing song!' 
      });
     module.exports = {
  name: 'stop',
  description: 'Stop current playback and clear queue',
  async execute(sock, message, args) {
    // This would connect to your music player state
    // For now, a simple response
    await sock.sendMessage(message.key.remoteJid, { 
      text: '⏹️ Playback stopped. Queue cleared.\nUse !play to start new music!' 
    });
  }
}; 

   module.exports = {
  name: 'skip',
  description: 'Skip to next song in queue',
  async execute(sock, message, args) {
    await sock.sendMessage(message.key.remoteJid, { 
      text: '⏭️ Skipping to next track...' 
    });
  }
};   

     module.exports = {
  name: 'queue',
  description: 'Show current playlist',
  async execute(sock, message, args) {
    await sock.sendMessage(message.key.remoteJid, { 
      text: '🎵 *Current Queue:*\n\n1. Song Title - Artist\n2. Song Title - Artist\n3. Song Title - Artist\n\nNo more songs in queue.' 
    });
  }
}; 

     module.exports = {
  name: 'volume',
  description: 'Adjust playback volume (1-100)',
  async execute(sock, message, args) {
    const volume = parseInt(args[0]);
    
    if (!volume || volume < 1 || volume > 100) {
      await sock.sendMessage(message.key.remoteJid, { 
        text: '🔊 Usage: !volume <1-100>\nCurrent volume: 50%' 
      });
      return;
    }
    
    await sock.sendMessage(message.key.remoteJid, { 
      text: `🔊 Volume set to ${volume}%` 
    });
  }
}; 

      const os = require('os');
const moment = require('moment-timezone');
const settings = require('../settings');

module.exports = {
  name: 'status',
  description: 'Check bot status and statistics',
  async execute(sock, message, args) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const statusText = `🎵 *${settings.BOT_NAME} Status*\n\n` +
      `✅ *Bot Status:* Online\n` +
      `⏰ *Uptime:* ${hours}h ${minutes}m ${seconds}s\n` +
      `💻 *Platform:* ${os.platform()}\n` +
      `🕐 *Time:* ${moment().tz(settings.TIMEZONE).format('YYYY-MM-DD HH:mm:ss')}\n` +
      `📱 *Session:* Active\n` +
      `🎧 *Music:* Ready to play\n\n` +
      `Use !help for commands!`;
    
    await sock.sendMessage(message.key.remoteJid, { text: statusText });
  }
};

      const settings = require('../settings');

module.exports = {
  name: 'owner',
  description: 'Contact bot owner',
  async execute(sock, message, args) {
    await sock.sendMessage(message.key.remoteJid, { 
      text: `👤 *Bot Owner*\n\n📞 Contact: wa.me/${settings.OWNER_NUMBER}\n\nFor issues, suggestions, or support, please contact the owner.` 
    });
  }
};
    }
  }
};
