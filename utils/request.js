// utils/request.js

// 在这里替换成您的后端 API 地址
const BASE_URL = 'https://api.yourdomain.com/api/v1'; 

const request = (options) => {
	return new Promise((resolve, reject) => {
		// 显示加载提示
		uni.showLoading({
			title: '加载中...'
		});

		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: {
				// 可以在这里统一设置请求头
				'Content-Type': 'application/json',
				// 如果有 token，可以从本地存储中获取并放入请求头
				'Authorization': uni.getStorageSync('token') || ''
			},
			success: (res) => {
				// 统一处理后端返回的业务错误码
				if (res.data.code !== 200) {
					uni.showToast({
						title: res.data.message || '请求失败',
						icon: 'none'
					});
					return reject(res.data);
				}
				// 请求成功
				resolve(res.data);
			},
			fail: (err) => {
				// 统一处理网络错误
				uni.showToast({
					title: '网络错误，请稍后重试',
					icon: 'none'
				});
				reject(err);
			},
			complete: () => {
				// 隐藏加载提示
				uni.hideLoading();
			}
		});
	});
};

export default request;