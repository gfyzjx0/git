import { message } from 'antd';
import { queryHome } from './service';
import { submitHome } from './service';


export default {
  namespace: 'home',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryHome, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    *submitClick({ payload }, { call }) {
      yield call(submitHome, payload);
      message.success('提交成功');
    },
  },

  reducers: {
    show(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
