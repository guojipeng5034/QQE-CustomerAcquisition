// api/api.js

import request from '@/utils/request.js';

/**
 * @description: 小程序静默登录，用 code 换取 openid 和 session
 * @param {string} code - 调用 uni.login() 获取的登录凭证
 */
export const silentLogin = (code) => {
	// 这个请求会发送到您自己的业务后端，所以使用 'default' 配置
	return request({
		url: '/auth/silent-login', // 假设您后端处理静默登录的接口是这个
		method: 'POST',
		data: {
			code
		}
	});
};

/**
 * @description: 调用后端接口获取真实手机号 (现在主要用于注册)
 * @param {string} code - 调用 uni.login() 获取的登录凭证
 */
export const getRealPhoneNumber = (code) => {
	return request({
		url: '/api/getPhoneNumber',
		method: 'POST',
		data: {
			code: code
		}
	}, 'phoneService'); // <-- 关键：指定使用 phoneService 的配置
};

/**
 * @description: 提交答题结果接口
 * @param {Object} quizResult - 答题结果数据
 */
export const submitQuizResult = (quizResult) => {
	// 这里没有指定配置，默认使用 'default'
	return request({
		url: '/quiz/submit',
		method: 'POST',
		data: quizResult
	});
};

/**
 * @description: H5手机验证码登录 (示例)
 * @param {string} phone - 手机号
 * @param {string} code - 验证码
 */
export const loginWithSmsCode = (phone, code) => {
	// 这里没有指定配置，默认使用 'default'
    return request({
        url: '/auth/sms-login',
        method: 'POST',
        data: {
            phone,
            code
        }
    });
};