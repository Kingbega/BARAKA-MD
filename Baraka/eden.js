const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const responseSection = document.getElementById('response-section');

sendButton.addEventListener('click', () => {
    const userMessage = userInput.value;
    if (userMessage !== '') {
        const response = `You: ${userMessage}`;
        responseSection.innerHTML += `
            <div class="message-bubble user-message">
                <p>${response}</p>
                <span>${new Date().toLocaleTimeString()}</span>
            </div>
           

 `;
  let knowledge = {};
let conversationHistory = [];

function learn(input, response) {
  if (!knowledge[input]) {
    knowledge[input] = [];
  }
  knowledge[input].push(response);
}

function respond(input) {
  if (knowledge[input]) {
    // Improved scoring system
    const responses = knowledge[input];
    let bestResponse = responses[0];
    let bestScore = 0;
    for (let i = 0; i < responses.length; i++) {
      const score = calculateScore(responses[i], input);
      if (score > bestScore) {
        bestScore = score;
        bestResponse = responses[i];
      }
    }
    return bestResponse;
  } else {
    // Contextual default response
    if (conversationHistory.length > 0) {
      return "I didn't understand that. Can you please rephrase? We were discussing " + conversationHistory[conversationHistory.length - 1].input;
    } else {
      return "I didn't understand that. Can you please rephrase?";
    }
  }
}

function calculateScore(response, input) {
  // Improved scoring system based on word frequency
  const inputWords = input.split(' ');
  const responseWords = response.split(' ');
  let score = 0;
  for (let i = 0; i < inputWords.length; i++) {
    const wordFrequency = inputWords.filter(word => word === inputWords[i]).length;
    if (responseWords.includes(inputWords[i])) {
      score += wordFrequency;
    }
  }
  return score;
}

function chatbotResponse(userInput) {
  const response = respond(userInput);
  learn(userInput, response);
  conversationHistory.push({ input: userInput, response });
  // Knowledge pruning
  if (conversationHistory.length > 100) {
    conversationHistory.shift();
  }
  return response;
}

// Add user feedback
function rateResponse(rating) {
  const lastConversation = conversationHistory[conversationHistory.length - 1];
  if (rating > 0) {
    learn(lastConversation.input, lastConversation.response);
  } else {
    // Remove the response from the knowledge base
    knowledge[lastConversation.input] = knowledge[lastConversation.input].filter(response => response !== lastConversation.response);
  }
}



        userInput.value = '';
        getBotResponse(userMessage);
    }
});

