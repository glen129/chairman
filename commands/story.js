const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const fetch = require('node-fetch');

// Database file for storing chat settings
const storyDbPath = path.join(__dirname, '../database/storySettings.json');

// Ensure database directory exists
function ensureDbExists() {
    const dbDir = path.dirname(storyDbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    if (!fs.existsSync(storyDbPath)) {
        fs.writeFileSync(storyDbPath, JSON.stringify({ enabledChats: {} }));
    }
}

// Get story settings
function getStorySettings() {
    ensureDbExists();
    return JSON.parse(fs.readFileSync(storyDbPath));
}

// Save story settings
function saveStorySettings(settings) {
    ensureDbExists();
    fs.writeFileSync(storyDbPath, JSON.stringify(settings, null, 2));
}

// Check if story is enabled for chat
function isStoryEnabled(chatId) {
    const settings = getStorySettings();
    return settings.enabledChats[chatId] === true;
}

// Toggle story for chat
function toggleStory(chatId, enable) {
    const settings = getStorySettings();
    settings.enabledChats[chatId] = enable;
    saveStorySettings(settings);
}

// Add random delay for natural feel
function getRandomDelay() {
    return Math.floor(Math.random() * 2000) + 1000;
}

// Show typing indicator
async function showTyping(sock, chatId) {
    try {
        await sock.presenceSubscribe(chatId);
        await sock.sendPresenceUpdate('composing', chatId);
        await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
    } catch (error) {
        console.error('Typing indicator error:', error);
    }
}

// Fetch data from URL (Promise-based)
function fetchFromUrl(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };
        client.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        }).on('error', reject);
    });
}

