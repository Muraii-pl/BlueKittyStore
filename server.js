import express from 'express';
import url from 'url'
const app = express();

import nodemailer from "nodemailer";
import { dirname } from 'path'
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import pass from'./pass.js';

//moongose

const __dirname = dirname(fileURLToPath(import.meta.url));
const itemSchema = {
    name: String,
    price: String,
    sale: String,
    category: String,
    available: String,
    time: Date,
    opis: String
}


//Set Vies

const Items = mongoose.model('items', itemSchema)


const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname +'/media'));
app.use(express.json());

app.set('view engine', 'ejs');

// Home page route
app.get('/', async (req, res) => {
    mongoose.connect(`mongodb+srv://admin:${pass}@cluster0.0edds.mongodb.net/BlueKittyStore?retryWrites=true&w=majority`, {
    useNewUrlParser: true, useUnifiedTopology: true
})

    let SaleItems = {}
    let NewsItems = {}
    await Items.find({}).limit(3).then(
        data => {
            SaleItems = data
        }
    )
    await Items.find({}).sort({time:-1}).limit(3).then(
    data => {
        NewsItems = data
    }   
    )
    res.render(`${__dirname}/public/main/index`,{'SaleItems':SaleItems,'NewsItems':NewsItems})
});
// Home page route
app.get('/index', (req, res) => {
    res.render(`${__dirname}/public/main/index`)
});
// About page route
app.get('/about', (req, res) => {
    res.render(`${__dirname}/public/main/about`)
});
// Contact page route
app.get('/contact', (req, res) => {
    res.render(`${__dirname}/public/main/contact`)
});
// Item page route
app.get('/item/:id', async (req, res) => {
    mongoose.connect(`mongodb+srv://admin:${pass}@cluster0.0edds.mongodb.net/BlueKittyStore?retryWrites=true&w=majority`, {
    useNewUrlParser: true, useUnifiedTopology: true
})

    let getItem
    console.log(req.params.id)
    await Items.findById(req.params.id).then(data => {
       getItem = data
    })

    mongoose.connection.close()
    res.render(`${__dirname}/public/main/item`,{'Items':getItem})

   
});
// Koszyk page route
app.get('/koszyk', (req, res) => {
    res.render(`${__dirname}/public/main/koszyk`)
});
// Podsumowanie page route
app.get('/podsumowanie', (req, res) => {
    res.render(`${__dirname}/public/main/podsumowanie`)
});
// Store page route
app.get('/store', async (req, res) => {

    mongoose.connect(`mongodb+srv://admin:${pass}@cluster0.0edds.mongodb.net/BlueKittyStore?retryWrites=true&w=majority`, {
        useNewUrlParser: true, useUnifiedTopology: true})
    let GetItems = {}
    await Items.find({}).then(
        data => {
            GetItems = data
        }
    )
    res.render(`${__dirname}/public/main/store`,{'Items':GetItems})
});
// Zamownienie page route
app.get('/zamowienie', (req, res) => {
    res.render(`${__dirname}/public/main/zamowienie`)
});
// Send email from page contact

app.post('/contact', (req, res) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'storebluekitty@gmail.com',
            pass: 'password01!'
        }
    });

    const mailOptions = {
        from: req.body.email,
        to: 'storebluekitty@gmail.com',
        subject: `Message from ${req.body.email}: ${req.body.subject}`,
        text: req.body.message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('error');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('success')
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})