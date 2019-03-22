'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Monitor = mongoose.model('Monitor');

var credentials,
    token,
    mockup;

describe('Monitor CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            "status": "waitwithdrawal",
            "team": {
                "team_id": "5c9301aec22eca001938db0b",
                "teamname": "Lovelove"
            },
            "orders": [
                {
                    "customer": {
                        "address": {
                            "houseno": "55/7",
                            "village": "casa-city",
                            "street": "lumlukka Road",
                            "subdistrict": "บึงคำพร้อย",
                            "district": "lumlukka",
                            "province": "phathumthani",
                            "zipcode": "12150"
                        },
                        "firstname": "nutshapon",
                        "lastname": "lertlao",
                        "tel": "0995689456"
                    },

                    "items": [
                        {

                            "option": [
                                {

                                    "value": [
                                        {

                                            "name": "RL01",
                                            "qty": 10
                                        },
                                        {

                                            "name": "RL02",
                                            "qty": 20
                                        }
                                    ],
                                    "name": "สีลิปสติก"
                                }
                            ],
                            "name": "perfect lip",
                            "price": 69,
                            "amount": 2070
                        },
                        {

                            "option": [
                                {

                                    "value": [
                                        {

                                            "name": "SK01",
                                            "qty": 12
                                        },
                                        {

                                            "name": "SK02",
                                            "qty": 22
                                        }
                                    ],
                                    "name": "สีแป้งตลับ"
                                }
                            ],
                            "name": "Powder",
                            "price": 170,
                            "amount": 5780
                        }
                    ],
                    "totalamount": 7850,
                    "user_id": "5c930138398ab6001962a53b",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "lables": []
                },
                {
                    "customer": {
                        "address": {
                            "houseno": "55/7 test",
                            "village": "casa-city test",
                            "street": "lumlukka Road test",
                            "subdistrict": "บึงคำพร้อย test",
                            "district": "lumlukka test",
                            "province": "phathumthani test",
                            "zipcode": "12150 test"
                        },
                        "firstname": "nnn",
                        "lastname": "lll",
                        "tel": "4456789789"
                    },

                    "items": [
                        {

                            "option": [
                                {

                                    "value": [
                                        {

                                            "name": "RL02",
                                            "qty": 33
                                        },
                                        {

                                            "name": "RL03",
                                            "qty": 66
                                        }
                                    ],
                                    "name": "สีลิปสติก"
                                }
                            ],
                            "name": "perfect lip",
                            "price": 69,
                            "amount": 6831
                        },
                        {

                            "option": [
                                {

                                    "value": [
                                        {

                                            "name": "SK02",
                                            "qty": 56
                                        },
                                        {

                                            "name": "SK03",
                                            "qty": 56
                                        }
                                    ],
                                    "name": "สีแป้งตลับ"
                                }
                            ],
                            "name": "Powder",
                            "price": 170,
                            "amount": 19040
                        }
                    ],
                    "totalamount": 25871,
                    "user_id": "5c930138398ab6001962a53b",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 33721,
            "logs": []
        };

        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Monitor get use token', (done) => {
        request(app)
            .get('/api/monitors')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Monitor get by id', function (done) {

        request(app)
            .post('/api/monitors')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/monitors/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.totalorderamount, mockup.totalorderamount);
                        assert.equal(resp.data.status, mockup.status);
                        assert.equal(resp.data.team.teamname, mockup.team.teamname);
                        assert.equal(resp.data.orders[0].customer.firstname, mockup.orders[0].customer.firstname);
                        assert.equal(resp.data.orders[0].customer.lastname, mockup.orders[0].customer.lastname);
                        assert.equal(resp.data.orders[0].customer.tel, mockup.orders[0].customer.tel);
                        assert.equal(resp.data.orders[0].customer.address.houseno, mockup.orders[0].customer.address.houseno);
                        assert.equal(resp.data.orders[0].customer.address.village, mockup.orders[0].customer.address.village);
                        assert.equal(resp.data.orders[0].customer.address.street, mockup.orders[0].customer.address.street);
                        assert.equal(resp.data.orders[0].customer.address.subdistrict, mockup.orders[0].customer.address.subdistrict);
                        assert.equal(resp.data.orders[0].customer.address.district, mockup.orders[0].customer.address.district);
                        assert.equal(resp.data.orders[0].customer.address.province, mockup.orders[0].customer.address.province);
                        assert.equal(resp.data.orders[0].customer.address.zipcode, mockup.orders[0].customer.address.zipcode);
                        assert.equal(resp.data.orders[0].items[0].name, mockup.orders[0].items[0].name);
                        assert.equal(resp.data.orders[0].items[0].option[0].name, mockup.orders[0].items[0].option[0].name);
                        assert.equal(resp.data.orders[0].items[0].option[0].value[0].name, mockup.orders[0].items[0].option[0].value[0].name);
                        assert.equal(resp.data.orders[0].items[0].option[0].value[0].qty, mockup.orders[0].items[0].option[0].value[0].qty);
                        assert.equal(resp.data.orders[0].items[0].price, mockup.orders[0].items[0].price);
                        assert.equal(resp.data.orders[0].items[0].amount, mockup.orders[0].items[0].amount);
                        assert.equal(resp.data.orders[0].totalamount, mockup.orders[0].totalamount);
                        assert.equal(resp.data.logs.remark, mockup.logs.remark);
                        done();
                    });
            });

    });

    it('should be Monitor post use token', (done) => {
        request(app)
            .post('/api/monitors')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 200);
                assert.equal(resp.data.totalorderamount, mockup.totalorderamount);
                assert.equal(resp.data.status, mockup.status);
                assert.equal(resp.data.team.teamname, mockup.team.teamname);
                assert.equal(resp.data.orders[0].customer.firstname, mockup.orders[0].customer.firstname);
                assert.equal(resp.data.orders[0].customer.lastname, mockup.orders[0].customer.lastname);
                assert.equal(resp.data.orders[0].customer.tel, mockup.orders[0].customer.tel);
                assert.equal(resp.data.orders[0].customer.address.houseno, mockup.orders[0].customer.address.houseno);
                assert.equal(resp.data.orders[0].customer.address.village, mockup.orders[0].customer.address.village);
                assert.equal(resp.data.orders[0].customer.address.street, mockup.orders[0].customer.address.street);
                assert.equal(resp.data.orders[0].customer.address.subdistrict, mockup.orders[0].customer.address.subdistrict);
                assert.equal(resp.data.orders[0].customer.address.district, mockup.orders[0].customer.address.district);
                assert.equal(resp.data.orders[0].customer.address.province, mockup.orders[0].customer.address.province);
                assert.equal(resp.data.orders[0].customer.address.zipcode, mockup.orders[0].customer.address.zipcode);
                assert.equal(resp.data.orders[0].items[0].name, mockup.orders[0].items[0].name);
                assert.equal(resp.data.orders[0].items[0].option[0].name, mockup.orders[0].items[0].option[0].name);
                assert.equal(resp.data.orders[0].items[0].option[0].value[0].name, mockup.orders[0].items[0].option[0].value[0].name);
                assert.equal(resp.data.orders[0].items[0].option[0].value[0].qty, mockup.orders[0].items[0].option[0].value[0].qty);
                assert.equal(resp.data.orders[0].items[0].price, mockup.orders[0].items[0].price);
                assert.equal(resp.data.orders[0].items[0].amount, mockup.orders[0].items[0].amount);
                assert.equal(resp.data.orders[0].totalamount, mockup.orders[0].totalamount);
                assert.equal(resp.data.logs.remark, mockup.logs.remark);
                done();
            });
    });

    it('should be monitor put use token', function (done) {

        request(app)
            .post('/api/monitors')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    totalorderamount: 250
                }
                request(app)
                    .put('/api/monitors/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.totalorderamount, update.totalorderamount);
                        assert.equal(resp.data.status, mockup.status);
                        assert.equal(resp.data.team.teamname, mockup.team.teamname);
                        assert.equal(resp.data.orders[0].customer.firstname, mockup.orders[0].customer.firstname);
                        assert.equal(resp.data.orders[0].customer.lastname, mockup.orders[0].customer.lastname);
                        assert.equal(resp.data.orders[0].customer.tel, mockup.orders[0].customer.tel);
                        assert.equal(resp.data.orders[0].customer.address.houseno, mockup.orders[0].customer.address.houseno);
                        assert.equal(resp.data.orders[0].customer.address.village, mockup.orders[0].customer.address.village);
                        assert.equal(resp.data.orders[0].customer.address.street, mockup.orders[0].customer.address.street);
                        assert.equal(resp.data.orders[0].customer.address.subdistrict, mockup.orders[0].customer.address.subdistrict);
                        assert.equal(resp.data.orders[0].customer.address.district, mockup.orders[0].customer.address.district);
                        assert.equal(resp.data.orders[0].customer.address.province, mockup.orders[0].customer.address.province);
                        assert.equal(resp.data.orders[0].customer.address.zipcode, mockup.orders[0].customer.address.zipcode);
                        assert.equal(resp.data.orders[0].items[0].name, mockup.orders[0].items[0].name);
                        assert.equal(resp.data.orders[0].items[0].option[0].name, mockup.orders[0].items[0].option[0].name);
                        assert.equal(resp.data.orders[0].items[0].option[0].value[0].name, mockup.orders[0].items[0].option[0].value[0].name);
                        assert.equal(resp.data.orders[0].items[0].option[0].value[0].qty, mockup.orders[0].items[0].option[0].value[0].qty);
                        assert.equal(resp.data.orders[0].items[0].price, mockup.orders[0].items[0].price);
                        assert.equal(resp.data.orders[0].items[0].amount, mockup.orders[0].items[0].amount);
                        assert.equal(resp.data.orders[0].totalamount, mockup.orders[0].totalamount);
                        assert.equal(resp.data.logs.remark, mockup.logs.remark);
                        done();
                    });
            });

    });

    it('should be monitor delete use token', function (done) {

        request(app)
            .post('/api/monitors')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/monitors/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be monitor get not use token', (done) => {
        request(app)
            .get('/api/monitors')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be monitor post not use token', function (done) {

        request(app)
            .post('/api/monitors')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be monitor put not use token', function (done) {

        request(app)
            .post('/api/monitors')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    totalorderamount: 250
                }
                request(app)
                    .put('/api/monitors/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be monitor delete not use token', function (done) {

        request(app)
            .post('/api/monitors')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/monitors/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('This can respones only report', function (done) {
        var monitor1 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "5c9301aec22eca001938db0b",
                "teamname": "nutnutLovelove"
            },
            "orders": [
                {
                    "customer": {
                        "address": {
                            "houseno": "55/7",
                            "village": "casa-city",
                            "street": "lumlukka Road",
                            "subdistrict": "บึงคำพร้อย",
                            "district": "lumlukka",
                            "province": "phathumthani",
                            "zipcode": "12150"
                        },
                        "firstname": "nutshapon",
                        "lastname": "lertlao",
                        "tel": "0995689456"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL01",
                                            "qty": 10
                                        },
                                        {
                                            "name": "RL02",
                                            "qty": 20
                                        }
                                    ],
                                    "name": "สี"
                                }
                            ],
                            "name": "ลิปติก",
                            "price": 69,
                            "amount": 2070
                        },
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "SK01",
                                            "qty": 12
                                        },
                                        {
                                            "name": "SK02",
                                            "qty": 22
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "แป้งตลับ",
                            "price": 170,
                            "amount": 5780
                        }
                    ],
                    "totalamount": 7850,
                    "user_id": "5c930138398ab6001962a53b",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "lables": []
                },
                {
                    "customer": {
                        "address": {
                            "houseno": "55/7 test",
                            "village": "casa-city test",
                            "street": "lumlukka Road test",
                            "subdistrict": "บึงคำพร้อย test",
                            "district": "lumlukka test",
                            "province": "phathumthani test",
                            "zipcode": "12150 test"
                        },
                        "firstname": "nnn",
                        "lastname": "lll",
                        "tel": "4456789789"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL02",
                                            "qty": 33
                                        },
                                        {
                                            "name": "RL03",
                                            "qty": 66
                                        }
                                    ],
                                    "name": "สี"
                                }
                            ],
                            "name": "ลิปติก",
                            "price": 69,
                            "amount": 6831
                        },
                        {

                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "SK02",
                                            "qty": 56
                                        },
                                        {
                                            "name": "SK03",
                                            "qty": 56
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 19040
                        }
                    ],
                    "totalamount": 25871,
                    "user_id": "5c930138398ab6001962a53b",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 33721,
            "logs": []
        })
        request(app)
            .post('/api/monitors')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                monitor1.save(function (err, mo1) {
                    request(app)
                        .get('/api/monitor/report/' + mo1._id)
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }
                            var resp = res.body;
                            // console.log(mo1)
                            // console.log(resp.data)
                            assert.equal(resp.data.teamname, mo1.team.teamname)
                            assert.equal(resp.data.reportall.items[0].name, mo1.orders[0].items[0].name)
                            assert.equal(resp.data.reportall.items[1].name, mo1.orders[0].items[1].name)
                            assert.equal(resp.data.reportall.items[2].name, mo1.orders[1].items[1].name)
                            assert.equal(resp.data.reportall.items[0].qty, 
                                mo1.orders[0].items[0].option[0].value[0].qty + mo1.orders[0].items[0].option[0].value[1].qty +
                                mo1.orders[1].items[0].option[0].value[0].qty + mo1.orders[1].items[0].option[0].value[1].qty)
                            assert.equal(resp.data.reportall.items[1].qty, 
                                mo1.orders[0].items[1].option[0].value[0].qty + mo1.orders[0].items[1].option[0].value[1].qty)
                            assert.equal(resp.data.reportall.items[2].qty, 
                                mo1.orders[1].items[1].option[0].value[0].qty + mo1.orders[1].items[1].option[0].value[1].qty)
                            assert.equal(resp.data.reportall.items[0].price, mo1.orders[0].items[0].price)
                            assert.equal(resp.data.reportall.items[1].price, mo1.orders[0].items[1].price)
                            assert.equal(resp.data.reportall.items[2].price, mo1.orders[1].items[1].price)
                            assert.equal(resp.data.reportall.totalprice, mo1.totalorderamount)
                            assert.equal(resp.data.reportall.totalqty,
                                mo1.orders[0].items[0].option[0].value[0].qty + mo1.orders[0].items[0].option[0].value[1].qty +
                                mo1.orders[0].items[1].option[0].value[0].qty + mo1.orders[0].items[1].option[0].value[1].qty +
                                mo1.orders[1].items[0].option[0].value[0].qty + mo1.orders[1].items[0].option[0].value[1].qty +
                                mo1.orders[1].items[1].option[0].value[0].qty + mo1.orders[1].items[1].option[0].value[1].qty)
                            assert.equal(resp.data.reportDetail.length, 2)
                            assert.equal(resp.data.reportDetail[0].customer.firstname, mo1.orders[0].customer.firstname)
                            assert.equal(resp.data.reportDetail[0].customer.lastname, mo1.orders[0].customer.lastname)
                            assert.equal(resp.data.reportDetail[0].items[0].name, 'ลิปติก(สี)')
                            assert.equal(resp.data.reportDetail[0].items[0].value[0].name, mo1.orders[0].items[0].option[0].value[0].name)
                            assert.equal(resp.data.reportDetail[0].items[0].value[0].qty, mo1.orders[0].items[0].option[0].value[0].qty)
                            assert.equal(resp.data.reportDetail[0].items[1].name, 'แป้งตลับ(เบอร์)')
                            assert.equal(resp.data.reportDetail[0].items[1].value[0].name, mo1.orders[0].items[1].option[0].value[0].name)
                            assert.equal(resp.data.reportDetail[0].items[1].value[0].qty, mo1.orders[0].items[1].option[0].value[0].qty)
                            assert.equal(resp.data.reportDetail[1].customer.firstname, mo1.orders[1].customer.firstname)
                            assert.equal(resp.data.reportDetail[1].customer.lastname, mo1.orders[1].customer.lastname)
                            assert.equal(resp.data.reportDetail[1].items[0].name, 'ลิปติก(สี)')
                            assert.equal(resp.data.reportDetail[1].items[0].value[0].name, mo1.orders[1].items[0].option[0].value[0].name)
                            assert.equal(resp.data.reportDetail[1].items[0].value[0].qty, mo1.orders[1].items[0].option[0].value[0].qty)
                            assert.equal(resp.data.reportDetail[1].items[1].name, 'ปัดขนตา(เบอร์)')
                            assert.equal(resp.data.reportDetail[1].items[1].value[0].name, mo1.orders[1].items[1].option[0].value[0].name)
                            assert.equal(resp.data.reportDetail[1].items[1].value[0].qty, mo1.orders[1].items[1].option[0].value[0].qty)
                            done();
                        });
                })
            });

    })

    it('should be Monitor get by id', function (done) {

        request(app)
            .post('/api/monitors')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                // console.log(resp.data.orders[0]._id)
                // console.log(resp.data.orders[1]._id)
                request(app)
                    .get('/api/monitor/labels/' + resp.data.orders[0]._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        done();
                    });
            });

    });

    afterEach(function (done) {
        Monitor.remove().exec(done);
    });

});