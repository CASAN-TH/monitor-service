'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Monitor = mongoose.model('Monitor'),
    request = require('request'),
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

var pad = function (num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}

exports.generateMonitorNo1 = function (req, res, next) {
    if (req.body) {
        var newDate = new Date();
        req.newDate = newDate;
        var textDate = newDate.getFullYear().toString().substr(2, 2) + ((newDate.getMonth() + 1) < 10 ? '0' : '') + (newDate.getMonth() + 1).toString() + pad(newDate.getDate(), 2);
        var codeteam = req.body.team.codeteam
        req.body.prefix = codeteam + textDate
        next();
    } else {
        return res.status(400).send({
            status: 400,
            message: 'Order not found.'
        });
    }

};

exports.generateMonitorNo2 = function (req, res, next) {
    Monitor.find({ prefix: req.body.prefix }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // console.log(data)
            req.body.monitorno = req.body.prefix + pad(data.length + 1, 3);
            next();
        }
    });
}

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

exports.getTeamById = function (req, res, next, id) {
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).send({
    //         status: 400,
    //         message: 'Id is invalid'
    //     });
    // }
    Monitor.find({ "team.team_id": id }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // console.log(data)
            req.result = data
            next();
        }
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
            if (data.status === "complete") {
                // console.log(data.orders)
                mq.publish('HistoryBuy', 'orders', JSON.stringify(data.orders));
            }
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
                        productData[indxNameV2].productQty = value.qty;
                        // console.log(productData[indxNameV2]);
                    } else {
                        // console.log(value.name + ' ----push รอบ2')
                        var indxValueName = productData[indxNameV2].type.findIndex(function (dataValueName) {
                            return value.name === dataValueName.name
                        })
                        if (indxValueName === -1) {
                            productData[indxNameV2].type.push({ name: value.name, qty: value.qty });
                            totalQty += value.qty;
                            productData[indxNameV2].productQty += value.qty;
                        } else {
                            productData[indxNameV2].type[indxValueName].qty += value.qty;
                            totalQty += value.qty;
                            productData[indxNameV2].productQty += value.qty;
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
    // console.log(req.reportOrder.reportall.items)
    next();
}

exports.reportDetailData = function (req, res, next) {

    var reportOrder = req.reportOrder;
    var data = req.data;
    var reportDetail = []

    for (let i = 0; i < data.orders.length; i++) {
        var order = data.orders[i];
        var itemsData = [];
        var num = 0;
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
    for (let g = 0; g < reportDetail.length; g++) {
        var reportDe = reportDetail[g].items;
        var reportDeqtycus = reportDetail[g]
        reportDeqtycus.qtycus = 0;
        for (let r = 0; r < reportDe.length; r++) {
            var item = reportDe[r].value;
            for (let p = 0; p < item.length; p++) {
                var val = item[p];
                reportDeqtycus.qtycus += val.qty
            }
        }

    }

    var date = new Date();
    var dateday = date.getDate().toString() + '/' + date.getMonth().toString() + '/' + date.getFullYear();
    var time = pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2);
    // console.log(time)

    var datetime = {
        date: dateday,
        time: time
    }
    var userreq = req.user;
    var user = {
        firstname: userreq ? userreq.firstname : '',
        lastname: userreq ? userreq.lastname : ''
    }
    // console.log(user)
    if (reportOrder && reportDetail) {
        reportOrder.reportDetail = reportDetail;
        reportOrder.withdrawdate = datetime
        req.result = reportOrder
        // console.log(req.result)
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

    var sumqty = 0;
    for (let u = 0; u < productData.length; u++) {
        var pro = productData[u];

        var index4 = a.findIndex(function (data4) {
            return pro.name === data4.name
        })

        if (index4 >= 0) {
            var qtysumone = pro.qty - a[index4].qty
            productData[index4].qtyAll = qtysumone
        }
    }


    // console.log(sumqty)

    // console.log('A : ', a)
    // console.log(productData)

    for (let w = 0; w < productData.length; w++) {
        sumqty += productData[w].qty;

    }

    var label = {
        customer: order.customer,
        productall: productData,
        sumqty: sumqty
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
            req.order_id = id
            // console.log(req.data)
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
};

exports.solveTotalProduct = function (req, res, next) {
    var status = req.body.status;
    var monitorsData = req.monitorsData;
    var productData = [];
    var userDataId = req.body.data_id;
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
                        }
                        if (status === "member") {
                            if (userDataId === order.user_id) {
                                // console.log(item.name)
                                var indxMember = productData.findIndex(function (dataMember) {
                                    return item.name === dataMember.name;
                                });
                                if (indxMember === -1) {
                                    productData.push({ name: item.name, qty: value.qty, price: item.price });
                                }
                                if (indxMember !== -1) {
                                    var qtyData = productData[indxMember].qty + value.qty
                                    productData[indxMember].qty = qtyData
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    req.result = productData
    next();
};

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
    var reportDay = req.body.reportDay;
    var calcuDay = new Date().setDate(new Date().getDate() - reportDay);
    var maxDay = new Date(calcuDay).getDate()
    var currentDay = new Date().getDate();
    var teamsUser = req.teamUser;
    var dataId = req.body.data_id;
    // console.log(teamsUser)
    var ordersUser = [];

    for (let i = 0; i < teamsUser.length; i++) {
        var teamUser = teamsUser[i];
        var dateOnly = teamUser.created.getDate();
        // console.log(i)
        for (let j = 0; j < teamUser.orders.length; j++) {
            var order = teamUser.orders[j];
            // console.log(order.user_id)

            for (let k = 0; k < order.items.length; k++) {
                var item = order.items[k];
                // console.log(item.name)
                var indxOrdUser = ordersUser.findIndex(function (dataOrdUser) {
                    return item.name === dataOrdUser
                })
                if (indxOrdUser === -1) {
                    ordersUser.push({ name: item.name })
                }
                // console.log(ordersUser)
                for (let m = 0; m < item.option.length; m++) {
                    var option = item.option[m];
                    for (let n = 0; n < option.value.length; n++) {
                        var value = option.value[n];
                        if (order.user_id === dataId) {
                            var indxOrdUser2 = ordersUser.findIndex(function (dataOrdUser) {
                                return
                            })
                        }
                    }
                }
            }
        }
    }
    // var aaa = [0, 0, 0, 0, 0, 0, 0]
    // // console.log(dateTest)

    // for (let z = 0; z < dateTest.length; z++) {
    //     var max2Day = maxDay
    //     var dateSingle = dateTest[z];
    //     // console.log(dateSingle)
    //     // console.log('-----------')
    //     for (let p = 0; p < reportDay; p++) {
    //         max2Day += 1
    //         // console.log(max2Day)
    //         if (max2Day === dateSingle) {
    //             aaa[p] = 5
    //         }
    //     }
    // }
    // console.log(aaa)


    // if (order.user_id === dataId) {
    //     ordersUser.push({ orderUser: order, created: team.created })
    // }
    // req.ordersUser = ordersUser;
    // console.log(req.ordersUser)
    next();
};

exports.findAndPushQty = function (req, res, next) {
    // var ordersUser = req.ordersUser;
    // // console.log(ordersUser)
    // var dataName = []
    // var dataQty = [0, 0, 0, 0, 0, 0, 0];

    // for (let i = 0; i < ordersUser.length; i++) {
    //     var orderUser = ordersUser[i];
    //     // console.log(orderUser.created)
    //     // console.log(i)
    //     for (let j = 0; j < orderUser.orderUser.items.length; j++) {
    //         var item = orderUser.orderUser.items[j];
    //         // console.log(item.name)
    //         for (let k = 0; k < item.option.length; k++) {
    //             var option = item.option[k];
    //             for (let m = 0; m < option.value.length; m++) {
    //                 var value = option.value[m];
    //                 // console.log(item.name)
    //                 // console.log(value)
    //                 var indxName = dataName.findIndex(function (data) {
    //                     return item.name === data.productname
    //                 });
    //                 if (indxName === -1) {
    //                     dataName.push({ productname: item.name })
    //                 }
    //             }
    //         }
    //     }
    // }
    // console.log(dataName)
    next();
}

exports.reportjs = function (req, res) {
    var report = req.result;
    var data = {
        template: { 'shortid': 'H1xD10Pwu4' },
        data: report,
        options: {
            preview: true
        }
    }
    var options = {
        uri: 'http://13.250.98.127/api/report',
        method: 'POST',
        json: data
    }
    request(options).pipe(res);
}

exports.deleteBox = function (req, res, next) {
    var id = req.lableId;
    var rableById = req.rableById;
    // console.log(rableById.orders[0].labels)
    var dataSplice;

    for (let i = 0; i < rableById.orders.length; i++) {
        var order = rableById.orders[i];
        for (let j = 0; j < order.labels.length; j++) {
            var label = order.labels[j];

            if (label._id == id) {
                dataSplice = label;
                order.labels.splice(j, 1);

                for (let k = 0; k < dataSplice.productlist.length; k++) {
                    var spliceProdList = dataSplice.productlist[k];
                    // console.log('-------------')
                    // console.log(spliceProdList.name)

                    var indxProductList = order.labels[0].productlist.findIndex((el) => {
                        return el.name === spliceProdList.name
                    });
                    console.log(indxProductList)

                    if (indxProductList === -1) {
                        // console.log('Pushed!!!!')
                        order.labels[0].productlist.push(spliceProdList)
                    }
                    if (indxProductList !== -1) {
                        // console.log('Not Push!!!!')

                        for (let o = 0; o < order.labels[0].productlist[indxProductList].option.length; o++) {
                            var option = order.labels[0].productlist[indxProductList].option[o];
                            for (let p = 0; p < option.value.length; p++) {
                                var value = option.value[p];
                                console.log(value.name)

                                for (let l = 0; l < spliceProdList.option.length; l++) {
                                    var spliceOption = spliceProdList.option[l];
                                    for (let m = 0; m < spliceOption.value.length; m++) {
                                        var spliceValue = spliceOption.value[m];
                                        if (spliceValue.name === value.name) {
                                            console.log('--------------   ' + spliceValue.name)
                                            value.qty += spliceValue.qty
                                            console.log(value)
                                        }

                                    }
                                }
                            }
                        }
                    }
                }

                // console.log(rableById.orders[0].labels[0].productlist[0].option[0].value)
                rableById.save(function (err, data) {
                    if (err) {
                        return res.status(400).send({
                            status: 400,
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        req.result = data;
                        next();
                    };
                });
            }
        }
    }
    // console.log(rableById.orders[0])
}

exports.getlableById = function (req, res, next, id) {
    // console.log(id)
    Monitor.findOne({ "orders.labels._id": id }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.rableById = data
            req.lableId = id
            // console.log(req.rableById.orders[0])
            next();
        }
    });
}

exports.printByLable = function (req, res) {
    var id = req.lableId;
    var orders = req.rableById.orders;
    var reportByLable = {
        labels: []
    }
    for (let i = 0; i < orders.length; i++) {
        var order = orders[i];
        for (let j = 0; j < order.labels.length; j++) {
            var label = order.labels[j];
            if (label._id == id) {
                // console.log(label)
                // console.log(order.customer.tel)
                // console.log(order.paymenttype)
                var dataReport;
                dataReport = label;
                dataReport.customer.tel = order.customer.tel;
                dataReport.customer.paymenttype = order.paymenttype;
                reportByLable.labels.push(dataReport)
            }
        }
    }
    // console.log(reportByLable)

    var data = {
        template: { 'shortid': 'Syi8NVVKV' },
        data: reportByLable,
        options: {
            preview: true
        }
    }
    var options = {
        uri: 'http://13.250.98.127/api/report',
        method: 'POST',
        json: data
    }
    request(options).pipe(res);
}

exports.reportlable = function (req, res) {

    var report = req.order;

    for (let z = 0; z < report.labels.length; z++) {
        report.labels[z].customer.tel = report.customer.tel;
        report.labels[z].customer.paymenttype = report.paymenttype;
    }

    var reportorder = {
        labels: report.labels
    };

    var data = {
        template: { 'shortid': 'Syi8NVVKV' },
        data: reportorder,
        options: {
            preview: true
        }
    }
    var options = {
        uri: 'http://13.250.98.127/api/report',
        method: 'POST',
        json: data
    }
    request(options).pipe(res);
}

exports.reportlableAll = function (req, res) {

    // var report = req.order;
    var monitorData = req.data;
    // console.log(monitorData)
    var reportorder = {
        labels: []
    };
    for (let i = 0; i < monitorData.orders.length; i++) {
        var order = monitorData.orders[i];
        for (let z = 0; z < order.labels.length; z++) {
            order.labels[z].customer.tel = order.customer.tel;
            order.labels[z].customer.paymenttype = order.paymenttype;
            reportorder.labels.push(order.labels[z])
        }
    }

    var data = {
        template: { 'shortid': 'Syi8NVVKV' },
        data: reportorder,
        options: {
            preview: true
        }
    }
    var options = {
        uri: 'http://13.250.98.127/api/report',
        method: 'POST',
        json: data
    }
    request(options).pipe(res);
}

exports.addBox = function (req, res, next) {

    var bodylabels = req.body;
    for (let h = 0; h < req.order.labels[0].productlist.length; h++) {
        var order = req.order.labels[0].productlist[h];
        for (let k = 0; k < order.option.length; k++) {
            var option = order.option[k];
            for (let l = 0; l < option.value.length; l++) {
                var value = option.value[l];

                var dataupdate = bodylabels.productlist.filter(function (paramsproductlist) {
                    if (order.name.toString() === paramsproductlist.name.toString()) {
                        paramsproductlist.option.filter(function (paramsoption) {
                            paramsoption.value.filter(function (paramsvalue) {

                                if (paramsvalue.name.toString() === value.name.toString()) {
                                    value.qty = value.qty - paramsvalue.qty
                                }
                            })
                        })
                    }
                });
            }
        }
        const a = option.value.length
        for (let o = 0; o < a; o++) {
            var valueIndex = option.value.findIndex(function (paramsv) {
                return paramsv.qty === 0
            })
            if (valueIndex >= 0) {
                option.value.splice(valueIndex, 1)
            }
        }
        // console.log(option.value.length)
        // console.log('sss ',req.order.labels[0].productlist.length)


    }

    const z = req.order.labels[0].productlist.length;
    var data = []
    for (let f = 0; f < z; f++) {
        console.log('object')
        // console.log(req.order.labels[0].productlist[f])
        var productlistloop = req.order.labels[0].productlist[f];
        // console.log(productlistloop.option[0].value.length)
        // console.log(productlistloop.option[0])
        if (productlistloop.option[0].value.length === 0) {
         data.push({ch:productlistloop._id})
            
        }
        
    }
    console.log(data)

    if (data !== []) {
        for (let index = 0; index < data.length; index++) {
            var j =  req.order.labels[0].productlist.findIndex(function (params) {
                // console.log('xxxxxxxxx',params._id)
                // console.log('zzzzzzzzz',data[index].ch)
                return params._id == data[index].ch
            })
            console.log('xxx',j)
            req.order.labels[0].productlist.splice(j,1)
        }
    }
    console.log(req.order.labels[0].productlist)
  
    var order = req.order;
    req.updateorder = order;
    next()
}

exports.updateData = function (req, res) {
    var updateOr = req.updateorder;
    var id = req.order_id;
    var bigdata = req.data;

    var a;
    var cookiedata;
    bigdata.forEach(element => {
        a = element.orders.findIndex(function (params) {
            cookiedata = {
                address: params.customer.address,
                customer: {
                    firstname: params.customer.firstname,
                    lastname: params.customer.lastname
                },
                productlist: req.body.productlist
            }

            return params._id.toString() === id.toString()

        })
        element.orders[a] = updateOr;
        element.orders[a].labels.push(cookiedata)
    });

    // console.log(bigdata[0].orders[0].labels[0].productlist)

    Monitor.findOneAndUpdate({ "orders._id": id }, bigdata[0], { new: true }, function (err, dataupdat) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: dataupdat
            })
        }
    });
}