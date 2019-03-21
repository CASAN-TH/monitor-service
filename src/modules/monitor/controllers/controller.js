'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Monitor = mongoose.model('Monitor'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

exports.getList = function (req, res) {
    Monitor.find(function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: datas
            });
        };
    });
};

exports.create = function (req, res) {
    var newMonitor = new Monitor(req.body);
    newMonitor.createby = req.user;
    newMonitor.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
            /**
             * Message Queue
             */
            // mq.publish('Monitor', 'created', JSON.stringify(data));
        };
    });
};

exports.getByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Monitor.findById(id, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update = function (req, res) {
    var updMonitor = _.extend(req.data, req.body);
    updMonitor.updated = new Date();
    updMonitor.updateby = req.user;
    updMonitor.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = function (req, res) {
    req.data.remove(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.getReport = function (req, res) {
    var orderTeam = req.data
    console.log(orderTeam)

    let i = 0;
    var productData = []
    var qty = 0;
    for (i = 0; i < orderTeam.orders.length; i++) {
        var order = orderTeam.orders[i];
        for (let j = 0; j < order.items.length; j++) {
            var item = order.items[j];
            var result = productData.findIndex(function (data1) {
                // console.log('findindex' + data1.name);
                return item.name === data1.name
            })
            productData.push()
            if (result === -1) {
                productData.push({ name: item.name });
            }
            for (let k = 0; k < item.option.length; k++) {
                var option = item.option[k];
                for (let m = 0; m < option.value.length; m++) {
                    var value = option.value[m];
                    for (let n = 0; n < productData.length; n++) {
                        var prodData = productData[n];
                        if (prodData.name === item.name) {
                            qty = qty + value.qty
                            productData.push({qty: qty})
                            
                        }
                    }

                    
                }
            }
        }
    }
    console.log(productData);

    req.resualt = {
        teamname: orderTeam.team.teamname,
        reportall: {
            items: [{
                name: "name",
                qty: 20,
                price: 200
            }],
            totalprice: 200,
            totalqty: 20
        }
    }
    res.jsonp({
        status: 200,
        data: req.resualt
    });
}