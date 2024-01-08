const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

transporter.verify((err , success) => {
    err ? console.log(err) : console.log(`=== Server is ready to make messages : ${success} ===`);
});

app.post("/send" , (req , res) => {
    try {
        const mailOptions = {
            from: req.body.email,
            to: process.env.EMAIL,
            subject: "Someone contacted from your portfolio :)",
            html: `
                <p>You have a new inquiry</p>
                <h3>Contact Details</h3>
                <ul>
                    <li>Name: ${req.body.fullname}</li>
                    <li>Email: ${req.body.email}</li>
                    <li>Message: ${req.body.message}</li>
                </ul>
            `
        };

        transporter.sendMail(mailOptions , (err , info) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'Something went wrong. Please try again later'
                });
            } else {
                res.status(200).send({
                    success: true,
                    message: 'Thanks for contacting us. We will get back to you shortly'
                });
            }
        })
    } catch (err) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong. Please try again later'
        });
    }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});