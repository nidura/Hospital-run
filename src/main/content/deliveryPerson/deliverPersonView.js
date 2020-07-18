import { withStyles } from "@material-ui/core/styles";
import { Button, Card, Col, Divider, Form, Icon, Input, message, Popconfirm, Radio, Row, Select, Spin, Table, Tooltip } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { connect } from 'react-redux';
import DeliveryPersonForm from "./deliverPersonCreate";
import DeliveryPersonUpdateForm from "./deliverPersonUpdate";
import applicationAPI from "../../../resources/applicationAPI";
import { getApi, postApi } from "../../ApiContent";

const styles = theme => ({
    layoutRoot: {}
});

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Search = Input.Search;

// image upload
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
    }
    return isLt2M;
}

class DeliveryPersonView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            updatingDelPerson: {},
            pagination: {},
            visible: false,
            updateID: ""
        };

        this.getDeliveryPersons();
    }

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleCancel = save => {
        if (true == save) {
        } else {
            this.setState({ visible: false });
        }
    };
    handleUpdateCancel = save => {
        if (true == save) {
        } else {
            this.setState({
                updateModalVisible: false,
            });
        }
    };
    saveFormRef = formRef => {
        this.formRef = formRef;
    };
    updateFormRef = formUpdate => {
        this.formUpdate = formUpdate;
    };
    handleModalShow = (text, record, config) => {
        console.log("clicked DeleveryPerson", text);

        this.setState({
            updatingDelPerson: text,
            updateID: text.ID_DELIVERY_PERSON,
            updateModalVisible: true,
        });
        // this.getCustomerDetailsById(text.ID_CUSTOMER_PROFILE);
        // // console.log("clicked Supplier aaa", this.state.updatedPaymentDetails);
        // let updatingCustomer = text;
        // console.log(updatingCustomer);
        // this.setState({
        //     updatingCustomer,
        //     updateModalVisible: true,
        // });
    };


    getDeliveryPersons = async () => {
        this.setState({ loading: true });
        const response = await getApi(applicationAPI.getDeliveryPersons, null);
        if (response.data.success) {
            const pagination = { ...this.state.pagination };
            pagination.total = response.data.tableCount;
            this.setState({
                deliveryPersonObjAr: response.data.result,
                pagination,
                loading: false
            });
        } else {
            this.setState({ loading: false });
        }
    };


    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.getCustomers({
            results: pagination.pageSize,
            page: pagination.current,
        });
    };

    searchCustomer = e => {
        this.getCustomers({
            results: 10,
            page: 1
        });
    };

    // deleteCustomer = async row => {
    //     var obj = {
    //         customerId: row.ID_CUSTOMER_REGISTRY
    //     };

    //     try {
    //         const result = await postApi(applicationAPI.deleteCustomer, obj);
    //         if (result.data.success) {
    //             message.success("Successfully Deleted");
    //             this.getCustomers({
    //                 results: 10,
    //                 page: 1,
    //             });
    //         } else message.error(result.data.message);
    //     } catch (error) {
    //         message.error("Error Action Change");
    //     }
    // };

    render() {
        const {
            visible, onCancel, onCreate, form, loading, departmentOptions, designationOptions, locationOptions,
            editorState, onEditorStateChange, onClear, formStatus, data, handleSubmit, user, location } = this.props;

        const columns = [

            {
                title: "Delivery Person Name",
                dataIndex: "NAME"
            },
            {
                title: "City",
                dataIndex: "CITY"
            },
            {
                title: "Email",
                dataIndex: "EMAIL"
            },
            {
                title: "Contact No",
                dataIndex: "MOBILE"
            },
            {
                title: "Action",
                render: rowObj => (
                    <span>
                        {this.props.user.userPermission[this.props.location.pathname].indexOf("UPDATE") != -1 ?
                            <span>
                                <Tooltip placement="topLeft" title="Are you sure to edit?">
                                    <button
                                        type="button"
                                        onClick={() => this.handleModalShow(rowObj)}
                                    >
                                        <Icon type="edit"></Icon>
                                    </button>
                                </Tooltip>

                                <Divider type="vertical" />
                            </span> : ""}

                        {/* {this.props.user.userPermission[this.props.location.pathname].indexOf("DELETE") != -1 ?
                            <span>
                                <Tooltip placement="bottomLeft" title="Are you sure to delete ?">
                                    <button>
                                        <Popconfirm
                                            title="Sure to delete ?"
                                            onConfirm={() => this.deleteCustomer(rowObj)}
                                        >
                                            <Icon type="delete"></Icon>
                                        </Popconfirm>
                                    </button>
                                </Tooltip>
                            </span> : ""} */}
                    </span>
                )
            }
        ];

        if (this.state.loading) {
            return (
                <Spin
                    tip="Wait..."
                    size="large"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "100px",
                        height: "100px",
                        "margin-top": "-20px" /* Half the height */,
                        "margin-left": "-20px"
                    }}
                ></Spin>
            );
        } else {
            return (
                <div className="w-full p-20 background_color">
                    <Row gutter={24}>
                        <Col span={8}>
                            <img src="assets/form_image/deliveryPerson.png" className="title_image" style={{ marginLeft: "35px" }} />
                            <h1 className="form_title" style={{ marginLeft: "3%" }}>Delivery Person Master</h1>
                            <p className="sub_title"> view all Delivery Persons</p>
                        </Col>
                        {this.props.user.userPermission[this.props.location.pathname].indexOf("WRITE") != -1 ?
                            <Col span={4} offset={12}>
                                <Button type="primary" onClick={this.showModal}>
                                    Create Delivery Person
              </Button>
                            </Col> : ""}
                    </Row>
                    <DeliveryPersonForm
                        onCreateModalClose={this.handleCancel}
                        visible={this.state.visible}
                        updatingDelPerson={this.getDeliveryPersons}
                    />
                    <DeliveryPersonUpdateForm
                        visible={this.state.updateModalVisible}
                        updatingDelPerson={this.state.updatingDelPerson}
                        updateID={this.state.updateID}
                        onUpdateModalClose={this.handleUpdateCancel}
                    />

                    <div>
                        <Divider style={{ marginLeft: "1%", width: "98%" }} />
                        {this.props.user.userPermission[this.props.location.pathname].indexOf("READ") != -1 ?
                            <Card style={{ marginLeft: "1%", marginRight: "1%" }}>
                                <Table
                                    pagination={this.state.pagination}
                                    onChange={this.handleTableChange}
                                    size="small" columns={columns} loading={this.state.loading} dataSource={this.state.deliveryPersonObjAr}
                                />
                            </Card> : ""}
                    </div>
                </div>
            );
        }
    }
}

function mapStateToProps({ fuse, auth }) {
    return {
        user: auth.user
    }
}
export default withStyles(styles, { withTheme: true })(Form.create()(connect(mapStateToProps)(DeliveryPersonView)));
