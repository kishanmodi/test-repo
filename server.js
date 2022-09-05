const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const PORT = process.env.PORT || '8080';
const axios = require('axios');
const cors = require('cors');
const data = require('./cities.json');
const movies = require('./movies.json');
const unorm = require('unorm');
app.use(
    cors({
        origin: [
            'https://kishanmodi.github.io',
            'https://kishanmodi.me',
            'https://www.kishanmodi.me',
            'http://localhost:3000',
            'https://kishanmodi.github.io/weather-app',
            'https://kishanmodi.me/weather-app',
            'https://movies-to-watch.vercel.app'
        ]
    })
);
const apiKey = '4fd95260ee4e78352fea592ff624e953';

app.use(bodyParser.urlencoded({ extended: true }));

const getTorrents = async (query) => {
    try {
        const links = await axios.get(
            `https://tscrap.herokuapp.com/torrents?key=${query}`
        );

        if (links.data.length === 0) {
            return { data: '', success: false };
        }
        const magnet = await axios.get(
            `https://tscrap.herokuapp.com/magnet?link=${links.data[0].url}`
        );
        if (Object.keys(magnet.data).length === 0) {
            return { data: '', success: false };
        } else {
            return { data: magnet.data['magnet'], success: true };
        }
    } catch (err) {
        return { data: '', success: false };
    }
};
app.get('/', function (req, res) {
    res.send({ weather: null, error: null, code: 200 });
});

app.get('/get', function (req, res) {
    let city = req.query.city;
    console.log(city);
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            res.send({
                weather: null,
                error: 'Error, please try again',
                code: 404
            });
        } else {
            let weather = body;
            res.send(weather);
        }
    });
});

app.get('/cities', (req, res) => {
    res.json(data);
});

app.get('/searchCity', (req, res) => {
    const params = req.query.city;
    if (params.length === 0) {
        res.send({ data: {}, success: false });
    }
    let count = 0;
    const filteredCities = data.filter((item) => {
        if (
            unorm
                .nfd(item.name)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .includes(params.toLowerCase())
        ) {
            return item;
        }
    });
    res.send({
        data: filteredCities.slice(0, 10),
        success: true
    });
});

app.get('/movies', (req, res) => {
    const params = req.query.m;
    if (params.length === 0) {
        res.send({ data: {}, success: false });
    }
    let count = 0;
    const filteredMovies = movies.filter((item) => {
        if (
            unorm
                .nfd(item.movie_title)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .includes(params.toLowerCase())
        ) {
            return item;
        }
    });
    res.send({
        data: filteredMovies.slice(0, 10),
        success: true
    });
});

app.get('/torrents', async (req, res) => {
    const params = req.query.q;
    const result = await getTorrents(params);
    console.log(result);
    res.send(result);
});
app.listen(PORT, () => {
    console.log('App is running on port ' + PORT);
});
