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
			field: 'roleName',
			type: 'input',
			label: '角色名称',
			rules: [],
			placeholder: '请输入角色名称',
		},
		{
			field: 'status',
			type: 'select',
			label: '角色状态',
			rules: [],
			placeholder: '请选择角色状态',
			options: [
				{
					label: '正常',
					value: '0',
				},
				{
					label: '停用',
					value: '1',
				},
			],
		},
	],
};
