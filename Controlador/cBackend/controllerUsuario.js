'use strict'
const mUsuario = require('../../models/mUsuarios')
const mContrato = require('../../models/mContratos')

var express = require("express");
var routerUsuario = express.Router();
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var fs = require('fs')
var path = require('path')

routerUsuario.route("/evohr/")
.post(function(req,res){
	mUsuario.findOne({
        usuario: req.body.usuario,
        contrasena: req.body.contrasena
    })

	.then((doc) =>{
	     req.session.usuarioId = doc._id;
	     req.session.correoElectronico = doc.correoElectronico;
	     req.session.usuario = doc.usuario;

	     var returnUsuario = {
	              usuarioId: doc._id,
	              correoElectronico: doc.correoElectronico,
	              usuario: doc.usuario,
	              primerNombre: doc.primerNombre,
	              primerApellido: doc.primerApellido,
	              sexo: doc.sexo,
	              error: ""
	      };
	     res.status(200).send(returnUsuario)
	})

	.catch((err)=>{
		//console.log(err)
		res.send({
             error: "La contraseña y/o el usuario no coinciden"
        });
	})
});

routerUsuario.route("/logout")
.post(function(req,res,next){
	if (req.session.usuarioId == req.body.id) {
		req.session.usuarioId = null
		req.session.correoElectronico = null
		req.session.usuario = null
		//console.log(req.session.usuarioId)

	    res.status(200).send(req.session)
	}else{
		res.status(500).send({
			error : "Error de sesiones"
		})
	}
});

routerUsuario.route("/usuarios/edicion")
.get(function(req,res){
	//console.log(req.query.id)
	let usuarioId = req.query.id
	//console.log(usuarioId);

	mUsuario.findById(usuarioId)
	.then((usuario)=>{
		mContrato.populate(usuario, {path: "contratoUsuario"})
		.then((contrato)=>{
			res.status(200).send(usuario);
		})
	})

	.catch((err) =>{
		res.status(500).send({
			message: `Error al realizar la petición: ${err}`
		})
	})
});

routerUsuario.route("/usuarios")
.get(function(req,res){
	var filtro = {
      estado: "activo"
    };
	// let estado = req.query.estado
	// //console.log(estado)

	mUsuario.find(filtro)
	.then((userAll) =>{
		res.send(userAll)
		// res.send({
		// 	usuarios: userAll
		// });
	})

	.catch((err) =>{
		message: "Error al tratar de traer los registros"
	});
})

.delete(function(req,res){
	var update = {
		estado: "inactivo"
	};

	mUsuario.update({_id: req.query.id}, update)

	.then((done)=>{
		res.status(200).send({
			message: "El Usuario se ha eliminado correctamente",
			error: "",
		})
	})

	.catch((done)=>{
		res.status(500).send({
			message: "Ha ocurrido un error al eliminar"
		})
	})
})

.post(upload.any(), function(req,res){
	// console.log(req.files)
	// console.log(req.body)

	var data = new mUsuario({
      primerNombre: req.body.primerNombre,
      segundoNombre: req.body.segundoNombre,
      primerApellido: req.body.primerApellido,
      segundoApellido: req.body.segundoApellido,
      tipoIdentificacion: req.body.tipoIdentificacion,
      identificacion: req.body.identificacion,
      sexo: req.body.sexo,
      fch_nacimiento: req.body.fch_nacimiento,
      direccion: req.body.direccion,
      telefono: req.body.telefono,
      celular: req.body.celular,
      correoElectronico: req.body.correoElectronico,
      usuario: req.body.usuario,
      contrasena: req.body.contrasena,
      estado: "activo"
    });

    data.save()
	.then((user) =>{
    	if (req.files) {
    		req.files.forEach(function(file){
    			var filename = user._id;
    			//fs.rename
    			console.log(file.path,'uploads/userFace/'+filename)
    		})
		}
		res.status(200).send(user);
	})

	.catch((error)=>{
        res.status(500).send(error);
	})
})

.put(upload.any(), function(req,res){

	let usuarioId = req.body.id
	let body = req.body

	mUsuario.findByIdAndUpdate(usuarioId, body)
	.then((user) =>{
		if (req.files) {
			console.log("aqui se hace la logica de subir la foto")
		}
		res.status(200).send(user);
	})

	.catch((err)=>{
		res.status(500).send(error);
	})
})



module.exports = routerUsuario;



// function ObtenerClientes(req,res,next){
// 	// //console.log("estoy en obtener clientes")
// 	mUsuario.find()
// 	.then((userAll) =>{
// 		// //console.log(userAll)
// 		res.send({
// 			usuarios: userAll
// 		});
// 	})

// 	.catch((err) =>{
// 		message: "Error al tratar de traer los registros"
// 	})

// 	// res.end()
// }

// function ActualizarUsuario(req,res,next){
// 	let usuarioId = req.params.usuarioId
// 	let body = req.body

// 	mUsuario.findByIdAndUpdate(usuarioId, body)
// 	.then((user) =>{
// 		//console.log(user);
// 		res.json(user);
// 	})

// 	.catch((err)=>{
// 		//console.log(err);
// 		res.send("error");
// 	})
// }

// function GuardarUsuario(req,res,next){

// 	let nody = req.body;

// 	let usuario = new mUsuario({
// 		primerNombre: req.body.primerNombre,
// 		segundoNombre: req.body.segundoNombre,
// 		primerApellido: req.body.primerApellido,
// 		segundoApellido: req.body.segundoApellido,
// 		direccion:  req.body.direccion,
// 		fch_nacimiento: req.body.fch_nacimiento,
// 		estado: req.body.estado,
// 		usuario: req.body.usuario,
// 		correoElectronico: req.body.correoElectronico,
// 		contrasena: req.body.contrasena,
// 		sexo :req.body.sexo
// 	})

// 	usuario.save()
// 	.then((user) =>{
// 		//console.log(user);
// 		res.status(200).send({token : service.createToken(user)});
// 	})

// 	.catch((err)=>{
// 		//console.log(err);
// 		res.status(500).send(err);
// 	})
// }

// function EliminarUsuario(req,res,next){
// 	let usuarioId = req.params.usuarioId

// 	mUsuario.findById(usuarioId)
// 	.then((userSel) =>{
// 		userSel.remove()
// 		.then(function(){
// 			res.status(200).send({
// 				message: "El usuario ha sido borrado"
// 			})
// 		})

// 		.catch((err) =>{
// 			res.status(500).send({
// 				message: `Error al borrar el usuario: ${err}`
// 			})
// 		})

// 	})

// 	.catch((err) =>{
// 		res.status(500).send({
// 			message: `Error al borrar el usuario: ${err}`
// 		})
// 	})
// }

// function LogOut(req,res,next){

// 	if (req.session.usuarioId == req.body.id) {
// 		req.session.usuarioId = null
// 		req.session.correoElectronico = null
// 		req.session.usuario = null

// 	    res.status(200).send(req.session)
// 	}else{
// 		res.status(500).send({
// 			error : "Error de sesiones"
// 		})
// 	}
// }

// module.exports = {
// 	ObtenerCliente,
// 	ObtenerClientes,
// 	ActualizarUsuario,
// 	GuardarUsuario,
// 	LogOut,
// 	singIn,
// 	EliminarUsuario
// }
