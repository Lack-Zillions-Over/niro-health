import getItem, { MenuItem } from '@/constants/sidebar-menu';

import { DashboardFilled } from '@ant-design/icons';

const Menu: MenuItem[] = [
  {
    key: '1',
    label: 'Dashboard',
    icon: <DashboardFilled />,
    link: '/dashboard',
  },
];

const menuSchema = Menu.map((menu) =>
  getItem(menu.label, menu.key, menu.link, menu.icon, menu.children),
);

export default menuSchema;
