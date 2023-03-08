<template>
	<!-- 线索管理 -->
	<div class="content-body">
		<el-tabs v-model="activeName" @tab-click="onChangeTab" type="card">
			<el-tab-pane label="待分配线索" name="unassigned">
				<unassignedTable ref="unassignedTable" @changeActiveName="changeActiveName"></unassignedTable>
			</el-tab-pane>
			<el-tab-pane label="待跟进线索" name="unFollowed">
				<unFollowedTable ref="unFollowedTable"></unFollowedTable>
			</el-tab-pane>
			<el-tab-pane label="跟进中线索" name="following">
				<followedingTable ref="followedingTable"></followedingTable>
			</el-tab-pane>
			<el-tab-pane label="线索去重" name="filters">
				<filtersTable ref="filtersTable"></filtersTable>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import unassignedTable from './unassigned/index.vue';
import unFollowedTable from './unFollowed/index.vue';
import followedingTable from './followeding/index.vue';
import filtersTable from './filters/index.vue';
export default {
	data() {
		const defaultActiveName = this.$route.query?.tabName || 'unassigned';

		return {
			activeName: defaultActiveName, //默认选中的标签页
		};
	},
	components: {
		unassignedTable,
		unFollowedTable,
		filtersTable,
		followedingTable,
	},
	watch: {
		activeName: {
			// immediate: true,
			handler() {
				this.updateURIQuery();
			},
		},
	},
	mounted() {
		this.initList();
	},
	methods: {
		updateURIQuery() {
			this.$router.replace({
				path: this.$route.path,
				query: {
					tabName: this.activeName,
				},
			});
		},
		changeActiveName(value) {
			this.activeName = value;
		},
		initList() {
			this.$nextTick(() => {
				switch (this.activeName) {
					case 'unassigned':
						this.$refs.unassignedTable.init();
						break;
					case 'unFollowed':
						this.$nextTick(() => {
							this.$refs.unFollowedTable.init();
						});
						break;
					case 'following':
						this.$nextTick(() => {
							this.$refs.followedingTable.init();
						});
						break;
					case 'filters':
						this.$nextTick(() => {
							this.$refs.filtersTable.initCustomerList();
						});
						break;
				}
			});
		},
		onChangeTab(tab) {
			this.initList();
			// switch (tab.label) {
			// 	case '待分配线索':
			// 		this.$refs.unassignedTable.init();
			// 		break;
			// 	case '待跟进线索':
			// 		this.$nextTick(() => {
			// 			this.$refs.unFollowedTable.init();
			// 		});
			// 		break;
			// 	case '跟进中线索':
			// 		this.$nextTick(() => {
			// 			this.$refs.followedingTable.init();
			// 		});
			// 		break;
			// 	case '线索去重':
			// 		this.$nextTick(() => {
			// 			this.$refs.filtersTable.initCustomerList();
			// 		});
			// 		break;
			// }
		},
	},
};
</script>
<style lang="scss" scoped></style>
