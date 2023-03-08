<template>
	<div class="">
		<el-dialog title="请完成安全验证" :visible.sync="show" width="20%" :before-close="handleClose" custom-class="slide_wrap">
			<slide-verify
				ref="slideblock"
				@again="onAgain"
				@fulfilled="onFulfilled"
				@success="onSuccess"
				@fail="onFail"
				@refresh="onRefresh"
				:accuracy="accuracy"
				:slider-text="text"
				:imgs="imgs"
			></slide-verify>
			<div>{{ msg }}</div>
		</el-dialog>
	</div>
</template>

<script>
import img0 from '@/assets/img/y1.jpg';
import img1 from '@/assets/img/y2.jpg';
import img3 from '@/assets/img/y3.jpg';
import { getUserPhoneByAccount } from '@/api/login/index';
export default {
	props: {
		slideShow: {
			type: Boolean,
			default: false,
		},
		username: {
			type: String,
		},
	},

	data() {
		return {
			msg: '',
			text: '向右拖动滑块填充拼图',
			// 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
			accuracy: 1,
			show: false,
			img: [],
		};
	},
	created() {
		this.show = this.slideShow;
		this.imgs = [ img0,img1, img3];
	},
	methods: {
		handleClose() {
			this.$emit('closeSlide', false);
		},
		onSuccess(times) {
			this.$message.success('安全验证成功');
			this.msg = `login success, 耗时${(times / 1000).toFixed(1)}s`;
			getUserPhoneByAccount(this.username).then((res) => {
				if (res.code === 200) {
					this.$store.dispatch('forgotPassword/setActive', { active: 2 });
					this.$store.dispatch('forgotPassword/setPhoneNum', { phonenumber: res.phonenumber });
					this.$message.success(res.msg);
				} else {
					this.$message.error(res.msg);
				}
				this.handleClose();
			});
		},
		onFail() {
			// console.log('验证不通过');
			this.msg = '';
		},
		onRefresh() {
			// console.log('点击了刷新小图标');
			this.msg = '';
		},
		onFulfilled() {
			// console.log('刷新成功啦！');
		},
		onAgain() {
			// console.log('检测到非人为操作的哦！');
			this.msg = 'try again';
			// 刷新
			this.$refs.slideblock.reset();
		},
	},
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog__body {
	// display: flex;
	// align-content: center;
	// justify-content: center;
}
</style>
