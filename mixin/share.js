// /mixins/share.js
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
export function useShare() {
    // #ifdef MP-WEIXIN
    onShareAppMessage((res) => {
    	return {
    		title: '想知道自己的英语能力吗？点这里测一测！',
    		path: '/pages/entry/index',
    	}
    })
     onShareTimeline(() => {
    	return {
    		title: '我正在参与免费的英语能力测试，快来加入我吧！',
    		path: '/pages/entry/index',
    	};
    })
    // #endif
}