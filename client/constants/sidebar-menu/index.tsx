import React from 'react';
import { MenuProps } from 'antd';

export type MenuItem = {
  label: string;
  key: React.Key;
  link: string;
  icon?: React.ReactNode;
  children?: MenuChildren[];
};

export type MenuChildren = Required<MenuProps>['items'][number];

export interface MenuSchema {
  link: string;
  key: string;
  item: MenuChildren;
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  link: string,
  icon?: React.ReactNode,
  children?: MenuChildren[],
): MenuSchema {
  const item = {
    label,
    key,
    icon,
    children,
  } as MenuChildren;

  return {
    link,
    key: key.toString(),
    item
  }
}

export default getItem;