function getBotResponse(userMessage) {
    let botResponse;
    if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey') || userMessage.includes('hola') || userMessage.includes('hallo' )|| userMessage.includes('Hello')|| userMessage.includes('Hi')|| userMessage.includes('Hy')|| userMessage.includes('ello')|| userMessage.includes('Ello')|| userMessage.includes('Heyy')|| userMessage.includes('eyy')|| userMessage.includes('yellow')|| userMessage.includes('Hi')|| userMessage.includes('Sup')|| userMessage.includes('sup')|| userMessage.includes('heyy')) {
        botResponse = 'Hi there!';
    } else if (userMessage.includes('good morning') || userMessage.includes('good afternoon') || userMessage.includes('good evening')) {
        botResponse = 'Good ' + userMessage.split(' ')[1] + '!';
    } else if (userMessage. includes('hey there') || userMessage.includes('hi there') || userMessage.includes('hello there')) {
        botResponse = 'Hey!';
    } else if (userMessage.includes('what\'s up') || userMessage.includes('what\'s good') || userMessage.includes('how\'s it going')) {
        botResponse = 'I\'m doing well, thanks!';
    } else if (userMessage.search('how are you')!==-1) {
        botResponse = 'I\'m doing well, thanks!';
    } else if (userMessage.includes('greetings')) {
        botResponse = 'Greetings!';
    } else if (userMessage.includes('hiya')) {
        botResponse = 'Hiya!';
    } else if (userMessage.includes('heyho')) {
        botResponse = 'Heyho!';
    } else if (userMessage.includes('hullo')) {
        botResponse = 'Hullo!';
    } else if (userMessage.search('well hello')!==-1) {
        botResponse = 'Well hello!';
    } else if (userMessage.search('long time no see')!==-1) {
        botResponse = 'Long time no see!';
    } else if (userMessage.includes('it\'s been a while')) {
        botResponse = 'It\'s been a while!';
    } else if (userMessage.includes('good day')) {
        botResponse = 'Good day!';
    } else if (userMessage.includes('goodnight')) {
        botResponse = 'Goodnight!';
    } else if (userMessage.search('hey now')!==-1) {
        botResponse = 'Hey now!';
    } else if (userMessage.includes('hi again')) {
        botResponse = 'Hi again!';
    } else if (userMessage.includes('hello again')) {
        botResponse = 'Hello again!';
    } else if (userMessage.includes('welcome back')) {
        botResponse = 'Welcome back!';
    } else if (userMessage.includes('good to see you')) {
        botResponse = 'Good to see you!';
    } else if (userMessage.includes('nice to meet you')) {
        botResponse = 'Nice to meet you!';
    } else if (userMessage.includes('pleasure to meet you')) {
        botResponse = 'Pleasure to meet you!';
    } else if (userMessage.includes('hello friend')) {
        botResponse = 'Hello friend!';
    } else if (userMessage.includes('hi friend')) {
        botResponse = 'Hi friend!';
    } else if (userMessage.includes('hey buddy')) {
        botResponse = 'Hey buddy!';
    } else if (userMessage.includes('hello there friend')) {
        botResponse = 'Hello there friend!';
    } else if (userMessage.includes('hi there friend')) {
        botResponse = 'Hi there friend!';
    } else if (userMessage.includes('good morning friend')) {
        botResponse = 'Good morning friend!';
    } else if (userMessage.includes('good afternoon friend')) {
        botResponse = 'Good afternoon friend!';
    } else if (userMessage.includes('good evening friend')) {
        botResponse = 'Good evening friend!';
    } else if (userMessage.includes('goodnight friend')) {
        botResponse = 'Goodnight friend!';
      


}else if (userMessage.includes('can you create a to-do list')) {
    botResponse = 'I can create a to-do list for you. Please provide the tasks you would like me to add.';
} else if (userMessage.includes('can you set a reminder')) {
    botResponse = 'I can set a reminder for you. Please provide the reminder and the time you would like me to remind you.';
} else if (userMessage.includes('can you provide news')) {
    botResponse = 'I can provide news for you. Please provide the topic or category you would like me to provide news for.';
} else if (userMessage.includes('can you provide weather')) {
    botResponse = 'I can provide weather for you. Please provide the location you would like me to provide weather for.';
} else if (userMessage.includes('can you provide sports')) {
    botResponse = 'I can provide sports information for you. Please provide the sport or team you would like me to provide information for.';
} else if (userMessage.includes('can you provide entertainment')) {
    botResponse = 'I can provide entertainment information for you. Please provide the type of entertainment you would like me to provide information for.';
} else if (userMessage.includes('can you provide education')) {
    botResponse = 'I can provide educational information for you. Please provide the topic or subject you would like me to provide information for.';
} else if (userMessage.includes('can you provide health')) {
    botResponse = 'I can provide health information for you. Please provide the topic or condition you would like me to provide information for.';
} else if (userMessage.includes('can you provide technology')) {
    botResponse = 'I can provide technology information for you. Please provide the topic or product you would like me to provide information for.';
} else if (userMessage.includes('can you provide business')) {
    botResponse = 'I can provide business information for you. Please provide the topic or company you would like me to provide information for.';
} else if (userMessage.includes('can you provide finance')) {
    botResponse = 'I can provide financial information for you. Please provide the topic or stock you would like me to provide information for.';
    

}else if (userMessage.includes('can you provide cryptocurrency')) {
    botResponse = 'I can provide cryptocurrency information for you. Please provide the topic or cryptocurrency you would like me to provide information for.';
} else if (userMessage.includes('can you provide stocks')) {
    botResponse = 'I can provide stock information for you. Please provide the topic or stock you would like me to provide information for.';
} else if (userMessage.includes('can you provide bonds')) {
    botResponse = 'I can provide bond information for you. Please provide the topic or bond you would like me to provide information for.';
} else if (userMessage.includes('can you provide mutual funds')) {
    botResponse = 'I can provide mutual fund information for you. Please provide the topic or mutual fund you would like me to provide information for.';
} else if (userMessage.includes('can you provide exchange traded funds')) {
    botResponse = 'I can provide ETF information for you. Please provide the topic or ETF you would like me to provide information for.';
} else if (userMessage.includes('can you provide retirement')) {
    botResponse = 'I can provide retirement information for you. Please provide the topic or retirement product you would like me to provide information for.';
} else if (userMessage.includes('can you provide estate planning')) {
    botResponse = 'I can provide estate planning information for you. Please provide the topic or estate planning product you would like me to provide information for.';
} else if (userMessage.includes('can you provide tax planning')) {
    botResponse = 'I can provide tax planning information for you. Please provide the topic or tax planning product you would like me to provide information for.';
}else if (userMessage.includes('can you provide information on HTML')) {
    botResponse = 'I can provide information on HTML. Please provide the topic or question you would like me to provide information for.';
} else if (userMessage.includes('can you provide information on CSS')) {
    botResponse = 'I can provide information on CSS. Please provide the topic or question you would like me to provide information for.';
} else if (userMessage.includes('can you provide information on JavaScript')) {
    botResponse = 'I can provide information on JavaScript. Please provide the topic or question you would like me to provide information for.';
} else if (userMessage.includes('can you provide information on Python')) {
    botResponse = 'I can provide information on Python. Please provide the topic or question you would like me to provide information for.';
} else if (userMessage.includes('can you provide information on Java')) {
    botResponse = 'I can provide information on Java. Please provide the topic or question you would like me to provide information for.';
} else if (userMessage.includes('can you provide information on C++')) {
    botResponse = 'I can provide information on C++. Please provide the topic or question you would like me to provide information for.';
} else if (userMessage.includes('can you provide information on Ruby')) {
    botResponse = 'I can provide information on Ruby. Please provide the topic or question you would like me to provide information for.';
} else if (userMessage.includes('can you provide information on Swift')) {
    botResponse = 'I can provide information on Swift. Please provide the topic or question you would like me to provide information for.';
}else if (userMessage.includes('what is AI')) {
    botResponse = 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans.';
} else if (userMessage.includes('what is algorithm')) {
    botResponse = 'An algorithm is a set of instructions that is used to solve a specific problem or perform a particular task.';
} else if (userMessage.includes('what is data science')) {
    botResponse = 'Data science is the study of the extraction of insights and knowledge from data, using techniques such as machine learning, statistics, and data visualization.';
} else if (userMessage.includes('what is cybersecurity')) {
    botResponse = 'Cybersecurity refers to the protection of computer systems, networks, and sensitive information from unauthorized access, use, disclosure, disruption, modification, or destruction.';
} else if (userMessage.includes('what is programming')) {
    botResponse = 'Programming is the process of designing, writing, testing, and maintaining the instructions that a computer follows to perform a specific task.';
} else if (userMessage.includes('what is software')) {
    botResponse = 'Software refers to the programs and operating systems that run on a computer, including applications, games, and utilities.';
} else if (userMessage.search('what is hardware')!==-1) {
    botResponse = 'Hardware refers to the physical components of a computer system, including the central processing unit (CPU), memory, storage devices, and input/output devices.';
    } else if (userMessage.search('deploy eden')!==-1 ){ 
    botResponse ='Hy i am a chatbot desinged by my owner to help you deploy eden please enter the deployment passcode in the form, deployEdenpasscode(passcodehere)  then l send qr to link your account with bot . please not that the brackets and format deployEdenpasscode(passcodehere) are considered part of the passcode if you don\'t include them my algorithms will consider the passcode wrong please only include passcode when sending  . ';
    }else if (userMessage.search('your name')!==-1) {
    				botResponse='My name is D1 the simple chatbot created for the  deployment of the ai assistant Eden to WhatsApp and other, platforms.';
   
   
    }
    
    
