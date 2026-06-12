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
