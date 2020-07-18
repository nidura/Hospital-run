import { withStyles } from '@material-ui/core/styles';
import { Button, Card, Checkbox, Col, Divider, Form, Icon, Input, InputNumber, message, Modal, Radio, Row, Select, Table, Tooltip, Upload, Popconfirm } from "antd";
import React from "react";
import { connect } from 'react-redux';
import applicationAPI from "../../../resources/applicationAPI";
import { getApi, postApi } from "../../ApiContent";
import moment from 'moment';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const styles = theme => ({
    layoutRoot: {}
});

class Cart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            cartObj: [],
            isDeliver: "none"
        };
        this.getCardDetails();
        this.generateOrderNo();
    }

    generateOrderNo = async () => {
        const response = await getApi(applicationAPI.getLastOrder, null);
        if (response.data.success) {
            var lastId = response.data.result[0].ID_ORDER
            var name = "XYZ"
            var date = new Date()
            var newId = name + "_" + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + "_" + lastId
            this.props.form.setFieldsValue({
                orderNo: newId
            })
        }
    };

    getCardDetails = async () => {
        const response = await postApi(applicationAPI.getCardDetails, { ID_CUSTOMER: this.props.user.roleDetails.ID_EMPLOYEE_REGISTRY });
        if (response.data.success) {
            this.setState({
                cartObjAr: response.data.result,
            });
        }
        this.calculateTotal()
    };


    calculateTotal = async () => {
        var cartObj = await this.state.cartObjAr
        var tot = 0;
        for (let i = 0; i < cartObj.length; i++) {
            tot += cartObj[i].TOTAL
        }

        var netAmount = parseFloat(tot)
        var serviceCharge = (netAmount * 4) / 100
        var transportCharge = this.props.form.getFieldValue("transportCharge") == null ? 0 : parseFloat(this.props.form.getFieldValue("transportCharge"))
        var tax = await (netAmount + serviceCharge + transportCharge) * 0.08

        this.props.form.setFieldsValue({
            netAmount: tot.toFixed(2),
            grandTotal: (netAmount + serviceCharge + transportCharge + tax).toFixed(2)
        })

    }

    deleteCartRecord = async row => {
        var obj = {
            ID_CART: row.ID_CART
        };

        try {
            const result = await postApi(applicationAPI.deleteCartRecord, obj);
            if (result.data.success) {
                message.success("Successfully Deleted");
                this.getCardDetails();
            } else message.error(result.data.message);
        } catch (error) {
            message.error("Error Action Change");
        }
    };


    // const result2 = await postApi(applicationAPI.sendMail, this.props.cartObjAr);

    handleSubmit = e => {

        const form = this.props.form;
        if (this.state.cartObjAr.length > 0) {
            form.validateFields(async (err, values) => {
                if (err) {
                    return;
                } else {
                    console.log("values from modal", values);
                    this.setState({ loading: true });
                    let order = {
                        ORDER_NO: values.orderNo,
                        ID_CUSTOMER: this.props.user.roleDetails.ID_EMPLOYEE_REGISTRY,
                        MILEAGE: values.distance,
                        IS_DELIVERY: values.orderingStatus,
                        TRANSPORT_CHARGE: values.transportCharge,
                        cartObj: this.state.cartObjAr
                    };
                    try {
                        const result = await postApi(applicationAPI.saveOrder, order);
                        if (result.data.success) {
                            message.success(result.data.message);
                            this.getCardDetails();
                            this.generateOrderNo()
                        } else message.error(result.data.message);
                    } catch (error) {
                        message.error("Error Action Change");
                    } finally {
                        this.props.form.resetFields()
                        this.setState({
                            loading: false,
                        });
                    }
                }
            })
        } else {
            message.info("Invalid Order")
            return
        }
    };

    updateQty = async (row, i) => {
        try {

            let item = {};
            item = {
                ID_ITEM: row.ID_ITEM,
            }
            var qty = this.props.form.getFieldValue('qty' + i)

            const response = await postApi(applicationAPI.getItemByID, item);
            if (response.data.success) {
                if ((parseInt(response.data.result[0].REMAINDER) - qty) > 0) {
                    var cartObj = {
                        ID_ITEM: row.ID_ITEM,
                        QUANTITY: qty,
                        ID_CART: row.ID_CART
                    }

                    const response1 = await postApi(applicationAPI.updateCart, cartObj);
                    if (response1.data.success) {
                        // this.calculateTotal();
                        message.success("Quantity Updated Successfully")
                    } else {
                        message.error("Error Action")
                    }

                } else {

                    message.info("Order count has exceeded, please try again later")
                    this.props.form.setFieldsValue({
                        [`qty${i}`]: row.QUANTITY
                    })

                }

            } else {
                message.info("Order count has exceeded, please try again later")
                this.props.form.setFieldsValue({
                    [`qty${i}`]: row.QUANTITY
                })
            }
        }
        catch (err) {
            message.error("Invalid Action")
        } finally {
            await this.getCardDetails();
        }

    }


    orderingStatusChange = async (e) => {
        if (e == 0) {
            this.setState({
                isDeliver: "none"
            })
        } else {
            this.setState({
                isDeliver: "block"
            })
        }
        this.props.form.resetFields("distance")
        this.props.form.resetFields("transportCharge")
        await this.calculateTotal();
    }

    distanceChanged = async (e) => {
        var distance = parseFloat(e.target.value)
        if (distance <= 3) {
            this.props.form.setFieldsValue({
                transportCharge: (distance * 50)
            })
            await this.calculateTotal();
        } else {
            message.error("Delivery is done only within 3km ")
            this.props.form.resetFields("distance")
        }
    }

    render() {
        const {
            visible, onCancel, onCreate, form, loading, departmentOptions, designationOptions, locationOptions,
            editorState, onEditorStateChange, onClear, formStatus, data, handleSubmit, user, location
        } = this.props;
        const { getFieldDecorator } = this.props.form;
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
        const CheckboxGroup = Checkbox.Group;
        const plainOptions = ["BR", "NIC", "Agreement"];

        function onChange(checkedValues) {
            console.log("checked = ", checkedValues);
        }


        const handleOk = e => {
            const form = this.formRef.props.form;
            form.validateFields((err, values) => {
                if (err) {
                    console.log("values", values);
                }
            });
            this.props.onCartModalClose();
        };

        const handleCancel = e => {

            this.props.form.resetFields();
            this.props.onCartModalClose();
        };

        const handleReset = e => {
            this.props.form.resetFields();

            this.props.onCartModalClose(); // added because of using image uploading array
        };
        const columns = [

            {
                title: "Item Name",
                dataIndex: "NAME"
            },
            {
                title: "Price",
                dataIndex: "PRICE"
            },
            {
                title: "Quantity",
                // dataIndex: "QUANTITY",
                render: (rowObj, r, i) => (
                    <span>
                        <FormItem

                            label=" "
                        >
                            {getFieldDecorator([`qty${i}`], {
                                initialValue: rowObj.QUANTITY
                            })(<Input type="number"
                                onBlur={() => this.updateQty(rowObj, i)}
                                onPressEnter={() => this.updateQty(rowObj, i)}
                            // onChange={this.updateQty(rowObj, i)}
                            />)}
                        </FormItem>


                    </span>
                )
            },
            {
                title: "Category",
                dataIndex: "CATEGORY"
            },
            {
                title: "Total",
                dataIndex: "TOTAL",
                align: "right"
            },
            {
                title: "Action",
                render: (rowObj, r, i) => (
                    <span>

                        <Tooltip placement="bottomLeft" title="Are you sure to delete ?">
                            <button>
                                <Popconfirm
                                    title="Sure to delete ?"
                                    onConfirm={() => this.deleteCartRecord(rowObj)}
                                >
                                    <Icon type="delete"></Icon>
                                </Popconfirm>
                            </button>
                        </Tooltip>
                    </span>
                )
            }
        ];

        return (
            <div className="w-full p-20 background_color">
                <Row gutter={24}>
                    <Col span={8}>
                        <img src="assets/form_image/Cart.png" className="title_image" style={{ marginLeft: "35px" }} />
                        <h1 className="form_title" style={{ marginLeft: "3%" }}>Order Cart</h1>
                    </Col>
                </Row>
                <Divider style={{ marginLeft: "1%", width: "98%" }} />
                <Form layout="vertical" >
                    <Card>
                        <Row gutter={10} >
                            <Col span={8}>
                                <FormItem
                                    label="Order Number"
                                >
                                    {getFieldDecorator("orderNo", {
                                    })(<Input readOnly={true} />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="Ordering Status"
                                >
                                    {getFieldDecorator("orderingStatus", {
                                    })(
                                        <Select
                                            style={{ width: "100%" }}
                                            showSearch
                                            placeholder="Select Ordering Status"
                                            optionFilterProp="children"
                                            onChange={this.orderingStatusChange.bind(this)}
                                            filterOption={(input, option) =>
                                                option.props.children
                                                    .toLowerCase()
                                                    .indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            <Option value="0">Take Away</Option>
                                            <Option value="1">Home Delivery</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} style={{ display: this.state.isDeliver }}>
                                <FormItem
                                    label="Distance in (Km)"
                                >
                                    {getFieldDecorator("distance", {
                                    })(<Input type="number"
                                        onChange={this.distanceChanged}
                                        min={0}
                                    />)}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row gutter={10} style={{ marginTop: '1%' }}>
                            <Col span={24}>
                                <Table
                                    pagination={false}
                                    onChange={this.handleTableChange}
                                    size="small" columns={columns} loading={this.state.loading} dataSource={this.state.cartObjAr}
                                />

                            </Col>
                        </Row>
                        <Row gutter={10} offset={14}>
                            <Row gutter={24} style={{ marginTop: '1%' }}>
                                <Col span={14} offset={10}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Net Amount"
                                    >
                                        {getFieldDecorator("netAmount", {
                                            initialValue: this.props.totalCart,
                                        })(<Input readOnly={true} style={{ textAlign: "right" }} />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24} style={{ marginTop: '1%' }}>
                                <Col span={14} offset={10}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Service Charge"
                                    >
                                        {getFieldDecorator("serviceCharge", {
                                            initialValue: "4%",
                                        })(<Input readOnly={true} style={{ textAlign: "right" }} />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24} style={{ marginTop: '1%', display: this.state.isDeliver }}>
                                <Col span={14} offset={10}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Transport Charge"
                                    >
                                        {getFieldDecorator("transportCharge", {
                                        })(<Input readOnly={true} style={{ textAlign: "right" }} />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24} style={{ marginTop: '1%' }}>
                                <Col span={14} offset={10}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Tax"
                                    >
                                        {getFieldDecorator("tax", {
                                            initialValue: "8%",
                                        })(<Input readOnly={true} style={{ textAlign: "right" }} />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24} style={{ marginTop: '1%' }}>
                                <Col span={14} offset={10}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Grand Total"
                                    >
                                        {getFieldDecorator("grandTotal", {
                                        })(<Input readOnly={true} style={{ textAlign: "right" }} />)}
                                    </FormItem>
                                </Col>
                                <Row gutter={24} style={{ marginTop: '1%' }}>
                                    <Col span={10} offset={14}>
                                        <Button type="primary"
                                            onClick={this.handleSubmit}>Confirm Order</Button>
                                    </Col>
                                </Row>
                            </Row>
                        </Row>
                    </Card>
                </Form>
            </div>
        );
    }
}

function mapStateToProps({ fuse, auth }) {
    return {
        user: auth.user
    }
}
export default withStyles(styles, { withTheme: true })(Form.create()(connect(mapStateToProps)(Cart)));
