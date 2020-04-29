import React, { useState } from 'react';
import { Form, Button, Input, Modal, Radio, Select, Steps } from 'antd';

const FormItem = Form.Item;
// const { Step } = Steps;
// const { TextArea } = Input;
// const { Option } = Select;
const RadioGroup = Radio.Group;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const UpdateForm = props => {
    const [formVals , setFormVals] =useState({
        name: props.values.name,
        age: props.values.age,
        sex: props.values.sex,
    });
    // const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const {
      onSubmit: handleUpdate,
      onCancel: handleUpdateModalVisible,
      updateModalVisible,
      values,
    } = props;

    const handleNext = async ()=>{
        const fieldsValue = await form.validateFields();
        setFormVals({ ...formVals, ...fieldsValue });
        handleUpdate(formVals);
    };

    const renderContent = () => {
        return (
            <>
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
          </>
        );
    };

    const renderFooter =() =>{
        return (
            <>
             <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
          <Button type="primary" onClick={() => handleNext()}>
            完成
          </Button>
          </>
        );
    };

    return(
    <Modal
        width={640}
        bodyStyle={{
            padding: '32px 40px 48px',
        }}
        destroyOnClose
        title="规则配置"
        visible={updateModalVisible}
        footer={renderFooter()}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
        >
           <Form
        {...formLayout}
        form={form}
        initialValues={{
          target: formVals.target,
          template: formVals.template,
          type: formVals.type,
          frequency: formVals.frequency,
          name: formVals.name,
          desc: formVals.desc,
        }}
      >
        {renderContent()}
      </Form>  
        </Modal>
    );
};

export default UpdateForm;