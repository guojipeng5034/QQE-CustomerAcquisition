<script>
	import { useUserStore } from '@/stores/user';

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