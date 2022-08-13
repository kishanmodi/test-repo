const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const PORT = process.env.PORT || '8080';

const cors = require('cors');
app.use(
	cors({
		origin: [
			'https://kishanmodi.github.io',
			'https://www.kishanmodi.me',
			'http://localhost:3000',
			'https://kishanmodi.github.io/weather-app'
		]
	})
);
const apiKey = '4fd95260ee4e78352fea592ff624e953';

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.send({ weather: null, error: null, code: 200 });
});

app.get('/get', function (req, res) {
	let city = req.query.city;
	console.log(city);
	let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=matric&appid=${apiKey}`;

	request(url, function (err, response, body) {
		if (err) {
			res.send({ weather: null, error: 'Error, please try again', code: 404 });
		} else {
			let weather = body;
			res.send(weather);
		}
	});
});

app.listen(PORT, () => {
	console.log('App is running on port ' + PORT);
});
