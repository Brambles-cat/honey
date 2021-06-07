const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');
const fs = require('fs');
client.commands = new Discord.Collection();
client.jobKeys = {};
client.cooldowns = new Discord.Collection();
client.checkId = (uId, callback) => {
	fs.readFile('/Users/Bramblestar/honey/users.json', 'utf8', (err, jsonString) => {
		if (err) {
			console.log(err);
			return;
		}
		const users = JSON.parse(jsonString);
		if (!(uId in users)) {
			users[uId] = {
				honey: 0,
				job: 'none',
				items: {},
				headpats: 0,
			};
		}
		callback(users);
	});
};
client.jobPays = { 'ghost hunter bee': [1000, 4000, 'prayer_beads'], 'cashier bee': [500, 3400, 'pretzel'] };

const commandFiles = fs.readdirSync('/Users/Bramblestar/honey/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready');
});

client.on('message', message => {
	if(message.content.toLowerCase().includes('bee')) {
		message.react('🐝');
	}
	if (Object.keys(client.jobKeys).includes(message.author.id)) {
		if(message.content.toLowerCase() === client.jobKeys[message.author.id]) {
			client.checkId(message.author.id, userObj => {
				const jobPayArray = client.jobPays[userObj[message.author.id].job];
				const payout = Math.floor(Math.random() * jobPayArray[0] + jobPayArray[1]);
				userObj[message.author.id].honey += payout;
				if(Math.floor(Math.random() * 22) === 18) {
					userObj[message.author.id].items[jobPayArray[2]] += 1;
					message.reply(`Good work! You recieved ${payout.toLocaleString('en-US')} for an hours worth of work\nAlso, you happened to find 1 :${jobPayArray[2]}: on your way out`);
				} else {message.reply(`Good work! You recieved ${payout.toLocaleString('en-US')} for an hours worth of work`);}
				fs.writeFile('/Users/Bramblestar/honey/users.json', JSON.stringify(userObj, null, 2), err => {
					if(err) {return console.log(err);}
				});
			});
		} else {
			message.reply('tisk tisk tisk, you\'ve failed your task and so you won\'t be paid');
		}
		delete client.jobKeys[message.author.id];
		return;
	}
	if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	const { cooldowns } = client;
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`You're on cooldown for this command for ${Math.floor(timeLeft.toFixed(1) / 60)} minutes`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);
