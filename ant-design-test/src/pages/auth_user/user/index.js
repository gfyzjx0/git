import React from 'react'
import {Tabs, Card, Icon, Button, Menu, Dropdown, Checkbox, message} from 'antd'
import {connect} from 'dva'
import UserAddPage from './user_add'       
import UserListPage from './user_list'


const {TabPane} = Tabs;

@connect(({auth_user}) => ({
    auth_user,
    tabActiveKey: auth_user.tabActiveKey,
    searchStatus: auth_user.searchStatus,
    dealStatus: auth_user.dealStatus,
}))

class UserPage extends React.Component {   


    handleTabsChange = (key) => {
        const {dispatch, tabActiveKey} = this.props;
    
        dispatch({
            type: 'auth_user/show',
            payload: {
                tabActiveKey: key,
                tableRecordData: [],
            },
        });
    };

    handleSearchStatus = () => {
        const {dispatch, searchStatus} = this.props;
  
        dispatch({
            type: 'auth_user/show',
            payload: {
                searchStatus: !searchStatus,
            },
        });
        searchStatus ? message.success('状态:查询关闭', 3) : message.success('状态:查询开启', 3);
    };

    handleDealStatus = () => {
        const {dispatch, dealStatus} = this.props;
        dispatch({
            type: 'auth_user/show',
            payload: {
                dealStatus: !dealStatus,
            },
        });
    
        dealStatus ? message.success('状态:批量操作关闭', 3) : message.success('状态:批量操作开启', 3);
    };

    render() {
        const {tabActiveKey, searchStatus, dealStatus} = this.props;
        const menu = (
            <Menu>
                <Menu.Item key="1">
                    <Checkbox
                        checked={searchStatus}
                        onChange={this.handleSearchStatus}
                    >
                        <Icon type="search"/> 查询功能
                    </Checkbox>
                </Menu.Item>

                <Menu.Item key="2">
                    <Checkbox
                        checked={dealStatus}
                        onChange={this.handleDealStatus}
                    >
                        <Icon type="align-left"/> 批量操作
                    </Checkbox>
                </Menu.Item>
            </Menu>
        );

        const operations = (
            <Dropdown overlay={menu}>
                <Button>
                    更多操作 <Icon type="down"/>
                </Button>
            </Dropdown>
        );

        return (
            <Card style={{margin: '-1.8%'}}>
                <Tabs
                    activeKey={tabActiveKey}
                    onChange={this.handleTabsChange}
                    tabBarExtraContent={operations}
                    tabBarGutter={-10}
                >
                    <TabPane
                        tab={<Button type='primary' style={{fontWeight: '700'}}>用户列表</Button>}
                        key="1"
                    >

                        <UserListPage/>
                    </TabPane>

                    <TabPane
                        tab={<Button style={{fontWeight: '700'}}>新增用户</Button>}
                        key="2"
                    >

                        <UserAddPage/>

                    </TabPane>

                    {
                        tabActiveKey === '3' ? (
                            <TabPane
                                tab={
                                    <Button type='dashed' style={{fontWeight: '700'}}>
                                        用户编辑
                                    </Button>
                                }
                                key="3"
                                disabled
                            >

                                <UserAddPage/>

                            </TabPane>
                        ) : null
                    }
                </Tabs>
            </Card>
        );
    }
}


export default UserPage;