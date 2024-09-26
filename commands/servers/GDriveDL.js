const axios = require('axios');

async function GDriveDL(url) {
    let id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))?.[1];
    if (!id) throw 'ID Not Found';
    let res = await axios.post(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {}, {
        headers: {
            'accept-encoding': 'gzip, deflate, br',
            'content-length': 0,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'origin': 'https://drive.google.com',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
            'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
            'x-drive-first-party': 'DriveWebUi',
            'x-json-requested': 'true'
        }
    });
    let { fileName, sizeBytes, downloadUrl } = JSON.parse(res.data.slice(4));
    if (!downloadUrl) throw 'Link Download Limit!';
    let data = await axios.get(downloadUrl, {
        responseType: 'arraybuffer'
    });
    if (data.status !== 200) throw data.statusText;
    return {
        downloadUrl, fileName,
        fileSize: (sizeBytes / 1024 / 1024).toFixed(2),
        mimetype: data.headers['content-type']
    };
}

module.exports = GDriveDL;
