<template>
	<div class="layout-navbars-breadcrumb-user" :style="{ flex: layoutUserFlexNum }">
		<!-- <div class="layout-navbars-breadcrumb-user-icon" @click="onSearchClick">
			<i class="el-icon-search" :title="$t('message.user.title2')"></i>
		</div>
		<div class="layout-navbars-breadcrumb-user-icon" @click="onLayoutSetingClick">
			<i class="icon-skin iconfont" :title="$t('message.user.title3')"></i>
		</div> -->
		<div class="layout-navbars-breadcrumb-user-icon">
			<el-popover placement="bottom" trigger="click" v-model="isShowUserNewsPopover" :width="300" popper-class="el-popover-pupop-user-news">
				<el-badge :is-dot="flag" @click.stop="isShowUserNewsPopover = !isShowUserNewsPopover" slot="reference">
					<!-- <i class="el-icon-bell" :title="$t('message.user.title4')"></i> -->
					<img class="user-icon-bell" src="@/assets/img/bell.png" alt="">
				</el-badge>
				<transition name="el-zoom-in-top">
					<UserNews ref="TheUserNews" v-show="isShowUserNewsPopover" />
				</transition>
			</el-popover>
		</div>
		<!-- <div class="layout-navbars-breadcrumb-user-icon mr10" @click="onScreenfullClick">
			<i
				class="iconfont"
				:title="isScreenfull ? $t('message.user.title6') : $t('message.user.title5')"
				:class="!isScreenfull ? 'icon-fullscreen' : 'icon-tuichuquanping'"
			></i>
		</div> -->
		<el-dropdown :show-timeout="70" :hide-timeout="50" @command="onDropdownCommand">
			<span class="layout-navbars-breadcrumb-user-link">
				<!-- <img :src="getUserInfos.photo" class="layout-navbars-breadcrumb-user-link-photo mr5" /> -->
				{{ getUserInfos.nickName === '' ? '用户' : getUserInfos.nickName }}
				<i class="el-icon-arrow-down el-icon--right"></i>
			</span>
			<el-dropdown-menu slot="dropdown" style="width: 200px">
				<!-- <el-dropdown-item command="/home">{{ $t('message.user.dropdown1') }}</el-dropdown-item>
				<el-dropdown-item command="/personal">{{ $t('message.user.dropdown2') }}</el-dropdown-item>
				<el-dropdown-item command="/404">{{ $t('message.user.dropdown3') }}</el-dropdown-item>
				<el-dropdown-item command="/401">{{ $t('message.user.dropdown4') }}</el-dropdown-item> -->
				<el-dropdown-item>
					<div class="user_info-wrap">
						<!-- <img src="../../../assets/img/logo.png" alt="" srcset="" /> -->
						<i class="el-icon-user">{{ getUserInfos.nickName === '' ? '用户' : getUserInfos.nickName }}</i>
					</div>
				</el-dropdown-item>
				<!-- <el-dropdown-item divided>
					<i class="el-icon-user">lisaweilabgo@123.0@</i>
				</el-dropdown-item>
				<el-dropdown-item>
					<i class="el-icon-mobile-phone">lisaweilabgo@123.0@</i>
				</el-dropdown-item> -->
				<el-dropdown-item>
					<div @click="changePassword">
						<i class="el-icon-lock">修改密码</i>
					</div>
				</el-dropdown-item>
				<el-dropdown-item divided command="logOut">
					<div style="text-align: center">
						<div>系统版本号V1.0</div>
						<el-button type="primary" size="mini">{{ $t('message.user.dropdown5') }}</el-button>
					</div>
				</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<Search ref="searchRef" />
		<Password ref="changepasswordRef" />
	</div>
</template>

