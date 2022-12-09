import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import { Layout, Menu } from 'antd';
import { ApiOutlined } from '@ant-design/icons';

import * as Styles from '@/components/layout/styles';

import useUser from '@/atom/user';
import useLogout from '@/hooks/logout';

import { MenuSchema } from '@/constants/sidebar-menu';

interface Props {
  menu: MenuSchema[];
  content: React.ReactNode;
}

const Avatar = dynamic(
  () => import('@/containers/_global/_components/_avatar'),
  {
    ssr: false, // Not import this component on server side (SSR) because it's not used and cause error.
  },
);

const { Content, Footer, Sider } = Layout;

function Container(props: Props) {
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const router = useRouter();
  const user = useUser();
  const logout = useLogout();

  const handleChangePage = (link: string) => router.push(link);

  const actualMenuKey = ((key) => {
    return key ? [key.toString()] : undefined;
  })(props.menu.find((menu) => menu.link === router.pathname)?.key);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <Styles.LayoutWrapper style={{ marginLeft: !collapsed ? 200 : 80 }}>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          className="my-5"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar hash="NiroHealth" size={64} />
        </div>
        {loading
          ? user.get().id.length > 0 && (
              <div className={'m-5'}>
                <Skeleton className="rounded-full h-[30px]" />
              </div>
            )
          : user.get().id.length > 0 && (
              <Styles.LogoutWrapper
                className={
                  'border rounded-full m-5 h-[30px] hover:bg-[#1890ff]'
                }
                onClick={() => {
                  if (!isDisconnecting) {
                    setIsDisconnecting(true);
                    logout.exec();
                  }
                }}
              >
                <ApiOutlined
                  className={(isDisconnecting && 'animate-spin') || ''}
                />{' '}
                {!collapsed && <p className="ml-2">Logout</p>}
              </Styles.LogoutWrapper>
            )}
        {loading ? (
          <div className={'m-2'}>
            {props.menu.map((menu) => (
              <Skeleton key={menu.key} className="h-[40px]" circle={false} />
            ))}
          </div>
        ) : (
          <Menu
            theme="dark"
            defaultSelectedKeys={actualMenuKey}
            mode="inline"
            items={props.menu.map((menu) => {
              return {
                ...menu.item,
                onClick: () => handleChangePage(menu.link),
              } as any;
            })}
          />
        )}
      </Sider>
      <Layout className="bg-[#e3e3e3]">
        <Content style={{ height: '100vh', overflow: 'initial' }}>
          {props.content}
        </Content>
        <Footer className="bg-[#ffb700] text-[#e3e3e3] text-[12px] text-center font-bold py-2 h-[1rem]">
          <p className="text-[10px] lg:text-[12px]">
            Niro Health - 2022 © All rights reserved.
          </p>
        </Footer>
      </Layout>
    </Styles.LayoutWrapper>
  );
}

export default Container;
