import React from 'react';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  id: string;
  key: string;
}

interface Props<Type> {
  columns: ColumnsType<Type>;
  data: Type[];
}

export default function Component<Type extends DataType>(props: Props<Type>) {
  return <Table columns={props.columns} dataSource={props.data} />;
}
