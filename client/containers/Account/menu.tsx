import getItem, { MenuItem } from '@/constants/sidebar-menu';

import { CheckCircleOutlined, LoginOutlined } from '@ant-design/icons';

const Menu: MenuItem[] = [
  {
    key: '1',
    label: 'Confirm',
    icon: <CheckCircleOutlined />,
    link: '/account/confirm',
  },
  {
    key: '2',
    label: 'Sign In',
    icon: <LoginOutlined />,
    link: '/',
  },
];

const menuSchema = Menu.map((menu) =>
  getItem(menu.label, menu.key, menu.link, menu.icon, menu.children),
);

export default menuSchema;
