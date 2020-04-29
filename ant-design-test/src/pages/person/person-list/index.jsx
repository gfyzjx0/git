import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';
import CreateForm from './components/CreateForm';
import { queryPerson,updatePerson,addPerson,removePerson } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async fields => {
    const hide = message.loading('正在添加');

    try {
        await addPerson({
        name: fields.name,
        age: fields.age,
        sex: fields.sex,
        });
        hide();
        message.success('添加成功');
        return true;
    } catch (error) {
        hide();
        message.error('添加失败请重试！');
        return false;
    }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async fields => {
    const hide =message.loading('正在配置');
    try{
        await updatePerson({
          name: fields.name,
          age: fields.age,
          sex: fields.sex,
          });
          hide();
          message.success('配置成功');
          return true;
        } catch (error) {
          hide();
          message.error('配置失败请重试！');
          return false;
        }
    };
 /**
 *  删除节点
 * @param selectedRows
 */
    const handleRemove =async selectedRows => {
        const hide = message.loading('正在删除');
        if (!selectedRows) return true;
      
        try {
          await removePerson({
            key: selectedRows.map(row => row.key),
          });
          hide();
          message.success('删除成功，即将刷新');
          return true;
        } catch (error) {
          hide();
          message.error('删除失败，请重试');
          return false;
        }
    };

const TableList = () =>{
    const [createModalVisible, handleModalVisible] = useState(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState(false);
    const [stepFormValues, setStepFormValues] = useState({});
    const actionRef = useRef();
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title:'年龄',
            dataIndex:'age',
        },
        {
            title:'性别',
            dataIndex:'sex',
            valueEnum:{
                0:{
                    text:'女',
                    sex:'0',
                },
                1:{
                    text:'男',
                    sex:'1',
                },
            },
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => (
              <>
                <a
                  onClick={() => {
                    handleUpdateModalVisible(true);
                    setStepFormValues(record);
                  }}
                >
                  修改
                </a>
                <Divider type="vertical" />
                <a href="">刷新</a>
              </>
            ),
          },
    ];

    return(
        <PageHeaderWrapper>
            <ProTable
                headerTitle="查询表格"
                actionRef={actionRef}
                rowKey="key"
                toolBarRender={(action,{selectedRows})=>[
                    <Button icon={<PlusOutlined/>} type="primary" onClick={() => handleModalVisible(true)}>
                        新建
                    </Button>,
                    selectedRows && selectedRows.length >0 &&(
                        <Dropdown
                        overlay={
                            <Menu
                              onClick={async e => {
                                if (e.key === 'remove') {
                                  await handleRemove(selectedRows);
                                  action.reload();
                                }
                              }}
                              selectedKeys={[]}
                            >
                              <Menu.Item key="remove">批量删除</Menu.Item>
                              <Menu.Item key="approval">批量审批</Menu.Item>
                            </Menu>
                          }
                        >
                            <Button>
                                批量操作 <DownOutlined/>
                            </Button>
                            </Dropdown>
                    ),
                ]}
                tableAlertRender={({selectedRowKeys,selectedRows})=>(
                  <div>
                     已选择{' '}
                      <a
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {selectedRowKeys.length}
                      </a>{' '}
                      项
                  </div>
                )}
                request={param =>queryPerson(param)}
                columns={columns}
                rowSelection={{}}
                />
                 <CreateForm
                    onSubmit={async value => {
                      const success = await handleAdd(value);

                      if (success) {
                        handleModalVisible(false);

                        if (actionRef.current) {
                          actionRef.current.reload();
                        }
                      }
                    }}
                    onCancel={() => handleModalVisible(false)}
                    modalVisible={createModalVisible}
                  />
                  {stepFormValues && Object.keys(stepFormValues).length ?(
                    <UpdateForm
                      onSubmit={async value => {
                        const success = await handleUpdate(value);

                        if(success) {
                          handleModalVisible(false);
                          setStepFormValues({});
                          
                          if(actionRef.current) {
                            actionRef.current.reload();
                          }
                        }
                      }}
                      onCancel={() => {
                        handleUpdateModalVisible(false);
                        setStepFormValues({});
                      }}
                      updateModalVisible={updateModalVisible}
                      values={stepFormValues}
                      />
                  ) :null
                }
        </PageHeaderWrapper>
    );
};

export default TableList;
