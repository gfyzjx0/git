import React from 'react'
import {Button, Card, Col, DatePicker, Form, Icon, Input, Row, Select} from 'antd'
// import {FormInLineLayout, FormLayout} from '@/layouts/form/FormLayout'
import {connect} from 'dva'

const Item = Form.Item;
const Option = Select.Option;

const FormInLineLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 13,
    },
  };

  const FormLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 13,
    },
  };

@connect(({auth_user}) => ({
    searchAdvanceStatus: auth_user.searchAdvanceStatus,
    pagination: auth_user.pagination,
}))

@Form.create()
export default class UserSearchPage extends React.Component {

    //日期相关
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
    };


    //简单搜索与高级搜索互相切换
    handleSearchAdvanceStatus = () => {
        const {dispatch, searchAdvanceStatus} = this.props;
        dispatch({
            type: 'auth_user/show',
            payload: {searchAdvanceStatus: !searchAdvanceStatus},
        });
    };

    //多条件查询
    handleSearchBtn = () => {
        const {form, dispatch, pagination} = this.props;
        const paginationParams = {
            page: 1,//pagination.current,
            pageSize: 10,
        };
        form.validateFields((err, fv) => {
            if (err) return false;

            if (fv.created_at) fv.created_at = fv.created_at.format('YYYY-MM-DD');

            //保存查询条件
            dispatch({
                type: 'auth_user/handleSearchParams',
                payload: {searchParams: fv},
            });

            dispatch({
                type: 'auth_user/handleListData',
                payload: {
                    ...fv,
                    ...paginationParams,
                },
            });
        });
    };


    render() {
        const {searchAdvanceStatus, form} = this.props;
        const d = form.getFieldDecorator;

        //简单搜索
        const simpleSearch = (
            <Form {...FormInLineLayout} labelAlign='left'>
                <Row gutter={24}>
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                        <Item label='用户名称:'>
                            {d('username')(
                                <Input placeholder='请输入'/>
                            )}
                        </Item>
                    </Col>

                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                        <Item label='手机号码:'>
                            {d('phone')(
                                <Input placeholder='请输入'/>
                            )}
                        </Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                        <Item>
                            <Button type="primary" onClick={this.handleSearchBtn}>
                                查询
                            </Button>
                            <Button style={{marginLeft: 8}} onClick={() => {
                                form.resetFields()
                            }}>
                                重置
                            </Button>
                            <a style={{marginLeft: 8}} onClick={this.handleSearchAdvanceStatus}>
                                展开 <Icon type="down"/>
                            </a>
                        </Item>
                    </Col>
                </Row>
            </Form>
        );

        //高级搜索
        const advanceSearch = (
            <Form {...FormInLineLayout} labelAlign='left'>
                <Row gutter={24}>
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                        <Item label='用户名称:'>
                            {d('username')(
                                <Input placeholder='请输入'/>
                            )}
                        </Item>
                    </Col>

                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                        <Item label='手机号码:' hasFeedback>
                            {d('phone')(
                                <Input placeholder='请输入'/>
                            )}
                        </Item>
                    </Col>

                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                        <Item label='性 别:'>
                            {d('sex')(
                                <Select placeholder='请选择'>
                                    <Option key='male'>男</Option>
                                    <Option key='female'>女</Option>
                                </Select>
                            )}
                        </Item>
                    </Col>

                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                        <Item label='注册时间:'>
                            {d('created_at')(
                                <DatePicker
                                    placeholder='请选择注册时间'
                                    style={{width: '100%'}}
                                >

                                </DatePicker>
                            )}
                        </Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Item>
                            <Button type="primary" onClick={this.handleSearchBtn}>
                                查询
                            </Button>
                            <Button style={{marginLeft: 8}} onClick={() => {
                                form.resetFields()
                            }}>
                                重置
                            </Button>
                            <a style={{marginLeft: 8}} onClick={this.handleSearchAdvanceStatus}>
                                收起 <Icon type="up"/>
                            </a>
                        </Item>
                    </Col>
                </Row>
            </Form>
        );

        return (
            <Card
                style={{marginBottom: '1%'}}
                bodyStyle={{paddingBottom: 0, paddingTop: '3%'}}
            >
                {
                    searchAdvanceStatus ? advanceSearch : simpleSearch
                }
            </Card>
        );
    }
}