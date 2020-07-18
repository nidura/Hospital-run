import {
    Form, Input, DatePicker, Tooltip, Icon, Cascader, Select, Row, Col, Upload, InputNumber, Checkbox, Button, Dropdown,
    Menu, AutoComplete, Table, Divider, Tag, Modal, Radio, Spin, Card, message
} from "antd";
import React, { Component } from "react";
import TextArea from "antd/lib/input/TextArea";
import applicationAPI from "../../../resources/applicationAPI";
import { postApi, getApi } from "../../ApiContent";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const styles = theme => ({ layoutRoot: {} });
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
    }
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0
        },
        sm: {
            span: 16,
            offset: 8
        }
    }
};

const ChefUpdateForm = Form.create()(
    class extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                loading: false,

            };

        }

        handleUpdate = e => {
            const form = this.props.form;

            form.validateFields(async (err, values) => {
                if (err) {
                    return;
                } else {
                    console.log("values from modal", values);
                    this.setState({ loading: true });
                    let chef = {
                        ID_CHEF: this.props.updateID,
                        ChefName: values.ChefName,
                        title: values.title,
                        address: values.address,
                        city: values.city,
                        nic: values.nic,
                        tel: values.tel,
                        email: values.email,
                    };
                    try {
                        const result = await postApi(applicationAPI.updateChefs, chef);
                        if (result.data.success) {
                            message.success(result.data.message);
                            this.props.form.resetFields();
                            this.props.getChefs();
                            this.props.onUpdateModalClose();
                        } else message.error(result.data.message);
                    } catch (error) {
                        message.error("Error Action Change");
                    } finally {
                        this.setState({
                            loading: false,
                        });
                    }
                }
            });
        };


        render() {
            const {
                visible, onCancel, onCreate, form, loading, departmentOptions, designationOptions, locationOptions, editorState, onEditorStateChange, onClear,
                formStatus, data, handleSubmit } = this.props;
            const { getFieldDecorator } = this.props.form;

            const handleOk = e => {
                const form = this.formUpdate.props.form;
                form.validateFields((err, values) => {
                    if (err) {
                        console.log("values", values);
                    }
                });
                this.props.onUpdateModalClose();
            };

            const handleCancel = e => {
                this.props.onUpdateModalClose();
            };

            const handleReset = e => {
                this.props.form.resetFields();
                this.props.onUpdateModalClose(); // for reset if removed images
            };

            const initialVal = this.props.updatingCustomer;
            console.log("rrrrrrrrrrr", initialVal)

            return (
                <Modal
                    visible={this.props.visible}
                    title="Update Customer"
                    //okText="Create"
                    onCancel={handleCancel}
                    width="50%"
                    onOk={handleOk}
                    maskClosable={false}
                    footer={
                        formStatus == "view"
                            ? null
                            : [
                                <Button key="reset" type="danger" onClick={handleReset}>
                                    Reset
                    </Button>,
                                <Button
                                    key="send"
                                    disabled={this.state.isImageUploading}
                                    type="primary"
                                    loading={this.props.loading}
                                    onClick={this.handleUpdate}
                                >
                                    Update
                    </Button>,
                                <Button key="close" type="danger" onClick={handleCancel}>
                                    Close
                    </Button>
                            ]
                    }
                >
                    <Form onSubmit={this.handleSubmit} layout="vertical" className="customerForm">

                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem

                                    label="Title"
                                >
                                    {getFieldDecorator("title", {
                                        initialValue: initialVal.TITLE
                                    })(
                                        <Select
                                            style={{ width: "100%" }}
                                            showSearch
                                            style={{ width: "100%" }}
                                            placeholder="Select Title"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.props.children
                                                    .toLowerCase()
                                                    .indexOf(input.toLowerCase()) >= 0
                                            }
                                            disabled={formStatus == "view"}
                                            onChange={this.onChangePostingCountry}
                                        >
                                            <Option value="Mr">Mr</Option>
                                            <Option value="Mrs">Mrs</Option>
                                            <Option value="Ms">Ms</Option>
                                            <Option value="Miss">Miss</Option>
                                            <Option value="Dr">Dr</Option>
                                            <Option value="Professor">Professor</Option>
                                            <Option value="Venerable">Venerable</Option>
                                            <Option value="Company">Company</Option>
                                            <Option value="Mx">Mx</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem

                                    label="Chef Name"
                                >
                                    {getFieldDecorator("ChefName", {
                                        initialValue: initialVal.NAME,
                                        rules: [
                                            { required: true, message: "Customer Name Required!" }
                                        ]
                                    })(<Input type="text" placeholder="Customer Name" />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem

                                    label="NIC"
                                >
                                    {getFieldDecorator("nic", {
                                        initialValue: initialVal.NIC,
                                        rules: [
                                            {
                                                required: true,
                                                message: "NIC Required!"
                                            }
                                        ]
                                    })(<Input type="text" placeholder="NIC" />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem

                                    label="Contact Number"
                                >
                                    {getFieldDecorator("tel", {
                                        initialValue: initialVal.MOBILE,
                                        rules: [
                                            {
                                                required: true,
                                                message: "Contact Number Required!"
                                            }
                                        ]
                                    })(<Input type="text" placeholder="Contact Number" />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem

                                    label="Email"
                                >
                                    {getFieldDecorator("email", {
                                        initialValue: initialVal.EMAIL,
                                        rules: [
                                            {
                                                required: true,
                                                message: "Email Required!"
                                            }
                                        ]
                                    })(<Input type="email" placeholder="Email" />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem

                                    label="Address"
                                >
                                    {getFieldDecorator("address", {
                                        initialValue: initialVal.ADDRESS,
                                        rules: [
                                            {
                                                required: true,
                                                message: "Address Required!"
                                            }
                                        ]
                                    })(
                                        <TextArea

                                            placeholder="Address"
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem

                                    label="City"
                                >
                                    {getFieldDecorator("city", {
                                        initialValue: initialVal.CITY,
                                        rules: [
                                            {
                                                required: true,
                                                message: "City Required!"
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder="City"
                                        />
                                    )}
                                </FormItem>

                            </Col>
                        </Row>
                    </Form>
                </Modal>
            );
        }
    }
);

export default ChefUpdateForm;
