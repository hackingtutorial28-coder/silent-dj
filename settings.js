module.exports = {
  // Bot name
  BOT_NAME: "Silent DJ",
  
  // Owner number (with country code, no + or spaces)
  OWNER_NUMBER: "255769192847",
  
  // Session name for auth files
  SESSION_NAME: "silent-dj-session",
  
  // Web dashboard port
  PORT: process.env.PORT || 3000,
  
  // Admin password for web panel
  MASTER_PASSWORD: process.env.MASTER_PASSWORD || "silentdj123",
  
  // Timezone
  TIMEZONE: "Africa/Dar_es_Salaam",
  
  // Prefix for commands
  PREFIX: ".",
  
  // Auto-status-view (true/false)
  AUTO_READ_STATUS: true,
  
  // Auto-read messages
  AUTO_READ_MESSAGES: false
};
