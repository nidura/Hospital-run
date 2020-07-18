import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple, DemoContent } from '@fuse';
import 'antd/dist/antd.css';

import {Form,Spin,Card,Input,Select,Col,Row, Checkbox,Collapse,
        Table,Button,Divider,Popconfirm,Icon} from 'antd';
import axios from 'axios/index';
import { FaBrush } from 'react-icons/fa';

import _ from 'lodash';


const styles = theme => ({
    layoutRoot: {}
});


const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

let uuid = 1;
let uuid_approve = 1;

class DocumentAuthorization extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            companyOptions :  [],
            selectedCompany : '',
            documentOptions : [],
            selectedDocument : '',
            locationOptions : [],
            selectedLocation : '',
            userOptions : [],
            allUsersOptions : [],
            dropDownDisable : 0,
            allDisable : 0
        }
        this.loadCompanies();
        this.loadDocuments();
        this.loadAllUsers();
    }


    loadCompanies = () => {
        var companyOptions = [];
        axios.get(window.systemServer + '/company/getCompaniesWhereLevelTwoUp')
            .then(response => {
               // console.log('response',response)
                if (response.data.success) {
                   // console.log('response company', response.data)
                    var companyObj = response.data.results;
                    for (var i = 0; i < companyObj.length; i++) {
                        companyOptions.push(
                            <Option
                                key={companyObj[i].ID_COMPANY}>{companyObj[i].NAME}
                            </Option>
                        );
                    }
                }
               // console.log("Company : " + companyOptions);
                this.setState({ companyOptions: companyOptions });
               // console.log("Company in status : " + this.state.companyOptions);
    
            }).catch(function (error) {
                console.log("Company err " + error);
                console.log("No internet connection or Internal error");
            });
    }

    selectCompany = (value) => {
        this.setState({ selectedCompany: value }, () => {
            console.log(this.state.selectedCompany);  
            this.props.form.resetFields('LOCATION');
        var locationOptions = [];
        axios.get(window.systemServer + '/location/get/getLocationsByCompanyId',
                    { params: {
                        companyId: this.state.selectedCompany,
                    }})
            .then(response => {
               // console.log('response',response)
                if (response.data.success) {
                   //console.log('response location', response.data)
                    var locationObj = response.data.locations;
                    for (var i = 0; i < locationObj.length; i++) {
                        locationOptions.push(
                            <Option
                                key={locationObj[i].ID_LOCATION}>{locationObj[i].LOCATION_NAME}
                            </Option>
                        );
                    }
                }
               // console.log("Location : " + locationOptions);
                this.setState({ locationOptions: locationOptions });
               // console.log("Location in status : " + this.state.locationOptions);
    
            }).catch(function (error) {
                console.log("Location err " + error);
                console.log("No internet connection or Internal error");
            });
        });
        
    }


    loadDocuments = () => {
        var documentOptions = [];
        axios.get(window.authServer + '/documentAuthorization/getDocuments')
            .then(response => {
               // console.log('response',response)
                if (response.data.success) {
                    console.log('response document', response.data)
                    var documentObj = response.data.results;
                    for (var i = 0; i < documentObj.length; i++) {
                        documentOptions.push(
                            <Option
                                key={documentObj[i].ID_DOCUMENT}>{documentObj[i].DOCUMENT_NAME}
                            </Option>
                        );
                    }
                }
                console.log("Company : " + documentOptions);
                this.setState({ documentOptions: documentOptions });
                console.log("Company in status : " + this.state.documentOptions);
    
            }).catch(function (error) {
                console.log("Company err " + error);
                console.log("No internet connection or Internal error");
            });
    }

    selectDocument = (value) => {
        this.setState({ selectedDocument: value }, () => {
            console.log(this.state.selectedDocument);  
        });

    }

    selectLocation = (value) => {
        console.log("value location", value[0])
        if(value[0]=='all'){
            this.setState({dropDownDisable:1,allDisable:0})
        }else if(value[0]==undefined){
            this.setState({dropDownDisable:0 ,allDisable:0})
        }else{
            this.setState({dropDownDisable:0 ,allDisable:1})
        }

        
        
        this.props.form.resetFields(['CHECK_LEVEL[1]','CHECK_LEVEL[2]','CHECK_LEVEL[3]','CHECK_LEVEL[4]','CHECK_LEVEL[5]','CHECK_LEVEL[6]','CHECK_LEVEL[7]','CHECK_LEVEL[8]','CHECK_LEVEL[9]','CHECK_LEVEL[10]',
                                    'APPROVE_LEVEL[1]','APPROVE_LEVEL[2]','APPROVE_LEVEL[3]','APPROVE_LEVEL[4]','APPROVE_LEVEL[5]','APPROVE_LEVEL[6]','APPROVE_LEVEL[7]','APPROVE_LEVEL[8]','APPROVE_LEVEL[9]','APPROVE_LEVEL[10]'
                                    ]);
        this.setState({ selectedLocation: value  }, () => {
            console.log(this.state.selectedLocation); 
            var userOptions = []; 
            var reqObj = {
                ID_LOCATION : this.state.selectedLocation
            }
            axios.post(window.authServer + '/documentAuthorization/usersByLocation',reqObj)
            .then(response => {
               // console.log('response',response)
               userOptions = []; 
                if (response.data.success) {
                    console.log('response user', response.data)
                    var userObj = response.data.results;
                    for (var i = 0; i < userObj.length; i++) {
                        
                        userOptions.push(
                            <Option
                                key={userObj[i].ID_USER}>{userObj[i].REGISTRY_CODE_PREFIX+' '+userObj[i].ID_EMPLOYEE_REGISTRY+' '+userObj[i].REGISTRY_CODE_SUFFIX+' - '+userObj[i].FIRSTNAME+' '+userObj[i].MIDDLENAME+' '+userObj[i].LASTNAME}
                            </Option>
                        );
                    }
                }
                console.log("Users : " + userOptions);
                this.setState({ userOptions: userOptions });
                console.log("Users in status : " + this.state.userOptions);
    
            }).catch(function (error) {
                console.log("User err " + error);
                console.log("No internet connection or Internal error");
            });

        });

    }


    loadAllUsers = () => {
        var allUsersOptions = [];
        axios.get(window.authServer + '/documentAuthorization/getAllUsers')
            .then(response => {
               // console.log('response',response)
                if (response.data.success) {
                    console.log('response all Users', response.data)
                    var allUsersObj = response.data.results;
                    for (var i = 0; i < allUsersObj.length; i++) {
                        allUsersOptions.push(
                            <Option
                                key={allUsersObj[i].ID_USER}>{allUsersObj[i].REGISTRY_CODE_PREFIX+' '+allUsersObj[i].ID_EMPLOYEE_REGISTRY+' '+allUsersObj[i].REGISTRY_CODE_SUFFIX+' - '+allUsersObj[i].FIRSTNAME+' '+allUsersObj[i].MIDDLENAME+' '+allUsersObj[i].LASTNAME}
                            </Option>
                        );
                    }
                }
                console.log("All Users : " + allUsersOptions);
                this.setState({ allUsersOptions: allUsersOptions });
                console.log("All User in status : " + this.state.allUsersOptions);
    
            }).catch(function (error) {
                console.log("All Users err " + error);
                console.log("No internet connection or Internal error");
            });
    }



    //add remove function for checked by---------------->Start
    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        // console.log(keys);
        // console.log(uuid);
        // console.log(nextKeys);
        uuid++;
        // console.log(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }
        uuid--;
        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }
    //add remove function for checked by---------------->End


    //add remove function for approve by---------------->Start
    add_approve = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys_approve = form.getFieldValue('keys_approve');
        const nextKeys_approve = keys_approve.concat(uuid_approve);
        // console.log(keys);
        // console.log(uuid);
        // console.log(nextKeys);
        uuid_approve++;
        // console.log(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys_approve: nextKeys_approve,
        });
    }

    remove_approve = (k_approve) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys_approve = form.getFieldValue('keys_approve');
        // We need at least one passenger
        if (keys_approve.length === 1) {
            return;
        }
        uuid_approve--;
        // can use data-binding to set
        form.setFieldsValue({
            keys_approve: keys_approve.filter(keys_approve => keys_approve !== k_approve),
        });
    }
    //add remove function for approve by---------------->End


    handleClear = () => {
        this.props.form.resetFields();
        uuid = 1;
        uuid_approve = 1
      }


      handleSave = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          console.log('Received values of form: ', values);
        });
      }

    render() {
        
        const { getFieldDecorator,getFieldValue  } = this.props.form;

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

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
              xs: { span: 24, offset: 0 },
              sm: { span: 20, offset: 7 },
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
                offset: 16,
              },
            },
          };


        const table_columns = [
            {
                title: 'No',
                dataIndex: 'NO',
            },
            {
                title: 'Created Date',
                dataIndex: 'CREATED_DATE',
            },
            {
                title: 'Level',
                dataIndex: 'LEVEL',
            },
            {
                title: 'Checking',
                dataIndex: 'CHECKING',
            },
            {
                title: 'Approving',
                dataIndex: 'APPROVING',
            },
            {
                title: 'Actions',
                dataIndex: '',
                key: 'Actions',
                render: (text, record) => (
                    <span>
                        <Button type="default" title="Edit" shape="circle" icon="edit" size={"small"} onClick={() => this.showEditModal(record)} />
                        <Divider type="vertical" />
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteRecord(record.ID_ALLOWANCE_DEDUCTION)}>
                            <Button
                                type="danger"
                                title="Delete"
                                shape="circle"
                                icon="delete"
                                size={"small"} />
                        </Popconfirm>
                    </span>
                )
            }
        ]

