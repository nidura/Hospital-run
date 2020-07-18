import {
    Form, Input, DatePicker, Tooltip, Icon, Cascader, Select, Row, Col, Upload, InputNumber,
    Checkbox, Button, Dropdown, Menu, AutoComplete, Table, Divider, Tag, Modal, Radio, Spin, Card, message
} from 'antd';
import React, { Component } from 'react';
import {updatePassword} from './apis' ;


const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const UserProfileForm = Form.create()(
    class extends React.Component {

        constructor(props) {
            super(props);

            this.state = {
                loading: false,
                confirmPasswordMessage : '1234'
            }
            //this.fetchData();
    
        }

        
        handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll(async (err, values) => {
                if (!err) {
                    console.log('values from form', values);

                    if(String(values.newPassword) !== String(values.confirmedNewPassword)){
                        return message.error('Password confirmation is not correct');
                    }

                    try{
                        this.props.setLoading(true);
                        let result = await updatePassword(this.props.userId, values.newPassword, values.currentPassword);
                        if (result === 'success'){
                            message.success('Password Changed');
                            this.props.form.resetFields();
                        }else{
                            message.error('Password Change Failed');
                        }

                    }catch(error){
                        console.log('error', error);
                        message.error('Password Change Failed');
                    }finally{
                        this.props.setLoading(false);

                    }
                    
                }
            });
        }


        render() {
            const { visible, onCancel, onCreate, form, loading, departmentOptions, designationOptions,
                locationOptions, editorState, onEditorStateChange, onClear, formStatus, data } = this.props;
            const { getFieldDecorator } = form;

            const CheckboxGroup = Checkbox.Group;
            const plainOptions = ['HR', 'Accounting', 'CRM', 'Inventory', 'Sales'];

            function onChange(checkedValues) {
                console.log('checked = ', checkedValues);
            }

            return (
                <Form onSubmit={this.handleSubmit}>


                    <Row gutter={24}>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="Current Password"
                            >
                            {getFieldDecorator('currentPassword', {
                                rules: [{ required: true,min:4, message: 'Please enter current password', }]
                            })(
                                <Input
                                    disabled={formStatus == 'view'}
                                ></Input>
                            )}
                                
                            </FormItem>
                        </Col>
                        

                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="New Password"
                            >
                                {getFieldDecorator('newPassword', {
                                    rules: [{ required: true,min:4, message: 'Please enter new password', }]
                                })(
                                    <Input
                                        type="password"
                                        disabled={formStatus == 'view'}
                                    ></Input>
                                )}
                                
                            </FormItem>
                        </Col>
                        <Col span={8}>

                            <Form.Item
                                {...formItemLayout}
                                label="Confirm New Password">
                                {getFieldDecorator('confirmedNewPassword', {
                                    rules: [{ required: true,min:4, message: 'Please confim new password', }]
                                })(
                                    <Input
                                        type="password"
                                        disabled={formStatus == 'view'}
                                    ></Input>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}

                            >
                                <Button htmlType="submit" style={{ marginLeft: '1%', }} type="primary"  >Change Password</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            )
        }

    }
)

export default UserProfileForm;