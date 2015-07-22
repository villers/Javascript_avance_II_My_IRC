/// <reference path="../../../server/all.d.ts" />

module irc {
	'use strict';

	export class Parse {
		static $inject = [Parse.filterFactory];

		static specialChar = [
			['>', '&gt;'],
			['<', '&lt;'],
			['\\n', '<br>'],
			['((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])', '<a href="$1">$1</a>']
		];

		static emoticones = [
			['O:\\)', 'angel.png', 'O:)'],
			['3:\\)', 'devil.png', '3:)'],
			['O\\.o', 'confused.png', 'O.o'],
			[':\'\\(', 'cry.png', ':\'('],
			[':\\(', 'frown.png', ':('],
			[':o', 'gasp.png', ':o'],
			['8\\|', 'glasses.png', '8|'],
			[':D', 'grin.png', ':D'],
			['&gt;:-\\(', 'grumpy.png', '>:-('],
			['&lt;3', 'heart.png', '<3'],
			['\\^_\\^', 'kiki.png', '^_^'],
			[':\\*', 'kiss.png', ':*'],
			[':v', 'pacman.png', ':v'],
			[':\\)', 'smile.png', ':)'],
			['-_-', 'squint.png', '-_-'],
			['8\\)', 'sunglasses.png', '8)'],
			[':P', 'tongue.png', ':P'],
			[':\\|', 'unsure.png', ':|'],
			['&gt;&lt;', 'upset.png', '><']
		];

		static filterFactory() {
			return (input: string): string => {
				for (let i in Parse.specialChar) {
					if (Parse.specialChar.hasOwnProperty(i)) {
						input = input.replace(new RegExp(Parse.specialChar[i][0], 'gi'), Parse.specialChar[i][1]);
					}
				}
				for (let i in Parse.emoticones) {
					if (Parse.emoticones.hasOwnProperty(i)) {
						input = input.replace(new RegExp(Parse.emoticones[i][0], 'gi'), '<img src="img/smiley/' + Parse.emoticones[i][1] + '">');
					}
				}
				return input;
			}
		}
	}
}
