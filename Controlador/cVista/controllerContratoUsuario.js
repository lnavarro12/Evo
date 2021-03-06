usuario.config(['$routeProvider','$locationProvider', '$qProvider', function($routeProvider, $locationProvider, $qProvider) {
	// $qProvider.errorOnUnhandledRejections(false);
	$routeProvider
	.when('/contratoUsuario/:usuarioId',{
    templateUrl: '../V.Contrato/creacionActualizacionContrato.html',
    controller: 'controllerContratoUsuario'
	})
	.when('/actualizarContratoUsuario/:usuarioId/:contratoId',{
    templateUrl: '../V.Contrato/creacionActualizacionContrato.html',
    controller: 'controllerContratoUsuario'
	})
	.otherwise('/',{
	    redirectTo :'/'
	});
}])

usuario.controller('controllerContratoUsuario', ['$scope', '$http', '$routeParams', '$location', function(scope, $http, $routeParams, $location){
	scope.btnRegistroContrato = true;
	scope.btnActualizarContrato = false;

	$http.get("/listadoOpciones",{
	  params: {id: $routeParams.usuarioId}
	})
	.then(function(respuesta){
		console.log(respuesta.data);
		scope.tipoContratoEmpresa = respuesta.data.datos[0].tiposContratos;
		scope.cicloFacturacionEmpresa = respuesta.data.datos[1].ciclos;
		scope.cargosEmpresa = respuesta.data.datos[2].cargos;
		scope.tipoSalarioEmpresa = respuesta.data.datos[3].tipoSalarios;
		scope.cicloFacturacionSeleccionado;
		scope.tipoContratoSeleccionado;
		scope.tipoSalarioSeleccionado;
		scope.cargoSeleccionado;
		if (respuesta.data.datos[4].ultimoContrato) {
			scope.noContrato = 1;
			scope.codContrato = "CONT"+scope.noContrato;
		}else{
			scope.noContrato = parseInt(respuesta.data.datos[4].ultimoContrato[0].noContrato) + 1;
			scope.codContrato = "CONT"+scope.noContrato;
		}
		scope.idUsuario = respuesta.data.datos[5].usuario._id;
		if ($location.path().indexOf("/actualizarContratoUsuario")!=-1) {
				scope.btnRegistroContrato = false;
				scope.btnActualizarContrato = true;
				scope.usuarios = {
					empleado: respuesta.data.datos[5].usuario.primerNombre + " " + respuesta.data.datos[5].usuario.primerApellido,
					docEmpleado: respuesta.data.datos[5].usuario.identificacion,
					id: respuesta.data.datos[5].usuario._id,
					fechaInicio: new Date(respuesta.data.datos[5].usuario.contratoUsuario.fechaIngreso),
					fechaFin: new Date(respuesta.data.datos[5].usuario.contratoUsuario.fechaFinalizacion),
					salariobase: respuesta.data.datos[5].usuario.contratoUsuario.salarioBase,
					notasContrato: respuesta.data.datos[5].usuario.contratoUsuario.nota
		    }
				scope.tipoContratoSeleccionado = scope.BuscarElementoSelect(respuesta.data.datos[0].tiposContratos, respuesta.data.datos[5].usuario.contratoUsuario.tipoContrato);
				scope.cicloFacturacionSeleccionado = scope.BuscarElementoSelect(respuesta.data.datos[1].ciclos, respuesta.data.datos[5].usuario.contratoUsuario.cicloFacturacion);
				scope.cargoSeleccionado = scope.BuscarElementoSelect(respuesta.data.datos[2].cargos, respuesta.data.datos[5].usuario.contratoUsuario.cargo);
				scope.tipoSalarioSeleccionado = scope.BuscarElementoSelect(respuesta.data.datos[3].tipoSalarios, respuesta.data.datos[5].usuario.contratoUsuario.tipoSalario);
				scope.noContrato = parseInt(respuesta.data.datos[4].ultimoContrato[0].noContrato);
			}else{
				scope.usuarios = {
					empleado: respuesta.data.datos[5].usuario.primerNombre + " " + respuesta.data.datos[5].usuario.primerApellido,
					docEmpleado: respuesta.data.datos[5].usuario.identificacion,
					id: respuesta.data.datos[5].usuario._id
				}
			}
	});

  scope.RegistrarContrato = function(){
    $http.post("/contratos", {
      cicloFacturacion: scope.cicloFacturacionSeleccionado.nombre,
      salarioBase: scope.usuarios.salariobase,
      fechaIngreso: scope.usuarios.fechaInicio,
      tipoContrato: scope.tipoContratoSeleccionado.nombre,
      tipoSalario: scope.tipoSalarioSeleccionado.nombre,
      fechaFinaliacion: scope.usuarios.fechaFin,
      cargo: scope.cargoSeleccionado.nombre,
	  nota: scope.usuarios.notasContrato,
	  noContrato: scope.noContrato,
	  codContrato: scope.codContrato
    })
    .then(function(response,status,headers,config){
			// if(response.data.error==""){
			// 	$http.put("/usuarios/edicion",
			// 		{
			// 			contrato: response.data._id
			// 		},
			// 		{params: { id: $routeParams.usuarioId }}
			// 	)
			// 	.then(function(response,status,headers,config){
			// 		if(response.data.error==""){
			// 			swal("Felicitaciones", "Contrato Guardado", "success");
			// 			$location.path("/actualizacionEmpleados/"+$routeParams.usuarioId);
			// 		}else{
			// 			swal("Error al relacionar contrato", response.data.error, "warning");
			// 		}
			// 	});
			// }else{
			// 	swal("Error al guardar contrato", response.data.error, "warning");
			// }
	});
		// .catch(function(response,status){
		// 	swal("Error", response.data, "error");
		// });
  };

	scope.ActualizarContrato = function(){
		$http.put("/contrato/edicion/",
			{
				cicloFacturacion: scope.cicloFacturacionSeleccionado.nombre,
	      salarioBase: scope.usuarios.salariobase,
	      fechaIngreso: scope.usuarios.fechaInicio,
	      tipoContrato: scope.tipoContratoSeleccionado.nombre,
	      tipoSalario: scope.tipoSalarioSeleccionado.nombre,
	      fechaFinaliacion: scope.usuarios.fechaFin,
	      cargo: scope.cargoSeleccionado.nombre
			},
			{params: { id: $routeParams.contratoId }}
		)
		.then(function(response,status,headers,config){
			if(response.data.error==""){
				swal("Actualizacion Correcta", "Hemos guardado tus datos", "success");
				$location.path("/actualizacionEmpleados/"+$routeParams.usuarioId);
			}else{
				swal("Verifica tus datos!", response.data.error, "warning");
			}
		});
	};

	scope.Cancelar = function(idUsuario){
		$location.path("/actualizacionEmpleados/"+idUsuario);
	};
  scope.BuscarElementoSelect = function(object, valor){
		for (var i = 0; i < object.length; i++) {
			if (object[i].nombre == valor) {
				return object[i];
			}
		}
	};
}])
