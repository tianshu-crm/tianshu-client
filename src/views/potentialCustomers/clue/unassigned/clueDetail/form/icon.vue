<template>
	<div>
		<!-- 线索状态  0待分配，1待跟进，2跟进中，3，已完成，4，战败 -->
		<img v-if="status == '0'" src="@/assets/img/daifenpei.png" alt="" />
		<img v-if="status == '1'" src="@/assets/img/daigengjing.png" alt="" />
		<img v-if="status == '2'" src="@/assets/img/gengjinzhong.png" alt="" />
		<img v-if="status == '3'" src="@/assets/img/yiwancheng.png" alt="" />
		<img v-if="status == '4'" src="@/assets/img/zhanbai.png" alt="" />
	</div>
</template>
<script>
export default {
	data() {
		return {};
	},
	props: {
		status: {
			type: String,
		},
	},
};
</script>
<style lang="scss" scoped>
img {
	width: 100px;
}
</style>
