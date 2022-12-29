const {writeExifImg}= require("./lib/exif.js");
const { 
default: makeWASocket, 
DisconnectReason, 
AnyMessageContent,downloadMediaMessage,
delay, 
useSingleFileAuthState 
} = require('@adiwajshing/baileys')
const P = require("pino")
const logger = P();
const { Boom } = require("@hapi/boom")
const { state, loadState, saveState } = useSingleFileAuthState("./sesi.json")
//Awal Koneksi
async function startBot() {
  console.log(("\n██╗░██╗░░░░░░░██╗░█████╗░███╗░░██╗\n██║░██║░░██╗░░██║██╔══██╗████╗░██║\n██║░╚██╗████╗██╔╝███████║██╔██╗██║\n██║░░████╔═████║░██╔══██║██║╚████║\n██║░░╚██╔╝░╚██╔╝░██║░░██║██║░╚███║\n╚═╝░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝╚═╝░░╚══╝\n\n██████╗░░█████╗░████████╗\n██╔══██╗██╔══██╗╚══██╔══╝\n██████╦╝██║░░██║░░░██║░░░\n██╔══██╗██║░░██║░░░██║░░░\n██████╦╝╚█████╔╝░░░██║░░░\n╚═════╝░░╚════╝░░░░╚═╝░░░\n"))

  console.log(("Menunggu Koneksi Ke WA"))
  console.log(("Menghubungkan"))
    const wabot = await makeWASocket({
    logger: P({ level: 'silent' }),
    browser: ["Iwan Bot","Safari","1.0.0"],
    printQRInTerminal: true,
    auth: state})
  console.log(("Terhuhung"))
  
  wabot.ev.on("connection.update", (update) => {
    const {connection, lastDisconnect} = update
    if (connection == "close") {
      lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut? startBot():
  console.log(('Sambungan Terputus'))}
  })
  
  wabot.ev.on('creds.update', saveState);
  wabot.ev.on("messages.upsert", async ({messages,type})=>{
        const msg = messages[0];
        if (!msg.message || msg.key.remoteJid === "status@broadcast" || msg.key.fromMe||!msg.message.imageMessage)return;
if(msg.key.remoteJid){
        let caption = msg.message.imageMessage.caption;

        let buffer = await downloadMediaMessage(msg, "buffer", {}, {
          logger
        });
        
        buffer = await writeExifImg(buffer, {packname:"Xixy Bot", author:"iwan"});
        
        if (caption === '#stiker') {
          wabot.sendMessage(msg.key.remoteJid, {sticker:{url: buffer}});
        }
}
      });
}
startBot()