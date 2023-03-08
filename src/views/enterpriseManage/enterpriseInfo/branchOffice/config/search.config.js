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
			// field=>字段名
			field: 'filialeName',
			type: 'input',
			label: '分公司名称',
			rules: [],
			placeholder: '请输入',
		},
	],
};
