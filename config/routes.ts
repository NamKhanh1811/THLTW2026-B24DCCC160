export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/products',
		name: 'Products',
		icon: 'ShoppingOutlined',
		component: './products',
	},
	{
		path:'/orders',
		name: 'Orders',
		component:'@/pages/orders'
	},
	{
		path: '/TH01-game',
		name: 'Game đoán số',
		component: './TH01-game',
	},
	{
		path: '/TH01-quanlyhoctap',
		name: 'Quản lý học tập',
		component: './TH01-quanlyhoctap',
	},
	{
		path: '/TH02-oantuti',
		name: 'Oẳn Tù Tì ',
		component: './TH02-oantuti',
	},
	{
		path: '/TH02-nganhangcauhoi',
		name: 'Ngân hàng câu hỏi',
		routes: [
			{
			path: '/TH02-nganhangcauhoi/khoikienthuc',
			name: 'Khối kiến thức',
			component: './TH02-nganhangcauhoi/khoikienthuc',
			},
			{
			path: '/TH02-nganhangcauhoi/monhoc',
			name: 'Môn học',
			component: './TH02-nganhangcauhoi/monhoc',
			},
			{
			path: '/TH02-nganhangcauhoi/cauhoi',
			name: 'Câu hỏi',
			component: './TH02-nganhangcauhoi/cauhoi',
			},
			{
			path: '/TH02-nganhangcauhoi/dethi',
			name: 'Đề thi',
			component: './TH02-nganhangcauhoi/dethi',
			},
		],
	},
	

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
