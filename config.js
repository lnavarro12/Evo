// Fichero de configuración de la bd y puertos
module.exports ={
	port: process.env.PORT || 3001,
	db: process.env.MONGODB || 'mongodb://usuarioevo:123@localhost/evohr',
	SECRET_TOKEN: 'miclavedetokens'
}
 //nube - mongodb://admin:admin@ds133321.mlab.com:33321/heroku_b6k75vtm
 //local - mongodb://usuarioevo:123@localhost/evohr
 