else if (userMessage.search('your name')!==-1) {
  botResponse = 'My name is D1 the simple chatbot created for the deployment of the ai assistant Eden to WhatsApp and other, platforms.';
} else if (userMessage.includes('Deployedenpasscode(123456789009876543211234567890)')) {
 
 
 
 
 //Linking code here
 















  // Initialize WhatsApp Web.js client
  const WhatsAppWeb = require('whatsapp-web.js');
  const client = new WhatsAppWeb.Client();
  const eden = require('./eden.js');

  // Handle authentication events
  client.on('authenticated', () => {
    console.log('Client authenticated');
  });

  client.on('auth_failure', () => {
    console.log('Authentication failed');
  });

  // Initialize the client
  client.initialize();

  // Generate QR code
  client.generateQR().then((qrCode) => {
    const qrCodeUrl = qrCode.asDataURL();
    botResponse = 'Please wait, sending your QR code ';
    // Display the QR code image response
    responseSection.innerHTML += `
      <div class="message-bubble bot-message">
        <p>Bot: ${botResponse}</p>
        <img src="${qrCodeUrl}" />
        <span>${new Date().toLocaleTimeString()}</span>
      </div>
    `;
  });
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
// End of link code 











  
   else {
  botResponse = 'I didn\'t understand that. Can you please rephrase?';
}

// Display the bot response
setTimeout(() => {
  responseSection.innerHTML += `
    <div class="message-bubble bot-message">
      <p>Bot: ${botResponse}</p>
      <span>${new Date().toLocaleTimeString()}</span>
    </div>
  `;
  responseSection.scrollTop = responseSection.scrollHeight;
}, 1000);
}
















