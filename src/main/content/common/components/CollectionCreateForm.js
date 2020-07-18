import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import 'antd/dist/antd.css';
import { Form, Input, DatePicker, message, Icon, Select, Button, 
     Modal, Switch, Upload,Row, Col } from 'antd';
import { loadCourseList } from '../../../CommonAPIs';
import { loadTrainingDeliveryMethodList } from '../../../CommonAPIs';
import { loadTrainingAttendanceTypeList } from '../../../CommonAPIs';
import moment from 'moment';

const styles = theme => ({
    layoutRoot: {}
});

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'YYYY-MM-DD hh:mm:ss';
const Dragger = Upload.Dragger;
//var attachment = {};
var fileList = '';

class CollectionCreateForm extends React.Component {


    constructor(props) {
        super(props);

        this.state ={
            courseListOptions : [],
            deliveryMethodOptions : [],
            attendanceTypeOptions:[],
            
        };
        this.getCourses();
        this.getDeliveryMethods();
        this.getAttendanceTypes();
      
       // this.forceUpdate();
    }


  
    // get all courses list from db
    
async getCourses() {
    try {

        var courseList = await loadCourseList();
        if (courseList && courseList.length > 0) {
            for (let i = 0; i < courseList.length; i++) {
                this.state.courseListOptions.push(
                    <Option
                        value={(courseList[i].ID_TRAINING_COURSES).toString()}>{courseList[i].NAME}
                    </Option>
                );
            }
        } else {
            message.error('No Courses Found');
        }
    } catch (error) {
        console.log(error)
    }
}

// get delivery methods from db
async getDeliveryMethods() {
    try {

        var deliveryMethodList = await loadTrainingDeliveryMethodList();
        if (deliveryMethodList && deliveryMethodList.length > 0) {
            for (let i = 0; i < deliveryMethodList.length; i++) {
                this.state.deliveryMethodOptions.push(
                    <Option
                        value={deliveryMethodList[i].ID_TRAINING_DELIVERY_METHOD}>{deliveryMethodList[i].NAME}
                    </Option>
                );
            }
        } else {
            message.error('No Delivery Methods Found');
        }
    } catch (error) {
        console.log(error)
    }
}

// get attendance types from db
async getAttendanceTypes() {
    try {

        var attendanceList = await loadTrainingAttendanceTypeList();
        if (attendanceList && attendanceList.length > 0) {
            for (let i = 0; i < attendanceList.length; i++) {
                this.state.attendanceTypeOptions.push(
                    <Option
                        value={attendanceList[i].ID_TRAINING_ATTENDANCE_TYPE}>{attendanceList[i].NAME}
                    </Option>
                );
            }
        } else {
            message.error('No Attendance Type Found');
        }
    } catch (error) {
        console.log(error)
    }
}


