import React from 'react';
import { Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';

interface Props {
  data: DataNode[];
  onSelect: TreeProps['onSelect'];
  onCheck: TreeProps['onCheck'];
}

export default function Component(props: Props) {
  return (
    <Tree
      showLine
      showIcon
      defaultExpandAll
      onSelect={props.onSelect}
      onCheck={props.onCheck}
      treeData={props.data}
    />
  );
}
