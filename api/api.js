// api/api.js

import request from '@/utils/request.js';

/**
 * 微信小程序登录接口
 * @param {string} code - 调用 uni.login() 获取的登录凭证
 * @param {string} encryptedData - 从 getPhoneNumber 事件中获取的加密数据
 * @param {string} iv - 从 getPhoneNumber 事件中获取的初始向量
 */
export const loginWithWeixin = (code, encryptedData, iv) => {
	return request({
		url: '/auth/weixin-login', // 假设后端的登录接口是这个
		method: 'POST',
		data: {
			code,
			encryptedData,
			iv
		}
	});
};

/**
 * 提交答题结果接口
 * @param {Object} quizResult - 答题结果数据
 * @param {Array} quizResult.answers - 用户选择的答案数组
 * @param {number} quizResult.score - 用户的得分
 */
export const submitQuizResult = (quizResult) => {
	return request({
		url: '/quiz/submit', // 假设后端的提交接口是这个
		method: 'POST',
		data: quizResult
	});
};

// 如果有H5验证码登录，也可以在这里添加
/**
 * H5手机验证码登录
 * @param {string} phone - 手机号
 * @param {string} code - 验证码
 */
export const loginWithSmsCode = (phone, code) => {
    return request({
        url: '/auth/sms-login',
        method: 'POST',
        data: {
            phone,
            code
        }
    });
};