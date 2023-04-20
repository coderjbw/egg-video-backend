'use strict';

const { Controller } = require('egg');

class UserController extends Controller {
    async create() {
        const { ctx } = this;
        // 校验参数
        ctx.validate({
            username: { type: 'string' },
            password: { type: 'string' },
            email: { type: 'string' },
        });

        ctx.body = 'hi, egg';
    }
}

module.exports = UserController;
