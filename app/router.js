'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
    const { router, controller, middleware } = app;
    const auth = middleware.auth();
    router.prefix('/api/v1');
    router.post('/users', controller.user.create);
    router.post('/users/login', controller.user.login);
    router.get('/user', auth, controller.user.getCurrentUser);
    router.patch('/user', auth, controller.user.update);
    router.get('/user/:userId', app.middleware.auth({ required: false }), controller.user.getUser);

    // 订阅路由
    router.get('/users/:userId/subscribe', auth, controller.user.subscribe);
    router.delete('/users/:userId/subscribe', auth, controller.user.unsubscribe);
    router.get('/users/:userId/subscriptions', controller.user.getSubscriptions);

    // 阿里云vod接口
    router.get('/vod/createUploadVideo', auth, controller.vod.createUploadVideo);
    router.get('/vod/refreshUploadVideo', auth, controller.vod.refreshUploadVideo);
    router.post('/videos', auth, controller.video.createVideo);
    router.get('/videos/:videoId', app.middleware.auth({ required: false }), controller.video.getVideo);
    router.get('/videos', controller.video.getVideos);
    router.get('users/:userId/videos', controller.video.getUserVideos);
    router.get('/user/videos/feed', auth, controller.video.getUserFeedVideos);
};
