const whURL =
	"https://ptb.discord.com/api/webhooks/1267496732271448156/D1zmlfvJH6nu8Sj9lQgdD1G9x1YZrX7JA9EQLUnTFFR-psFEZnMfQF5wKBF5FUeMMP6U";

const COOLDOWN_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds
const COOKIE_NAME = "suggest-colour-cooldown";

function suggestColour() {
	const colourName = document.getElementById("suggest").value;

	if (!colourName) {
		return;
	}

	const cookie = document.cookie
		.split("; ")
		.find((row) => row.startsWith(COOKIE_NAME + "="));
	const expirationTime = cookie ? parseInt(cookie.split("=")[1]) : 0;

	if (Date.now() < expirationTime) {
		alert(
			"Thanks for your enthusiasm, but you've already submitted a suggestion recently.\nIf you have another suggestion, please feel free to submit it later.\n\nThank you! <3"
		);
		return;
	}

	const expirationDate = new Date(Date.now() + COOLDOWN_TIME);
	document.cookie = `${COOKIE_NAME}=${expirationDate.getTime()}; expires=${expirationDate.toUTCString()}; path=/`;

	fetch(whURL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			content: colourName,
		}),
	});
}
