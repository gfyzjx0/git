import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Popconfirm, Table, message } from 'antd';
import React, { useState } from 'react';
import { connect } from 'dva';
import { submitHome } from '../service';

const TableForm = ({ value, onChange }) => {
  const [clickedCancel, setClickedCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [cacheOriginData, setCacheOriginData] = useState({});
  const [data, setData] = useState(value);
  
  // const { submitting } = TableForm;

  const getRowByKey = (key, newData) => (newData || data)?.filter(item => item.key === key)[0];

  const toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = data?.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);

    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        cacheOriginData[key] = { ...target };
        setCacheOriginData(cacheOriginData);
      }

      target.editable = !target.editable;
      setData(newData);
    }
  };

  const newMember = () => {
    const newData = data?.map(item => ({ ...item })) || []; // eslint-disable-next-line no-unused-expressions

    newData?.push({
      key: `NEW_TEMP_ID_${index}`,
      name: '',
      age: '',
      cityId: '',
      cityName:'',
      address:'',
    });
    setIndex(index + 1);
    setData(newData);
  };

  const remove = key => {
    const newData = data?.filter(item => item.key !== key);
    setData(newData);

    if (onChange) {
      onChange(newData);
    }
  };

  const handleFieldChange = (e, fieldName, key) => {
    const newData = [...data];
    const target = getRowByKey(key, newData);

    if (target) {
      target[fieldName] = e.target.value;
      setData(newData);
    }
  };

  const saveRow = (e, key) => {
    e.persist();
    setLoading(true);
    setTimeout(() => {
      if (clickedCancel) {
        setClickedCancel(false);
        return;
      }

      const target = getRowByKey(key) || {};

      if (!target.age || !target.name || !target.cityName) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        setLoading(false);
        return;
      }

      delete target.isNew;
      toggleEditable(e, key);

      if (onChange) {
        onChange(data);
      }

      setLoading(false);
    }, 500);
  };

  const handleKeyPress = (e, key) => {
    if (e.key === 'Enter') {
      saveRow(e, key);
    }
  };

  const cancel = (e, key) => {
    setClickedCancel(true);
    e.preventDefault();
    const newData = [...data]; // 编辑前的原始数据

    let cacheData = [];
    cacheData = newData.map(item => {
      if (item.key === key) {
        if (cacheOriginData[key]) {
          const originItem = { ...item, ...cacheOriginData[key], editable: false };
          delete cacheOriginData[key];
          setCacheOriginData(cacheOriginData);
          return originItem;
        }
      }

      return item;
    });
    setData(cacheData);
    setClickedCancel(false);
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => handleFieldChange(e, 'name', record.key)}
              onKeyPress={e => handleKeyPress(e, record.key)}
              placeholder="姓名"
            />
          );
        }

        return text;
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: '10%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => handleFieldChange(e, 'age', record.key)}
              onKeyPress={e => handleKeyPress(e, record.key)}
              placeholder="年龄"
            />
          );
        }

        return text;
      },
    },
    {
      title: '城市编号',
      dataIndex: 'cityId',
      key: 'cityID',
      width: '10%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => handleFieldChange(e, 'cityId', record.key)}
              onKeyPress={e => handleKeyPress(e, record.key)}
              placeholder="城市编号"
            />
          );
        }

        return text;
      },
    },
    {
      title: '城市名称',
      dataIndex: 'cityName',
      key: 'cityName',
      width: '20%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => handleFieldChange(e, 'cityName', record.key)}
              onKeyPress={e => handleKeyPress(e, record.key)}
              placeholder="城市名称"
            />
          );
        }

        return text;
      },
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
      width: '40%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => handleFieldChange(e, 'address', record.key)}
              onKeyPress={e => handleKeyPress(e, record.key)}
              placeholder="住址"
            />
          );
        }

        return text;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        if (!!record.editable && loading) {
          return null;
        }

        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={e => saveRow(e, record.key)}>添加</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }

          return (
            <span>
              <a onClick={e => saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => cancel(e, record.key)}>取消</a>
            </span>
          );
        }

        return (
          <span>
            <a onClick={e => toggleEditable(e, record.key)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  return (
    <>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
        // rowClassName={record => (record.editable ? styles.editable : '')}
      />
      <Button
        style={{
          width: '100%',
          marginTop: 16,
          marginBottom: 8,
        }}
        type="dashed"
        onClick={newMember}
      >
        <PlusOutlined />
        新增成员
      </Button>
      {/* <Button type="primary" htmlType="submit" loading={submitting}>提交</Button> */}
    </>
  );
};

export default connect(({ home, loading }) => ({
  home,
  loading: loading.models.home,
  // submitting: loading.effects.submitClick,
}))(TableForm)

