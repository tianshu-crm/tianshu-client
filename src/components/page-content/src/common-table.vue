<template>
	<div class="page-conten">
		<div class="header">
			<slot name="header">
				<div class="title"></div>
				<div class="handler">
					<slot name="headlerHeadler"></slot>
				</div>
			</slot>
		</div>
		<el-table
			:header-cell-style="{ background: '#F6F6F6' }"
			:row-key="rowKey"
			ref="table"
			:height="heigth"
			:data="tableData"
			style="width: 100%"
			v-loading="loading"
			element-loading-text="拼命加载中"
			element-loading-background="rgba(255, 255, 255, 0.8)"
			@selection-change="handleSelectionChange"
			@row-click="handleRowClick"
		>
			<el-table-column type="index" align="center" width="15">
				<template slot-scope="scope">
					<slot v-if="scope.row.status == '1'" name="readUnread"></slot>
				</template>
			</el-table-column>
			<el-table-column
				v-if="contentTableConfig.showSelectColumn"
				type="selection"
				align="center"
				width="55"
				:reserve-selection="true"
			></el-table-column>
			<el-table-column v-if="contentTableConfig.showIndexColumn" label="序号" type="index" align="center" width="50">
				<template slot-scope="scope">
					<div>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</div>
				</template>
			</el-table-column>
			<template v-for="propItem in contentTableConfig.propList">
				<el-table-column v-bind="propItem" :width="propItem.width" :fixed="propItem.fixed">
					<template #default="scope">
						<slot :name="propItem.slotName" :row="scope.row">
							{{ scope.row[propItem.prop] }}
						</slot>
					</template>
				</el-table-column>
			</template>
			<template slot="empty">
				<img src="../../../assets/img/no_data.png" style="width: 260px; height: 260px" />
				<p class="emptyText" style="line-height: 0">暂无数据</p>
			</template>
		</el-table>
		<div class="footer">
			<slot name="footer">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:page-sizes="[10, 20, 50]"
					:page-size="queryParams.pageSize"
					:current-page="queryParams.pageNum"
					background
					layout="total, sizes, prev, pager, next, jumper"
					:total="listCount"
				>
				</el-pagination>
			</slot>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		contentTableConfig: {
			type: Object,
		},
		queryParams: {
			type: Object,
		},
		tableData: {
			type: Array,
			default: () => [],
		},
		listCount: {
			type: Number,
			default: 0,
		},
		loading: {
			type: Boolean,
			default: true,
		},
		rowKey: {
			type: String,
			default: 'id',
		},
		//页面高度
		heigth: {
			type: Number,
			default: window.innerHeight - 240,
		},
	},
	data() {
		return {
			ids: [],
		};
	},
	created() {},
	mounted() {
	},
	methods: {
		handleSizeChange(val) {
			this.$emit('sizeChange', val);
		},
		handleCurrentChange(val) {
			this.$emit('currentChange', val);
		},
		handleSelectionChange(selection) {
			this.ids = selection.map((item) => item[this.rowKey]);
			this.$emit('multipleChoiceEvent', this.ids);
		},
		handleRowClick(val) {
			this.$emit('handleRowClick', val);
		},
		clearSelect() {
			this.$refs.table.clearSelection();
		},
		getRowKeys(row) {
			let rowKey = this.rowKey;
			console.log(rowKey);
			return row.rowKey;
		},
	},
};
</script>

<style scoped lang="scss">
.header {
	display: flex;
	height: auto;
	padding: 0 5px;
	justify-content: space-between;
	align-items: center;

	.title {
		font-size: 20px;
		font-weight: 700;
	}
	.handler {
		text-align: center;
	}
}
.footer {
	.el-pagination {
		text-align: center;
		margin-top: 20px;
	}
}
</style>
