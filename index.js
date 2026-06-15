const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } =await import('@whiskeysockets/baileys');
const Pino = require('pino');
const fs = require('fs-extra');
const path = require('path');
const qrcode = require('qrcode-terminal');
const express = require('express');
const settings = require('./settings');

const app = express();
const logger = Pino({ level: 'silent' });

// Store active connections
let sock = null;
let isConnected = false;

// Command handlers
const commands = new Map();

// Load commands from /commands folder
async function loadCommands() {
  const commandsPath = path.join(__dirname, 'commands');
  if (!fs.existsSync(commandsPath)) {
    fs.ensureDirSync(commandsPath);
  }
  
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
    console.log(`✅ Loaded command: ${command.name}`);
  }
}

// Handle incoming messages
async function handleMessage(sock, message) {
  if (!message.message) return;
  
  const body = message.message.conversation || 
               message.message.extendedTextMessage?.text || 
               '';
  
  if (!body.startsWith(settings.PREFIX)) return;
  
  const args = body.slice(settings.PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  
  const command = commands.get(commandName);
  if (!command) return;
  
  try {
    await command.execute(sock, message, args);
  } catch (error) {
    console.error(`Error executing ${commandName}:`, error);
    await sock.sendMessage(message.key.remoteJid, { 
      text: `❌ Error: ${error.message}` 
    });
  }
}

// Main bot connection
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(`./auth/${settings.SESSION_NAME}`);
  
  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger,
    browser: ['Silent DJ', 'Chrome', '1.0.0']
  });
  
  // Generate QR code
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('\n📱 SCAN THIS QR CODE WITH WHATSAPP:\n');
      qrcode.generate(qr, { small: true });
      console.log('\n⏰ QR expires in 20 seconds...\n');
    }
    
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('❌ Connection closed, reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      isConnected = true;
      console.log(`\n✅ ${settings.BOT_NAME} is online!\n`);
      
      // Send startup message to owner
      if (settings.OWNER_NUMBER) {
        const ownerJid = `${settings.OWNER_NUMBER}@s.whatsapp.net`;
        await sock.sendMessage(ownerJid, { 
          text: `🎵 *${settings.BOT_NAME} is now online!*\n\nReady to play your requests.` 
        });
      }
    }
  });
  
  // Save credentials on update
  sock.ev.on('creds.update', saveCreds);
  
  // Handle incoming messages
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.key.fromMe && msg.message) {
      await handleMessage(sock, msg);
    }
  });
  
  return sock;
}

// Web dashboard
function startWebServer() {
  app.use(express.json());
  app.use(express.static('public'));
  
  app.get('/status', (req, res) => {
    res.json({
      name: settings.BOT_NAME,
      status: isConnected ? 'online' : 'offline',
      sessions: 1,
      uptime: process.uptime()
    });
  });
  
  app.listen(settings.PORT, () => {
    console.log(`🌐 Web dashboard: http://localhost:${settings.PORT}`);
  });
}

// Initialize bot
async function init() {
  console.log(`\n🎵 Starting ${settings.BOT_NAME}...\n`);
  await loadCommands();
  await startBot();
  startWebServer();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n👋 Shutting down...');
    if (sock) await sock.logout();
    process.exit(0);
  });
}

init();
