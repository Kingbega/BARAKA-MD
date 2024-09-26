const fs = require('fs');
const {
  sleep
} = require("./system");
const ff = require("fluent-ffmpeg");
const {
  tmpdir
} = require('os');
const Crypto = require("crypto");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const webp = require("node-webpmux");
const path = require("path");
const {
  exec
} = require("child_process");
ff.setFfmpegPath(ffmpegInstaller.path);
let {
  JSDOM
} = require("jsdom");
const {
  default: fetch
} = require("node-fetch");
const FormData = require("form-data");
const {
  writeFile,
  unlink,
  readFile
} = require("fs-extra");
const Jimp = require("jimp");
const fileType = require("file-type");
const axios = require("axios");
async function imageToWebp(_0x43ef32) {
  const _0x4ec607 = path.join(tmpdir(), Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  const _0x15263 = path.join(tmpdir(), Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".jpg");
  fs.writeFileSync(_0x15263, _0x43ef32);
  await new Promise((_0x46b270, _0x4db5be) => {
    ff(_0x15263).on("error", _0x4db5be).on("end", () => _0x46b270(true)).addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"]).toFormat("webp").save(_0x4ec607);
  });
  const _0x4a5570 = fs.readFileSync(_0x4ec607);
  fs.unlinkSync(_0x4ec607);
  fs.unlinkSync(_0x15263);
  return _0x4a5570;
}
async function videoToWebp(_0x117438) {
  const _0x2a8670 = path.join(tmpdir(), Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  const _0x3a9440 = path.join(tmpdir(), Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".mp4");
  fs.writeFileSync(_0x3a9440, _0x117438);
  await new Promise((_0x2adfa6, _0x20d296) => {
    ff(_0x3a9440).on("error", _0x20d296).on("end", () => _0x2adfa6(true)).addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse", "-loop", '0', "-ss", "00:00:00", '-t', "00:00:05", "-preset", "default", "-an", "-vsync", '0']).toFormat("webp").save(_0x2a8670);
  });
  const _0x3b524f = fs.readFileSync(_0x2a8670);
  fs.unlinkSync(_0x2a8670);
  fs.unlinkSync(_0x3a9440);
  return _0x3b524f;
}
async function writeExifImg(_0x2d7d1e, _0x2e7ebd) {
  let _0x9db217 = await imageToWebp(_0x2d7d1e);
  const _0x1da0d9 = path.join(tmpdir(), Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  const _0x3fa178 = path.join(tmpdir(), Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  fs.writeFileSync(_0x1da0d9, _0x9db217);
  if (_0x2e7ebd.packname || _0x2e7ebd.author) {
    const _0x4906cb = new webp.Image();
    const _0x501821 = {
      'sticker-pack-id': "https://github.com/Kingbega/Baraka-Md",
      'sticker-pack-name': _0x2e7ebd.packname,
      'sticker-pack-publisher': _0x2e7ebd.author,
      'emojis': _0x2e7ebd.categories ? _0x2e7ebd.categories : ['🌟']
    };
    const _0x1f9600 = Buffer.from([73, 73, 42, 0, 8, 0, 0, 0, 1, 0, 65, 87, 7, 0, 0, 0, 0, 0, 22, 0, 0, 0]);
    const _0x54773a = Buffer.from(JSON.stringify(_0x501821), "utf-8");
    const _0x328431 = Buffer.concat([_0x1f9600, _0x54773a]);
    _0x328431.writeUIntLE(_0x54773a.length, 14, 4);
    await _0x4906cb.load(_0x1da0d9);
    fs.unlinkSync(_0x1da0d9);
    _0x4906cb.exif = _0x328431;
    await _0x4906cb.save(_0x3fa178);
    return _0x3fa178;
  }
}
async function writeExifVid(_0x1d3d8f, _0xef7b9b) {
  let _0xb192b6 = await videoToWebp(_0x1d3d8f);
  const _0x8ac773 = path.join(tmpdir(), Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  const _0x34ab6b = path.join(tmpdir(), Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  fs.writeFileSync(_0x8ac773, _0xb192b6);
  if (_0xef7b9b.packname || _0xef7b9b.author) {
    const _0x1c57f2 = new webp.Image();
    const _0x54df18 = {
      'sticker-pack-id': "https://github.com/Kingbega/Baraka-Md",
      'sticker-pack-name': _0xef7b9b.packname,
      'sticker-pack-publisher': _0xef7b9b.author,
      'emojis': _0xef7b9b.categories ? _0xef7b9b.categories : ['🌟']
    };
    const _0x71360e = Buffer.from([73, 73, 42, 0, 8, 0, 0, 0, 1, 0, 65, 87, 7, 0, 0, 0, 0, 0, 22, 0, 0, 0]);
    const _0x49cd0d = Buffer.from(JSON.stringify(_0x54df18), "utf-8");
    const _0x374130 = Buffer.concat([_0x71360e, _0x49cd0d]);
    _0x374130.writeUIntLE(_0x49cd0d.length, 14, 4);
    await _0x1c57f2.load(_0x8ac773);
    fs.unlinkSync(_0x8ac773);
    _0x1c57f2.exif = _0x374130;
    await _0x1c57f2.save(_0x34ab6b);
    return _0x34ab6b;
  }
}
async function writeExifWebp(_0x26f2c8, _0x184694) {
  const _0x5acb92 = path.join(tmpdir(), Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  const _0x10f027 = path.join(tmpdir(), Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  fs.writeFileSync(_0x5acb92, _0x26f2c8);
  if (_0x184694.packname || _0x184694.author) {
    const _0x5cbb6f = new webp.Image();
    const _0x2613bc = {
      'sticker-pack-id': "https://github.com/Kingbega/Baraka-Md",
      'sticker-pack-name': _0x184694.packname,
      'sticker-pack-publisher': _0x184694.author,
      'emojis': _0x184694.categories ? _0x184694.categories : ['🌟']
    };
    const _0x140460 = await Buffer.from([73, 73, 42, 0, 8, 0, 0, 0, 1, 0, 65, 87, 7, 0, 0, 0, 0, 0, 22, 0, 0, 0]);
    const _0x306451 = await Buffer.from(JSON.stringify(_0x2613bc), "utf-8");
    const _0x4be983 = await Buffer.concat([_0x140460, _0x306451]);
    await _0x4be983.writeUIntLE(_0x306451.length, 14, 4);
    await _0x5cbb6f.load(_0x5acb92);
    fs.unlinkSync(_0x5acb92);
    _0x5cbb6f.exif = _0x4be983;
    await _0x5cbb6f.save(_0x10f027);
    return _0x10f027;
  }
}
async function webp2mp4(_0x1515fa) {
  let _0x2dab2d = new FormData();
  let _0x596bb8 = typeof _0x1515fa === "string" && /https?:\/\//.test(_0x1515fa);
  _0x2dab2d.append("new-image-url", _0x596bb8 ? _0x1515fa : '');
  _0x2dab2d.append("new-image", _0x596bb8 ? '' : _0x1515fa, "image.webp");
  let _0xaeb8f1 = await fetch("https://ezgif.com/webp-to-mp4", {
    'method': "POST",
    'body': _0x2dab2d
  });
  let _0x4dd2f3 = await _0xaeb8f1.text();
  let {
    document: _0x5651bf
  } = new JSDOM(_0x4dd2f3).window;
  let _0x444f13 = new FormData();
  let _0xec66c8 = {};
  for (let _0x403ad0 of _0x5651bf.querySelectorAll("form input[name]")) {
    _0xec66c8[_0x403ad0.name] = _0x403ad0.value;
    _0x444f13.append(_0x403ad0.name, _0x403ad0.value);
  }
  let _0x1d7309 = await fetch("https://ezgif.com/webp-to-mp4/" + _0xec66c8.file, {
    'method': "POST",
    'body': _0x444f13
  });
  let _0x1613e5 = await _0x1d7309.text();
  let {
    document: _0x57d5ce
  } = new JSDOM(_0x1613e5).window;
  return new URL(_0x57d5ce.querySelector("div#output > p.outfile > video > source").src, _0x1d7309.url).toString();
}
async function webpToPng(_0x29915f) {
  return new Promise((_0x3e133a, _0x3d4497) => {
    ff(_0x29915f).output("sticker.png").on("end", () => {
      fs.unlinkSync(_0x29915f);
      const _0x2f9292 = fs.readFileSync("sticker.png");
      _0x3e133a(_0x2f9292);
    }).on("error", _0x1b25ee => {
      fs.unlinkSync(_0x29915f);
      _0x3d4497(_0x1b25ee);
    }).run();
  });
}
async function toVideo(_0x5c0d5d) {
  return new Promise((_0x9d5447, _0x950c03) => {
    ff(_0x5c0d5d).outputOptions(['-y', "-filter_complex", "[0:a]showvolume=f=1:b=4:w=720:h=68,format=yuv420p[vid]", "-map", "[vid]", "-map 0:a"]).save("output.mp4").on("end", async () => {
      const _0x222451 = fs.readFileSync("output.mp4");
      _0x9d5447(_0x222451);
    }).on("error", _0x475f4f => {
      _0x950c03(_0x475f4f);
    });
  });
}
async function toAudio(_0x25c215) {
  const _0x7fbe2f = path.join("./lib/temp", Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".opus");
  const _0x399211 = path.join("./lib/temp", Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".mp4");
  await fs.promises.writeFile(_0x399211, _0x25c215);
  return new Promise((_0x40b1c6, _0x358f6f) => {
    ff(_0x399211).toFormat("mp3").on("end", () => {
      _0x40b1c6(fs.readFileSync(_0x7fbe2f));
      [...[_0x399211, _0x7fbe2f]].forEach(fs.unlinkSync);
    }).on("error", _0x5cc8b4 => {
      _0x358f6f(_0x5cc8b4);
      [...[_0x399211, _0x7fbe2f]].forEach(fs.unlinkSync);
    }).save(_0x7fbe2f);
  });
}
const gifToBuff = async _0x260a90 => {
  const {
    ext: _0x160529
  } = await fileType.fromBuffer(_0x260a90);
  if (_0x160529 !== "gif") {
    return _0x260a90;
  }
  const _0x9df685 = '' + Math.random().toString(36);
  await writeFile('./' + _0x9df685 + ".gif", _0x260a90);
  await new Promise((_0x15a673, _0xb9e920) => {
    exec("ffmpeg -i ./" + _0x9df685 + ".gif -movflags faststart -pix_fmt yuv420p -vf \"scale=trunc(iw/2)*2:trunc(ih/2)*2\" ./" + _0x9df685 + ".mp4", _0x50bf04 => {
      if (_0x50bf04) {
        _0xb9e920(_0x50bf04);
      } else {
        _0x15a673();
      }
    });
  });
  const _0x5336af = await readFile('./' + _0x9df685 + ".mp4");
  await Promise.all([unlink('./' + _0x9df685 + ".mp4"), unlink('./' + _0x9df685 + ".gif")]);
  return _0x5336af;
};
async function generateProfilePicture(_0x213bb4) {
  const _0x50b92c = await Jimp.read(_0x213bb4);
  const _0x5b8c4d = _0x50b92c.getWidth();
  const _0x1dee22 = _0x50b92c.getHeight();
  const _0x3b1a0e = _0x50b92c.clone().crop(0, 0, _0x5b8c4d, _0x1dee22);
  return {
    'img': await _0x3b1a0e.scaleToFit(324, 720).getBufferAsync(Jimp.MIME_JPEG),
    'preview': await _0x3b1a0e.normalize().getBufferAsync(Jimp.MIME_JPEG)
  };
}
async function genThumb(_0x53619a) {
  let _0x58e8e4;
  if (_0x53619a instanceof Buffer) {
    _0x58e8e4 = _0x53619a;
  } else {
    if (typeof _0x53619a === "string") {
      const _0x1575e1 = await axios.get(_0x53619a, {
        'responseType': "arraybuffer"
      });
      _0x58e8e4 = Buffer.from(_0x1575e1.data, "binary");
    } else {
      throw new Error("Unsupported input type. Only Buffer or URL string is allowed.");
    }
  }
  const _0x35735f = await fileType.fromBuffer(_0x58e8e4);
  await fs.promises.writeFile("thumb." + _0x35735f.ext, _0x58e8e4);
  const _0x2e3e28 = await Jimp.read("thumb." + _0x35735f.ext);
  function _0x30b0f1(_0x54fce4, _0x1a65a4) {
    while (true) {
      _0x54fce4 = _0x54fce4 > 301 || _0x1a65a4 > 301 ? _0x54fce4 / 1.001 : _0x54fce4;
      _0x1a65a4 = _0x54fce4 > 301 || _0x1a65a4 > 301 ? _0x1a65a4 / 1.001 : _0x1a65a4;
      if (parseInt(_0x54fce4) < 301 && parseInt(_0x1a65a4) < 301) {
        return {
          'w': parseInt(_0x54fce4),
          'h': parseInt(_0x1a65a4)
        };
      }
    }
  }
  const {
    w: _0x14c436,
    h: _0x308151
  } = _0x30b0f1(_0x2e3e28.bitmap.width, _0x2e3e28.bitmap.height);
  return await _0x2e3e28.resize(_0x14c436, _0x308151).getBufferAsync("image/jpeg");
}
function generateButtonText(_0x3355bb) {
  return _0x3355bb.map(_0xb6a5e8 => {
    let _0x418c8b = '';
    switch (_0xb6a5e8.name) {
      case "single_select":
        _0x418c8b = JSON.stringify(JSON.parse(_0xb6a5e8.buttonParamsJson));
        break;
      case "cta_url":
        _0x418c8b = "{\"display_text\":\"" + _0xb6a5e8.display_text + "\",\"url\":\"" + _0xb6a5e8.url + "\",\"merchant_url\":\"" + _0xb6a5e8.merchant_url + "\"}";
        break;
      case "cta_call":
        _0x418c8b = "{\"display_text\":\"" + _0xb6a5e8.display_text + "\",\"id\":\"" + _0xb6a5e8.id + "\",\"phone_number\":\"" + _0xb6a5e8.phone_number + "\"}";
        break;
      case "cta_copy":
        _0x418c8b = "{\"display_text\":\"" + _0xb6a5e8.display_text + "\",\"id\":\"" + _0xb6a5e8.id + "\",\"copy_code\":\"" + _0xb6a5e8.copy_code + "\"}";
        break;
      case "cta_reminder":
      case "cta_cancel_reminder":
      case "address_message":
        _0x418c8b = "{\"display_text\":\"" + _0xb6a5e8.display_text + "\",\"id\":\"" + _0xb6a5e8.id + "\"}";
        break;
      default:
        _0x418c8b = "{\"display_text\":\"" + _0xb6a5e8.display_text + "\",\"id\":\"" + _0xb6a5e8.id + "\"}";
    }
    return {
      'name': _0xb6a5e8.name,
      'buttonParamsJson': _0x418c8b
    };
  });
}
function shell(_0x12565d) {
  return new Promise((_0x5e4bc7, _0x519d95) => {
    exec(_0x12565d, (_0x5380a9, _0x12ebd5, _0x4844b4) => {
      if (_0x5380a9) {
        _0x519d95("Error: " + _0x5380a9.message);
      } else if (_0x4844b4) {
        _0x519d95("Stderr: " + _0x4844b4);
      } else {
        _0x5e4bc7(_0x12ebd5.trim());
      }
    });
  });
}
;
async function restartBot() {
  try {
    const _0x2d3bd6 = await shell("pm2 list");
    if (!_0x2d3bd6.includes("Baraka-Md")) {
      await shell("pm2 start index.js --name Baraka-Md");
      await sleep(500);
    }
    ;
    await shell("pm2 restart Baraka-Md");
    process.exit(0);
  } catch (_0x38b6d7) {
    return _0x38b6d7;
  }
}
;
module.exports = {
  'imageToWebp': imageToWebp,
  'videoToWebp': videoToWebp,
  'writeExifImg': writeExifImg,
  'writeExifVid': writeExifVid,
  'writeExifWebp': writeExifWebp,
  'webp2mp4': webp2mp4,
  'webpToPng': webpToPng,
  'toVideo': toVideo,
  'restartBot': restartBot,
  'toAudio': toAudio,
  'gifToBuff': gifToBuff,
  'generateProfilePicture': generateProfilePicture,
  'genThumb': genThumb,
  'generateButtonText': generateButtonText,
  'shell': shell
};