  import { message } from 'antd';
import { 
    queryProvince,
    queryStoreData, 
    queryCity,
    queryListData, 
    queryDelData 
  } from "./service";
  
  export default {
      namespace: 'auth_user',
      state: {
          province: [],           //后台返回的身份列表数据
          city: [],               //后台返回的城市列表数据
          listData: [],          //后台返回的用户列表数据
          pagination: {},       //后台返回的分页相关数据
          tabActiveKey: '1',   //默认是用户列表Tab
          searchAdvanceStatus: false,  //是否展开高级搜索功能
          searchStatus: true,         //是否显示搜索功能
          dealStatus: false,         //是否显示批量操作
          searchParams: [],           //搜索功能的参数值
          tableRecordData: [],        //表格中一行的数据
      },
  
      effects: {
          * fetchProvince(_, { call, put }) {
              //异步拉取省份数据
              const res = yield call(queryProvince);
              if (res.isSuccess) {
                  yield put({
                      type: 'show',
                      payload: { province: res },
                  });
              } else {
                  message.warning(res.msg);
                  
              }
  
          },
  
          * fetchCity({ payload, callback }, { call, put }) {
              //异步拉取城市的数据
              const res = yield call(queryCity, payload);
              if(res.isSuccess){
                  yield put({
                      type: 'show',
                      payload: { city: res }
                  });
              }else{
                  message.warning(res.msg);
              }
              if (typeof callback === 'function') callback();
          },
  
          * handleSubmitBtn({ payload }, { call, put }) {
              //提交数据和处理提交按钮状态
              const res = yield call(queryStoreData, payload);
              if (res.isSuccess){
                  yield put({
                      type: 'show',
                      payload: res,
                  });
              }else{
                  message.warning(res.msg);
              }
          },
  
          * handleDelData({ payload, callback }, { call, put }) {
              //删除用户
              const res = yield call(queryDelData, payload);
              if(res.isSuccess){
                  yield put({
                      type: 'show',
                      payload: res,
                  });
              }else{
                  message.warning(res.msg);
              }
              if (typeof callback === 'function') callback();
          },
  
          * handleListData({ payload, callback }, { call, put }) {
              //获取用户列表
              const res = yield call(queryListData, payload);
              if(res.isSuccess){
                  yield put({
                      type: 'show',
                      payload: {
                          listData: res.list,
                          pagination: {
                              total: res.total,
                              current: payload.page,
                              pageSize: payload.pageSize,
                          },
                      },
                  });
              }else{
                  message.warning(res.msg);
              }
              if (callback) callback();
          },
  
          * handleTabKey({ payload }, { put }) {
              //改变Tabs的值
              yield put({
                  type: 'show',
                  payload: payload,
              });
          },
  
          * handleSearchParams({ payload }, { put }) {
              //保存搜索框，用户输入的参数选项值
              yield put({
                  type: 'show',
                  payload: payload,
              });
          },
  
          * handleTableRecordData({ payload }, { put }) {
              //保存表格中一行的数据
              yield put({
                  type: 'show',
                  payload: payload,
              });
          }
  
      },
  
      reducers: {
          show(state, { payload }) {
              return {
                  ...state,
                  ...payload,
              };
          },
      }
  }