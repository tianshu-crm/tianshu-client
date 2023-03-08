export const contentTableConfig = {
	propList: [
		{
			prop: 'areaName',
			label: '区域名称',
			width: '300',
		},
		{
			prop: 'areaRange',
			label: '区域范围',
			slotName: 'areaRange',
		},
		{
			prop: 'staffCount',
			label: '员工数量',
			width: '100',
		},
		{
			label: '操作',
			slotName: 'handler',
			fixed: 'right',
			width: '150',
		},
	],
	//是否显示ID
	showIndexColumn: true,
	//是否显示全选勾选
	showSelectColumn: false,
};
