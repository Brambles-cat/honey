/* eslint-disable no-case-declarations */
/* eslint-disable indent */
const fs = require('fs');
const cooldowns = [];
module.exports = {
	name: 'work',
    description: 'Work or look for a job to get paid in honeycombs by completing a min-game',
    usage: '(list/jobName)',
	timer: function(sec) {
		return new Promise(resolve => setTimeout(resolve, sec * 1000));
	},
	availableJobs: ['ghost hunter bee', 'maid bee', 'firefighter bee', 'cashier bee'],
	execute(message, args) {
		message.client.checkId(message.author.id, userObj => {
			if(!(args.length)) {
				const jobType = userObj[message.author.id].job;
				if (jobType != 'none') {
                    if(Object.keys(message.client.jobKeys).includes(message.author.id)){return;}
					if (cooldowns.includes(message.author.id)) {
                        const timeLeft = (cooldowns[cooldowns.indexOf(message.author.id) + 1] - Date.now()) / 1000;
						return message.reply(`You have to wait ${(Math.floor(timeLeft) / 60).toFixed(1)} minutes before you can work again`);
					} else {
                        const mainJobCode = async (jT) => {
                            message.client.jobKeys[message.author.id] = 0;
                            switch (jT) {
                                case 'ghost hunter bee':
                                    const ghbm = await message.channel.send('*Work as __Ghost Hunter Bee__*\nType `left`, `right`, or `middle` to catch the ghost when it appears\n:house_with_garden:   :school:   :house:');
                                    await this.timer(3);
                                    ghbm.edit(':house_with_garden:   :school:   :house:');
                                    let appeared = false;
                                    const types = ['                ', ':adult:', '                '];
                                    const lmr = { 0: 'left', 1: 'middle', 2: 'right' };
                                    for(let i = 0; i < 6; i++) {
                                        if(!(Object.keys(message.client.jobKeys).includes(message.author.id))) {return;}
                                        const buildings = [types[Math.floor(Math.random() * 3)], types[Math.floor(Math.random() * 3)], types[Math.floor(Math.random() * 3)]];
                                        if(Math.floor(Math.random() * 8) <= 4) {
                                            const key = Math.floor(Math.random() * 3);
                                            appeared = true;
                                            buildings[key] = ':ghost:';
                                            message.client.jobKeys[message.author.id] = lmr[key];
                                        } else {
                                            message.client.jobKeys[message.author.id] = 0;
                                        }
                                        ghbm.edit(`:house_with_garden:   :school:   :house:\n${buildings.join(' ')}`);
                                        await this.timer(2.8);
                                    }
                                    delete message.client.jobKeys[message.author.id];
                                    if(!(appeared)) {
                                        message.channel.send('bummer, it looks like no ghosts showed up, better luck next time');
                                    } else {
                                        message.reply('You failed to capture the spirit, and worse, you now fear the chance of being cursed by it...');
                                        if(userObj[message.author.id].honey > 3000) {
                                            if(Math.floor(Math.random() * 10) > 6) {
                                                userObj[message.author.id].honey -= Math.floor(Math.random() * 2000 + 1000);
                                            }
                                        }
                                    }
                                    break;
                                case 'cashier bee':
                                    const cbm = await message.channel.send('*Work as __Cashier Bee__*\n find the total of the customer\'s items by adding up each item');
                                    await this.timer(3);
                                    const customerPerson = [':adult:', ':man:', ':woman:', ':ghost'];
                                    const items = { ':cheese:': 2.50, ':pancakes:': 4.00, ':honey_pot:': 5.30, ':squeeze_bottle:': 3.10, ':toothbrush:': 0.50, ':jack_o_lantern:': 2.50 };
                                    const itemArray = Object.keys(items);
                                    const customer = [customerPerson[Math.floor(Math.random() * 3)], itemArray[Math.floor(Math.random() * 6)], itemArray[Math.floor(Math.random() * 6)], itemArray[Math.floor(Math.random() * 6)]];
                                    message.client.jobKeys[message.author.id] = (items[customer[1]] + items[customer[2]] + items[customer[3]]).toFixed(2);
                                    console.log((items[customer[1]] + items[customer[2]] + items[customer[3]]).toFixed(2));
                                    cbm.edit(`${customer[0]}\n\n ${customer[1]}     ${customer[2]}     ${customer[3]}\n$${items[customer[1]].toFixed(2)} $${items[customer[2]].toFixed(2)} $${items[customer[3]].toFixed(2)}`);
                                    await this.timer(8.5);
                                    if(!(Object.keys(message.client.jobKeys).includes(message.author.id))) {break;} else {
                                        delete message.client.jobKeys[message.author.id];
                                        message.reply('Your customer just took everything without paying because you took to long you won\'t be paid to make up for those lost items');
                                    }
                                    break;
                                case 'maid bee':
                                    // beep when object on conveyer belt, do math with 3 given item prices
                                    break;
                                default:
                                    console.log('default');
                            }
                        };
                        mainJobCode(jobType);
						cooldowns.push(message.author.id);
                        cooldowns.push(Date.now() + 60000 * 60);
						return setTimeout(() => {
                            cooldowns.splice(cooldowns.indexOf(message.author.id), 1);
							cooldowns.splice(message.author.id);
						}, 60000 * 60);
					}
				} else {return message.channel.send('You don\'t currently have a job, use `h-work (jobname)` to work as a job from `h-work list`');}
			} else if(args[0].toLowerCase() === 'list') {
				return message.channel.send('**List of Available Jobs**\n1. **Ghost Hunter Bee** :ghost:\n__pay:4k - 5k, risk: low__\n2. **Maid Bee**\n\n3. **Firefighter Bee**\n\n4. **Cashier Bee** :convenience_store:\n__pay:3.4k - 3.9k, risk: none__');
			}
            const jobArg = args.join(' ').toLowerCase();
            if(this.availableJobs.includes(jobArg)) {
				userObj[message.author.id].job = jobArg;
				fs.writeFile('/Users/Bramblestar/honey/users.json', JSON.stringify(userObj, null, 2), err => {
					if (err) {
						console.log(err);
					} else {
						return message.reply(`Congrats, you now work as a ${jobArg}`);
					}
				});
			} else {
                return message.reply('That isn\'t an available job. Use `h-work list` to see what jobs there are');
            }
		});
	},
};
