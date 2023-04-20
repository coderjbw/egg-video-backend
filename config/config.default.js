/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = (exports = {});

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1681747972599_3992';

    // add your middleware config here
    config.middleware = ['errorHandler'];

    // 只针对/api/v1前缀的请求进行匹配
    config.errorHandler = {
        match: '/api/v1',
    };

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    config.mongoose = {
        client: {
            url: 'mongodb://127.0.0.1/youtube-clone',
            options: {
                useUnifiedTopology: true,
            },
            // mongoose global plugins, expected a function or an array of function and options
            plugins: [],
        },
    };

    config.security = {
        csrf: {
            enable: false,
        },
    };

    return {
        ...config,
        ...userConfig,
    };
};
