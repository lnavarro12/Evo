'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')

// Estos servicios pueden ser usados desde cualquier parte de la aplicación 
// Aqui creo los token para la autenticación y creación de usuario

function createToken(user){
	const payload = {
		sub: user._id,
		iat: moment().unix(), // creación de token
		exp: moment().add(14, 'days').unix() // fecha de expiración
	}

	return jwt.encode(payload,config.SECRET_TOKEN)
}

function decodeToken(token){
	const decoded = new Promise((resolve,reject) =>{
		try{
			const payload = jwt.decode(token,config.SECRET_TOKEN)
			if (payload.exp <= moment().unix()) {
				reject({
					status:401,
					message: 'El token ha expirado'
				})
			}

			resolve(payload.sub)

		}catch(err){
			reject({
				status: 500,
				message: 'Invalid token'
			})
		}
	})

	return decoded
}

module.exports = {
	createToken,
	decodeToken
}