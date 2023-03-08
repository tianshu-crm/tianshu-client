export const contentTableConfig = {
	propList: [
		{
			prop: 'cityName',
			label: '城市',
		},
		{
			prop: 'companyName',
			label: '公司名称',
		},
		{
			prop: 'filialeName',
			label: '分公司名称',
		},
		{
			prop: 'filialeAddress',
			label: '公司地址',
		},
		{
			prop: 'generalManager',
			label: '负责人',
		},
		{
			prop: 'filialePhone',
			label: '联系电话',
		},
		{
			prop: 'createTime',
			label: '创建时间',
		},
		{
			label: '操作',
			slotName: 'handler',
			width: '150',
			fixed: 'right',
		},
	],
	//是否显示ID
	showIndexColumn: true,
	//是否显示全选勾选
	showSelectColumn: false,
};
