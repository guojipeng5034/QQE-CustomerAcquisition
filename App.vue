<script>
	import {
		useUserStore
	} from '@/stores/user';
	import {
		useQuizStore
	} from '@/stores/quiz';
	export default {
		// [新增] 定义全局数据
		globalData: {
			loginPromise: null
		},
		onLaunch: function() {
			console.log('App Launch');

			// #ifdef MP-WEIXIN
			const userStore = useUserStore();
			// [核心修改] 将静默登录的 Promise 存入 globalData
			this.globalData.loginPromise = userStore.handleSilentLogin();
			// #endif
		},
		onShow: function() {
			console.log('App Show');
			// #ifdef MP-WEIXIN
			const userStore = useUserStore();
			const quizStore = useQuizStore();
			// [新增] 在 onShow 中检查登录状态，如果未登录则重新尝试静默登录
			// a. userStore.isLoggedIn 是从 user.js 的 getters 中获取的计算属性。
			// b. 它可以确保我们只在用户未登录时才发起登录请求，避免了每次 onShow 都重复执行登录。
			if (!userStore.isLoggedIn) {
				console.log('用户未登录，从 onShow 触发静默登录');
				this.globalData.loginPromise = userStore.handleSilentLogin();
			} else {
				if (quizStore.score > -1) {
					console.log("用户登录且有分数")
					setTimeout(() => {
						console.log("执行跳转到result")
						uni.redirectTo({
							url: '/pages/result/index'
						});
					}, 500); // 延迟100毫秒通常足够了
				}
			}
			// #endif
		},
		onHide: function() {
			console.log('App Hide');
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';

	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>