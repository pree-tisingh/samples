const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

const messagesFile = path.join(__dirname, 'messages.json');


if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, '[]', 'utf-8');
}


app.get('/login', (req, res) => {
    res.render('login');
});


app.post('/login', (req, res) => {
    const { username } = req.body;
    res.cookie('username', username, { maxAge: 900000, httpOnly: true });
    res.redirect('/');
});


app.get('/', (req, res) => {
    if (!req.cookies.username) {
        return res.redirect('/login');
    }
    res.render('message');
});


app.post('/message', (req, res) => {
    const { message } = req.body;
    const username = req.cookies.username;

    if (!username) {
        return res.status(400).send("No username found in cookies. Please log in.");
    }

    const newMessage = { username, message };

    fs.readFile(messagesFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }

        let messages;
        try {
            messages = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Internal Server Error');
        }

        messages.push(newMessage);
        fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/');
        });
    });
});

app.get('/messages', (req, res) => {
    fs.readFile(messagesFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }

        let messages;
        try {
            messages = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Internal Server Error');
        }

        res.render('messages', { messages });
    });
});


app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

app.listen(3000);
