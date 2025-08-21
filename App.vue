<script>
	import { useUserStore } from '@/stores/user';

	export default {
		onLaunch: function() {
			console.log('App Launch');
			
			// #ifdef MP-WEIXIN
			const userStore = useUserStore();
			// 触发静默登录
			userStore.handleSilentLogin();
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