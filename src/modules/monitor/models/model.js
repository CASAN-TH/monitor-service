'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var counterSchema = new Schema({
//     prefix: { type: String, required: true },
//     seq: { type: Number, default: 0 }
// });


// var counter = mongoose.model('counter', counterSchema);

var MonitorSchema = new Schema({
    prefix: { type: String},
    seq: { type: Number, default: 0 },
    totalorderamount: {
        type: Number
    },
    monitorno: {
        type: String
    },
    status: {
        type: String,
        enum: ['waitwithdrawal', 'waitpack', 'waitshipping', 'complete'],
        default: 'waitwithdrawal'
    },
    logs: {
        type: [
            {
                remark: {
                    type: String
                }
            }
        ]
    },
    team: {
        team_id: {
            type: String
        },
        teamname: {
            type: String
        },
        codeteam: {
            type: String
        }
    },
    orders: {
        type: [
            {
                orderno: {
                    type: String,
                },
                customer: {
                    firstname: {
                        type: String
                    },
                    lastname: {
                        type: String
                    },
                    tel: {
                        type: String
                    },
                    address: {
                        houseno: {
                            type: String
                        },
                        village: {
                            type: String
                        },
                        street: {
                            type: String
                        },
                        subdistrict: {
                            type: String
                        },
                        district: {
                            type: String
                        },
                        province: {
                            type: String
                        },
                        zipcode: {
                            type: String
                        }
                    },
                },
                items: {
                    type: [
                        {
                            name: {
                                type: String
                            },
                            option: {
                                type: [
                                    {
                                        name: {
                                            type: String
                                        },
                                        value: {
                                            type: [
                                                {
                                                    name: {
                                                        type: String
                                                    },
                                                    qty: {
                                                        type: Number
                                                    }
                                                }
                                            ]
                                        },
                                    }
                                ]
                            },
                            price: {
                                type: Number
                            },
                            amount: {
                                type: Number
                            }
                        }
                    ]
                },
                labels: {
                    type: [{
                        trackno: {
                            type: String
                        },
                        customer: {
                            type: {
                                firstname: {
                                    type: String
                                },
                                lastname: {
                                    type: String
                                },
                            }
                        },
                        address: {
                            houseno: {
                                type: String
                            },
                            village: {
                                type: String
                            },
                            street: {
                                type: String
                            },
                            subdistrict: {
                                type: String
                            },
                            district: {
                                type: String
                            },
                            province: {
                                type: String
                            },
                            zipcode: {
                                type: String
                            }
                        },
                        productlist: {
                            type: [{
                                name: {
                                    type: String
                                },
                                qty: {
                                    type: Number
                                }
                            }]
                        }
                    }]
                },
                totalamount: {
                    type: Number
                },
                user_id: {
                    type: String
                },
                paymenttype: {
                    name: {
                        type: String
                    }
                }
            }
        ]
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

// var pad = function (num, size) {
//     var s = "000000000" + num;
//     return s.substr(s.length - size);
// }

// MonitorSchema.pre("save", function (next) {
//     var doc = this;
//     var newDate = new Date();
//     var prefix = doc.team.codeteam + newDate.getFullYear().toString().substr(2, 2) + ((newDate.getMonth() + 1) < 10 ? '0' : '') + (newDate.getMonth() + 1).toString() + pad(newDate.getDate(), 2);
//     // counter.findOneAndUpdate({ prefix: prefix }, {
//     //     $inc: { seq: 1 }
//     // },
//     //     function (error, counter) {
//     //         console.log(counter);
//     //         if (error) return next(error);
//     //         doc.monitorno = prefix + pad(counter ? counter.seq : 1, 3);
//     //         next();
//     //     });
//     // counter.findById(
//     //     prefix
//     //     , function (error, data) {
//     //         console.log(data);
//     //         if (error) return next(error);
//     //         doc.monitorno = prefix + pad(data ? data.seq : 1, 3);
//     //         next();
//     //     });
//     doc.monitorno = prefix;
//     next();
// });

mongoose.model("Monitor", MonitorSchema);