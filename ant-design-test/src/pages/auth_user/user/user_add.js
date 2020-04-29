import React from 'react'
import {Input, Form, Row, Col, Select, Button, message, Spin} from 'antd'
// import {FormLayout, FormRules} from '@/layouts/form/FormLayout'
import {connect} from 'dva'

const Item = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

const FormLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 13,
    },
  };

@connect(({auth_user, loading}) => ({
    auth_user,
    submitting: loading.effects['auth_user/handleListData'],
    cityLoading: loading.effects['auth_user/fetchCity'],
    tableRecordData: auth_user.tableRecordData,
    tabActiveKey: auth_user.tabActiveKey,
    msg: auth_user.msg,
}))


@Form.create()
class UserAddPage extends React.Component {
    componentDidMount() {
        const {dispatch, tableRecordData, form} = this.props;
        //初始化拉取省份城市列表
        dispatch({
            type: 'auth_user/fetchProvince'
        });

        if (tableRecordData.length !== 0) {
            tableRecordData.created_at = undefined;
            //拉取城市并赋值表单
            dispatch({
                type: 'auth_user/fetchCity',
                payload: {provinceid: tableRecordData.province},
                callback: () => {
                    form.setFieldsValue(tableRecordData);
                }
            });
        }
    }

    handleTabsChange = (key) => {
        const {dispatch, tabActiveKey} = this.props;
        //改变tabs状态和清除tableRecordData
        dispatch({
            type: 'auth_user/show',
            payload: {
                tabActiveKey: key,
                tableRecordData: [],
            },
        });
    };


    //根据省份id获取对应城市
    handleProvinceChange = (provinceid) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'auth_user/fetchCity',
            payload: {provinceid: provinceid},
        });
    };

    //重置表单
    handleReSetForm = () => {
        const {form} = this.props;
        form.resetFields();
    };

    //提交数据
    handleSubmitBtn = () => {
        const {form, dispatch, tableRecordData} = this.props;
        form.validateFields((err, fv) => {
            if (err) return;

            //如果是编辑
            if (tableRecordData && tableRecordData.id) fv.id = tableRecordData.id;

            dispatch({
                type: 'auth_user/handleSubmitBtn',
                payload: fv,
            });

            //添加后重新拉取数据
            dispatch({
                type: 'auth_user/handleListData',
                payload: {pageSize: 10, page: 1},
                callback: () => {
                    //切换Tabs，到userList列表页
                    this.handleTabsChange('1');

                    //重置表单
                    this.handleReSetForm();

                    //提 示
                    tableRecordData && tableRecordData.id ? message.success(this.props.msg, 3) : message.success(this.props.msg, 3);
                }
            });

        });

    };

    render() {
        const {form, auth_user, submitting, cityLoading, tabActiveKey} = this.props;
        const d = form.getFieldDecorator;
        const {province = [], city = []} = auth_user;//设置默认为空，如果不设置默认，第一次render时会报错

        return (
            <Form {...FormLayout} labelAlign='left'>
                <Spin spinning={tabActiveKey === '3' && cityLoading}>
                    <Row gutter={24}>
                        <Col xs={24} sm={8}>
                            <Item label='姓 名'>
                                {d('username', FormRules)(<Input placeholder='请输入用户姓名'/>)}
                            </Item>
                        </Col>

                        <Col xs={24} sm={8}>
                            <Item label='性 别'>
                                {d('sex', FormRules)(
                                    <Select placeholder='请选择'>
                                        <Option value='male'>男</Option>
                                        <Option value='female'>女</Option>
                                    </Select>
                                )}
                            </Item>
                        </Col>

                        <Col xs={24} sm={8}>
                            <Item label='手机号码'>
                                {d('phone', FormRules)(<Input placeholder='请输入手机号码'/>)}
                            </Item>
                        </Col>

                        <Col xs={24} sm={8}>
                            <Item label='电子邮箱'>
                                {d('email', FormRules)(<Input placeholder='请输入电子邮箱'/>)}
                            </Item>
                        </Col>


                        <Col xs={24} sm={8}>
                            <Item label='所在省份'>
                                {d('province', FormRules)(
                                    <Select onChange={this.handleProvinceChange} placeholder='请选择'>
                                        {province.map(province => <Option key={province.provinceid}>
                                            {province.province}</Option>)}
                                    </Select>
                                )}
                            </Item>
                        </Col>

                        <Col xs={24} sm={8}>
                            <Item label='所在城市'>
                                {d('city', FormRules)(
                                    <Select placeholder='请选择'>
                                        {city.map(city => <Option key={city.cityid}>{city.city}</Option>)}
                                    </Select>
                                )}
                            </Item>
                        </Col>

                        <Col xs={24} sm={16}>
                            <Item label='用户基本情况'>
                                {d('introduce', FormRules)(
                                    <TextArea rows={4} placeholder='请简述个人基本信息'/>
                                )}
                            </Item>
                        </Col>

                    </Row>

                    <Row type='flex' justify='center'>
                        <Col xs={{span: 6}} sm={{span: 3}}><Button type='danger' onClick={this.handleReSetForm}>重
                            置</Button></Col>

                        <Col xs={{span: 6}} sm={{span: 3}}>
                            <Button type='primary' onClick={this.handleSubmitBtn} loading={submitting}>立即提交</Button>
                        </Col>

                    </Row>
                </Spin>
            </Form>
        );
    }
}

export default UserAddPage;