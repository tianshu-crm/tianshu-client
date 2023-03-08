<template>
	<div class="layout-logo" v-if="setShowLogo" @click="onThemeConfigChange">
		<!-- <span class="title">天枢易销</span> -->
		<img src="../../assets/img/logo.png" alt="">
	</div>
</template>

<script>
export default {
	name: 'layoutLogo',
	computed: {
		// 获取布局配置信息
		getThemeConfig() {
			return this.$store.state.themeConfig.themeConfig;
		},
		// 设置 logo 是否显示
		setShowLogo() {
			let { isCollapse, layout } = this.$store.state.themeConfig.themeConfig;
			return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
		},
	},
	methods: {
		// logo 点击实现菜单展开/收起
		onThemeConfigChange() {
			if (this.$store.state.themeConfig.themeConfig.layout === 'transverse') return false;
			this.$store.state.themeConfig.themeConfig.isCollapse = !this.$store.state.themeConfig.themeConfig.isCollapse;
		},
	},
};
</script>

<style scoped lang="scss">
.layout-logo {
	width: 220px;
	padding: 15px 0 15px;
	box-sizing: border-box;
	background-color: #3174ec;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;
	text-align: center;
	&:hover {
		img {
			opacity: 0.9;
		}
	}
	&-medium-img {
		width: 20px;
		margin-right: 5px;
		position: relative;
		top: 2px;
	}
	.title {
		display: inline-block;
		font-size: 36px;
		font-weight: 500;
		color: #ffffff;

		line-height: 50px;
	}
	img{
		width: 150px;
	}
}
.layout-logo-size {
	width: 100%;
	height: 50px;
	display: flex;
	cursor: pointer;
	&-img {
		width: 20px;
		margin: auto;
		animation: logoAnimation 0.3s ease-in-out;
	}
}
</style>
