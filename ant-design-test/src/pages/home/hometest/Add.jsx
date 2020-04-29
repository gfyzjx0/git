import {Form, Input, Button, message} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout'
import {connect} from 'dva';
import React from 'react';

// const Option=Select.Option
// const cityList=[{"cityId":"1","cityCode":"1001","cityName":"北京"},
// {"cityId":"2","cityCode":"1002","cityName":"杭州"},
// {"cityId":"3","cityCode":"1003","cityName":"上海"},
// {"cityId":"4","cityCode":"1004","cityName":"广州"}
// ]

const fromLayout={
    labelCol: {span:4},
    wrapperCol: {span:18},
}

class PersonAdd extends React.Component{
    state={
        key:'',
        name:'',
        age:'',
        cityId:'',
        cityName:'',
        address:''
    }

    // /**
    //  * select改变事件
    //  */
    // handleSelectChange=(cityId)=>{
    //     let find=cityList.find(item=>item.cityId==cityId);
    //     if(find){
    //         this.setState({
    //             cityId,
    //             cityName:find.cityName
    //         })
    //     }
    // }
    // /**
    //  * 状态下拉列表改变事件
    //  */
    handledSelectChangeStatus=(status)=>{
        this.setState({status})
    }

    handleClickSubmit=(e)=>{
        const{form:{validateFields},add,hideModel}=this.props;//引入validateFields方法
        // eslint-disable-next-line no-console
        console.log(Object.keys(this.state))
        validateFields(Object.keys(this.state),(err,values)=>{
            if(err) return;
            add({...this.state})
            message.success('添加成功')
            hideModel()
        });
    }

    /**
     * 处理输入框事件
     */
    handleChangeInput=(type,val)=>{
        this.setState({
          [type]:val
        })
      }

    render(){
        const{name,age,cityId,cityName,address}=this.state;
        const {getFieldDecorator}=this.props.form;
        return(
            <Form layout="horizontal">
                <Form.Item label="编号" {...fromLayout}>
                    {getFieldDecorator('key',{
                        rules: [{required:true,message:'姓名不能为空'}],
                    })(<Input placeholder="请输入编号" initialValue={key} onChange={(e)=>this.hangleChangeInput('key',e.target.value)}/>)}
                </Form.Item>
                <Form.Item label="姓名" {...fromLayout}>
                    {getFieldDecorator('name',{
                        rules: [{required:true,message:'姓名不能为空'}],
                    })(<Input placeholder="请输入姓名" initialValue={name} onChange={(e)=>this.hangleChangeInput('name',e.target.value)}/>)}
                </Form.Item>
                <Form.Item label="年龄" {...fromLayout}>
                    {getFieldDecorator('age',{
                        rules: [{required:true,message:'年龄不能为空'}],
                    })(<Input placeholder="请输入年龄" initialValue={age} onChange={(e)=>this.hangleChangeInput('age',e.target.value)}/>)}
                </Form.Item>
                <Form.Item label="城市编号" {...fromLayout}>
                    {getFieldDecorator('cityID',{
                        rules: [{required:true,message:'城市编号不能为空'}],
                    })(<Input placeholder="请输入城市编号" initialValue={cityId} onChange={(e)=>this.hangleChangeInput('cityID',e.target.value)}/>)}
                </Form.Item>
                <Form.Item label="城市名" {...fromLayout}>
                    {getFieldDecorator('cityID',{
                        rules: [{required:true,message:'城市名不能为空'}],
                    })(<Input placeholder="请输入城市名" initialValue={cityName} onChange={(e)=>this.hangleChangeInput('cityName',e.target.value)}/>)}
                </Form.Item>
                <Form.Item label="住址" {...fromLayout}>
                    {getFieldDecorator('address',{
                        rules: [{required:true,message:'住址不能为空'}],
                    })(<Input placeholder="请输入住址" initialValue={address} onChange={(e)=>this.hangleChangeInput('address',e.target.value)}/>)}
                </Form.Item>
                <Form.Item>
                    <Button type='primary' block onClick={this.handleClickSubmit}>确认添加</Button>
                </Form.Item>
            </Form>)
    }
}
export default Form.create({name: 'personAdd'})(PersonAdd);