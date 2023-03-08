export const searchFormConfig = {
	colLayout: {
		xl: 4, //>1920px 一行四个
		lg: 6,
		md: 12,
		sm: 24,
		xs: 24,
	},
	showSearch: true,
	closeBtn: '重置',
	closeBtnIcon: 'el-icon-refresh',
	saveBtn: '搜索',
	saveBtnIcon: 'el-icon-search',
	formItems: [
		{
			field: 'deptName',
			type: 'input',
			label: '部门名称',
			rules: [],
			placeholder: '请输入部门名称',
		},
		{
			field: 'status',
			type: 'select',
			label: '部门状态',
			rules: [],
			placeholder: '请选择部门状态',
			options: [
				{
					value: '0',
					label: '正常',
				},
				{
					value: '1',
					label: '停用',
				},
			],
		},
	],
};
