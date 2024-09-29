import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import axios from 'axios';

const searchRepo = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const validCommands = ['repo', 'sc', 'script'];

  if (validCommands.includes(cmd)) {
    const repoUrl = `https://api.github.com/repos/Kingbega/BARAKA-MD-V1`;
    
    await handleRepoCommand(m, Matrix, repoUrl);
  }
};

const handleRepoCommand = async (m, Matrix, repoUrl) => {
  try {
    const response = await axios.get(repoUrl);
    const repoData = response.data;

    const {
      full_name,
      name,
      forks_count,
      stargazers_count,
      created_at,
      updated_at,
      owner,
    } = repoData;

    const messageText = `*_BARAKA MD GITHUB INFORMATION:_*\n
*_Name:_* ${name}
*_Stars:_* ${stargazers_count}
*_Forks:_* ${forks_count}
*_Created At:_* ${new Date(created_at).toLocaleDateString()}
*_Last Updated:_* ${new Date(updated_at).toLocaleDateString()}
*_Owner:_* *_Baraka Bega_*
    `;

    const repoMessage = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: messageText,
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: '*© Baraka Bega*',
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              ...(await prepareWAMessageMedia({
                image: {
                  url: 'https://i.imgur.com/3zfa6Qy.jpeg',
                },
              }, { upload: Matrix.waUploadToServer })),
              title: '',
              gifPlayback: true,
              subtitle: '',
              hasMediaAttachment: false,
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Contact Owner',
                    url: 'https://wa.me/+255762190568?text=Hey_Mr_baraka',
                  }),
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Click Here To Fork',
                    url: 'https://github.com/Kingbega/BARAKA-MD-V1/fork',
                  }),
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Join Our Community',
                    url: 'https://whatsapp.com/channel/0029Vail87sIyPtQoZ2egl1h',
                  }),
                },
              ],
            }),
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 9999,
              isForwarded: true,
            },
          }),
        },
      },
    }, {});

    await Matrix.relayMessage(repoMessage.key.remoteJid, repoMessage.message, {
      messageId: repoMessage.key.id,
    });
    await m.React('✅');
  } catch (error) {
    console.error('Error processing your request:', error);
    m.reply('Error processing your request.');
    await m.React('❌');
  }
};

export default searchRepo;
