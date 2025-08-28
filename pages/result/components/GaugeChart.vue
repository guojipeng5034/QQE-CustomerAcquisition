<template>
	<view class="gauge-chart-container">
		<l-echart ref="gaugeChart" :ec="ec"></l-echart>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		watch,
		nextTick
	} from 'vue';
	const echarts = require('../../../uni_modules/lime-echart/static/echarts.min');

	// 定义组件的 props
	const props = defineProps({
		value: {
			type: Number,
			default: 0
		},
		maxValue: {
			type: Number,
			default: 12
		}
	});

	// 创建一个 ref 来引用 l-echart 组件实例
	const gaugeChart = ref(null);

	// ECharts 的配置项
	// 注意：这里我们将 option 放在了 ec 对象中，以匹配 <l-echart> 组件的 prop
	const ec = reactive({
		option: {}
	});

	/**
	 * @description 获取 ECharts 配置项
	 * @param {number} progressValue - 当前的进度值
	 */
	const getChartOption = (progressValue,maxValue) => {
		// ECharts 的 option 配置是完全不变的，可以直接复用
		return {
			series: [{
				type: 'gauge',
				radius: '90%',
				center: ['50%', '70%'],
				startAngle: 180,
				endAngle: 0,
				min: 0,
				max: maxValue,
				axisLine: {
					roundCap: true,
					lineStyle: {
						width: 12,
						color: [
							[1, '#D4F6E2']
						]
					}
				},
				progress: {
					show: true,
					width: 12,
					roundCap: true,
					itemStyle: {
						color: '#11C873'
					}
				},
				detail: {
					valueAnimation: true,
					offsetCenter: [0, '-8%'],
					formatter: function(value) {
						return '{value|' + value.toFixed(0) + '}\n{title|综合得分}';
					},
					rich: {
						value: {
							fontSize: 36,
							fontWeight: 'bold',
							color: '#333'
						},
						title: {
							fontSize: 16,
							color: '#888',
							fontWeight: 500,
							padding: [5, 0, 0, 0]
						}
					}
				},
				data: [{
					value: progressValue
				}],
				splitLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					show: false
				},
				pointer: {
					show: false
				},
			}, {
				type: 'gauge',
				radius: '73%',
				center: ['50%', '70%'],
				startAngle: 180,
				endAngle: 0,
				min: 0,
				max: 12,
				axisLine: {
					roundCap: true,
					lineStyle: {
						width: 10,
						// 修改：将背景色换成 #D4F6E2
						color: [
							[1, '#EEFBF7']
						]
					}
				},
				splitLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					show: false
				},
				pointer: {
					show: false
				},
				detail: {
					show: false
				},
			}, ]
		};
	};

	// 在组件挂载后初始化图表
	onMounted(() => {
		nextTick(() => {
			if (gaugeChart.value) {
				// 1. 获取设备的像素比
				const dpr = uni.getSystemInfoSync().pixelRatio;
				// 关键改动：调用组件实例的 init 方法
				gaugeChart.value.init(echarts, chart => {
					const option = getChartOption(props.value,props.maxValue);
					chart.setOption(option);
				}, { // <-- 这是 ECharts 的 opts 参数
					devicePixelRatio: dpr // <-- 在这里设置
				});
			}
		});
	});

	// watch 也需要相应修改
	watch(() => props.value, (newValue) => {
		if (gaugeChart.value) {
			// 调用组件实例的方法来更新图表
			const option = getChartOption(newValue,props.maxValue);
			// 假设组件实例上有一个 setOption 方法
			gaugeChart.value.setOption(option);
		}
	});
	watch(() => props.maxValue, (newValue) => {
		if (gaugeChart.value) {
			// 调用组件实例的方法来更新图表
			const option = getChartOption(props.value,newValue);
			// 假设组件实例上有一个 setOption 方法
			gaugeChart.value.setOption(option);
		}
	});
</script>

<style scoped>
	.gauge-chart-container {
		/* 容器尺寸必须指定，否则图表可能无法显示 */
		width: 350px;
		height: 200px;
		/* 给予一个明确的高度 */
		margin: 0 auto;
	}

	/* 确保 l-echart 组件本身能够撑满容器
  一些封装组件可能需要你手动设置其尺寸
*/
	l-echart {
		width: 100%;
		height: 100%;
	}
</style>