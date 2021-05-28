process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const express = require('express');
const app = express();

const nodemailer = require("nodemailer");


//Set Vies




const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/media'));
app.use(express.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render(`${__dirname}/public/main/index`)
});

app.get('/index', (req, res) => {
    res.render(`${__dirname}/public/main/index`)
});

app.get('/about', (req, res) => {
    res.render(`${__dirname}/public/main/about`)
});

app.get('/contact', (req, res) => {
    res.render(`${__dirname}/public/main/contact`)
});

app.get('/item/:id', async (req, res) => {

    const { id } = req.params

    try{
        const getItem = await pool.query("SELECT * FROM .... WHERE ID= $1", [id])
        res.json(getItem.rows[0])
        res.render(`${__dirname}/public/main/item`)
    } catch (err) {
        console.error(err.message)
    }
    
    
});

app.get('/koszyk', (req, res) => {
    res.render(`${__dirname}/public/main/koszyk`)
});

app.get('/podsumowanie', (req, res) => {
    res.render(`${__dirname}/public/main/podsumowanie`)
});

app.get('/store', (req, res) => {
    res.render(`${__dirname}/public/main/store`)
});

app.get('/zamowienie', (req, res) => {
    res.render(`${__dirname}/public/main/zamowienie`)
});

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
        if (error){
            console.log(error);
            res.send('error');
        }else{
            console.log('Email sent: ' + info.response);
            res.send('success')
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})