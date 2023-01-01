import React, { useState, useEffect } from 'react';

import { Row, Col, Form, Input, Divider, Card, Button, message } from 'antd';

import * as Styles from '@/containers/Dashboard/styles';

import LayoutWithSession from '@/containers/_global/_pages/_layout-with-session';
import Menu from '@/containers/Dashboard/menu';

import useUser from '@/atom/user';

import { useSocket } from '@/context/websockets';
import { WebSocketsResponse } from '@/common/websockets-response.type';

import ChatRoomSchema from '@/schemas/chat/rooms';

import Table from '@/containers/_global/_components/_table';
import Tree from '@/containers/_global/_components/_tree';
import ModalByForm from '@/containers/_global/_components/_modalByForm';

export default function Component() {
  const [rooms, setRooms] = useState<ChatRoomSchema[]>([]);

  const [formCreateRoom] = Form.useForm();

  const user = useUser();
  const socket = useSocket();

  useEffect(() => {
    socket?.emit('rooms:findAll');
  }, [socket]);

  useEffect(() => {
    socket?.on(
      'rooms:findAll:response',
      (data: WebSocketsResponse<ChatRoomSchema[] | string>) => {
        if (!data.error) {
          setRooms(data.data as ChatRoomSchema[]);
        } else {
          message.error(`${data.message}. Error: ${data.data}`);
        }
      },
    );

    socket?.on(
      'rooms:create:response',
      (data: WebSocketsResponse<ChatRoomSchema | string>) => {
        if (!data.error) {
          setRooms((prev) => [...prev, data.data as ChatRoomSchema]);
        } else {
          message.error(`${data.message}. Error: ${data.data}`);
        }
      },
    );

    socket?.on(
      'rooms:delete:response',
      (data: WebSocketsResponse<boolean | string>) => {
        if (!data.error) {
          if (!data.data) return message.error('Error: Room not found');

          const _id = data.data as string;
          setRooms((prev) => [...prev.filter((room) => room._id !== _id)]);
        } else {
          message.error(`${data.message}. Error: ${data.data}`);
        }
      },
    );

    return () => {
      socket?.off('rooms:findAll:response');
      socket?.off('rooms:create:response');
      socket?.off('rooms:delete:response');
    };
  }, [socket]);

  return (
    <LayoutWithSession menu={Menu}>
      <Row gutter={24}>
        <Col span={24}>
          <Table
            columns={[
              {
                title: 'Room',
                dataIndex: 'name',
                key: 'name',
                render: (text: string) => <a>{text}</a>,
              },
              {
                title: 'Users',
                dataIndex: 'users',
                key: 'users',
              },
              {
                title: 'Messages',
                dataIndex: 'messages',
                key: 'messages',
              },
              {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                render: (text: string, record: any) => {
                  return (
                    <Button
                      danger
                      type="dashed"
                      onClick={() => socket?.emit('rooms:delete', record.id)}
                    >
                      Delete
                    </Button>
                  );
                },
              },
            ]}
            data={rooms.map((room) => ({
              key: room._id,
              id: room._id,
              name: room.name,
              users: room.users.length,
              messages: room.messages.length,
            }))}
          />
          <Divider />
          <Card title="Create Room">
            <Form
              name="Form create room"
              form={formCreateRoom}
              onFinish={({ name }) => {
                socket?.emit('rooms:create', name);
                formCreateRoom.resetFields();
              }}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: 'Please input name of room' },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </LayoutWithSession>
  );
}
