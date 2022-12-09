import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

type TabPosition = 'left' | 'right' | 'top' | 'bottom';

export interface Props {
  tabPosition?: TabPosition;
  items: {
    label: string;
    content: React.ReactNode;
  }[];
}

export default function Component(props: Props) {
  return (
    <Tabs tabPosition={props.tabPosition}>
      {
        props.items.map(({ label, content }) => (
          <TabPane tab={label} key={`${label}-${Date.now()}`}>
            {content}
          </TabPane>
        ))
      }
    </Tabs>
  );
};
