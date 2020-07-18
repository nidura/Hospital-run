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

class Italian extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            pagination: {},
            cartObjAr: [],
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
            this.setState({ visible: false });
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
                            await this.showModal();
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
                    <Form onSubmit={this.handleSubmit} layout="vertical" >
                        <Row gutter={24}>
                            <Col span={8}>
                                <img src="assets/form_image/italianLogo.jpeg" className="title_image" style={{ marginLeft: "35px" }} />
                                <h1 className="form_title" style={{ marginLeft: "3%" }}>Italian Corner</h1>
                            </Col>
                        </Row>
                        <Divider style={{ marginLeft: "1%", width: "98%" }} />
                        <Row gutter={24}>
                            <Col span={6}>
                                <Card
                                    hoverable
                                    cover={<img src="assets/form_image/spaghetti.jpg" style={{ height: "200px" }} />}
                                >
                                    <Meta title="Spaghetti" description="Rs. 350" />
                                    <Col span={14}>
                                        <FormItem
                                            label="Quantity"
                                        >
                                            {getFieldDecorator("qty1", {
                                            })(
                                                <Input type="number" min={0} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={10}>
                                        <Tooltip placement="topLeft" title="Add To Cart">
                                            <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(1, "qty1")} className="cart_image" />
                                        </Tooltip>
                                    </Col>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card
                                    hoverable
                                    cover={<img src="assets/form_image/prawnPasta.jpg" style={{ height: "200px" }} />}
                                >
                                    <Meta title="Prawn Pasta" description="Rs. 500" />
                                    <Col span={14}>
                                        <FormItem
                                            label="Quantity"
                                        >
                                            {getFieldDecorator("qty2", {
                                            })(
                                                <Input type="number" min={0} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={10}>
                                        <Tooltip placement="topLeft" title="Add To Cart">
                                            <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(2, "qty2")} className="cart_image" />
                                        </Tooltip>
                                    </Col>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card
                                    hoverable
                                    cover={<img src="assets/form_image/pizza.jpg" style={{ height: "200px" }} />}
                                >
                                    <Meta title="Chicken and Cheese Pizza" description="Rs. 1500" />
                                    <Col span={14}>
                                        <FormItem
                                            label="Quantity"
                                        >
                                            {getFieldDecorator("qty3", {
                                            })(
                                                <Input type="number" min={0} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={10}>
                                        <Tooltip placement="topLeft" title="Add To Cart">
                                            <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(3, "qty3")} className="cart_image" />
                                        </Tooltip>
                                    </Col>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card
                                    hoverable
                                    cover={<img src="assets/form_image/pizaCheese.jpg" style={{ height: "200px" }} />}
                                >
                                    <Meta title="Cheese and Onion Pizza" description="Rs. 800" />
                                    <Col span={14}>
                                        <FormItem
                                            label="Quantity"
                                        >
                                            {getFieldDecorator("qty4", {
                                            })(
                                                <Input type="number" min={0} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={10}>
                                        <Tooltip placement="topLeft" title="Add To Cart">
                                            <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(4, "qty4")} className="cart_image" />
                                        </Tooltip>
                                    </Col>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={24} style={{ marginTop: "1%" }}>
                            <Col span={6}>
                                <Card
                                    hoverable
                                    cover={<img src="assets/form_image/lasagnaChiken.jpg" style={{ height: "200px" }} />}
                                >
                                    <Meta title="Chicken Lasagna" description="Rs. 900" />
                                    <Col span={14}>
                                        <FormItem
                                            label="Quantity"
                                        >
                                            {getFieldDecorator("qty5", {
                                            })(
                                                <Input type="number" min={0} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={10}>
                                        <Tooltip placement="topLeft" title="Add To Cart">
                                            <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(5, "qty5")} className="cart_image" />
                                        </Tooltip>
                                    </Col>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card
                                    hoverable
                                    cover={<img src="assets/form_image/lasagna.jpg" style={{ height: "200px" }} />}
                                >
                                    <Meta title="Chicken Pie" description="Rs. 900" />
                                    <Col span={14}>
                                        <FormItem
                                            label="Quantity"
                                        >
                                            {getFieldDecorator("qty6", {
                                            })(
                                                <Input type="number" min={0} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={10}>
                                        <Tooltip placement="topLeft" title="Add To Cart">
                                            <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(6, "qty6")} className="cart_image" />
                                        </Tooltip>
                                    </Col>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card
                                    hoverable
                                    cover={<img src="assets/form_image/chikenLasgna.jpg" style={{ height: "200px" }} />}
                                >
                                    <Meta title="Lasagna Mix" description="Rs. 1000" />
                                    <Col span={14}>
                                        <FormItem
                                            label="Quantity"
                                        >
                                            {getFieldDecorator("qty7", {
                                            })(
                                                <Input type="number" min={0} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={10}>
                                        <Tooltip placement="topLeft" title="Add To Cart">
                                            <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(7, "qty7")} className="cart_image" />
                                        </Tooltip>
                                    </Col>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card
                                    hoverable
                                    cover={<img src="assets/form_image/coffee.jpg" style={{ height: "200px" }} />}
                                >
                                    <Meta title="Cappuccino" description="Rs. 250" />
                                    <Col span={14}>
                                        <FormItem
                                            label="Quantity"
                                        >
                                            {getFieldDecorator("qty8", {
                                            })(
                                                <Input type="number" min={0} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={10}>
                                        <Tooltip placement="topLeft" title="Add To Cart">
                                            <img src="assets/form_image/Cart.png" onClick={() => this.addToCart(8, "qty8")} className="cart_image" />
                                        </Tooltip>
                                    </Col>
                                </Card>
                            </Col>
                        </Row>
                    </Form>


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
export default withStyles(styles, { withTheme: true })(Form.create()(connect(mapStateToProps)(Italian)));
