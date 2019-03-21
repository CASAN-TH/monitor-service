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
                    address: [
                        {
                            houseno: "55/7",
                            village: "casa-city",
                            street: "lumlukka Road",
                            subdistrict: "บึงคำพร้อย",
                            district: "lumlukka",
                            province: "phathumthani",
                            zipcode: "12150"
                        }
                    ]
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
                assert.equal(resp.data.totalorderamount, mockup.totalorderamount);
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
                        assert.equal(resp.data.totalorderamount, update.totalorderamount);
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

    afterEach(function (done) {
        Monitor.remove().exec(done);
    });

});