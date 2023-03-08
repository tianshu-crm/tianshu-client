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
			field: 'areaId',
			type: 'select',
			label: '区域名称',
			rules: [],
			placeholder: '请选择区域名称',
			dictUrl: '/system/area/areaname/list',
			labelAndValue: {
				label: 'dictLabel',
				value: 'dictValue',
			},
			options: [],
		},
		{
			field: 'cityName',
			type: 'input',
			label: '区域范围',
			rules: [],
			placeholder: '请输入区域范围',
		},
	],
};
