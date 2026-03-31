import route from "mock/route";
import path from "path";

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
	{
		path: '/TH03-datlich',
		name: 'Đặt lịch dịch vụ',
		routes: [
			{
			path: '/TH03-datlich/nhanvien',
			name: 'Nhân viên',
			component: './TH03-datlich/nhanvien',
			},
			{
			path: '/TH03-datlich/dichvu',
			name: 'Dịch vụ',
			component: './TH03-datlich/dichvu',
			},
			{
			path: '/TH03-datlich/lichhen',
			name: 'Lịch hẹn',
			component: './TH03-datlich/lichhen',
			},
			{
			path: '/TH03-datlich/thongke',
			name: 'Thống kê',
			component: './TH03-datlich/thongke',
			},
			{
			path: '/TH03-datlich/danhgia',
			name: 'Đánh giá',
			component: './TH03-datlich/danhgia',
			}
		],
	},
	{
		path: '/TH04-vanbang',
		name: 'Quản lý văn bằng',
		routes: [
			{
				path: '/TH04-vanbang/tracuu',
				name: 'Tra cứu',
				component: './TH04-vanbang/TraCuu',
			},
			{
				path: '/TH04-vanbang/vanbang',
				name: 'Văn bằng',
				component: './TH04-vanbang/VanBang',
			},
			{
				path: '/TH04-vanbang/quyetdinh',
				name: 'Quyết định',
				component: './TH04-vanbang/QuyetDinh',
			},
			{
				path: '/TH04-vanbang/sovanbang',
				name: 'Sổ văn bằng',
				component: './TH04-vanbang/SoVanBang',
			},
			{
				path: '/TH04-vanbang/cauhinhtruong',
				name: 'Cấu hình trường',
				component: './TH04-vanbang/CauHinhTruong',
			}
		],
	},
	{
		path: '/TH05-caulacbo',
		name: 'Quản lý câu lạc bộ',
		routes: [
			{
				path: '/TH05-caulacbo/CauLacBo',
				name: 'Câu lạc bộ',
				component: './TH05-caulacbo/CauLacBo',
			},
			{
				path: '/TH05-caulacbo/ThanhVien',
				name: 'Thành viên',
				component: './TH05-caulacbo/ThanhVien',
			},
			{
				path: '/TH05-caulacbo/DonDangKy',
				name: 'Đơn đăng ký',
				component: './TH05-caulacbo/DonDangKy',
			},
			{
				path: '/TH05-caulacbo/BaoCao',
				name: 'Báo cáo',
				component: './TH05-caulacbo/BaoCao',
			}
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
