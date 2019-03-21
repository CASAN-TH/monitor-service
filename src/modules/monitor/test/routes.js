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
            totalorderamount: 200,
            status: 'waitwithdrawal',
            team: {
                teamname: 'lovelove'
            },
            orders: [{
                customer: {
                    firstname: 'Nutshapon',
                    lastname: 'Lertlaosakun',
                    tel: '025337172',
                    address: {
                        houseno: "55/7",
                        village: "casa-city",
                        street: "lumlukka Road",
                        subdistrict: "บึงคำพร้อย",
                        district: "lumlukka",
                        province: "phathumthani",
                        zipcode: "12150"
                    }
                },
                items: [
                    {
                        name: 'ลิปติก',
                        option: [
                            {
                                name: 'สี',
                                value: [{
                                    name: '#01',
                                    qty: 2,
                                }],
                            }
                        ],
                        price: 100,
                        amount: 200
                    }
                ],
                totalamount: 200,
                paymenttype:
                {
                    name: "ปลายทาง"
                }
            }],
            logs: [{
                remark: "print Again"
            }]
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

    xit('This can respones only report', function (done) {
        var monitor1 = new Monitor({
            totalorderamount: 700,
            status: 'waitwithdrawal',
            team: {
                teamname: 'Love1'
            },
            orders: [{
                customer: {
                    firstname: 'nutnut',
                    lastname: 'lerlao',
                    tel: '025333333',
                    address: {
                        houseno: "68/78",
                        village: "casan",
                        street: "lumlukka test1",
                        subdistrict: "บึงคำพร้อย1",
                        district: "lumlukka test1",
                        province: "phathumthani test1",
                        zipcode: "12130"
                    }
                },
                items: [
                    {
                        name: 'ลิปติก',
                        option: [
                            {
                                name: 'สี',
                                value: [{
                                    name: '#01',
                                    qty: 3,
                                }],
                            }
                        ],
                        price: 100,
                        amount: 300
                    },
                    {
                        name: 'แป้งตลับ',
                        option: [
                            {
                                name: 'เบอร์',
                                value: [{
                                    name: '#02',
                                    qty: 4,
                                }],
                            }
                        ],
                        price: 100,
                        amount: 400
                    }
                ],
                totalamount: 700,
                paymenttype:
                {
                    name: "ปลายทาง"
                }
            },{
                customer: {
                    firstname: 'nutnut2',
                    lastname: 'lerlao2',
                    tel: '0255555555',
                    address: {
                        houseno: "55/986",
                        village: "casan",
                        street: "lumlukka test1",
                        subdistrict: "บึงคำพร้อย1",
                        district: "lumlukka test1",
                        province: "phathumthani test1",
                        zipcode: "12130"
                    }
                },
                items: [
                    {
                        name: 'ลิปติก',
                        option: [
                            {
                                name: 'สี',
                                value: [{
                                    name: '#01',
                                    qty: 4,
                                }],
                            }
                        ],
                        price: 100,
                        amount: 400
                    },
                    {
                        name: 'แป้งตลับ',
                        option: [
                            {
                                name: 'เบอร์',
                                value: [{
                                    name: '#02',
                                    qty: 8,
                                }],
                            }
                        ],
                        price: 100,
                        amount: 800
                    }
                ],
                totalamount: 1200,
                paymenttype:
                {
                    name: "ปลายทาง"
                }
            }],
            logs: [{
                remark: "print Again"
            }]
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
                            // console.log(resp)
                            done();
                            assert.equal(resp.data.teamname, mo1.team.teamname)
                            assert.equal(resp.data.reportall.items[0].name, mo1.orders[0].items[0].name)
                            assert.equal(resp.data.reportall.items[0].qty, 7)
                            assert.equal(resp.data.reportall.items[0].price, mo1.orders[0].items[0].price)
                            assert.equal(resp.data.reportall.totalprice, mo1.orders[0].totalamount)
                            assert.equal(resp.data.reportall.totalqty, 7)
                            assert.equal(resp.data.reportdetail[0].customer.firstname, 'nutnut')
                            assert.equal(resp.data.reportdetail[0].customer.lastname, 'lerlao')
                            assert.equal(resp.data.reportdetail[0].items[0].name, 'ลิปติก(สี)')
                            assert.equal(resp.data.reportdetail[0].items[0].value[0].name, mo1.orders[0].items[0].option[0].value[0].name)
                            assert.equal(resp.data.reportdetail[0].items[0].value[0].qty, mo1.orders[0].items[0].option[0].value[0].qty)
                        });
                })
            });

    })

    afterEach(function (done) {
        Monitor.remove().exec(done);
    });

});