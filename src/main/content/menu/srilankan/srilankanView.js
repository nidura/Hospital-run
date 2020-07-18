import { withStyles } from "@material-ui/core/styles";
import { Card, Col, Divider, Form, Icon, Input, message, Popconfirm, Radio, Row, Select, Spin, Tooltip } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { connect } from 'react-redux';
import applicationAPI from "../../../../resources/applicationAPI";
import { postApi } from "../../../ApiContent";

const styles = theme => ({
    layoutRoot: {}
});

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const { Meta } = Card;

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

class SriLankan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            pagination: {},
            totalCart: ""
        };
        // this.getCustomers({
        //   results: 10,
        //   page: 1,
        // });
    }

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleCancel = save => {
        if (true == save) {
        } else {
            this.setState({ visible: false, tempAttchments: [] });
        }
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    handleModalShow = (text, record, config) => {
        console.log("clicked Supplier", text);

        this.setState({
            updateID: text.ID_CUSTOMER_PROFILE,
            updateRegistryID: text.ID_CUSTOMER_REGISTRY
        });
        let updatingCustomer = text;
        console.log(updatingCustomer);
    };

    addToCart = async (id, name) => {
        this.getCardDetails();
        let item = {};
        item = {
            ID_ITEM: id,
        }
        var qty = this.props.form.getFieldValue(name)
        try {
            const response = await postApi(applicationAPI.getItemByID, item);
            if (response.data.success) {
                if (qty > 0) {
                    if ((parseInt(response.data.result[0].REMAINDER) - qty) > 0) {

                        for (let i = 0; i < await this.state.cartObjAr.length; i++) {

                            if (id == this.state.cartObjAr[i].ID_ITEM) {
                                var cartObj1 = {
                                    ID_ITEM: this.state.cartObjAr[i].ID_ITEM,
                                    QUANTITY: qty,
                                    ID_CUSTOMER: this.props.user.roleDetails.ID_EMPLOYEE_REGISTRY
                                }

                                const response2 = await postApi(applicationAPI.updateCartByItemCustomer, cartObj1);
                                if (response2.data.success) {
                                    message.success("Successfully Updated Cart")
                                    await this.showModal();
                                } else {
                                    message.error("Error Action")
                                }
                                return
                            }
                        }

                        var cartObj = {
                            ID_ITEM: id,
                            QUANTITY: qty,
                            ID_CUSTOMER: this.props.user.roleDetails.ID_EMPLOYEE_REGISTRY
                        }

                        const response1 = await postApi(applicationAPI.saveToCart, cartObj);
                        if (response1.data.success) {
                            message.success("Successfully Added To Cart")
                        } else {
                            message.error("Error Action")
                        }

                    } else {
                        message.info("Order count has exceeded, please try again later")
                    }
                } else {
                    message.info("Invalid Quantity")
                }
            } else {
                message.info("Order count has exceeded, please try again later")
            }
        }
        catch (err) {
            message.error("Invalid Action")
        } finally {
            this.props.form.resetFields();
            this.getCardDetails();

        }
    }
    getCardDetails = async () => {
        const response = await postApi(applicationAPI.getCardDetails, { ID_CUSTOMER: this.props.user.roleDetails.ID_EMPLOYEE_REGISTRY });
        if (response.data.success) {
            this.setState({
                cartObjAr: response.data.result,
            });
        }
    };

    render() {
        const {
            visible, onCancel, onCreate, form, loading, departmentOptions, designationOptions, locationOptions,
            editorState, onEditorStateChange, onClear, formStatus, data, handleSubmit, user, location } = this.props;
        const { getFieldDecorator } = this.props.form;


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
                            <img src="assets/form_image/srilankanLogo.jpeg" className="title_image" style={{ marginLeft: "35px" }} />
                            <h1 className="form_title" style={{ marginLeft: "3%" }}>Sri Lankan Corner</h1>
                        </Col>
                    </Row>
                    <Divider style={{ marginLeft: "1%", width: "98%" }} />
                    <Row gutter={24}>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/stringHoppers.png" style={{ height: "200px" }} />}
                            >
                                <Meta title="String Hoppers" description="Rs. 250" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty9", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(9, "qty9")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/hoppers.png" style={{ height: "200px" }} />}
                            >
                                <Meta title="Egg Hopper" description="Rs. 100" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty10", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(10, "qty10")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/crab.png" style={{ height: "200px" }} />}
                            >
                                <Meta title="Crab Rice" description="Rs. 1500" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty11", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(11, "qty17")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/rice.jpeg" style={{ height: "200px" }} />}
                            >
                                <Meta title="Rice and Curry" description="Rs. 350" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty12", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(12, "qty12")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={24} style={{ marginTop: "1%" }}>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/milkRice.jpeg" style={{ height: "200px" }} />}
                            >
                                <Meta title="Milk Rice" description="Rs. 150" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty13", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(13, "qty13")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/roti.png" style={{ height: "200px" }} />}
                            >
                                <Meta title="Pol Roti" description="Rs. 100" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty14", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(14, "qty14")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/cashew.jpeg" style={{ height: "200px" }} />}
                            >
                                <Meta title="Fried Cashews" description="Rs. 500" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty15", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(15, "qty15")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/chicken.jpeg" style={{ height: "200px" }} />}
                            >
                                <Meta title="Roast Chicken Leg" description="Rs 250" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty16", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(16, "qty16")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                    </Row>

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
export default withStyles(styles, { withTheme: true })(Form.create()(connect(mapStateToProps)(SriLankan)));
