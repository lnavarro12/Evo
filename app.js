'use strict'

// COnfiguración de Express
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// Ruteros para la aplicación

const router = require("./routes/cb.rutas");
const userSession = require("./Controlador/cBackend/cb.userSession");
const routerUsuario = require("./Controlador/cBackend/controllerUsuario");
const routerConfigContract = require("./Controlador/cBackend/cb.conf-Contrato")
const routerContrato = require("./Controlador/cBackend/cb.contrato")


const CookieSession = require('cookie-session');

app.use(CookieSession({
  name: 'session',
  keys: ['cualquier_cosa'],

 // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours 
}))


const path = require('path')
const fs = require('fs')

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'Vista'));

// Rutas Estaticas
app.use("/",express.static("./Recursos"))
app.use("/",express.static("./uploads"))
app.use("/",express.static("./Controlador"))
app.use("/",express.static("./Vista"))

app.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, sid")
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT")
	next()
})
// app.use("/evohr/",userSession);


app.get("/",function(req,res){
    res.redirect("/evohr");
});

app.get("/evohr/login",function(req,res){
    res.render("V.Comun/login.html");
});


app.use("/",routerUsuario)
app.use("/",router)
app.use("/",routerConfigContract)
app.use("/",routerContrato)
app.use("/evohr/",userSession)


module.exports = app;