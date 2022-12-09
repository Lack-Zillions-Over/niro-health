import React from 'react';

import { Form, Input, Row, Col, message } from 'antd';
import { LockOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';

import * as Styles from '@/containers/Home/input-register/styles';

import ButtonStyled from '@/containers/_global/_styles/_button';

import Messages from '@/containers/Home/input-register/messages';
import UserService from '@/services/users';

import PatternUsername from '@/utils/validators/pattern-username';
import PatternEmail from '@/utils/validators/pattern-email';

declare interface Props {
  toggleIsRegister: () => void;
  buttonLogin?: boolean;
}

export default function InputRegister({
  toggleIsRegister,
  buttonLogin = true,
}: Props) {
  const { loading, register } = UserService();

  const [form] = Form.useForm();

  const onFinish = (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    register(values.username, values.email, values.password)
      .then(() => {
        message.success(
          `Account created successfully. Check your email to verify your account.`,
        );
        toggleIsRegister();
      })
      .catch((error) => message.error(error.message));
  };

  return (
    <Form
      form={form}
      name="normal_register"
      className="register-form flex flex-col items-center justify-center"
      layout="vertical"
      onFinish={onFinish}
    >
      <Row gutter={24} className="w-[100%] lg:w-[50%]">
        <Col span={24}>
          <div
            className="p-5"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p className="text-black text-xl lg:text-[2rem] font-bold">
              Create your account
            </p>
          </div>
        </Col>
        <Col span={24}>
          <Styles.FormItemLight
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                pattern: PatternUsername,
                message: Messages.emptyOrInvalidField,
              },
            ]}
          >
            <Input
              prefix={<GlobalOutlined className="site-form-item-icon" />}
              type="text"
              placeholder="Username"
            />
          </Styles.FormItemLight>
        </Col>
        <Col span={24}>
          <Styles.FormItemLight
            name="email"
            label="Email Address"
            rules={[
              {
                required: true,
                pattern: PatternEmail,
                message: Messages.emptyOrInvalidField,
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              type="text"
              placeholder="Email"
            />
          </Styles.FormItemLight>
        </Col>
        <Col span={24} lg={12}>
          <Styles.FormItemLight
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Styles.FormItemLight>
        </Col>
        <Col span={24} lg={12}>
          <Styles.FormItemLight
            name="password_confirmation"
            label="Confirm Password"
            rules={[
              {
                required: true,
                message: 'Please confirm your Password!',
                validator: (rule, value, callback) => {
                  if (value && value !== form.getFieldValue('password')) {
                    callback('Two passwords that you enter is inconsistent!');
                  }
                  callback();
                },
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirm Password"
            />
          </Styles.FormItemLight>
        </Col>
        <Col span={24}>
          <Form.Item>
            <ButtonStyled type="primary" htmlType="submit" loading={loading}>
              Register
            </ButtonStyled>
            {buttonLogin && (
              <ButtonStyled
                type="dashed"
                loading={loading}
                className="mt-3"
                onClick={toggleIsRegister}
              >
                Login
              </ButtonStyled>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
