import {
  Form, Input, DatePicker, Tooltip, Icon, Cascader, Select, Row, Col, Upload, InputNumber,
  Checkbox, Button, Dropdown, Menu, AutoComplete, Table, Divider, Tag, Modal, Radio, Spin, Card, message,
} from 'antd';
import React, { Component } from 'react';
import {updateRole} from './apis';

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

const UserRoleUpdateModal = Form.create()(


  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {

      };
    }

    handleUpdateClick = () => {
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                console.log('values from form', values);
                
                try{
                  this.setState({loading:true});
                  console.log('this.props.updateUserId',this.props.updateUserId);
                  await updateRole(this.props.updateUserId,values.role);
                  this.handleClose();
                  this.props.reloadServerData();
                  message.success('Role changed');
                }catch(error){
                  console.log('error changing role', error);
                  // message.error('failed to update role');
                }finally{
                  this.setState({loading:false});
                }
            }
        });
    }

    handleClose = () => {
      this.props.onUpdateModalClose();
    }
    

    render() {
      const {
        visible, onUpdateModalShow, onUpdateModalClose, form, formStatus,
      } = this.props;
      const { getFieldDecorator } = form;
      const { TextArea } = Input;


      const CheckboxGroup = Checkbox.Group;


      const handleCancel = (e) => {
        this.props.onUpdateModalClose();
      }

      

      function onChange(checkedValues) {
        console.log('checked = ', checkedValues);
      }

      return (

        <Modal
                    visible={this.props.updateModalVisible}
                    title="Change Role"
                    // okText="Create"
                    onCancel={handleCancel}
                    // width='520'
                    // onOk={handleOk}
                    maskClosable={false}
                    footer={formStatus == 'view' ? null : [
                        <Button key="close" onClick={handleCancel} disabled={this.state.loading} >Close</Button>,
                        <Button key="send" type="primary" loading={this.state.loading} onClick={this.handleUpdateClick}>
                                        Update
                        </Button>,
                    ]}
                    >

                    <Form onSubmit={this.handleSubmit}>

                        <Row gutter={24}>
                        <Col span={8}>
                            <FormItem
                            {...formItemLayout}
                            label="Role"
                            >
                            {getFieldDecorator('role', {
                                rules: [{ required: true, message: 'Please select role' }],
                                initialValue: this.props.updateRoleId,
                            })(
                                
                                <Select
                                    style={{ width: '100%' }}
                                    showSearch
                                    // value={this.state.updateRoleId}
                                    style={{ width: '100%' }}
                                    placeholder="Select Role "
                                    optionFilterProp="children"
                                    onChange={this.handleRoleChange}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    disabled={formStatus == 'view'}
                                >
                                                    {this.props.roles && this.props.roles.map(role => (
                                    <Option value={role.ID_AUTH_ROLE}>{role.ROLE_NAME}</Option>
                                ))
                                }
                                </Select>
                            )}

                            </FormItem>
                        </Col>

                        </Row>

                       


                    </Form>
                    </Modal>
      );
    }
  },
);

export default UserRoleUpdateModal;
