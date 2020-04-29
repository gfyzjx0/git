import React from 'react'
import {Alert, Button, Divider, Dropdown, Icon, Menu, message, Modal, Table} from 'antd'

import moment from 'moment'
import {connect} from 'dva'
import UserSearchPage from './user_search'

@connect(({auth_user, loading}) => ({
    auth_user,
    loading: loading.effects['auth_user/handleListData'],
    listData: auth_user.listData,
    pagination: auth_user.pagination,
    msg: auth_user.msg,
    searchAdvanceStatus: auth_user.searchAdvanceStatus,
    searchStatus: auth_user.searchStatus,
    dealStatus: auth_user.dealStatus,
    searchParams: auth_user.searchParams,
}))

class UserListPage extends React.Component {

    state = {
        selectedCount: 0,//被选中的条数
        selectedRowKeys: [],//被选中的表格数据id集合
    };


    componentDidMount() {
        //初始化拉取表格数据
        this.handleGetListData();

    }

    //获取基本数据列表
    handleGetListData = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'auth_user/handleListData',
            //payload: {pageSize: 10, current: 1},
            payload: {pageSize: 10, page: 1},//page、current都表示当前页，但是laravel框架需要用page
        });
    };

    //分页改变
    handlePaginationChange = (pagination) => {
        const {dispatch, searchParams} = this.props;
        const params = {
            //current: pagination.current,
            page: pagination.current, //page、current都表示当前页，但是laravel框架需要用page
            pageSize: pagination.pageSize,
            ...searchParams,
        };
        dispatch({
            type: 'auth_user/handleListData',
            payload: params,
        });
    };

    //编辑
    handleTableRecordData = (record) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'auth_user/show',
            payload: {
                tabActiveKey: '3',
                tableRecordData: record,
            },
        });
    };

    //删除
    handleDelTableRecord = (id, username) => {
        const {dispatch} = this.props;
        const userNameHtml = <span>您确定要删除 <span style={{color: 'blue'}}>{username} </span>吗？</span>;
        Modal.confirm({
            title: userNameHtml,
            content: '一旦删除，数据将无法恢复，请慎重操作',
            okText: '确定',
            //okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                dispatch({
                    type: 'auth_user/handleDelData',
                    payload: {ids: [id]},
                    callback: () => {
                        //重新加载数据
                        this.handleGetListData();

                        //提示
                        message.success(this.props.msg, 3);

                    }
                });
            },
            onCancel() {
            }
        })
    };

    //批量删除
    handleDelsTableRecord = () => {
        const {dispatch} = this.props;
        const ids = this.state.selectedRowKeys;//数组
        Modal.confirm({
            title: '您确定要删除被选中的用户吗？',
            content: '一旦删除，数据将无法恢复，请慎重操作',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                dispatch({
                    type: 'auth_user/handleDelData',
                    payload: {ids: ids},
                    callback: () => {
                        // 重新加载数据
                        this.handleGetListData();

                        //将被选中重置为0
                        this.setState({selectedCount: 0});

                        //提示
                        message.success(this.props.msg, 3);

                    }
                });
            },
            onCancel() {
            }
        })
    };

    //操作
    handleTableOperation = ({key}, record) => {
        //key=1 删除 ，key=2 分配角色 ，key=3 分配权限
        if (key === '1') this.handleDelTableRecord(record.id, record.username);
    };

    menu = (record) => (
        <Menu onClick={(key) => {
            this.handleTableOperation(key, record)
        }}>
            <Menu.Item key="1">
                <a href="#">删 除</a>
            </Menu.Item>

            <Menu.Item key="2">
                <a href="#">分配角色</a>
            </Menu.Item>

            <Menu.Item key="3">
                <a href="#">分配权限</a>
            </Menu.Item>
        </Menu>
    );

    //表头
    columns = [{
        title: 'ID',
        dataIndex: 'id'
    }, {
        title: '用户名',
        dataIndex: 'username',
        render: (e) => (
            <a href="#">{e}</a>
        ),
    }, {
        title: '性别',
        dataIndex: 'sex',
        render: (e, record) => {
            return e === 'male' ? '男' : '女';
        },
    }, {
        title: '手机号码',
        dataIndex: 'phone',
    }, {
        title: '邮箱',
        dataIndex: 'email',
    }, {
        title: '注册时间',
        dataIndex: 'created_at',
        render: (e) => {
            return moment(e).format('YYYY-MM-DD HH:mm:ss');
        },
    }, {
        title: '操作',
        render: (e, record) => (
            <div>
                <a onClick={() => this.handleTableRecordData(record)}>编辑</a>
                <Divider type='vertical'/>
                <Dropdown overlay={() => this.menu(record)}>
                    <a href="#">
                        更多<Icon type="down"/>
                    </a>
                </Dropdown>
            </div>
        )
    }];

    //多选
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
                selectedCount: selectedRowKeys.length,
                selectedRowKeys: selectedRowKeys,
            });
            //注：selectedRow只能拿到当前页所选择的数据，selectedRowKeys可以同时拿到多页的id

        },
        getCheckboxProps: record => ({
            disabled: record.username === '孙盘玉',//设置该条数据不能被选择
        }),
    };


    render() {
        const {searchStatus, dealStatus, loading, pagination, listData} = this.props;
        const {selectedCount} = this.state;


        //分页配置
        const paginationParams = {
            pageSize: pagination.pageSize,
            total: pagination.total,
            current: pagination.current,
            showSizeChanger: true,
            showQuickJumper: true,
        };


        return (
            <div style={{paddingRight: '1%', paddingLeft: '1%'}}>
                {
                    searchStatus ? <UserSearchPage/> : null
                }
                <Alert
                    message={(<span>系统检索出总数据 < a href="#">{pagination.total}</a> 条</span>)}
                    type='info'
                    showIcon
                    closeText='X'
                    style={{marginBottom: '1%'}}
                />
                {
                    dealStatus ? <div style={{marginBottom: '1%'}}>
                        <Button style={{fontWeight: '700'}} type='danger'
                                onClick={this.handleDelsTableRecord}>批量删除({selectedCount})</Button>
                        <Button style={{marginRight: '1%', marginLeft: '1%', fontWeight: '700'}}
                                type='dashed'>分配角色({selectedCount})</Button>
                        <Button style={{fontWeight: '700'}} type='dashed'>分配权限({selectedCount})</Button>
                    </div> : null
                }
                <Table
                    dataSource={listData}
                    columns={this.columns}
                    rowSelection={dealStatus ? this.rowSelection : null}
                    rowKey="id"
                    size='small'
                    loading={loading}
                    pagination={paginationParams}
                    onChange={this.handlePaginationChange}
                />
            </div>
        );
    }
}

export default UserListPage;