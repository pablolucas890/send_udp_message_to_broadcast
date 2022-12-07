
var dgram = require('dgram');


const PORT_BROADCAST = 80;
const BROADCAST_ADDR = "255.255.255.255";

const server = dgram.createSocket("udp4");

server.bind(function () {
  server.setBroadcast(true);
  setInterval(broadcastNew, 3000);
});

function broadcastNew() {
  const SSID = "NetworkSSID";
  const PASS = "NetworkPASS";
  const SECURY_MODE = 3;

  const sum = (data, res) => {
    for (let i = 0; i < data.length; ++i)
      res = (res + data[i])
    return res
  }

  let bytearray = []
  for (let i = 0; i < 0x88; i++) bytearray.push(0x00)
  bytearray[0x26] = 0x14

  let payload = Buffer.from(bytearray)

  for (let i = 0; i < SSID.length; i++) payload[68 + i] = SSID[i].charCodeAt(0);
  for (let i = 0; i < PASS.length; i++) payload[100 + i] = PASS[i].charCodeAt(0);

  payload[0x84] = SSID.length
  payload[0x85] = PASS.length
  payload[0x86] = SECURY_MODE
  const checksum = sum(payload, 0xBEAF)
  payload[0x20] = checksum & 0xFF
  payload[0x21] = checksum >>> 8

  server.send(payload, 0, payload.length, PORT_BROADCAST, BROADCAST_ADDR, (error) => {
    if (error) console.log(error)
    else console.log("Sent '" + payload + "'");
  });
}