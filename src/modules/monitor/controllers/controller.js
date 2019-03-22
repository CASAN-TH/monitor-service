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

exports.getReport = function (req, res, next) {
    var orderTeam = req.data
    // console.log(orderTeam)

    let i = 0;
    var productData = [];
    var totalprice = 0;
    var totalQty = 0;
    for (i = 0; i < orderTeam.orders.length; i++) {
        var order = orderTeam.orders[i];
        for (let j = 0; j < order.items.length; j++) {
            var item = order.items[j];

            totalprice = totalprice + item.amount

            for (let k = 0; k < item.option.length; k++) {
                var option = item.option[k];
                for (let m = 0; m < option.value.length; m++) {
                    var value = option.value[m];

                    var result = productData.findIndex(function (data1) {
                        return item.name.toString() === data1.name.toString()
                    })
                    
                    if (result === -1) {
                        productData.push({ name: item.name, qty: value.qty, price: item.price });
                    }
                    if (result !== -1) {
                        var qtyData = productData[result].qty + value.qty
                        productData[result].qty = qtyData
                    }
                }
            }
        }
    }

    //หา ค่ารวม qty
    for (let o = 0; o < productData.length; o++) {
        var prodData = productData[o];
        totalQty += prodData.qty
    }

    // console.log(productData);
    // console.log(totalprice);
    // console.log(totalQty);

    req.reportall = {
        teamname: orderTeam.team.teamname,
        reportall: {
            items: productData,
            totalprice: totalprice,
            totalqty: totalQty
        }
    }
    next();
}

exports.reportDetailData = function (req, res, next) {

    var reportall = req.reportall;
    var data = req.data;
    // console.log(data);
    var reportDetail = []

    for (let i = 0; i < data.orders.length; i++) {
        var order = data.orders[i];
        var itemsData = [];
        for (let j = 0; j < order.items.length; j++) {
            var item = order.items[j];
            for (let k = 0; k < item.option.length; k++) {
                var option = item.option[k];
                var displayName = item.name + "(" + option.name + ")";
                var valueData = []
                for (let m = 0; m < option.value.length; m++) {
                    var value = option.value[m];
                    valueData.push(value)
                }

                itemsData.push({ name: displayName, value: valueData })
            }
        }
        //ไว้ตรงนี้เพราะจะ push ตาม order
        reportDetail.push({
            customer: {
                firstname: order.customer.firstname,
                lastname: order.customer.lastname
            },
            items: itemsData
        });
    }
    if (reportall && reportDetail) {
        reportall.reportDetail = reportDetail
        req.report = reportall
        next();
    }
}

exports.returnData = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.report
    });
}

exports.getProductLabel = function (req, res, next) {

    var order = req.order;

    let j = 0;
    let k = 0;
    let m = 0;
    var productData = [];
    for (j = 0; j < order.items.length; j++) {
        var item = order.items[j];
        var result = productData.findIndex(function (data1) {
            return item.name === data1.name
        })
        for (k = 0; k < item.option.length; k++) {
            var option = item.option[k];
            for (m = 0; m < option.value.length; m++) {
                var value = option.value[m];
                if (result === -1) {
                    productData.push({ name: item.name, qty: value.qty });
                }
                if (result !== -1) {
                    var qtyData = productData[result].qty + value.qty
                    productData[result].qty = qtyData
                }
            }
        }
    }

    var label = {
        customer: order.customer,
        productall: productData
    }
    req.report = label;
    next();
}

exports.getMonitorByOrder = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Monitor.find({ "orders._id": id }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            var b;
            req.data.forEach(element => {
                var a = element.orders.filter(function (params) {
                    if (params._id.toString() === id.toString()) {
                        b = params;
                    }
                })

            });
            req.order = b;
            next();
        };
    });
}