const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./silent_session');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,      // No QR – only pairing code
        browser: ['Silent DJ Pairing', 'Chrome', '1.0.0']
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, pairingCode } = update;
        if (pairingCode) {
            console.log(`\n🔐 YOUR 8-DIGIT PAIRING CODE: ${pairingCode}\n`);
            console.log('👉 Open WhatsApp → Settings → Linked Devices → Link a Device → Link with phone number');
            console.log('👉 Enter this code.\n');
        }
        if (connection === 'open') {
            console.log('✅ Bot connected! Session saved to "silent_session" folder.');
            process.exit(0);
        }
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error).output.statusCode;
            if (reason === DisconnectReason.loggedOut) {
                console.log('❌ Logged out. Delete silent_session folder and try again.');
            } else {
                console.log('❌ Connection closed. Check your internet and try again.');
            }
            process.exit(1);
        }
    });

    sock.ev.on('creds.update', saveCreds);

    const phoneNumber = await question('📱 Enter your phone number with country code (e.g., 255768192847): ');
    await sock.requestPairingCode(phoneNumber);
}

connectToWhatsApp();