///////////Eden Code script .js here 


```
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const client = new WhatsAppWebJS.Client();
const fs = require('fs');
const speech = require('speech-js');
const spacy = require('spacy');

// Set speech synthesis settings
speech.setVoice('male');
speech.setLanguage('en-US');

// Load spaCy English model
const nlp = spacy.load('en_core_web_sm');

client.on('message', (message) => {
  const userMessage = message.body;
  const doc = nlp(userMessage);

  // Extract entities and intent
  const entities = doc.ents;
  const intent = doc.intent;

  if (entities.length > 0) {
    const entity = entities[0];
    const query = `PREFIX dbpedia-owl: <(link unavailable)>
      PREFIX dbpedia: <(link unavailable)>
      SELECT ?name ?abstract
      WHERE {
        ?subject dbpedia-owl:abstract ?abstract .
        ?subject dbpedia-owl:name ?name .
        FILTER(LANG(?abstract) = 'en')
        FILTER(CONTAINS(LCASE(STR(?name)), '${entity.text.toLowerCase()}'))
      }`;

    fetch(`(link unavailable){encodeURIComponent(query)}&format=json`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.bindings.length > 0) {
          const result = data.results.bindings[0];
          const audio = speech.synthesize(`"${result.name.value}" is ${result.abstract.value}`);
          fs.writeFileSync('response.mp3', audio);
          message.reply(new WhatsAppWebJS.Message.Audio('response.mp3'));
        } else {
          const audio = speech.synthesize('I couldn\'t find any information on that topic.');
          fs.writeFileSync('response.mp3', audio);
          message.reply(new WhatsAppWebJS.Message.Audio('response.mp3'));
        }
      });
  } else if (intent === 'greeting') {
    const audio = speech.synthesize('Hello! How can I assist you today?');
    fs.writeFileSync('response.mp3', audio);
    message.reply(new WhatsAppWebJS.Message.Audio('response.mp3'));
  } else {
    const audio = speech.synthesize('I didn\'t understand what you meant.');
    fs.writeFileSync('response.mp3', audio);
    message.reply(new WhatsAppWebJS.Message.Audio('response.mp3'));
  }
});













   //.   .........   End of  Eden code.  .............