// config.js
const fs = require("fs");
require("dotenv").config();

const config = {
  SESSION_ID: process.env.SESSION_ID || "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidUtSdEk2cmxCNk9wRWphK1MyNkFZcExpLzFBM2VyYUUzL0tLb1dTU0NVaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVjRSMC93VmRNaWIxcVc3K1N2WjBhVDB2eDlaZ0FWUENibXhaL3FTSkVsZz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLT29XTVlMbnU5TUYwMDNiYmpoN0pFcDlFQkJjb1JaVjl2NEhqL1BsUkUwPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJYVlNpWGN2Q2tSRmlJKy95S2FiWG9uRXUyeVR2aUxNSWNWUzVSaWdjVm1NPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImdJak5FcXBSQXpRL1FaM1I1a3dGQys1ZVFMNXBxK1FpeENKMEJidEVnbUU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlRiOXg1Y3JhV2loTFBvZFdSb1hRNUx6cTY2c2habGl1dXdYTTlsV3hLa289In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaUpTU0lVTGlvRkJXbjdLZTNKWEJZaVdEQUtDWXMvY2NKdE5UVmZxTzkyRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZDNYS3U5QlhLZ2J3RDZOWllOUVVlZlZLc3dVQkxRS2k2WlhJL0JJcUtYYz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InR2YndFZG1zWVVpMHc3K3RXKzZKS1lWUlRHOUZWOEdIQnRsQU5DL2s0NTFVNnhaNjVVUWg2cytVRjFzUDVHQUJvekhVeEllUDluTERnbms4QzRsbWhRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTAsImFkdlNlY3JldEtleSI6IlJld1F4Vm15QzcxVkFvcHg5dU5CWFRoNmNneDE1a2JxaWV1NWYyU2wyYlE9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IkhwdHp4MnNyUUllM05NVWxOZGFGTGciLCJwaG9uZUlkIjoiMjI0OTEwNjYtMTMwNi00OTQ2LWI0N2EtNWE2ZWQ5NzNkN2JjIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlMreVlvWkJiS2Q1aU40eVUxMDJrZWh3c2tnVT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJQYXRCNU5uYWV5TnBmYS9qZlJVcjRDQkZsUnc9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiOEQ1UzY3R1YiLCJtZSI6eyJpZCI6IjI0MjA1NTM1OTczMzoxMEBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiLgv5DwlqST8J2brfCdkYXwk4KA8J2bsvCdkYzwnZGH8J2bqPCdm6XwnZC68J2bqfCdkYXwnZuv8Jakk+C/kCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSVRibVBRRUVNbXg4TGNHR0FRZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiUThQTWR3M1hSQnZRUWp1VXdCSFQvMFhoaFZPbTgvaWl4ZHVvUUIyU0YxMD0iLCJhY2NvdW50U2lnbmF0dXJlIjoiV2VOY1U1aUxva25zaTNkaytxb2ptMk9BQklCc0liNGtNT200NFNwRng4eFdyMVFlWlpuZUFNY2pETjV1QTlVQ0xCV1dvZWM2MU9Malh4d0tzMFMvQVE9PSIsImRldmljZVNpZ25hdHVyZSI6IitFWHBHM2ljdDZmVzllZkRsL2dRNGZ4VEFRYlJ3VllGZ3lBRUFkNlZFQVFWNkVIT1lzUzc1b2J6ajBDd21ZWDhVcHRsaGdDbDhTYXdNQVBRcGJ5L2lRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjQyMDU1MzU5NzMzOjEwQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlVQRHpIY04xMFFiMEVJN2xNQVIwLzlGNFlWVHB2UDRvc1hicUVBZGtoZGQifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3Mjc3OTc0NjN9",
  PREFIX: process.env.PREFIX || '.',
  AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN !== undefined ? process.env.AUTO_STATUS_SEEN === 'true' : true, 
  AUTO_DL: process.env.AUTO_DL !== undefined ? process.env.AUTO_DL === 'true' : false,
  AUTO_READ: process.env.AUTO_READ !== undefined ? process.env.AUTO_READ === 'true' : true,
  AUTO_TYPING: process.env.AUTO_TYPING !== undefined ? process.env.AUTO_TYPING === 'true' : true,
  AUTO_RECORDING: process.env.AUTO_RECORDING !== undefined ? process.env.AUTO_RECORDING === 'true' : false,
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE !== undefined ? process.env.ALWAYS_ONLINE === 'true' : true,
  AUTO_REACT: process.env.AUTO_REACT !== undefined ? process.env.AUTO_REACT === 'true' : false,
   /*auto block only for 212 */
  AUTO_BLOCK: process.env.AUTO_BLOCK !== undefined ? process.env.AUTO_BLOCK === 'true' : true,
  
  
  REJECT_CALL: process.env.REJECT_CALL !== undefined ? process.env.REJECT_CALL === 'true' : false, 
  NOT_ALLOW: process.env.NOT_ALLOW !== undefined ? process.env.NOT_ALLOW === 'true' : true,
  MODE: process.env.MODE || "public",
  OWNER_NAME: process.env.OWNER_NAME || "𝛭𝑅🥀𝛲𝑌𝑇𝛨𝛥𝐺𝛩𝑅𝛯",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "+242064837163",
  GEMINI_KEY: process.env.GEMINI_KEY || "AIzaSyCUPaxfIdZawsKZKqCqJcC-GWiQPCXKTDc",
  WELCOME: process.env.WELCOME !== undefined ? process.env.WELCOME === 'true' : false, 
};


module.exports = config;
