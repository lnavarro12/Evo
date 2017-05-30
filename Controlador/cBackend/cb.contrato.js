var express = require("express");
var modeloContrato = require("../../models/mContratos");
var routerContrato = express.Router();

routerContrato.route("/contratos")
  .post(function(req, res) {
    console.log(req.body);
    // var data = {
    //   cicloFacturacion: req.fields.cicloFacturacion,
    //   salarioBase: req.fields.salarioBase,
    //   fechaIngreso: req.fields.fechaIngreso,
    //   tipoContrato: req.fields.tipoContrato,
    //   tipoSalario: req.fields.tipoSalario,
    //   fechaFinalizacion: req.fields.fechaFinaliacion,
    //   cargo: req.fields.cargo,
    //   nota: req.fields.nota,
    //   noContrato: req.fields.noContrato
    // };
    // //console.log(data);
    // var contrato = new modeloContrato(data);
    // contrato.save(function(error) {
    //   if (error) {
    //     var mensajeError = "";
    //     var contador = 1;
    //     for (var i in error.errors) {
    //       var coma = "";
    //       console.log(error.errors.length);
    //       if (error.errors.length != 1 && contador != error.errors.length) {
    //         coma = "\n";
    //       }
    //       mensajeError += error.errors[i].message + coma;
    //       contador++;
    //     }
    //     res.send({
    //       error: mensajeError
    //     });
    //   } else {
    //     var returncontrato = {
    //       _id: contrato._id,
    //       error: ""
    //     };
    //     res.send(returncontrato);
    //   }
    // });
  });

routerContrato.route("/contrato/edicion/")
  .get(function(req, res) {
    modeloContrato.findById(req.query.id).exec(function(error, contrato) {
      if (contrato !== null) {
        res.send(contrato);
      } else {
        res.send({
          error: error
        });
      }
    });
  })
  .put(function(req, res) {
    modeloContrato.findById(req.query.id).exec(function(error, contrato) {
      if (error) {
        res.send({
          error: error
        });
      } else {
        if (req.fields.cicloFacturacion) {
          contrato.cicloFacturacion = req.fields.cicloFacturacion;
        }
        if (req.fields.tipoContrato) {
          contrato.tipoContrato = req.fields.tipoContrato;
        }
        if (req.fields.tipoSalario) {
          contrato.tipoSalario = req.fields.tipoSalario;
        }
        if (req.fields.cargo) {
          contrato.cargo = req.fields.cargo;
        }
        if (req.fields.salarioBase) {
          contrato.salarioBase = req.fields.salarioBase;
        }
        if (req.fields.fechaIngreso) {
          contrato.fechaIngreso = req.fields.fechaIngreso;
        }
        if (req.fields.fechaFinaliacion) {
          contrato.fechaFinaliacion = req.fields.fechaFinaliacion;
        }
        contrato.save(function(err) {
          if (err) {
            res.send({
              error: err
            });
          } else {
            res.status(200).send({contrato:contrato, error:""});
          }
        });
      }
    });
  });

module.exports = routerContrato;
