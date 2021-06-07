const fs = require('fs');
module.exports = {
	name: 'giveheadpats',
	aliases: ['ghp', 'givepats'],
	description: 'Used by admins to give headpats to server members',
	usage: '[user] [+/-amount]',
	execute(message, args) {
		const taggedUser = message.mentions.users.first();
		const authorPerms = message.channel.permissionsFor(message.author).toArray();
		if (authorPerms.includes('ADMINISTRATOR')) {
			if (!(args.length)) {
				return message.reply('You need to mention who to give headpats to and then the amount of headpats (+/-)');
			} else if (taggedUser != undefined) {
				if (taggedUser.id === message.author.id) {
					return message.channel.send('You can\'t give headpats to yourself silly');
				}
				try {
					if (args[1] != undefined) {
						message.client.checkId(taggedUser.id, userObj => {
							userObj[taggedUser.id].headpats = userObj[taggedUser.id].headpats + parseInt(args[1]);
							fs.writeFile('/Users/Bramblestar/honey/users.json', JSON.stringify(userObj, null, 2), err => {
								if (err) {
									console.log(err);
								} else {
									return message.channel.send(`${taggedUser.username} has been given ${args[1].toLocaleString('en-US')} headpats`);
								}
							});
						});
					} else {
						message.channel.send('Type the amount of headpats to give after mentioning a user');}
				} catch {
					message.channel.send('You must type a number of headpats to give');}
			} else {
				message.channel.send('You need to mention a user to give headpats to');}
		} else {
			message.reply('Only members with admin permissions can use this command');}
	},
};
