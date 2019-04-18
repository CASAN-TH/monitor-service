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
                "teamname": "Lovelove",
                "codeteam": "LVD"
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
                    "labels": [
                        {
                            "address": {
                                "houseno": "5/16",
                                "village": "",
                                "street": "",
                                "subdistrict": "สมเด็จเจริญ",
                                "district": "หนองปรือ",
                                "province": "กาญจนบุรี",
                                "zipcode": "71220"
                            },
                            "trackno": "1111",
                            "customer": {
                                "firstname": "ณัฐพล",
                                "lastname": "ใจดี"
                            },
                            "productlist": [
                                {
                                    "option": [
                                        {
                                            "value": [
                                                {
                                                    "name": "RL01",
                                                    "qty": 13
                                                },
                                                {
                                                    "name": "RL02",
                                                    "qty": 10
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
                                                    "name": "R2L01",
                                                    "qty": 16
                                                },
                                                {
                                                    "name": "R2L02",
                                                    "qty": 105
                                                }
                                            ],
                                            "name": "สีลิปสติก"
                                        }
                                    ],
                                    "name": "perfect lip2",
                                    "price": 69,
                                    "amount": 2070
                                }
                            ]
                        },
                        {
                            "address": {
                                "houseno": "5/16",
                                "village": "",
                                "street": "",
                                "subdistrict": "สมเด็จเจริญ",
                                "district": "หนองปรือ",
                                "province": "กาญจนบุรี",
                                "zipcode": "71220"
                            },
                            "trackno": "2222",
                            "customer": {
                                "firstname": "ณัฐพล",
                                "lastname": "ใจดี"
                            },
                            "productlist": [
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
                                    "name": "perfect lip3",
                                    "price": 69,
                                    "amount": 2070
                                },
                                {

                                    "option": [
                                        {
                                            "value": [
                                                {
                                                    "name": "RL01",
                                                    "qty": 20
                                                },
                                                {
                                                    "name": "RL02",
                                                    "qty": 40
                                                }
                                            ],
                                            "name": "สีลิปสติก"
                                        }
                                    ],
                                    "name": "perfect lip",
                                    "price": 69,
                                    "amount": 2070
                                }
                            ]
                        }
                    ]
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
                    "labels": [{
                        "address": {
                            "houseno": "5/16",
                            "village": "",
                            "street": "",
                            "subdistrict": "สมเด็จเจริญ",
                            "district": "หนองปรือ",
                            "province": "กาญจนบุรี",
                            "zipcode": "71220"
                        },
                        "trackno": "3333",
                        "customer": {
                            "firstname": "ณัฐพล",
                            "lastname": "ใจดี"
                        },
                        "productlist": [
                            {
                                "option": [
                                    {
                                        "value": [
                                            {
                                                "name": "RL01",
                                                "qty": 12
                                            },
                                            {
                                                "name": "RL02",
                                                "qty": 22
                                            }
                                        ],
                                        "name": "สีลิปสติก"
                                    }
                                ],
                                "name": "perfect lip 1 order2",
                                "price": 69,
                                "amount": 2070
                            }
                        ]
                    },
                    {
                        "address": {
                            "houseno": "5/16",
                            "village": "",
                            "street": "",
                            "subdistrict": "สมเด็จเจริญ",
                            "district": "หนองปรือ",
                            "province": "กาญจนบุรี",
                            "zipcode": "71220"
                        },
                        "trackno": "4444",
                        "customer": {
                            "firstname": "ณัฐพล",
                            "lastname": "ใจดี"
                        },
                        "productlist": [
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
                                "name": "perfect lip 2 order2",
                                "price": 69,
                                "amount": 2070
                            }
                        ]
                    }]
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

    xit('should be print All', (done) => {
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
                    .get('/api/monitor/reportlableall/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        // var resp = res.body
                        // assert.equal(resp.data.labels[0].trackno, mockup.orders[0].labels[0].trackno)
                        // assert.equal(resp.data.labels[1].trackno, mockup.orders[0].labels[1].trackno)
                        // assert.equal(resp.data.labels[2].trackno, mockup.orders[1].labels[0].trackno)
                        // assert.equal(resp.data.labels[3].trackno, mockup.orders[1].labels[1].trackno)
                        done();
                    })
            })
    });

    xit('should be print by label', (done) => {
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
                // console.log(resp.data.orders[0].labels[0]._id)
                request(app)
                    .get('/api/monitor/reportbylable/' + resp.data.orders[0].labels[0]._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        // var resp = res.body
                        done();
                    })
            })
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
                // assert.equal(resp.data.monitorno,"LVD190408001")
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

    it('should be monitor put use token #2', function (done) {

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
                    status: 'waitpack'
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
                        assert.equal(resp.data.status, "waitpack");

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

    it('should be get Data by Team_id', function (done) {

        var monitor1 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team001",
                "teamname": "nutnutLovelove1",
                "codeteam": "NLV1"
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
                    "user_id": "user001",
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
                    "user_id": "user002",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 33721,
            "logs": [],
            "created": new Date().setDate(new Date().getDate())
        });
        var monitor2 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team002",
                "teamname": "lelouLa",
                "codeteam": "LEL"
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
                        "firstname": "natsu",
                        "lastname": "tsutsu",
                        "tel": "990897895"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL01",
                                            "qty": 45
                                        },
                                        {
                                            "name": "RL02",
                                            "qty": 55
                                        }
                                    ],
                                    "name": "สี"
                                }
                            ],
                            "name": "ลิปติก",
                            "price": 69,
                            "amount": 6900
                        },
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "SK01",
                                            "qty": 22
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
                            "amount": 7480
                        }
                    ],
                    "totalamount": 14380,
                    "user_id": "user003",
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
                        "firstname": "lala",
                        "lastname": "loulou",
                        "tel": "5569866986"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL02",
                                            "qty": 38
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
                            "amount": 7176
                        }
                    ],
                    "totalamount": 7176,
                    "user_id": "user004",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 21556,
            "logs": [],
            "created": new Date().setDate(new Date().getDate() - 6)
        });
        monitor1.save(function (err, mo1) {
            monitor2.save(function (err, mo2) {
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
                        // console.log(resp)
                        request(app)
                            .get('/api/monitor/team/' + resp.data.team.team_id)
                            .set('Authorization', 'Bearer ' + token)
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err);
                                }
                                var resTeam = res.body;
                                assert.equal(resTeam.status, 200);
                                assert.equal(resTeam.data[0].totalorderamount, mockup.totalorderamount);
                                assert.equal(resTeam.data[0].status, mockup.status);
                                assert.equal(resTeam.data[0].team.teamname, mockup.team.teamname);
                                assert.equal(resTeam.data[0].orders[0].customer.firstname, mockup.orders[0].customer.firstname);
                                assert.equal(resTeam.data[0].orders[0].customer.lastname, mockup.orders[0].customer.lastname);
                                assert.equal(resTeam.data[0].orders[0].customer.tel, mockup.orders[0].customer.tel);
                                assert.equal(resTeam.data[0].orders[0].customer.address.houseno, mockup.orders[0].customer.address.houseno);
                                assert.equal(resTeam.data[0].orders[0].customer.address.village, mockup.orders[0].customer.address.village);
                                assert.equal(resTeam.data[0].orders[0].customer.address.street, mockup.orders[0].customer.address.street);
                                assert.equal(resTeam.data[0].orders[0].customer.address.subdistrict, mockup.orders[0].customer.address.subdistrict);
                                assert.equal(resTeam.data[0].orders[0].customer.address.district, mockup.orders[0].customer.address.district);
                                assert.equal(resTeam.data[0].orders[0].customer.address.province, mockup.orders[0].customer.address.province);
                                assert.equal(resTeam.data[0].orders[0].customer.address.zipcode, mockup.orders[0].customer.address.zipcode);
                                assert.equal(resTeam.data[0].orders[0].items[0].name, mockup.orders[0].items[0].name);
                                assert.equal(resTeam.data[0].orders[0].items[0].option[0].name, mockup.orders[0].items[0].option[0].name);
                                assert.equal(resTeam.data[0].orders[0].items[0].option[0].value[0].name, mockup.orders[0].items[0].option[0].value[0].name);
                                assert.equal(resTeam.data[0].orders[0].items[0].option[0].value[0].qty, mockup.orders[0].items[0].option[0].value[0].qty);
                                assert.equal(resTeam.data[0].orders[0].items[0].price, mockup.orders[0].items[0].price);
                                assert.equal(resTeam.data[0].orders[0].items[0].amount, mockup.orders[0].items[0].amount);
                                assert.equal(resTeam.data[0].orders[0].totalamount, mockup.orders[0].totalamount);
                                assert.equal(resTeam.data[0].logs.remark, mockup.logs.remark);
                                done();
                            });
                    });
            });
        });
    });

    it('This can respones only report', function (done) {
        var monitor1 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "5c9301aec22eca001938db0b",
                "teamname": "nutnutLovelove",
                "codeteam": "NLV"
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
                                            "name": "SK01",
                                            "qty": 56
                                        },
                                        {
                                            "name": "SK03",
                                            "qty": 44
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 17000
                        }
                    ],
                    "totalamount": 23831,
                    "user_id": "5c930138398ab6001962a53b",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 31681,
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
                            // console.log(resp.data.reportall.items)
                            assert.equal(resp.data.teamname, mo1.team.teamname)
                            assert.equal(resp.data.reportall.items[0].name, mo1.orders[0].items[0].name)
                            assert.equal(resp.data.reportall.items[1].name, mo1.orders[0].items[1].name)
                            assert.equal(resp.data.reportall.items[2].name, mo1.orders[1].items[1].name)
                            assert.equal(resp.data.reportall.items[0].type[0].name, mo1.orders[0].items[0].option[0].value[0].name)
                            assert.equal(resp.data.reportall.items[0].type[0].qty, mo1.orders[0].items[0].option[0].value[0].qty)
                            assert.equal(resp.data.reportall.items[0].type[1].name, mo1.orders[0].items[0].option[0].value[1].name)
                            assert.equal(resp.data.reportall.items[0].type[1].qty,
                                mo1.orders[0].items[0].option[0].value[1].qty + mo1.orders[1].items[0].option[0].value[0].qty)
                            assert.equal(resp.data.reportall.items[0].type[2].name, mo1.orders[1].items[0].option[0].value[1].name)
                            assert.equal(resp.data.reportall.items[0].type[2].qty, mo1.orders[1].items[0].option[0].value[1].qty)
                            assert.equal(resp.data.reportall.items[1].type[0].name, mo1.orders[0].items[1].option[0].value[0].name)
                            assert.equal(resp.data.reportall.items[1].type[0].qty, mo1.orders[0].items[1].option[0].value[0].qty)
                            assert.equal(resp.data.reportall.items[1].type[1].name, mo1.orders[0].items[1].option[0].value[1].name)
                            assert.equal(resp.data.reportall.items[1].type[1].qty, mo1.orders[0].items[1].option[0].value[1].qty)
                            assert.equal(resp.data.reportall.items[2].type[0].name, mo1.orders[1].items[1].option[0].value[0].name)
                            assert.equal(resp.data.reportall.items[2].type[0].qty, mo1.orders[1].items[1].option[0].value[0].qty)
                            assert.equal(resp.data.reportall.items[2].type[1].name, mo1.orders[1].items[1].option[0].value[1].name)
                            assert.equal(resp.data.reportall.items[2].type[1].qty, mo1.orders[1].items[1].option[0].value[1].qty)
                            assert.equal(resp.data.reportall.items[0].price, mo1.orders[0].items[0].price)
                            assert.equal(resp.data.reportall.items[0].productQty,
                                resp.data.reportall.items[0].type[0].qty + resp.data.reportall.items[0].type[1].qty +
                                resp.data.reportall.items[0].type[2].qty)
                            assert.equal(resp.data.reportall.items[1].price, mo1.orders[0].items[1].price)
                            assert.equal(resp.data.reportall.items[1].productQty,
                                resp.data.reportall.items[1].type[0].qty + resp.data.reportall.items[1].type[1].qty)
                            assert.equal(resp.data.reportall.items[2].price, mo1.orders[1].items[1].price)
                            assert.equal(resp.data.reportall.items[2].productQty,
                                resp.data.reportall.items[2].type[0].qty + resp.data.reportall.items[2].type[1].qty)
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

    it('Should delete Box by Label_Id', function (done) {
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
                // console.log(resp.data.orders[0].labels)
                request(app)
                    .delete('/api/monitor/deletebox/' + resp.data.orders[0].labels[1]._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // console.log(resp.data.orders[0].labels[0].productlist[0].option[0].value);
                        done();
                    });
            });
    });

    it('Should be get Graph product by team_id', function (done) {
        var monitor1 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team001",
                "teamname": "nutnutLovelove",
                "codeteam": "NLV"
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
                    "user_id": "user001",
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
                    "user_id": "user002",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 33721,
            "logs": [],
            "created": new Date().setDate(new Date().getDate())
        });
        var monitor2 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team002",
                "teamname": "lelouLa",
                "codeteam": "LEL"
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
                        "firstname": "natsu",
                        "lastname": "tsutsu",
                        "tel": "990897895"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL01",
                                            "qty": 45
                                        },
                                        {
                                            "name": "RL02",
                                            "qty": 55
                                        }
                                    ],
                                    "name": "สี"
                                }
                            ],
                            "name": "ลิปติก",
                            "price": 69,
                            "amount": 6900
                        },
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "SK01",
                                            "qty": 22
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
                            "amount": 7480
                        }
                    ],
                    "totalamount": 14380,
                    "user_id": "user003",
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
                        "firstname": "lala",
                        "lastname": "loulou",
                        "tel": "5569866986"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL02",
                                            "qty": 38
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
                            "amount": 7176
                        }
                    ],
                    "totalamount": 7176,
                    "user_id": "user004",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 21556,
            "logs": [],
            "created": new Date().setDate(new Date().getDate() - 6)
        });
        var monitor3 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team003",
                "teamname": "love 03",
                "codeteam": "LV3"
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
                        "firstname": "lovelove",
                        "lastname": "luvluv",
                        "tel": "23699886589"
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
                                            "qty": 5
                                        },
                                        {
                                            "name": "SK02",
                                            "qty": 8
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 2210
                        }
                    ],
                    "totalamount": 4280,
                    "user_id": "user005",
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
                                            "name": "SK02",
                                            "qty": 20
                                        },
                                        {
                                            "name": "SK03",
                                            "qty": 30
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 8500
                        }
                    ],
                    "totalamount": 8500,
                    "user_id": "user006",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 12780,
            "logs": [],
            "created": new Date().setDate(new Date().getDate() + 3)
        });
        var monitor4 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team001",
                "teamname": "nutnutLovelove",
                "codeteam": "NLV"
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
                        "firstname": "tofutoru",
                        "lastname": "fufu",
                        "tel": "77998653215"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "SK01",
                                            "qty": 33
                                        },
                                        {
                                            "name": "SK02",
                                            "qty": 36
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 11730
                        }
                    ],
                    "totalamount": 11730,
                    "user_id": "user007",
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
                        "firstname": "nana",
                        "lastname": "lala",
                        "tel": "889966369863"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL02",
                                            "qty": 40
                                        },
                                        {
                                            "name": "RL03",
                                            "qty": 99
                                        }
                                    ],
                                    "name": "สี"
                                }
                            ],
                            "name": "ลิปติก",
                            "price": 69,
                            "amount": 9591
                        },
                        {

                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "SK02",
                                            "qty": 60
                                        },
                                        {
                                            "name": "SK03",
                                            "qty": 32
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 15640
                        }
                    ],
                    "totalamount": 25231,
                    "user_id": "user008",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 36961,
            "logs": [],
            "created": new Date().setDate(new Date().getDate() - 5)
        });
        monitor1.save(function (err, mo1) {
            monitor2.save(function (err, mo2) {
                monitor3.save(function (err, mo3) {
                    monitor4.save(function (err, mo4) {
                        var reqData = {
                            data_id: monitor1.team.team_id,
                            status: "team",
                            reportDay: 7
                        };
                        request(app)
                            .post('/api/graph/product/')
                            .set('Authorization', 'Bearer ' + token)
                            .send(reqData)
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err);
                                }
                                var resp = res.body;
                                assert.equal(resp.data[0].name, monitor1.orders[0].items[0].name)
                                assert.equal(resp.data[0].qty,
                                    monitor1.orders[0].items[0].option[0].value[0].qty + monitor1.orders[0].items[0].option[0].value[1].qty +
                                    monitor1.orders[1].items[0].option[0].value[0].qty + monitor1.orders[1].items[0].option[0].value[1].qty +
                                    monitor4.orders[1].items[0].option[0].value[0].qty + monitor4.orders[1].items[0].option[0].value[1].qty)
                                assert.equal(resp.data[0].price, monitor1.orders[0].items[0].price)

                                assert.equal(resp.data[1].name, monitor1.orders[0].items[1].name)
                                assert.equal(resp.data[1].qty,
                                    monitor1.orders[0].items[1].option[0].value[0].qty + monitor1.orders[0].items[1].option[0].value[1].qty)
                                assert.equal(resp.data[1].price, monitor1.orders[0].items[1].price)

                                assert.equal(resp.data[2].name, monitor1.orders[1].items[1].name)
                                assert.equal(resp.data[2].qty,
                                    monitor1.orders[1].items[1].option[0].value[0].qty + monitor1.orders[1].items[1].option[0].value[1].qty +
                                    monitor4.orders[0].items[0].option[0].value[0].qty + monitor4.orders[0].items[0].option[0].value[1].qty +
                                    monitor4.orders[1].items[1].option[0].value[0].qty + monitor4.orders[1].items[1].option[0].value[1].qty)
                                assert.equal(resp.data[2].price, monitor1.orders[1].items[1].price)
                                done();
                            });
                    });
                });
            });
        });
    });

    it('Should be get Graph product by user_id', function (done) {
        var monitor1 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team004",
                "teamname": "nutnut4",
                "codeteam": "NUT4"
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
                    "user_id": "user001",
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
                    "user_id": "user002",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 33721,
            "logs": [],
            "created": new Date().setDate(new Date().getDate())
        });
        var monitor2 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team002",
                "teamname": "lelouLa",
                "codeteam": "LEL"
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
                        "firstname": "natsu",
                        "lastname": "tsutsu",
                        "tel": "990897895"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL01",
                                            "qty": 45
                                        },
                                        {
                                            "name": "RL02",
                                            "qty": 55
                                        }
                                    ],
                                    "name": "สี"
                                }
                            ],
                            "name": "ลิปติก",
                            "price": 69,
                            "amount": 6900
                        },
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "SK01",
                                            "qty": 22
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
                            "amount": 7480
                        }
                    ],
                    "totalamount": 14380,
                    "user_id": "user003",
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
                        "firstname": "lala",
                        "lastname": "loulou",
                        "tel": "5569866986"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL02",
                                            "qty": 38
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
                            "amount": 7176
                        }
                    ],
                    "totalamount": 7176,
                    "user_id": "user004",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 21556,
            "logs": [],
            "created": new Date().setDate(new Date().getDate() - 6)
        });
        var monitor3 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team001",
                "teamname": "nutnutLovelove",
                "codeteam": "NLV"
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
                        "firstname": "lovelove",
                        "lastname": "luvluv",
                        "tel": "23699886589"
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
                                            "qty": 5
                                        },
                                        {
                                            "name": "SK02",
                                            "qty": 8
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 2210
                        }
                    ],
                    "totalamount": 4280,
                    "user_id": "user005",
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
                                            "name": "SK02",
                                            "qty": 20
                                        },
                                        {
                                            "name": "SK03",
                                            "qty": 30
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 8500
                        }
                    ],
                    "totalamount": 8500,
                    "user_id": "user006",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 12780,
            "logs": [],
            "created": new Date().setDate(new Date().getDate() + 3)
        });
        var monitor4 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team004",
                "teamname": "nutnut4",
                "codeteam": "NUT4"
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
                        "firstname": "tofutoru",
                        "lastname": "fufu",
                        "tel": "77998653215"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "SK01",
                                            "qty": 33
                                        },
                                        {
                                            "name": "SK02",
                                            "qty": 36
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 11730
                        }
                    ],
                    "totalamount": 11730,
                    "user_id": "user007",
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
                        "firstname": "nana",
                        "lastname": "lala",
                        "tel": "889966369863"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL02",
                                            "qty": 40
                                        },
                                        {
                                            "name": "RL03",
                                            "qty": 99
                                        }
                                    ],
                                    "name": "สี"
                                }
                            ],
                            "name": "ลิปติก",
                            "price": 69,
                            "amount": 9591
                        },
                        {

                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "SK02",
                                            "qty": 60
                                        },
                                        {
                                            "name": "SK03",
                                            "qty": 32
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 15640
                        }
                    ],
                    "totalamount": 25231,
                    "user_id": "user001",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 36961,
            "logs": [],
            "created": new Date().setDate(new Date().getDate() - 5)
        });
        monitor1.save(function (err, mo1) {
            monitor2.save(function (err, mo2) {
                monitor3.save(function (err, mo3) {
                    monitor4.save(function (err, mo4) {
                        var reqData = {
                            data_id: "user001",
                            status: "member",
                            reportDay: 7
                        };
                        request(app)
                            .post('/api/graph/product/')
                            .set('Authorization', 'Bearer ' + token)
                            .send(reqData)
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err);
                                }
                                var resp = res.body;
                                // console.log(resp.data)
                                assert.equal(resp.data[0].name, monitor1.orders[0].items[0].name)
                                assert.equal(resp.data[0].qty,
                                    monitor1.orders[0].items[0].option[0].value[0].qty + monitor1.orders[0].items[0].option[0].value[1].qty +
                                    monitor4.orders[1].items[0].option[0].value[0].qty + monitor4.orders[1].items[0].option[0].value[1].qty)
                                assert.equal(resp.data[0].price, monitor1.orders[0].items[0].price)

                                assert.equal(resp.data[1].name, monitor1.orders[0].items[1].name)
                                assert.equal(resp.data[1].qty,
                                    monitor1.orders[0].items[1].option[0].value[0].qty + monitor1.orders[0].items[1].option[0].value[1].qty)
                                assert.equal(resp.data[1].price, monitor1.orders[0].items[1].price)

                                assert.equal(resp.data[2].name, monitor4.orders[1].items[1].name)
                                assert.equal(resp.data[2].qty,
                                    monitor4.orders[1].items[1].option[0].value[0].qty + monitor4.orders[1].items[1].option[0].value[1].qty)
                                assert.equal(resp.data[2].price, monitor4.orders[1].items[1].price)
                                done();
                            });
                    });
                });
            });
        });
    });

    xit('Should be get Graph Line by user_id', function (done) {
        var monitor1 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team001",
                "teamname": "nutnutLovelove1",
                "codeteam": "NLV1"
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
                    "user_id": "user001",
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
                    "user_id": "user002",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 33721,
            "logs": [],
            "created": new Date().setDate(new Date().getDate())
        });
        var monitor2 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team002",
                "teamname": "lelouLa",
                "codeteam": "LEL"
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
                        "firstname": "natsu",
                        "lastname": "tsutsu",
                        "tel": "990897895"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL01",
                                            "qty": 45
                                        },
                                        {
                                            "name": "RL02",
                                            "qty": 55
                                        }
                                    ],
                                    "name": "สี"
                                }
                            ],
                            "name": "ลิปติก",
                            "price": 69,
                            "amount": 6900
                        },
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "SK01",
                                            "qty": 22
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
                            "amount": 7480
                        }
                    ],
                    "totalamount": 14380,
                    "user_id": "user003",
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
                        "firstname": "lala",
                        "lastname": "loulou",
                        "tel": "5569866986"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL02",
                                            "qty": 38
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
                            "amount": 7176
                        }
                    ],
                    "totalamount": 7176,
                    "user_id": "user004",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 21556,
            "logs": [],
            "created": new Date().setDate(new Date().getDate() - 6)
        });
        var monitor3 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team003",
                "teamname": "love 03",
                "codeteam": "LV03"
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
                        "firstname": "lovelove",
                        "lastname": "luvluv",
                        "tel": "23699886589"
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
                                            "qty": 5
                                        },
                                        {
                                            "name": "SK02",
                                            "qty": 8
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 2210
                        }
                    ],
                    "totalamount": 4280,
                    "user_id": "user005",
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
                                            "name": "SK02",
                                            "qty": 20
                                        },
                                        {
                                            "name": "SK03",
                                            "qty": 30
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 8500
                        }
                    ],
                    "totalamount": 8500,
                    "user_id": "user006",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 12780,
            "logs": [],
            "created": new Date().setDate(new Date().getDate() + 3)
        });
        var monitor4 = new Monitor({
            "status": "waitwithdrawal",
            "team": {
                "team_id": "team001",
                "teamname": "nutnutLovelove4",
                "codeteam": "NUT4"
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
                        "firstname": "tofutoru",
                        "lastname": "fufu",
                        "tel": "77998653215"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL01",
                                            "qty": 50
                                        },
                                        {
                                            "name": "RL02",
                                            "qty": 30
                                        }
                                    ],
                                    "name": "สี"
                                }
                            ],
                            "name": "ลิปติก",
                            "price": 69,
                            "amount": 5520
                        },
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "SK01",
                                            "qty": 33
                                        },
                                        {
                                            "name": "SK02",
                                            "qty": 36
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 11730
                        }
                    ],
                    "totalamount": 17250,
                    "user_id": "user001",
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
                        "firstname": "nana",
                        "lastname": "lala",
                        "tel": "889966369863"
                    },

                    "items": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL02",
                                            "qty": 40
                                        },
                                        {
                                            "name": "RL03",
                                            "qty": 99
                                        }
                                    ],
                                    "name": "สี"
                                }
                            ],
                            "name": "ลิปติก",
                            "price": 69,
                            "amount": 9591
                        },
                        {

                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "SK02",
                                            "qty": 60
                                        },
                                        {
                                            "name": "SK03",
                                            "qty": 32
                                        }
                                    ],
                                    "name": "เบอร์"
                                }
                            ],
                            "name": "ปัดขนตา",
                            "price": 170,
                            "amount": 15640
                        }
                    ],
                    "totalamount": 25231,
                    "user_id": "user008",
                    "paymenttype": {
                        "name": "ชำระเงินปลายทาง"
                    },
                    "labels": []
                }
            ],
            "totalorderamount": 36961,
            "logs": [],
            "created": new Date().setDate(new Date().getDate() - 5)
        });
        monitor1.save(function (err, mo1) {
            monitor2.save(function (err, mo2) {
                monitor3.save(function (err, mo3) {
                    monitor4.save(function (err, mo4) {
                        var reqData = {
                            data_id: "user001",
                            status: "member",
                            reportDay: 7
                        };
                        request(app)
                            .post('/api/graph/line/')
                            .set('Authorization', 'Bearer ' + token)
                            .send(reqData)
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err);
                                }
                                var resp = res.body;
                                console.log(resp);
                                done();
                            });
                    });
                });
            });
        });
    });


    it('should be Monitor addbox', (done) => {
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

                var addbox = {
                    "productlist": [
                        {
                            "option": [
                                {
                                    "value": [
                                        {
                                            "name": "RL01",
                                            "qty": 5
                                        },
                                        {
                                            "name": "RL02",
                                            "qty": 5
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
                                            "name": "R2L01",
                                            "qty": 1
                                        },
                                        {
                                            "name": "R2L02",
                                            "qty": 1
                                        }
                                    ],
                                    "name": "สีลิปสติก"
                                }
                            ],
                            "name": "perfect lip2",
                            "price": 69,
                            "amount": 2070
                        }
                    ]
                }
                request(app)
                    .post('/api/monitor/addbox/' + resp.data.orders[0]._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(addbox)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // console.log(resp)
                        done();
                    });
            });
    });



    afterEach(function (done) {
        Monitor.remove().exec(done);
    });

});