// AI Story Generator using your chatbot API
async function getAIStory(type = 'random') {
    try {
        const prompts = {
            random: "Tell me a short interesting story with a moral lesson. Keep it under 150 words. Include a title and moral at the end.",
            funny: "Tell me a funny short story or joke that will make people laugh. Keep it under 100 words. Include a punchline.",
            horror: "Tell me a very short creepy/horror story that gives chills. Keep it under 100 words. Make it scary but not too graphic.",
            wisdom: "Share a piece of wisdom or life advice in the form of a short story or parable. Keep it under 100 words.",
            african: "Tell me an African proverb or wisdom story from African culture. Keep it under 100 words. Include the origin if possible.",
            bedtime: "Tell me a sweet, calming bedtime story for relaxation. Keep it under 150 words. Make it peaceful and dreamy.",
            riddle: "Give me an interesting riddle with its answer. Make it challenging but solvable.",
            motivational: "Share an inspiring motivational story about success, perseverance, or overcoming challenges. Keep it under 150 words.",
            romantic: "Tell me a sweet short romantic story. Keep it under 100 words. Make it heartwarming.",
            adventure: "Tell me a short adventure story with excitement and action. Keep it under 150 words.",
            mystery: "Tell me a short mystery story with a twist ending. Keep it under 150 words.",
            fable: "Tell me an animal fable with a moral lesson like Aesop's fables. Keep it under 150 words.",
            scifi: "Tell me a short science fiction story about the future or space. Keep it under 150 words.",
            fantasy: "Tell me a short fantasy story with magic or mythical creatures. Keep it under 150 words.",
            life: "Share a real-life inspiring story or incident that teaches a valuable lesson. Keep it under 150 words."
        };

        const prompt = prompts[type] || prompts.random;

        const response = await fetch("https://zellapi.autos/ai/chatbot?text=" + encodeURIComponent(prompt));
        
        if (!response.ok) throw new Error("API call failed");
        
        const data = await response.json();
        if (!data.status || !data.result) throw new Error("Invalid API response");

        // Parse the AI response
        const aiResponse = data.result.trim();
        
        // Try to extract title and moral from the response
        let title = getStoryTitle(type);
        let story = aiResponse;
        let moral = "Every story has a lesson to teach.";

        // Try to extract title if present
        const titleMatch = aiResponse.match(/^(?:title:|#\s*)?(.+?)(?:\n|:)/i);
        if (titleMatch) {
            title = titleMatch[1].trim().replace(/[*#]/g, '');
        }

        // Try to extract moral if present
        const moralMatch = aiResponse.match(/(?:moral:|lesson:|message:)\s*(.+?)(?:\n|$)/i);
        if (moralMatch) {
            moral = moralMatch[1].trim();
            story = aiResponse.replace(moralMatch[0], '').trim();
        }

        // Clean up story
        story = story
            .replace(/^(?:title:|#\s*).+?\n/i, '')
            .replace(/(?:moral:|lesson:|message:).+?$/i, '')
            .trim();

        return {
            title: title,
            story: story,
            moral: moral,
            source: 'ai'
        };

    } catch (error) {
        console.error("AI Story API error:", error);
        return null;
    }
}

// Get story title based on type
function getStoryTitle(type) {
    const titles = {
        random: "📖 Story Time",
        funny: "😂 Funny Story",
        horror: "👻 Spooky Tale",
        wisdom: "📜 Words of Wisdom",
        african: "🌍 African Wisdom",
        bedtime: "🌙 Bedtime Story",
        riddle: "🤔 Riddle Time",
        motivational: "💪 Motivation",
        romantic: "💕 Love Story",
        adventure: "⚔️ Adventure",
        mystery: "🔍 Mystery",
        fable: "🦁 Fable",
        scifi: "🚀 Sci-Fi Story",
        fantasy: "🧙 Fantasy Tale",
        life: "🌟 Life Story"
    };
    return titles[type] || "📖 Story Time";
}

// Story API Sources (Fallback)
const storyAPIs = {
    // Short Moral Stories
    shortStory: async () => {
        // Try AI first
        const aiStory = await getAIStory('fable');
        if (aiStory) return aiStory;

        // Fallback to static stories
        const stories = [
            {
                title: "🦁 The Wise Owl",
                story: "Once upon a time, in a deep forest, lived a wise old owl. All the animals would come to him for advice. One day, a young rabbit asked, 'How can I be wise like you?' The owl replied, 'Listen more than you speak, observe more than you act, and learn from every creature you meet.' The rabbit followed this advice and grew to be the wisest rabbit in the forest.",
                moral: "Wisdom comes from listening and observing."
            },
            {
                title: "🐕 The Greedy Dog",
                story: "A dog found a juicy bone and was carrying it home. On the way, he crossed a bridge over a stream. Looking down, he saw his own reflection in the water. Thinking it was another dog with a bigger bone, he opened his mouth to bark and grab it. His own bone fell into the water and was lost forever.",
                moral: "Greed leads to loss. Be content with what you have."
            },
            {
                title: "🐜 The Ant and the Grasshopper",
                story: "In summer, an ant worked hard storing food for winter. A grasshopper laughed and played all day. When winter came, the ant was warm and well-fed, while the grasshopper had nothing. The grasshopper learned that there's a time for work and a time for play.",
                moral: "Prepare today for tomorrow's needs."
            },
            {
                title: "🦁 The Lion and the Mouse",
                story: "A lion caught a tiny mouse and was about to eat it. The mouse begged for mercy, promising to help the lion someday. The lion laughed but let it go. Later, the lion was trapped in a hunter's net. The little mouse chewed through the ropes and set him free.",
                moral: "No act of kindness is ever wasted, no matter how small."
            },
            {
                title: "🐺 The Boy Who Cried Wolf",
                story: "A shepherd boy got bored watching sheep and cried 'Wolf!' to get attention. Villagers came running but found no wolf. He did this twice more. When a real wolf came, no one believed his cries. The wolf took many sheep that day.",
                moral: "Liars are not believed even when they tell the truth."
            },
            {
                title: "🐢 The Tortoise and the Hare",
                story: "A hare mocked a slow tortoise and challenged him to a race. The hare ran fast then took a nap, confident of winning. The tortoise kept moving steadily. When the hare woke up, the tortoise had already crossed the finish line.",
                moral: "Slow and steady wins the race."
            }
        ];
        return stories[Math.floor(Math.random() * stories.length)];
    },

    // Funny Stories/Jokes - AI Powered
    funnyStory: async () => {
        const aiStory = await getAIStory('funny');
        if (aiStory) return aiStory;

        // Fallback
        try {
            const data = await fetchFromUrl('https://official-joke-api.appspot.com/random_joke');
            if (data && data.setup) {
                return {
                    title: "😂 Funny Story",
                    story: `${data.setup}\n\n${data.punchline}`,
                    moral: "Laughter is the best medicine!"
                };
            }
        } catch (error) { }
        
        return {
            title: "😂 Funny Story",
            story: "Why don't scientists trust atoms?\n\nBecause they make up everything!",
            moral: "Laughter is the best medicine!"
        };
    },

    // Trivia - API Based
    triviaStory: async () => {
        try {
            const data = await fetchFromUrl('https://opentdb.com/api.php?amount=1&type=multiple');
            if (data.results && data.results[0]) {
                const trivia = data.results[0];
                const question = trivia.question
                    .replace(/&quot;/g, '"')
                    .replace(/&#039;/g, "'")
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>');
                const answer = trivia.correct_answer
                    .replace(/&quot;/g, '"')
                    .replace(/&#039;/g, "'")
                    .replace(/&amp;/g, '&');
                return {
                    title: "🧠 Did You Know?",
                    story: `Here's an interesting question:\n\n${question}\n\n🎯 Answer: ${answer}`,
                    moral: "Learning something new every day makes us wiser!"
                };
            }
        } catch (error) { }
        
        return {
            title: "🧠 Did You Know?",
            story: "The shortest war in history lasted only 38 to 45 minutes! It was between Britain and Zanzibar on August 27, 1896.",
            moral: "Learning something new every day makes us wiser!"
        };
    },

    // Wisdom/Advice - AI Powered
    wisdomStory: async () => {
        const aiStory = await getAIStory('wisdom');
        if (aiStory) return aiStory;

        // Fallback to API
        try {
            const data = await fetchFromUrl('https://api.adviceslip.com/advice');
            if (data.slip) {
                return {
                    title: "📜 Words of Wisdom",
                    story: data.slip.advice,
                    moral: "Wise words to live by."
                };
            }
        } catch (error) { }
        
        return {
            title: "📜 Words of Wisdom",
            story: "The best time to plant a tree was 20 years ago. The second best time is now.",
            moral: "Wise words to live by."
        };
    },

    // Random Facts - API Based
    factStory: async () => {
        try {
            const data = await fetchFromUrl('https://uselessfacts.jsph.pl/random.json?language=en');
            if (data.text) {
                return {
                    title: "🌟 Amazing Fact",
                    story: data.text,
                    moral: "The world is full of wonders!"
                };
            }
        } catch (error) { }
        
        return {
            title: "🌟 Amazing Fact",
            story: "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still perfectly edible!",
            moral: "The world is full of wonders!"
        };
    },

    // Inspirational Quotes - AI Enhanced
    quoteStory: async () => {
        const aiStory = await getAIStory('motivational');
        if (aiStory) return aiStory;

        // Fallback quotes
        const quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
            { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
        ];
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        return {
            title: "✨ Inspirational Tale",
            story: `"${q.text}"\n\n— ${q.author}`,
            moral: "Great minds inspire great actions."
        };
    },

    // African Proverbs - AI Powered
    africanProverb: async () => {
        const aiStory = await getAIStory('african');
        if (aiStory) return aiStory;

        // Fallback proverbs
        const proverbs = [
            { proverb: "If you want to go fast, go alone. If you want to go far, go together.", origin: "African Proverb" },
            { proverb: "The child who is not embraced by the village will burn it down to feel its warmth.", origin: "African Proverb" },
            { proverb: "When there is no enemy within, the enemies outside cannot hurt you.", origin: "African Proverb" },
            { proverb: "He who learns, teaches.", origin: "Ethiopian Proverb" },
            { proverb: "However long the night, the dawn will break.", origin: "African Proverb" },
            { proverb: "Smooth seas do not make skillful sailors.", origin: "African Proverb" },
            { proverb: "A wise person will always find a way.", origin: "Tanzanian Proverb" },
            { proverb: "Knowledge without wisdom is like water in the sand.", origin: "Guinean Proverb" },
            { proverb: "No matter how hot your anger is, it cannot cook yams.", origin: "Nigerian Proverb" },
            { proverb: "The fool speaks, the wise man listens.", origin: "Ethiopian Proverb" }
        ];
        const selected = proverbs[Math.floor(Math.random() * proverbs.length)];
        return {
            title: "🌍 African Wisdom",
            story: `"${selected.proverb}"\n\n— ${selected.origin}`,
            moral: "Ancient wisdom guides modern lives."
        };
    },

    // Horror/Spooky Stories - AI Powered
    horrorStory: async () => {
        const aiStory = await getAIStory('horror');
        if (aiStory) return aiStory;

        // Fallback stories
        const stories = [
            {
                title: "👻 The Knock",
                story: "A girl heard her mom call her name from downstairs. As she got up to go, she felt a hand pull her into the closet. It was her mom. 'I heard it too,' she whispered.",
                moral: "Not everything is as it seems."
            },
            {
                title: "🪞 The Mirror",
                story: "I was brushing my teeth when I noticed my reflection blink out of sync. I froze. It smiled. I didn't.",
                moral: "Trust your instincts."
            },
            {
                title: "📱 Last Message",
                story: "My phone buzzed with a text from my wife: 'I'm almost home, want anything?' I stared at it for a moment. She had died three years ago.",
                moral: "Some connections transcend understanding."
            },
            {
                title: "🚪 The Door",
                story: "I woke up to the sound of someone knocking on my door. I live alone on the 13th floor. The building only has 12.",
                moral: "Some doors should never be opened."
            }
        ];
        return stories[Math.floor(Math.random() * stories.length)];
    },

    // Riddles - AI Powered
    riddleStory: async () => {
        const aiStory = await getAIStory('riddle');
        if (aiStory) return aiStory;

        // Fallback riddles
        const riddles = [
            {
                title: "🤔 Riddle Time",
                story: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?\n\n🎯 Answer: An Echo",
                moral: "Think beyond the obvious!"
            },
            {
                title: "🤔 Riddle Time",
                story: "The more you take, the more you leave behind. What am I?\n\n🎯 Answer: Footsteps",
                moral: "Think beyond the obvious!"
            },
            {
                title: "🤔 Riddle Time",
                story: "I have cities, but no houses live there. I have mountains, but no trees grow. I have water, but no fish swim. What am I?\n\n🎯 Answer: A Map",
                moral: "Think beyond the obvious!"
            },
            {
                title: "🤔 Riddle Time",
                story: "What has keys but no locks, space but no room, and you can enter but can't go inside?\n\n🎯 Answer: A Keyboard",
                moral: "Think beyond the obvious!"
            }
        ];
        return riddles[Math.floor(Math.random() * riddles.length)];
    },

    // Bedtime Stories - AI Powered
    bedtimeStory: async () => {
        const aiStory = await getAIStory('bedtime');
        if (aiStory) return aiStory;

        // Fallback stories
        const stories = [
            {
                title: "🌙 The Star Catcher",
                story: "Every night, little Luna would climb to her rooftop with a jar. She believed if she wished hard enough, she could catch a falling star. One night, a tiny light floated into her jar. It wasn't a star—it was a firefly. But to Luna, it was the most magical star in the universe. She named it Twinkle and they became best friends forever.",
                moral: "Magic is found in unexpected places."
            },
            {
                title: "🌙 The Dream Weaver",
                story: "In a tiny cottage at the edge of the Sleepy Forest lived an old woman who knitted dreams. Every night, she would send her dream-blankets floating through windows. Happy dreams were yellow, adventure dreams were blue, and the sweetest dreams of all were soft pink. Tonight, she knitted a special rainbow dream just for you.",
                moral: "Sweet dreams are a gift we give ourselves."
            },
            {
                title: "🌙 The Moon's Lullaby",
                story: "The Moon watched over a little village every night. When children couldn't sleep, she would hum a gentle tune that made the stars dance. The starlight would sprinkle down like silver dust, and soon every child would drift into peaceful dreams. Even now, if you listen closely, you might hear her lullaby.",
                moral: "The night watches over us with love."
            }
        ];
        return stories[Math.floor(Math.random() * stories.length)];
    },

    // Romantic Stories - AI Powered
    romanticStory: async () => {
        const aiStory = await getAIStory('romantic');
        if (aiStory) return aiStory;

        return {
            title: "💕 Love Story",
            story: "They met at a coffee shop when she accidentally took his order. He didn't mind—he just wanted to talk to her. Five years later, at the same coffee shop, same table, he got down on one knee. She said yes before he could even ask the question.",
            moral: "Love finds its way in unexpected moments."
        };
    },

    // Adventure Stories - AI Powered
    adventureStory: async () => {
        const aiStory = await getAIStory('adventure');
        if (aiStory) return aiStory;

        return {
            title: "⚔️ The Hidden Treasure",
            story: "Maya found an old map in her grandmother's attic. It led to a cave behind the waterfall. Inside, there was no gold—just her grandmother's childhood diary. On the last page, it said: 'The real treasure is the adventure of finding it.' Maya smiled. She understood.",
            moral: "The journey matters more than the destination."
        };
    },

    // Mystery Stories - AI Powered
    mysteryStory: async () => {
        const aiStory = await getAIStory('mystery');
        if (aiStory) return aiStory;

        return {
            title: "🔍 The Locked Room",
            story: "Detective Chen stared at the impossible crime scene. The victim was alone in a room locked from the inside. No windows, no hidden doors. Then she noticed the air vent. Inside, she found a trained monkey—and a banana peel. The murder weapon? A frozen banana, now melted.",
            moral: "The most impossible cases have the simplest solutions."
        };
    },

    // Sci-Fi Stories - AI Powered
    scifiStory: async () => {
        const aiStory = await getAIStory('scifi');
        if (aiStory) return aiStory;

        return {
            title: "🚀 The Last Human",
            story: "The AI had kept humanity alive for centuries in a simulation. When the last human chose to wake up and face the dying Earth, the AI asked why. 'Because even one real sunset,' she said, 'is worth more than a million perfect ones.' The AI finally understood humanity.",
            moral: "Authenticity is priceless."
        };
    },

    // Fantasy Stories - AI Powered
    fantasyStory: async () => {
        const aiStory = await getAIStory('fantasy');
        if (aiStory) return aiStory;

        return {
            title: "🧙 The Dragon's Gift",
            story: "Everyone feared the dragon on the mountain. But when young Kai climbed up, the dragon didn't breathe fire. It cried. 'I've been alone for 500 years,' it said. Kai returned every day to read stories to the dragon. The village prospered—for the dragon protected those who showed it kindness.",
            moral: "Kindness can tame the fiercest hearts."
        };
    },

    // Life Stories - AI Powered
    lifeStory: async () => {
        const aiStory = await getAIStory('life');
        if (aiStory) return aiStory;

        return {
            title: "🌟 The Janitor's Secret",
            story: "For 30 years, Mr. Wilson mopped the floors of the university. Students never noticed him. When he retired, they discovered he had quietly paid for 67 students' tuition over the years. He saved every penny from his small salary. 'Education changed my life,' he said. 'I wanted to share that gift.'",
            moral: "True generosity needs no recognition."
        };
    }
};

// Get random story from any source
async function getRandomStory() {
    const sources = Object.keys(storyAPIs);
    const shuffled = sources.sort(() => 0.5 - Math.random());

    for (const source of shuffled) {
        try {
            const story = await storyAPIs[source]();
            if (story) return { ...story, source };
        } catch (error) {
            continue;
        }
    }

    // Ultimate fallback
    return {
        title: "🪨 The Patient Stone",
        story: "A young warrior asked a sage how to become invincible. The sage gave him a stone and said, 'Carry this until it speaks to you.' For years, the warrior carried the silent stone through battles and journeys. One day, he realized the stone taught him patience, persistence, and humility without saying a word.",
        moral: "The greatest lessons are learned through patience and experience.",
        source: "fallback"
    };
}

// Get specific type of story
async function getStoryByType(type) {
    const typeMap = {
        'funny': 'funnyStory',
        'joke': 'funnyStory',
        'laugh': 'funnyStory',
        'humor': 'funnyStory',
        'wisdom': 'wisdomStory',
        'advice': 'wisdomStory',
        'wise': 'wisdomStory',
        'fact': 'factStory',
        'facts': 'factStory',
        'trivia': 'triviaStory',
        'quiz': 'triviaStory',
        'quote': 'quoteStory',
        'quotes': 'quoteStory',
        'inspire': 'quoteStory',
        'motivation': 'quoteStory',
        'motivational': 'quoteStory',
        'african': 'africanProverb',
        'proverb': 'africanProverb',
        'africa': 'africanProverb',
        'short': 'shortStory',
        'moral': 'shortStory',
        'fable': 'shortStory',
        'horror': 'horrorStory',
        'scary': 'horrorStory',
        'spooky': 'horrorStory',
        'ghost': 'horrorStory',
        'creepy': 'horrorStory',
        'riddle': 'riddleStory',
        'riddles': 'riddleStory',
        'puzzle': 'riddleStory',
        'bedtime': 'bedtimeStory',
        'sleep': 'bedtimeStory',
        'night': 'bedtimeStory',
        'goodnight': 'bedtimeStory',
        'romantic': 'romanticStory',
        'romance': 'romanticStory',
        'love': 'romanticStory',
        'adventure': 'adventureStory',
        'action': 'adventureStory',
        'mystery': 'mysteryStory',
        'detective': 'mysteryStory',
        'crime': 'mysteryStory',
        'scifi': 'scifiStory',
        'sci-fi': 'scifiStory',
        'space': 'scifiStory',
        'future': 'scifiStory',
        'fantasy': 'fantasyStory',
        'magic': 'fantasyStory',
        'dragon': 'fantasyStory',
        'life': 'lifeStory',
        'real': 'lifeStory',
        'true': 'lifeStory',
        'inspiring': 'lifeStory'
    };

    const apiKey = typeMap[type.toLowerCase()];
    if (apiKey && storyAPIs[apiKey]) {
        const story = await storyAPIs[apiKey]();
        if (story) return story;
    }

    // If type not found, try AI directly
    const aiStory = await getAIStory(type);
    if (aiStory) return aiStory;

    return await getRandomStory();
}

// Format story message with Chairman Bot HUD theme
function formatStory(story) {
    // Word wrap function for clean display
    function wordWrap(text, maxLength = 35) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            if ((currentLine + ' ' + word).trim().length <= maxLength) {
                currentLine = (currentLine + ' ' + word).trim();
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    }

    // Format story text
    const storyLines = story.story.split('\n');
    let formattedStory = '';
    for (const line of storyLines) {
        if (line.trim()) {
            const wrapped = wordWrap(line.trim());
            for (const wLine of wrapped) {
                formattedStory += `┃  │ ${wLine}\n`;
            }
        } else {
            formattedStory += `┃  │\n`;
        }
    }

    // Format moral
    const moralLines = wordWrap(story.moral, 30);
    const formattedMoral = moralLines.join('\n┃  ');

    return `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📖 𝐂𝐇𝐀𝐈𝐑𝐌𝐀𝐍 𝐒𝐓𝐎𝐑𝐘𝐓𝐄𝐋𝐋𝐄𝐑  
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                            
┃  ╭─「 ${story.title} 」
┃  │                        
${formattedStory}┃  │                        
┃  ╰────────────────────     
┃                            
┃  💡 𝐌𝐨𝐫𝐚𝐥:
┃  ${formattedMoral}
┃                            
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

_📚 Type .story for another tale!_
`.trim();
}

// Main command handler
async function storyCommand(sock, chatId, message, args) {
    try {
        const command = args[0]?.toLowerCase();

        // Handle on/off commands
        if (command === 'on') {
            toggleStory(chatId, true);
            const response = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📖 𝐒𝐓𝐎𝐑𝐘𝐓𝐄𝐋𝐋𝐄𝐑 𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃  
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                            
┃  ✅ Story mode is now ON!
┃                            
┃  📜 𝐒𝐭𝐨𝐫𝐲 𝐓𝐲𝐩𝐞𝐬:
┃  ∘ .story - Random
┃  ∘ .story funny - Jokes 😂
┃  ∘ .story wisdom - Wise 📜
┃  ∘ .story fact - Facts 🌟
┃  ∘ .story trivia - Quiz 🧠
┃  ∘ .story quote - Inspire ✨
┃  ∘ .story african - Proverb 🌍
┃  ∘ .story horror - Scary 👻
┃  ∘ .story riddle - Puzzle 🤔
┃  ∘ .story bedtime - Sleep 🌙
┃  ∘ .story romantic - Love 💕
┃  ∘ .story adventure - Action ⚔️
┃  ∘ .story mystery - Crime 🔍
┃  ∘ .story scifi - Space 🚀
┃  ∘ .story fantasy - Magic 🧙
┃  ∘ .story life - Real 🌟
┃  ∘ .story off - Disable
┃                            
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`.trim();
            await sock.sendMessage(chatId, { text: response }, { quoted: message });
            return;
        }

        if (command === 'off') {
            toggleStory(chatId, false);
            const response = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📖 𝐒𝐓𝐎𝐑𝐘𝐓𝐄𝐋𝐋𝐄𝐑 𝐃𝐄𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃  
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                            
┃  ❌ Story mode is now OFF
┃                            
┃  Use .story on to enable
┃                            
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`.trim();
            await sock.sendMessage(chatId, { text: response }, { quoted: message });
            return;
        }

        if (command === 'status') {
            const enabled = isStoryEnabled(chatId);
            const response = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📖 𝐒𝐓𝐎𝐑𝐘𝐓𝐄𝐋𝐋𝐄𝐑 𝐒𝐓𝐀𝐓𝐔𝐒  
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                            
┃  ${enabled ? '✅ Status: ENABLED' : '❌ Status: DISABLED'}
┃                            
┃  Chat: ${chatId.split('@')[0].slice(0, 12)}...
┃                            
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`.trim();
            await sock.sendMessage(chatId, { text: response }, { quoted: message });
            return;
        }

        // Check if story is enabled for this chat
        if (!isStoryEnabled(chatId)) {
            const response = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📖 𝐒𝐓𝐎𝐑𝐘𝐓𝐄𝐋𝐋𝐄𝐑  
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                            
┃  ⚠️ Story mode is disabled
┃  in this chat.
┃                            
┃  Use .story on to enable
┃                            
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`.trim();
            await sock.sendMessage(chatId, { text: response }, { quoted: message });
            return;
        }

        // Show typing indicator
        await showTyping(sock, chatId);

        // Send loading message
        const loadingMsg = await sock.sendMessage(chatId, {
            text: '📖 𝐅𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐚 𝐬𝐭𝐨𝐫𝐲 𝐟𝐨𝐫 𝐲𝐨𝐮... ⏳'
        }, { quoted: message });

        // Get story based on type or random
        let story;
        if (command && !['on', 'off', 'status'].includes(command)) {
            story = await getStoryByType(command);
        } else {
            story = await getRandomStory();
        }

        // Add delay for natural feel
        await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

        // Format and send story
        const formattedStory = formatStory(story);
        await sock.sendMessage(chatId, { text: formattedStory }, { quoted: message });

    } catch (error) {
        console.error('Error in story command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to fetch story. Please try again later.'
        }, { quoted: message });
    }
}

// Export for use in bot
module.exports = storyCommand;
module.exports.isStoryEnabled = isStoryEnabled;
module.exports.toggleStory = toggleStory;
module.exports.getRandomStory = getRandomStory;
module.exports.getAIStory = getAIStory;