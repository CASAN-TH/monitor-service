'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MonitorSchema = new Schema({
    totalorderamount: {
        type: Number
    },
    status: {
        type: String,
        enum: ['waitwithdrawal', 'waitpack', 'waitshipping', 'complete'],
        default: ['waitwithdrawal']
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

mongoose.model("Monitor", MonitorSchema);