const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
	name: 'bulletinboard',
	aliases: ['board', 'bb'],
	description: 'See the last 8 posts by this server\'s members',
	execute(message) {
		fs.readFile('/Users/Bramblestar/honey/posts.json', 'utf8', (err, jsonString) => {
			if(err) {console.log(err);} else {
				const posts = JSON.parse(jsonString);
				if(posts.new.length) {
					const embed = new Discord.MessageEmbed()
						.setTitle('**The Hive\'s Bulletin Board**')
						.setColor('#f5cc16');
					let counter = 0;
					for(let i = 0; i < posts.new.length / 2; i++) {
						if(counter === 0) {
							counter++;
						} else {
							counter = 0;
							embed.addField('\u200b', '\u200b', true);
						}
						const postIndex = posts.new.indexOf(i + 1);
						embed.addField(`${posts.new[postIndex]}. ${posts.new[postIndex + 1].title}`, `${posts.new[postIndex + 1].textField}\nauthor: ${posts.new[postIndex + 1].author}`, true);
					}
					message.channel.send(embed);
				} else {
					message.channel.send('It looks like there\'s no posts on the bulletin board yet. You can make one by using h-createpost (title) (text)');
				}
			}
		});
	},
};
