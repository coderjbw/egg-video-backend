'use strict';

const { Controller } = require('egg');

class VodController extends Controller {
    // 获取上传地址和凭证
    async createUploadVideo() {
        const { ctx } = this;
        const query = ctx.query;
        ctx.validate(
            {
                Title: { type: 'string' },
                FileName: { type: 'string' },
            },
            query,
        );

        ctx.body = await this.app.vodClient.request('CreateUploadVideo', query, {});
    }

    // 刷新上传地址和凭证
    async refreshUploadVideo() {
        const { ctx } = this;
        const query = ctx.query;
        ctx.validate(
            {
                VideoId: { type: 'string' },
            },
            query,
        );

        ctx.body = await this.app.vodClient.request('RefreshUploadVideo', query, {});
    }
}

module.exports = VodController;
