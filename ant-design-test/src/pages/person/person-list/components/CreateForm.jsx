import React from 'react';
import { Form, Input, Modal,Radio } from 'antd';

const FormItem = Form.Item;

const RadioGroup = Radio.Group;

const CreateForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    handleAdd(fieldsValue);
  };

  return (
    <Modal
      destroyOnClose
      title="添加成员"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form}>
        <FormItem
            name="name"
            label="姓名"
            rules={[
            {
              required: true,
              message: '请输入姓名！',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
        //   labelCol={{
        //     span: 5,
        //   }}
        //   wrapperCol={{
        //     span: 15,
        //   }}
          label="年龄"
          name="age"
          rules={[
            {
              required: true,
              message: '请输入年龄！',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem name="sex" label="性别">
            <RadioGroup>
              <Radio value="0">女</Radio>
              <Radio value="1">男</Radio>
            </RadioGroup>
          </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
