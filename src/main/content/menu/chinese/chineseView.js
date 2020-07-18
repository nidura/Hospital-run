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

class Chinese extends React.Component {
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
                            <img src="assets/form_image/dragon.png" className="title_image" style={{ marginLeft: "35px" }} />
                            <h1 className="form_title" style={{ marginLeft: "3%" }}>Chinese Corner</h1>
                        </Col>
                    </Row>
                    <Divider style={{ marginLeft: "1%", width: "98%" }} />
                    <Row gutter={24}>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/porkRibs.jpg" style={{ height: "200px" }} />}
                            >
                                <Meta title="Pork Ribs" description="Rs. 1000" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty17", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(17, "qty17")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/eggPop.jpg" style={{ height: "200px" }} />}
                            >
                                <Meta title="Egg Pop" description="Rs. 250" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty18", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(18, "qty18")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/prawns.jpg" style={{ height: "200px" }} />}
                            >
                                <Meta title="Prawn Salad" description="Rs. 550" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty19", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(19, "qty19")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/noodles.jpg" style={{ height: "200px" }} />}
                            >
                                <Meta title="Chicken Noodles" description="Rs. 600" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty20", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(20, "qty20")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={24} style={{ marginTop: "1%" }}>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/vegRolls.jpg" style={{ height: "200px" }} />}
                            >
                                <Meta title="Veggy Rolls" description="Rs. 300" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty21", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(21, "qty21")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/gourmet.jpg" style={{ height: "200px" }} />}
                            >
                                <Meta title="Mix Salad" description="Rs. 500" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty22", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(22, "qty22")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/fried-fish-with-sweet-peppers.jpg" style={{ height: "200px" }} />}
                            >
                                <Meta title="Fried Fish with Sweet Peppers" description="Rs. 450" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty23", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(23, "qty23")} className="cart_image" />
                                    </Tooltip>
                                </Col>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<img src="assets/form_image/chefSalad.jpg" style={{ height: "200px" }} />}
                            >
                                <Meta title="Chef Salad" description="Rs. 800" />
                                <Col span={14}>
                                    <FormItem
                                        label="Quantity"
                                    >
                                        {getFieldDecorator("qty24", {
                                        })(
                                            <Input type="number" min={0} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <Tooltip placement="topLeft" title="Add To Cart">
                                        <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(24, "qty24")} className="cart_image" />
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
export default withStyles(styles, { withTheme: true })(Form.create()(connect(mapStateToProps)(Chinese)));
