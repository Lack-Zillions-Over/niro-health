import React from 'react';
import { Modal } from 'antd';

interface Props {
  title: string;
  open: boolean;
  children: React.ReactNode;
  onCancel: () => void;
}

export default function Component(props: Props) {
  return (
    <Modal
      title={props.title}
      open={props.open}
      onCancel={props.onCancel}
      footer={null}
    >
      {props.children}
    </Modal>
  );
}