<script>
import screenfull from 'screenfull';
import { Session, Local } from '@/utils/storage.js';
import UserNews from '@/layout/navBars/breadcrumb/userNews.vue';
import Search from '@/layout/navBars/breadcrumb/search.vue';
import Password from '@/layout/navBars/breadcrumb/password.vue';
export default {
	name: 'layoutBreadcrumbUser',
	components: { UserNews, Search, Password },
	data() {
		return {
			isScreenfull: false,
			isShowUserNewsPopover: false,
			disabledI18n: 'zh-cn',
			disabledSize: '',
			flag: false, //是否显示红点
		};
	},
	computed: {
		// 获取用户信息
		getUserInfos() {
			return this.$store.state.userInfos.userInfos;
		},
		// 设置弹性盒子布局 flex
		layoutUserFlexNum() {
			let { layout, isClassicSplitMenu } = this.$store.state.themeConfig.themeConfig;
			let num = '';
			if (layout === 'defaults' || (layout === 'classic' && !isClassicSplitMenu) || layout === 'columns') num = 1;
			else num = null;
			return num;
		},
	},
	mounted() {
		if (Local.get('themeConfigPrev')) {
			this.initI18n();
			this.initComponentSize();
		}
		this.openSocket();
	},
	methods: {
		openSocket() {
			if (typeof WebSocket == 'undefined') {
			} else {
				let userId = Session.get('userInfo').userId;
				var socketUrl = 'wss:/pro.tianshuyixiao.com/websocket/' + userId;
				if (this.socket != null) {
					this.socket.close();
					this.socket = null;
				}
				this.socket = new WebSocket(socketUrl);
				//获得消息事件
				this.socket.onmessage = (res) => {
					if (res.data != 'null') {
						let data = JSON.parse(res.data);
						this.flag = data.flag;
						this.$notify({
							title: '消息通知',
							message: data.notice,
							position: 'bottom-right',
						});

						// 刷新消息
						this.$refs.TheUserNews.getWindowlist();
					}
				};
			}
		},
		//修改密码
		changePassword() {
			this.$refs.changepasswordRef.open();
		},
		// 搜索点击
		onSearchClick() {
			this.$refs.searchRef.openSearch();
		},
		// 布局配置点击
		onLayoutSetingClick() {
			this.bus.$emit('openSetingsDrawer');
		},
		// 全屏点击
		onScreenfullClick() {
			if (!screenfull.isEnabled) {
				this.$message.warning('暂不不支持全屏');
				return false;
			}
			screenfull.toggle();
			screenfull.on('change', () => {
				if (screenfull.isFullscreen) this.isScreenfull = true;
				else this.isScreenfull = false;
			});
			// 监听菜单 horizontal.vue 滚动条高度更新
			this.bus.$emit('updateElScrollBar');
		},
		// 组件大小改变
		onComponentSizeChange(size) {
			Local.remove('themeConfigPrev');
			this.$store.state.themeConfig.themeConfig.globalComponentSize = size;
			Local.set('themeConfigPrev', this.$store.state.themeConfig.themeConfig);
			this.$ELEMENT.size = size;
			this.initComponentSize();
			window.location.reload();
		},
		// 语言切换
		onLanguageChange(lang) {
			Local.remove('themeConfigPrev');
			this.$store.state.themeConfig.themeConfig.globalI18n = lang;
			Local.set('themeConfigPrev', this.$store.state.themeConfig.themeConfig);
			this.$i18n.locale = lang;
			this.initI18n();
		},
		// 初始化言语国际化
		initI18n() {
			switch (Local.get('themeConfigPrev').globalI18n) {
				case 'zh-cn':
					this.disabledI18n = 'zh-cn';
					break;
				case 'en':
					this.disabledI18n = 'en';
					break;
				case 'zh-tw':
					this.disabledI18n = 'zh-tw';
					break;
			}
		},
		// 初始化全局组件大小
		initComponentSize() {
			switch (Local.get('themeConfigPrev').globalComponentSize) {
				case '':
					this.disabledSize = '';
					break;
				case 'medium':
					this.disabledSize = 'medium';
					break;
				case 'small':
					this.disabledSize = 'small';
					break;
				case 'mini':
					this.disabledSize = 'mini';
					break;
			}
		},
		// `dropdown 下拉菜单` 当前项点击
		onDropdownCommand(path) {
			if (path === 'logOut') {
				setTimeout(() => {
					this.$msgbox({
						closeOnClickModal: false,
						closeOnPressEscape: false,
						title: this.$t('message.user.logOutTitle'),
						message: this.$t('message.user.logOutMessage'),
						showCancelButton: true,
						confirmButtonText: this.$t('message.user.logOutConfirm'),
						cancelButtonText: this.$t('message.user.logOutCancel'),
						beforeClose: (action, instance, done) => {
							if (action === 'confirm') {
								instance.confirmButtonLoading = true;
								instance.confirmButtonText = this.$t('message.user.logOutExit');
								setTimeout(() => {
									done();
									setTimeout(() => {
										instance.confirmButtonLoading = false;
									}, 300);
								}, 700);
							} else {
								done();
							}
						},
					})
						.then(() => {
							// 清除缓存/token等
							Session.clear();
							// 使用 reload 时，不需要调用 resetRoute() 重置路由
							window.location.reload();
						})
						.catch(() => {});
				}, 150);
			} else {
				this.$router.push(path);
			}
		},
	},
};
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	&-link {
		height: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		&-photo {
			width: 25px;
			height: 25px;
			border-radius: 100%;
		}
	}
	&-icon {
		padding: 0 10px;
		cursor: pointer;
		color: var(--prev-bg-topBarColor);
		height: 50px;
		line-height: 50px;
		display: flex;
		align-items: center;
		&:hover {
			background: var(--prev-color-hover);
			i {
				display: inline-block;
				animation: logoAnimation 0.3s ease-in-out;
			}
		}
	}
	& ::v-deep .el-dropdown {
		color: var(--prev-bg-topBarColor);
	}
	& ::v-deep .el-badge {
		height: 40px;
		line-height: 40px;
		display: flex;
		align-items: center;
	}
	& ::v-deep .el-badge__content.is-fixed {
		top: 12px;
	}
}
.user_info-wrap {
	img {
		width: 30px;
		height: 30px;
		vertical-align: middle;
	}
}
.layout-navbars-breadcrumb-user-link{
	cursor: pointer;
}
.user-icon-bell{
	width: 15px;
}
</style>
