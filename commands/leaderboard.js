const Discord = require('discord.js');
module.exports = {
	name: 'leaderboard',
	aliases: ['lb'],
	description: 'Check the top ranking players in honeycombs or headpats',
	usage: '[honeycombs/headpats]',
	execute(message, args) {
		const numbers = [];
		const valuesArray = [];
		message.client.checkId(message.author.id, userObj => {
			const ids = Object.keys(userObj);
			const amount = ids.length;
			if(args[0] === 'honeycombs') {
				for(let i = 0; i < amount; i++) {
					numbers.push(userObj[ids[i]].honey);
				}
			} else if(args[0] === 'headpats') {
				for(let i = 0; i < amount; i++) {
					numbers.push(userObj[ids[i]].headpats);
				}
			} else {
				return message.reply('Type `headpats` or `honeycombs` to see the leaderboard for that type');
			}
			for(let c = 0; c < amount; c++) {
				valuesArray.push(ids[c]);
				valuesArray.push(numbers[c]);
			}
			numbers.sort((a, b) => b - a);
			let lbmsg = `**${args[0].toLowerCase()} leaderboard**`;
			for(let r = 0; r < amount; r++) {
				if(numbers[0] === 0 || r === 10) {break;}
				const sorted = valuesArray.indexOf(numbers.shift()) - 1;
				const userId = valuesArray[sorted];
				valuesArray.splice(sorted, 1);
				const value = valuesArray[sorted];
				valuesArray.splice(sorted, 1);
				lbmsg += `\n${r + 1}. <@!${userId}>: ${value.toLocaleString('en-US')}`;
			}
			const embed = new Discord.MessageEmbed()
				.setDescription(lbmsg)
				.setColor('#f5cc16');
			message.channel.send(embed);
		});
	},
};
