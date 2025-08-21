// utils/request.js

// --- API 配置中心 ---
// 在这里集中管理所有的后端接口配置
const API_CONFIGS = {
	// 我们自己的业务后端
	default: {
		baseUrl: 'https://api.yourdomain.com/api/v1', // ⚠️ 注意：这里依旧是您自己业务后端的地址
		headers: {
			'Content-Type': 'application/json',
			// Authorization 会在请求时动态获取
		}
	},
	// 用于获取手机号的第三方服务
	phoneService: {
		baseUrl: 'https://ai.52cebu.com',
		headers: {
			'Content-Type': 'application/json',
			'X-API-Key': 'APIKEY_7Yxk2QmT9nZ4wVb1Rc8GsHpJdE5LhAo3UfKiM0Nt', // ⚠️ 您的API Key
			'Accept': 'application/json'
		}
	}
};


/**
 * @description: 通用的网络请求函数
 * @param {object} options - uni.request 的参数
 * @param {string} configKey - 在 API_CONFIGS 中定义的配置键名，默认为 'default'
 */
const request = (options, configKey = 'default') => {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '加载中...'
		});

		const config = API_CONFIGS[configKey];
		if (!config) {
			return reject(new Error(`API config for key "${configKey}" not found.`));
		}
		
		// 拼接完整的请求地址
		options.url = config.baseUrl + options.url;
		
		// 设置请求头
		options.header = { ...config.headers };
		if (configKey === 'default') {
			options.header.Authorization = uni.getStorageSync('token') || '';
		}
		
		uni.request({
			...options,
			timeout: options.timeout || 10000, // 默认10秒超时
			success: (res) => {
				// 兼容不同后端的成功判断逻辑
				const isSuccess = configKey === 'phoneService' 
					? (res.statusCode === 200 && res.data && res.data.success)
					: (res.data.code === 200);

				if (isSuccess) {
					resolve(res.data);
				} else {
					// 统一的错误提示
					const errorMsg = res.data?.message || `请求失败 (${res.statusCode})`;
					uni.showToast({
						title: errorMsg,
						icon: 'none'
					});
					console.error('API业务失败:', res.data);
					reject(res.data);
				}
			},
			fail: (err) => {
				let errorMessage = '网络请求失败';
				if (err.errMsg) {
					const errMsg = err.errMsg.toLowerCase();
					if (errMsg.includes('timeout')) {
						errorMessage = '请求超时，请检查网络';
					} else if (errMsg.includes('domain list')) {
						errorMessage = `请在小程序后台配置域名:\n${config.baseUrl}`;
					}
				}
				uni.showToast({
					title: errorMessage,
					icon: 'none'
				});
				console.error('网络请求失败:', err);
				reject(err);
			},
			complete: () => {
				uni.hideLoading();
			}
		});
	});
};

export default request;