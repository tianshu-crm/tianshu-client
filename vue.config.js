module.exports = {
	productionSourceMap: false,
	publicPath: '/', // 不要使用"./", 因为history模式的静态资源需要从根目录访问，而不是当前目录(./)访问
	// publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	lintOnSave: false,
	devServer: {
		open: process.env.VUE_APP_OPEN === 'false' ? false : true, // 自动打开浏览器
		disableHostCheck:true,
		host: '0.0.0.0', // 真机模拟，使用
		port: process.env.VUE_APP_PORT, // 前台代理端口号
		https: false, // https： {type: Booleam}
		hotOnly: true, // 热更新
		proxy: {
			[process.env.VUE_APP_BASE_API]: {
				target: `https://pro.tianshuyixiao.com`,
				changeOrigin: true,
				// pathRewrite: {
				// 	['^' + process.env.VUE_APP_BASE_API]: '',
				// },
			},
		},
	},
	chainWebpack(config) {
		// 移除打包后 index.html 所有打包好的文件都预加载行为
		config.plugins.delete('preload');
		config.plugins.delete('prefetch');
	},
	configureWebpack: {
		output: {
			filename: `js/[name].${new Date().getTime()}.js`,
			chunkFilename: `js/[name].${new Date().getTime()}.js`,
		},
	},
	css: {
		extract: {
			filename: `css/[name].${new Date().getTime()}.css`,
			chunkFilename: `css/[name].${new Date().getTime()}.css`,
			ignoreOrder: true
		},
		
	},
};
