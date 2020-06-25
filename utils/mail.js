const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.MAILGUN_TOKEN;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});
 

module.exports = {
	sendVerificationMail(email, link) {
		console.log(link, 'mail js file');
		const data = {
		  from: 'FitX Ninja <noreply@fitx.ninja>',
		  to: email,
		  subject: 'Please verify your email address',
		  html: '',
		  text: `Please verify your account by clicking on the link. ${link}`
		};
		mailgun.messages().send(data, function (error, body) {
		  console.log(body);
		});
	},

	sendWelcomeEmail(email, link) {
		console.log(link, 'mail js file');
		const data = {
		  from: 'FitX Ninja <noreply@fitx.ninja>',
		  to: email,
		  subject: 'Welcome to FitX Ninja!',
		  html: '',
		  text: `Welcome to FitX Ninja! We're glad you've decided to join us. We're still new and just starting to flap our unicorn wings, which is why we especially value that you join us! Take a peak and stay tuned for new features will be popping up left and right! Enjoy your stay and enjoy fitness!`
		};
		mailgun.messages().send(data, function (error, body) {
		  console.log(body);
		});
	},

	sendVideoSignUpEmail(email, streamName, link) {
		console.log("THE LINK LINK LINK", link);
		const data = {
		  from: 'Eeter.tv <noreply@eeter.tv>',
		  to: email,
		  subject: `Registreerisid vaatama ${streamName}`,
		  html: '',
		  text: `Ära muretse! Tuletame sulle meelde kohe kui ${streamName} eetrisse läheb! Seniks, mine uudista Eeter.tv lehel ringi, äkki leiad midagi muud põnevat. ${link}`
		};
		mailgun.messages().send(data, function (error, body) {
		  console.log(body);
		});
	},


	sendVideoSignUpReminderEmail30(email, link) {
		const data = {
		  from: 'Eeter.tv <noreply@eeter.tv>',
		  to: email,
		  subject: `Kohe eetris: ${stream_name}`,
		  html: '',
		  text: `Ära unusta! ${stream_name} on juba 30 minuti pärast eetris!`
		};
		mailgun.messages().send(data, function (error, body) {
		  console.log(body);
		});
	},

	sendVideoSignUpReminderEmail(email, stream, link) {
		const data = {
		  from: 'Eeter.tv <noreply@eeter.tv>',
		  to: email,
		  subject: `${stream.stream_name} on eetris!`,
		  html: '',
		  text: `${stream.stream_name} on juba eetris! Tõtta vaatama! ${link}`
		};
		mailgun.messages().send(data, function (error, body) {
		  console.log(body);
		});
	},


	sendResetMail(email, link) {
		console.log(link, 'mail js file');
		const data = {
		  from: 'FitX Ninja <noreply@fitx.ninja>',
		  to: email,
		  subject: 'Reset password for your FitX Ninja account',
		  html: '',
		  text: `To reset your password, click on this link ${link}. The link expires in 30 minutes.`
		};
		mailgun.messages().send(data, function (error, body) {
		  console.log(body);
		});
	},

	sendInterestReceived(email, stream) {
		const data = {
		  from: 'Eeter.tv <noreply@eeter.tv>',
		  to: email,
		  subject: `Soovisid minna eetrisse?`,
		  html: '',
		  text: `Meil on väga hea meel, et oled huvitatud oma sisu Eeter.tv keskkonnas jagama. Su
		  soov jõudis meieni ja võtame sinuga ühendust!`
		};
		mailgun.messages().send(data, function (error, body) {
		  console.log(body);
		});
	}
}
