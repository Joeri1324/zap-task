import express from "express";
import path from 'path'
import fs from 'fs'
import bodyParser from 'body-parser'
import crypto from 'crypto'
import { fileURLToPath } from 'url';

// Deffining the secret key
const secret = 'VERY_SECRET_KEY :-)';
const passwordHash = '4bce9f4eabe55b4e3fa8869475a636776dc156cd38f432c8df2f12b626a21869'

const port = 3333;
const app = express();
app.use(bodyParser.json())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userFile = path.join(__dirname, 'data/users.csv')

let userData = {}
let columns = []

const loadUserData = () => {
    const rawUserData = fs.readFileSync(userFile).toString()
    
    rawUserData.split('\n').forEach((line, idx) => {
        if (idx === 0) {
            columns = line.split(',').map(el => el.trim())
        } else {
            const lineEntries = line.split(',')

            const userObject = {}
            lineEntries.forEach((lineEntry, idx) => {
                userObject[columns[idx]] = lineEntry
            })
    
            userData[userObject["id"]] = userObject
        }
    })

}

loadUserData()

app.get("/", (req, res) => {
    res.send("Hello from Zaptic! 👋💜");
});

app.get("/zaptic", (req, res) => {
    res.sendFile(path.join(__dirname, "public/res/zaptic_logo.jpeg"))
})

app.get('/api/v1/users/:id', (req, res) => {
    const user = userData[req.params.id]

    if (!user) {
        res.sendStatus(404).end()
        return
    }

    res.json(user).end()
})

// actual password is ?password=supersafepassword
app.post('/api/v1/users', (req, res) => {
    const hash = crypto.createHash('sha256', secret)
        .update(req.query.password || "")
        .digest('hex');
    
    if (hash !== passwordHash) {
        res.sendStatus(401)
        return
    }

    const userLine = columns
        .filter((value) => value !== 'id')
        .map(entry => req.body[entry])
        .join(',')

    const id = Object.entries(userData).length

    fs.appendFile(userFile, `\n${id},${userLine}`, (err) => {
        if (err) {
            res.sendStatus(500)
        } else {
            loadUserData()
            res.sendStatus(200).end()
        }
    })
})

app.get('*', function(req, res){
    res.status(404).send("Seems like you're lost😱. Do you need some help?🕵️");
});

app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
});


export default app;