 // document upload




    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
        }

       

    render() {
    //const { visible, onCancel, onCreate, form ,loading,formStatus,data,onClear,onEdit,attachments,getFieldDecorator} = this.props.form;
  //const {getFieldDecorator} = form;

  const { getFieldDecorator } = this.props.form;
    //fileList = attachments;
    var attachment;
    const docProps = {
        name: 'file',
        action: window.imageUploadServer + "/h2biz_document_upload",
        headers: {
            authorization: 'authorization-text',
        },
        defaultFileList: [...fileList],

        onChange(info) {

            attachment = {};
            attachment.docPath = "";
            attachment.docName = "";

            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} File Successfully Uploaded`);

                // remove old uploaded file
                var fileList = info.fileList;
                fileList = fileList.splice(0);
                fileList = fileList;

                attachment.docPath = info.file.response.file;
                attachment.docName = info.file.name;

            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} File Uploading Failed`);
            }
        },
    }; 

    //componentDidUpdate(prevProps, prevState)

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


    //var fileList = [...attachments];


    //var fileList = [...attachments];

 
       
    /* const file = [{
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }, {
        uid: '-2',
        name: 'yyy.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }]; */

      



    return (
        <Modal
        visible={this.props.visible}
        title={this.props.formStatus=="Create"?"Create New Training Session":this.props.formStatus=="view"?"=View Training Session Details":"Edit Training Session Details"}
         width='720'
        // okText="Create"
        onCancel={this.props.onCancel}
        onOk={this.props.onCreate}
        maskClosable={false}
        footer={this.props.formStatus=="view"?null: [
            <Button key="Save" type="primary" loading={this.props.loading} onClick={this.props.formStatus=="Create"?this.props.onCreate:this.props.formStatus=='edit'?this.props.onEdit:null}>
                {this.props.formStatus=="Create"?"Save":"Update"}
            </Button>,
            <Button key="clear" onClick={this.props.onClear}>Clear</Button>,
            ]}
            
        >
        <Form>

            <Row gutter={8}>
            <Col span={8}>
            <FormItem
              
                    label="Name"
            >
                {getFieldDecorator('name', {
                        rules: [{
                        required: true, message: 'Please enter the training session name!',
                    }],
                    initialValue: this.props.formStatus != "Create" ? this.props.data.name : []
                })(
                    <Input
                        disabled={this.props.formStatus=='view'}
                    >
                    </Input>
                )}
            </FormItem>
            </Col>
            <Col span={8}>
            <FormItem
               
                    label="Course"
            >
                {getFieldDecorator('idCourse', {
                        rules: [{
                        required: true, message: 'Please select a course!',
                    }],
                    initialValue: this.props.formStatus != "Create" ? (this.props.data.idCourse).toString() : []
                })(
                    <Select
                        mode="single"
                        style={{width:'100%'}}
                        showSearch
                        placeholder="Select course"
                        optionFilterProp="children"
                        disabled={this.props.formStatus=='view'}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} 
                    >
                        {this.state.courseListOptions}
                    </Select>
                )}
            </FormItem>
            </Col>
            <Col span={8}>
            <FormItem
               
                    label="Details"
            >
                {getFieldDecorator('details', {
                        rules: [{
                        required: true, message: 'Please enter the training session details!',
                    }],
                    initialValue: this.props.formStatus != "Create" ? this.props.data.details : []
                })(
                    <TextArea 
                        disabled={this.props.formStatus=='view'}
                        style={{ width: '100%' }} />
                )}
            </FormItem>
            </Col>
            </Row>

            <Row gutter={8}>
            <Col span={8}>
            <FormItem
               
                    label="Schedule Time"
            >
                {getFieldDecorator('scheduleTime', {
                        rules: [{
                        required: true, message: 'Please select the schedule time!',
                    }],
                    initialValue:this.props.formStatus !="Create" ? moment(this.props.data.scheduleTime,timeFormat):moment(new Date())
                })(
                    <DatePicker
                        showTime
                        disabled={this.props.formStatus=='view'}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="Select Schedule Time"
                        // defaultValue={formStatus !="Create" ? moment(data.scheduleTime,timeFormat):moment(new Date())}
                    >
                        
                    </DatePicker>
                )}
            </FormItem>
            </Col>
            <Col span={8}>
            <FormItem
                
                    label="Assignment Due Date"
            >
                {getFieldDecorator('assignmentDueDate', {
                        rules: [{
                        required: true, message: 'Please select the assignment due date!',
                    }],
                    initialValue:this.props.formStatus !="Create" ? moment(this.props.data.assignmentDueDate,dateFormat):moment(new Date())
                })(
                    <DatePicker
                        disabled={this.props.formStatus=='view'}
                        
                        // defaultValue={formStatus !="Create" ? moment(data.assignmentDueDate,dateFormat):moment(new Date())}
                    >
                        
                    </DatePicker>
                )}
            </FormItem>
            </Col>
            <Col span={8}>
            <FormItem
               
                    label="Delivery Method"
            >
                {getFieldDecorator('idDeliveryMethod', {
                        rules: [{
                        required: true, message: 'Please select a delivery method!',
                    }],
                    initialValue: this.props.formStatus != "Create" ? this.props.data.idDeliveryMethod : []
                })(
                    <Select
                        mode="single"
                        style={{width:'100%'}}
                        //defaultValue={[93,47]}
                        showSearch
                        placeholder="Select delivery method"
                        optionFilterProp="children"
                        disabled={this.props.formStatus=='view'}
                        
                        //onChange={this.selectAssetModel}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} 
                    >
                        {this.state.deliveryMethodOptions}
                    </Select>
                )}
            </FormItem>
            </Col>
            </Row>    

             <Row gutter={8}>
            <Col span={8}>
            <FormItem
               
                    label="Delivery Location"
            >
                {getFieldDecorator('deliveryLocation', {
                        rules: [{
                        required: true, message: 'Please enter the delivery location!',
                    }],
                    initialValue: this.props.formStatus != "Create" ? this.props.data.deliveryLocation : []
                })(
                    <Input
                        disabled={this.props.formStatus=='view'}
                    >
                    </Input>
                )}
            </FormItem>
            </Col>
            <Col span={8}>
            <FormItem
                    label="Attendance Type"
            >
                {getFieldDecorator('idAttendanceType', {
                        rules: [{
                        required: true, message: 'Please select a attendance type!',
                    }],
                    initialValue: this.props.formStatus != "Create" ? this.props.data.idAttendanceType : []
                })(
                    <Select
                        mode="single"
                        style={{width:'100%'}}
                        //defaultValue={[93,47]}
                        showSearch
                        placeholder="Select attendance type"
                        optionFilterProp="children"
                        disabled={this.props.formStatus=='view'}
                        
                        //onChange={this.selectAssetModel}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} 
                    >
                        {this.state.attendanceTypeOptions}
                    </Select>
                )}
            </FormItem>
            </Col>
            <Col span={4}>
            <FormItem
                    label="Training Certificate Required"
            >
                {getFieldDecorator('certificateRequired', {
                        rules: [{
                        required: false
                    }],
                    initialValue: this.props.formStatus != "Create" ? this.props.data.certificateRequired === 1 : []
                })(
                    <Switch
                        defaultChecked 
                        disabled={this.props.formStatus=='view'}
                    />
                )}
            </FormItem>
            </Col>
            <Col span={4}>
            <FormItem
               
                    label="Status"
            >
                {getFieldDecorator('status', {
                        rules: [{
                        required: false
                    }],
                    initialValue: this.props.formStatus != "Create" ? this.props.data.status === 1 : []
                })(
                    <Switch
                        defaultChecked 
                        disabled={this.props.formStatus=='view'}
                    />
                )}
            </FormItem>
            </Col>
            </Row>   

            <Row gutter={8}>
            
            <Col span={8}>
            <FormItem
               
               label="Attachments"
           >

                {getFieldDecorator('attachments', {
                   //  initialValue :  [...this.props.attachments]
                })(
                    <Upload {...this.props.docProps} style={{marginLeft:'8%'}} 
                        
                    >
                    <Button style={{backgroundColor:'#6A7FDB',color:'white'}} type="primary"  icon='paper-clip'>Attachment</Button>
                    </Upload>
                )}
               
               
                
               
           </FormItem>
            </Col>
            </Row>
           
        </Form>
        </Modal>
    );
    }
}

  export default withStyles(styles, { withTheme: true })(Form.create()(CollectionCreateForm));