//checked by components------------------------>Start
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
               
               <Row gutter={8}>
                   <Col span={20}>
                        <FormItem
                            {...formItemLayout}
                            label={`Check Level ${k}`}
                        >
                            {getFieldDecorator(`CHECK_LEVEL[${k}]`, {
                                
                            })(
                                <Select
                                    style={{ width: '100%' }}
                                    mode ='multiple'
                                    showSearch
                                    placeholder="Select a User"
                                    optionFilterProp="children"
                                    allowClear = {true}
                                    //onChange={this.selectCompany}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    { getFieldValue(`CHECK_LEVEL_CHECK_BOX[${k}]`) ==true || this.state.selectedLocation[0]=='all'?this.state.allUsersOptions:this.state.userOptions}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2}
                    >
                        <FormItem 
                        >
                            {getFieldDecorator(`CHECK_LEVEL_CHECK_BOX[${k}]`, {
                        
                        })(
                        <Checkbox 
                            style={{marginLeft:'2%'}}
                            //onChange= {this.selectCheckBox}
                        >
                            All Users
                        </Checkbox>
                    )}
                        </FormItem>
                    
                    </Col>
                   
                    <Col span={2}>
                    {keys.length > 1 && index != 0 ?<Button
                    disabled={k!=keys.length}
                    onClick={() => this.remove(k)}
                    shape="circle"
                    className="dynamic-delete-button"
                    icon="minus"
                    >
                        </Button>:null}
                                
                    </Col>
               </Row>
                
               
                    
                
            );
        });
