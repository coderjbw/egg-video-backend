module.exports = (options = { required: true }) => {
    return async (ctx, next) => {
        // 获取请求头中的token数据
        let token = ctx.headers.authorization;
        token = token ? token.split('Bearer ')[1] : null;

        if (token) {
            try {
                // token有效，根据userId获取用户数据，挂在在ctx对象中给后续中间件使用
                const data = ctx.service.user.verifyToken(token);
                ctx.user = await ctx.model.User.findById(data.userId);
            } catch {
                ctx.throw(401);
            }
        } else if (options.required) {
            ctx.throw(401);
        }

        // next进行执行后续中间件
        await next();
    };
};
