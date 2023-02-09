const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const color = require("cli-color")
const qrcode = require('qrcode');
const log = require("pino");
const logger = log();
const { 
default: makeWASocket, 
DisconnectReason, 
AnyMessageContent,downloadMediaMessage, 
useSingleFileAuthState 
} = require('@adiwajshing/baileys')
const { state,saveState } = useSingleFileAuthState("./sesimonitor.json")
//Awal Koneksi
async function xixyBot() {
    const xixy = await makeWASocket({
    logger: log({ level: 'silent' }),
    browser: ["Server Monitor","Safari","3.0.0"],
    printQRInTerminal: true,
    auth: state})
  
   xixy.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
      if(connection === 'close') {xixyBot()}
      if(connection ==="open"){console.log("Tersambung Ke WA")}
   })
  xixy.ev.on ('creds.update', saveState)
      
//@@@ AREA CONVERSATION MODE @@@
xixy.ev.on("messages.upsert", async ({messages,type})=>{
      //console.log(messages)
      if(!messages[0]||!messages[0].message)return;
      const msg = messages[0];
      const pesan = messages[0].message.conversation;
      const kirim = xixy.sendMessage;
      const id = messages[0].key.remoteJid
      
//Menu Creator
const objek=pesan.split("_")
    if(objek[0]==="tambah" && objek[1].includes("#") && objek.length=="3"){
      fs.writeFileSync("./"+`${objek[1].slice(1)}.json`,objek[2]),kirim(id,{text:"Sukses Menambahkan Keyword"})}
      
//Auto Akses # key
if(pesan.split(" ").length=="1" && pesan.includes("#")){
const data = path.join("./", `${pesan.toString().slice(1)}.json`)
fs.open(data, 'a+', function (err, f) {if(fs.readFileSync(data).toString()!="")
kirim(id,{text:fs.readFileSync(data).toString()})
if(fs.readFileSync(data).toString()=="")fs.unlinkSync(data) }) }
    
//Standar Akses Terminal
const p=pesan.split("@")
    if(p[0]==="cmd")exec(p[1], (error, stdout, stderr) => {
    if (error){kirim(id,{text: `${error}`})}
    if (stderr) {return;}
    if(stdout)kirim(id,{text: `${stdout}`})})

//Kirim File
const k=pesan.split(" ")
const filesget ={
      document: {url: k[1]},
      mimetype: 'Mimetype.zip',
      fileName: k[1]+".zip"}
if(k[0]=='send'&& k.length== "2")kirim(id,filesget)

//Hapus file
const del=pesan.split(" ")
    if(del[0]==="hapus" && del.length=="2")exec("rm "+del[1], (error, stdout, stderr) => {
    if (error) {kirim(id,{text: `${error}`})}
    if (stderr) {return;}
    if(stdout){kirim(id,{text: `${stdout}`})}
      kirim(id,{text:"file berhasil di hapus"})})

//List file
const lst=pesan.split(" ")
    if(lst[0]==="list" && del.length=="1")exec("ls", (error, stdout, stderr) => {
    if (error) {kirim(id,{text: `${error}`})}
    if (stderr) {return;}
    if(stdout){kirim(id,{text: `${stdout}`})} })

if(pesan=="#jadibot"){console.log("Terdeteksi meminta layanan Clone Bot"),kirim(messages[0].key.remoteJid,{image: {url: ("./qr.png")},caption:"Scan QR ini untuk menjadi Xixybot\n\n1. Klik titik 3 di pojok kanan atas\n2. Klik Perangkat Tertaut\n3. Scan QR ini \nQR Expired dalam 30 detik"})}
});


//@@@ AREA EXTENDED MODE @@@
xixy.ev.on("messages.upsert", async ({messages,type})=>{
      //console.log(messages)
      if(!messages[0]||!messages[0].message||!messages[0].message.extendedTextMessage)return;
      const msg = messages[0];
      const pesan = messages[0].message.extendedTextMessage.text;
      const kirim = xixy.sendMessage;
      const id = messages[0].key.remoteJid;

//Menu Creator
const objek=pesan.split("_")
    if(objek[0]==="tambah" && objek[1].includes("#") && objek.length=="3"){
      fs.writeFileSync("./"+`${objek[1].slice(1)}.json`,objek[2]),kirim(id,{text:"Sukses Menambahkan Keyword"})}
      
//Auto Akses # key
if(pesan.split(" ").length=="1" && pesan.includes("#")){
const data = path.join("./", `${pesan.toString().slice(1)}.json`)
fs.open(data, 'a+', function (err, f) {if(fs.readFileSync(data).toString()!="")
kirim(id,{text:fs.readFileSync(data).toString()})
if(fs.readFileSync(data).toString()=="")fs.unlinkSync(data) }) }
    
//Standar Akses Terminal
const p=pesan.split("@")
    if(p[0]==="cmd")exec(p[1], (error, stdout, stderr) => {
    if (error){kirim(id,{text: `${error}`})}
    if (stderr) {return;}
    if(stdout)kirim(id,{text: `${stdout}`})})

//Kirim File
const k=pesan.split(" ")
const filesget ={
      document: {url: k[1]},
      mimetype: 'Mimetype.zip',
      fileName: k[1]+".zip"}
if(k[0]=='send'&& k.length== "2")kirim(id,filesget)

//Hapus file
const del=pesan.split(" ")
    if(del[0]==="hapus" && del.length=="2")exec("rm "+del[1], (error, stdout, stderr) => {
    if (error) {kirim(id,{text: `${error}`})}
    if (stderr) {return;}
    if(stdout){kirim(id,{text: `${stdout}`})}
      kirim(id,{text:"file berhasil di hapus"})})

//List file
const lst=pesan.split(" ")
    if(lst[0]==="list" && del.length=="1")exec("ls", (error, stdout, stderr) => {
    if (error) {kirim(id,{text: `${error}`})}
    if (stderr) {return;}
    if(stdout){kirim(id,{text: `${stdout}`})} })

if(pesan=="#jadibot"){console.log("Terdeteksi meminta layanan Clone Bot"),kirim(messages[0].key.remoteJid,{image: {url: ("./qr.png")},caption:"Scan QR ini untuk menjadi Xixybot\n\n1. Klik titik 3 di pojok kanan atas\n2. Klik Perangkat Tertaut\n3. Scan QR ini \nQR Expired dalam 30 detik"})}

});
//Area Ev.on
}
  xixyBot()