//checked by components------------------------>End


//approved by components------------------------>Start
    getFieldDecorator('keys_approve', { initialValue: [] });
    const keys_approve = getFieldValue('keys_approve');
    const formItems_approve = keys_approve.map((k_approve, index_approve) => {
        return (
        
            <Row>
                <Col span={20}>
                    <FormItem
                        {...formItemLayout}
                        label={`Approve Level ${k_approve}`}
                    >
                        {getFieldDecorator(`APPROVE_LEVEL[${k_approve}]`, {
                            
                        })(
                            <Select
                                style={{ width: '100%' }}
                                mode ='multiple'
                                showSearch
                                placeholder="Select a User"
                                optionFilterProp="children"
                                allowClear = {true}
                                //onChange={this.selectCompany}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}

                            >

                                { getFieldValue(`APPROVE_LEVEL_CHECK_BOX[${k_approve}]`) ==true || this.state.selectedLocation[0]=='all'?this.state.allUsersOptions:this.state.userOptions}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={2}>
                <FormItem 
                    >
                        {getFieldDecorator(`APPROVE_LEVEL_CHECK_BOX[${k_approve}]`, {
                            
                        })(
                            <Checkbox style={{marginLeft:'2%'}}>
                                All Users
                            </Checkbox>
                        )}
                    </FormItem>
                        
                </Col>
            
                <Col span={2}>
                {keys_approve.length > 1 && index_approve != 0 ?<Button
                disabled={k_approve!=keys_approve.length}
                onClick={() => this.remove_approve(k_approve)}
                shape="circle"
                className="dynamic-delete-button"
                icon="minus"
                >
                    </Button>:null}
                            
                </Col>

            </Row>
              
        );
    });
//approved by components------------------------>End
      

        if (this.state.loading) {
            return (
                <Spin tip="Loading..." size="large"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100px',
                        height: '100px',
                        'margin-top': '-20px', /* Half the height */
                        'margin-left': '-20px'
                    }}
                >
                </Spin>
            );
        }
        else {

            return (
                <div>
                    <br/>
                    <h1 style={{marginLeft:'2%'}}>Document Authorization</h1>
                    <Form onSubmit={this.handleSave}>
                        <Card style={{marginLeft:'2%',marginRight:'2%'}}>
                            
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="Company Name"
                                        >
                                            {getFieldDecorator('COMPANY_NAME', {
                                                rules: [{
                                                    required: true, message: 'Please select a company.',
                                                }],
                                        
                                            })(
                                                <Select
                                                    style={{ width: '100%' }}
                                                    showSearch
                                                    placeholder="Select a company"
                                                    optionFilterProp="children"
                                                    allowClear = {true}
                                                    onChange={this.selectCompany}
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                >
                                                    {this.state.companyOptions}
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="Document Name"
                                        >
                                            {getFieldDecorator('DOCUMENT_NAME', {
                                                rules: [{
                                                    required: true, message: 'Please select a document.',
                                                }],
                                            })(
                                                <Select
                                                    style={{ width: '100%' }}
                                                    showSearch
                                                    placeholder="Select a document"
                                                    optionFilterProp="children"
                                                    allowClear = {true}
                                                    onChange={this.selectDocument}
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                >
                                                    {this.state.documentOptions}
                                                </Select>
                                            )}
                                        </FormItem>   
                                    </Col>
                                </Row> 
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="Location"
                                        >
                                            {getFieldDecorator('LOCATION', {
                                                    rules: [{
                                                        required: true, message: 'Please select a location.',
                                                    }],
                                            })(
                                                <Select
                                                    style={{ width: '100%' }}
                                                    mode="multiple"
                                                    showSearch
                                                    placeholder="Select a location"
                                                    optionFilterProp="children"
                                                    allowClear = {true}
                                                    onChange={this.selectLocation}
                                                    disabled = {this.state.selectedCompany=='' || this.state.selectedCompany==undefined}
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                >
                                                    <Option key='all'
                                                        disabled={this.state.allDisable==1}>All</Option>
                                                    {this.state.dropDownDisable==0?this.state.locationOptions:null}
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>        

                        </Card>
                    
                        <Collapse style={{marginLeft:'2%', marginTop:'1%',marginRight:'2%'}}>
                            <Panel header="Checked By">
                                {formItems} 
                           <FormItem
                                {...formItemLayoutWithOutLabel}
                           >
                                <Button 
                                type="dashed" onClick={this.add} style={{ width: '60%' }}>
                                    <Icon type="plus" /> Add Check Levels
                                </Button>
                           </FormItem>
                                
                            </Panel>
                        </Collapse>

                        <Collapse style={{marginLeft:'2%', marginTop:'1%',marginRight:'2%'}}>
                            <Panel header="Approved By">
                            
                                {formItems_approve}
                           
                            
                           <FormItem
                                {...formItemLayoutWithOutLabel}
                           >
                                <Button 
                                type="dashed" onClick={this.add_approve} style={{ width: '60%' }}>
                                    <Icon type="plus" /> Add Approve Levels
                                </Button>
                           </FormItem>
                            </Panel>
                        </Collapse>
                        <Row>
                        <Col span={12}>
                        </Col>
                           <Col span={12}>
                                <FormItem
                                    {...tailFormItemLayout}


                                >
                                    <Button
                                        //type='primary'
                                        style={{marginTop:'2%'}}
                                        onClick = {this.handleClear}
                                    >
                                        <FaBrush/>
                                        Clear
                                    </Button>
                                    <Button
                                        type='primary'
                                        style={{marginTop:'2%',marginLeft:'2%'}}
                                        icon='save'
                                        htmlType="submit"
                                    >
                                        Save
                                    </Button>
                                   
                                </FormItem>
                               
                           </Col>
                       </Row>
                    </Form>
                    
                    <Card style={{marginLeft:'2%',marginRight:'2%',marginTop:'1%'}}>
                        <Row>
                            <Col span={12}>
                            </Col>
                            <Col span={12}>
                            <FormItem
                                    {...tailFormItemLayout}


                                >
                                    <Button
                                        
                                        style={{marginTop:'2%',marginLeft:'30%',backgroundColor:'#219E4A',color:'white'}}
                                        icon='export'
                                    >
                                        Export
                                    </Button>
                                   
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Document Name"         
                                    >
                                        {getFieldDecorator('DOCUMENT_NAME_TABLE', {
                                                   
                                    })(
                                        <Select 
                                            style={{ width: '100%' }}
                                            showSearch
                                            placeholder="Select a document"
                                            optionFilterProp="children"
                                            allowClear = {true}
                                            onChange={this.selectDocument}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        
                                        >
                                            {this.state.documentOptions}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Location"         
                                    >
                                        {getFieldDecorator('LOCATION_TABLE', {
                                                   
                                    })(
                                        <Select style={{width:'100%'}}>
                    
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                       
                        <Table
                            columns = {table_columns}
                        >
                            
                        </Table>
                            
                    </Card>
                </div>
            )
        }
    }


}



export default withStyles(styles, { withTheme: true })(Form.create()(DocumentAuthorization));