export const contentTableConfig = {
	propList: [
		{
			prop: 'cityName',
			label: '城市',
			width: '150',
		},
		{
			prop: 'companyName',
			label: '公司名称',
			width: '150',
		},
		{
			prop: 'companyRegAddress',
			label: '公司地址',
            width:''
		},
        {
			prop: 'legalPersonName',
			label: '法人代表',
			width: '150',
		},
        {
			prop: 'companyPhone',
			label: '联系电话',
			width: '150',
		},
		{
			prop: 'companyRegTime',
			label: '注册时间',
			width: '150',
		},
		{
			prop: 'dataCreateTime',
			label: '创建时间',
			width: '200',
		},
		{
			label: '操作',
			slotName: 'handler',
			width: '150',
			fixed: 'right',
		},
	],
	//是否显示ID
	showIndexColumn: false,
	//是否显示全选勾选
	showSelectColumn: false,
};
