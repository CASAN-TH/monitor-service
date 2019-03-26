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

exports.reportAllData = function (req, res, next) {
    var orderTeam = req.data
    // console.log(orderTeam)
    var productData = [];
    var totalprice = 0;
    var totalQty = 0;

    for (let i = 0; i < orderTeam.orders.length; i++) {
        var order = orderTeam.orders[i];
        for (let j = 0; j < order.items.length; j++) {
            var item = order.items[j];
            totalprice = totalprice + item.amount
            // console.log(item.name)
            var indxName = productData.findIndex(function (dataName) {
                return item.name === dataName.name
            })
            if (indxName === -1) {
                productData.push({ name: item.name, price: item.price })
            }
            for (let k = 0; k < item.option.length; k++) {
                var option = item.option[k];
                for (let m = 0; m < option.value.length; m++) {
                    var value = option.value[m];
                    // console.log(value.name)
                    var indxNameV2 = productData.findIndex(function (dataName) {
                        return item.name === dataName.name
                    });
                    if (!productData[indxNameV2].type) {
                        productData[indxNameV2].type = [{ name: value.name, qty: value.qty }]
                        totalQty += value.qty;
                        // console.log(productData[indxNameV2]);
                    } else {
                        // console.log(value.name + ' ----push รอบ2')
                        var indxValueName = productData[indxNameV2].type.findIndex(function (dataValueName) {
                            return value.name === dataValueName.name
                        })
                        if (indxValueName === -1) {
                            productData[indxNameV2].type.push({ name: value.name, qty: value.qty });
                            totalQty += value.qty;
                        } else {
                            productData[indxNameV2].type[indxValueName].qty += value.qty;
                            totalQty += value.qty;
                        }
                    }
                }
            }
        }
    }

    req.reportOrder = {
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

    var reportOrder = req.reportOrder;
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
    if (reportOrder && reportDetail) {
        reportOrder.reportDetail = reportDetail
        req.result = reportOrder
        next();
    }
}

exports.returnData = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.result ? req.result : "data"
    });
}

exports.getProductLabel = function (req, res, next) {

    var order = req.order;

    let j = 0;
    let k = 0;
    let m = 0;
    // let q = 0;
    // let x = 0;
    // console.log(order)

    var productData = [];
    for (j = 0; j < order.items.length; j++) {
        var item = order.items[j];

        for (k = 0; k < item.option.length; k++) {
            var option = item.option[k];
            for (m = 0; m < option.value.length; m++) {
                var value = option.value[m];

                var result = productData.findIndex(function (data1) {
                    return item.name === data1.name
                })

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

    var a = [];
    for (let q = 0; q < order.labels.length; q++) {
        var labels = order.labels[q];
        // console.log(labels)
        for (let x = 0; x < labels.productlist.length; x++) {
            var prod = labels.productlist[x];
            // console.log(prod)
            var index3 = a.findIndex(function (data1) {
                return prod.name === data1.name
            })
            // console.log(index3)

            if (index3 === -1) {
                a.push({ name: prod.name, qty: prod.qty });
            }
            if (index3 !== -1) {
                var qtyData = a[index3].qty + prod.qty
                a[index3].qty = qtyData
            }

        }
    }

    for (let u = 0; u < productData.length; u++) {
        var pro = productData[u];

        var index4 = a.findIndex(function (data4) {
            return pro.name === data4.name
        })

        if (index4 >= 0) {
            var qtysumone = pro.qty - a[index4].qty
            productData[index4].qtyAll = qtysumone
        }
        // console.log(index4)
    }

    // console.log('A : ', a)
    // console.log(productData)

    var label = {
        customer: order.customer,
        productall: productData
    }
    // console.log(label)
    req.result = label;
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
};

exports.findMonitorByData = function (req, res, next) {
    var reportDay = req.body.reportDay;
    var maxDay = new Date().setDate(new Date().getDate() - reportDay);
    var minDay = new Date();

    var dataId = req.body.data_id;
    var status = req.body.status;

    if (status === "team") {
        Monitor.find({ "team.team_id": dataId, created: { $gte: maxDay, $lte: minDay } }, function (err, data) {
            if (err) {
                return res.status(400).send({
                    status: 400,
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                req.monitorsData = data;
                next();
            }
        });
    } else if (status === "member") {
        Monitor.find({ "orders.user_id": dataId, created: { $gte: maxDay, $lte: minDay } }, function (err, data) {
            if (err) {
                return res.status(400).send({
                    status: 400,
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                req.monitorsData = data;
                // console.log(data);
                next();
            }
        });
    } else {
        next();
    }
}

exports.solveTotalProduct = function (req, res, next) {
    var status = req.body.status;
    var monitorsData = req.monitorsData;
    var productData = [];
    for (let i = 0; i < monitorsData.length; i++) {
        var team = monitorsData[i];
        for (let j = 0; j < team.orders.length; j++) {
            var order = team.orders[j];
            for (let k = 0; k < order.items.length; k++) {
                var item = order.items[k];
                for (let m = 0; m < item.option.length; m++) {
                    var option = item.option[m];
                    for (let n = 0; n < option.value.length; n++) {
                        var value = option.value[n];

                        if (status === "team") {
                            var indxTeam = productData.findIndex(function (data1) {
                                return item.name.toString() === data1.name.toString()
                            })
                            if (indxTeam === -1) {
                                productData.push({ name: item.name, qty: value.qty, price: item.price });
                            }
                            if (indxTeam !== -1) {
                                var qtyData = productData[indxTeam].qty + value.qty
                                productData[indxTeam].qty = qtyData
                            }
                        } else {

                        }
                    }
                }
            }
        }
    }
    req.result = productData
    // console.log(req.result)
    next();
}

exports.findTeamByTypeId = function (req, res, next) {
    var reportDay = req.body.reportDay;
    var maxDay = new Date().setDate(new Date().getDate() - reportDay);
    var minDay = new Date();

    var dataId = req.body.data_id;
    var status = req.body.status;

    Monitor.find({ "orders.user_id": dataId, created: { $gte: maxDay, $lte: minDay } }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.teamUser = data;
            next();
        }
    });
};

exports.filterTypeId = function (req, res, next) {
    var teamUser = req.teamUser;
    var dataId = req.body.data_id;
    // console.log(teamUser)
    var ordersUser = []

    for (let i = 0; i < teamUser.length; i++) {
        var team = teamUser[i];
        for (let j = 0; j < team.orders.length; j++) {
            var order = team.orders[j];
            if (order.user_id === dataId) {
                ordersUser.push({ orderUser: order, created: team.created })
            }
        }
    }
    req.ordersUser = ordersUser;
    // console.log(req.ordersUser)
    next();
}

exports.findAndPushQty = function (req, res, next) {
    var ordersUser = req.ordersUser;
    // console.log(ordersUser)
    var dataName = []
    var dataQty = [0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < ordersUser.length; i++) {
        var orderUser = ordersUser[i];
        // console.log(orderUser.created)
        // console.log(i)
        for (let j = 0; j < orderUser.orderUser.items.length; j++) {
            var item = orderUser.orderUser.items[j];
            // console.log(item.name)
            for (let k = 0; k < item.option.length; k++) {
                var option = item.option[k];
                for (let m = 0; m < option.value.length; m++) {
                    var value = option.value[m];
                    // console.log(item.name)
                    // console.log(value)
                    var indxName = dataName.findIndex(function (data) {
                        return item.name === data.productname
                    });
                    if (indxName === -1) {
                        dataName.push({ productname: item.name })
                    }
                }
            }
        }
    }
    console.log(dataName)
    next();
}