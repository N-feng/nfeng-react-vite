import { ProLayout } from '@ant-design/pro-layout';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Button, ConfigProvider, Dropdown, notification } from 'antd';
import { MenuDataItem, ProConfigProvider } from '@ant-design/pro-components';
import {
  GithubFilled,
  InfoCircleFilled,
  LogoutOutlined,
  QuestionCircleFilled,
  SmileFilled,
  CrownFilled,
  SmileOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import SearchInput from './SearchInput';
import { MenuCard } from './MenuCard';
import { bgLayoutImgList } from './_defaultProp';
import { useFetch } from '../hook/useFetch';
import { profile } from '../api/AuthController';

const IconMap = {
  smile: <SmileOutlined />,
  heart: <HeartOutlined />,
};

const loopMenuItem = (menus: any[]): MenuDataItem[] =>
  menus.map(({ icon, access, ...item }) => ({
    ...item,
    path: item.url || item.path || '/',
    name: item.actionName || item.moduleName || item.name,
    icon: icon && IconMap[icon as 'smile'],
    routes: access && loopMenuItem(access),
  }));

export default function Layout() {
  const location = useLocation();
  console.log('location: ', location);
  const token = localStorage.getItem('token');
  const { data: { username, access } }: any = useFetch(profile);
  const defaultProps = {
    route: {
      path: '/',
      routes: [
        {
          path: '/welcome',
          name: '欢迎',
          icon: <SmileFilled />,
          component: './Welcome',
        },
        {
          path: '/counter',
          name: '计算页',
          icon: <CrownFilled />,
          access: 'canAdmin',
          component: './Counter',
        },
        ...loopMenuItem(access || [])
      ],
    },
  };
  if (!token) {
    notification.error({
      message: '登录令牌为空',
      description: '请重新登录哦！',
    });
    return <Navigate to="/login" replace />
  }
  if (location.pathname === '/login') {
    return <><Outlet /></>
  }
  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById('test-pro-layout') || document.body;
          }}
        >
          <ProLayout
            prefixCls="my-prefix"
            bgLayoutImgList={bgLayoutImgList}
            {...defaultProps}
            location={{
              pathname: location.pathname,
            }}
            token={{
              header: {
                colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
              },
            }}
            menu={{
              collapsedShowGroupTitle: true,
            }}
            avatarProps={{
              src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
              size: 'small',
              title: username || '七妮妮',
              render: (props, dom) => {
                return (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'logout',
                          icon: <LogoutOutlined />,
                          label: <NavLink to="/login">退出登录</NavLink>,
                        },
                      ],
                    }}
                  >
                    {dom}
                  </Dropdown>
                );
              },
            }}
            actionsRender={(props) => {
              if (props.isMobile) return [];
              if (typeof window === 'undefined') return [];
              return [
                props.layout !== 'side' && document.body.clientWidth > 1400 ? (
                  <SearchInput />
                ) : undefined,
                <InfoCircleFilled key="InfoCircleFilled" />,
                <QuestionCircleFilled key="QuestionCircleFilled" />,
                <GithubFilled key="GithubFilled" />,
              ];
            }}
            headerTitleRender={(logo, title, _) => {
              const defaultDom = (
                <Button type='text'>
                  {logo}
                  {title}
                </Button>
              );
              if (typeof window === 'undefined') return defaultDom;
              if (document.body.clientWidth < 1400) {
                return defaultDom;
              }
              if (_.isMobile) return defaultDom;
              return (
                <>
                  {defaultDom}
                  <MenuCard />
                </>
              );
            }}
            menuFooterRender={(props) => {
              if (props?.collapsed) return undefined;
              return (
                <div
                  style={{
                    textAlign: 'center',
                    paddingBlockStart: 12,
                  }}
                >
                  <div>© 2021 Made with love</div>
                  <div>by Ant Design</div>
                </div>
              );
            }}
            onMenuHeaderClick={(e) => console.log(e)}
            menuItemRender={(item, dom) => {
              return (
                <NavLink to={item.path || '/welcome'}>
                  {dom}
                </NavLink>
              );
            }}
          >
            
            <Outlet />

          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
}
