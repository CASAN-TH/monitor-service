'use strict';
var controller = require('../controllers/controller'),
    mq = require('../../core/controllers/rabbitmq'),
    policy = require('../policy/policy');
module.exports = function (app) {
    var url = '/api/monitors';
    var urlWithParam = '/api/monitors/:monitorId';
    app.route(url).all(policy.isAllowed)
        .get(controller.getList)
        .post(
            controller.generateMonitorNo1,
            controller.generateMonitorNo2,
            controller.create
        );

    app.route(urlWithParam).all(policy.isAllowed)
        .get(controller.read)
        .put(controller.update)
        .delete(controller.delete);

    app.route('/api/monitor/report/:monitorId')
        .get(
            controller.reportAllData,
            controller.reportDetailData,
            controller.returnData
        );

    app.route('/api/monitor/labels/:orderid')
        .get(
            controller.getProductLabel,
            controller.returnData
        );



    app.route('/api/graph/product/')
        .post(
            controller.findMonitorByData,
            controller.solveTotalProduct,
            controller.returnData
        );

    app.route('/api/graph/line/')
        .post(
            controller.findTeamByTypeId,
            controller.filterTypeId,
            controller.findAndPushQty,
            controller.returnData
        );

    app.route('/api/monitor/team/:teamid')
        .get(controller.returnData);

    app.route('/api/monitor/deletebox/:lableid')
        .delete(
            controller.deleteBox,
            controller.returnData
        )

    app.route('/api/monitor/reportdetail/:monitorId')
        .get(
            controller.reportAllData,
            controller.reportDetailData,
            controller.reportjs
        );
    app.route('/api/monitor/reportlable/:orderid')
        .get(
            controller.reportlable
        );

    app.route('/api/monitor/reportbylable/:lableid')
        .get(
            controller.printByLable
        );

    app.route('/api/monitor/reportlableall/:monitorId')
        .get(
            controller.reportlableAll
        );

    app.param('monitorId', controller.getByID);
    app.param('orderid', controller.getMonitorByOrder);
    app.param('teamid', controller.getTeamById);
    app.param('lableid', controller.getlableById);

    /**
     * Message Queue
     * exchange : ชื่อเครือข่ายไปรษณีย์  เช่น casan
     * qname : ชื่อสถานีย่อย สาขา
     * keymsg : ชื่อผู้รับ
     */
    // mq.consume('monitor', 'created', 'created', (msg)=>{
    //     console.log(JSON.parse(msg.content));

    // });
}