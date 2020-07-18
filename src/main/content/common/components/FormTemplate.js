import React from 'react';
import {
    Col,
    Row,
    Card,
    Button,
    message,
    Table,
    List,
    Switch,
    Icon,
    Modal,
    Form,
    Popconfirm,
    Input,
    Menu,
    Dropdown,
    Select,
    Divider
} from 'antd';
import { getUserGridSettings, saveUserGridSettings } from '../../../asyncDataFetch';
import { connect } from 'react-redux';
import lodash from 'lodash';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Option = Select.Option;

class HeaderViewComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gridColumns: [],
            pageSize: 10,
            tableLoading: true
        }

        this.resolveUserDataSettings(this.props.user.userId, this.props.gridName);
    }

    GRID_NAME = this.props.gridName;
    columns = this.props.columns;

    resolveUserDataSettings = async (ID_USER, GRID_NAME) => {

        try {
            var gridSettings = await getUserGridSettings(ID_USER, GRID_NAME);
            console.log('recieved user grid settings', gridSettings.gridColumns);
            if (gridSettings.gridColumns) {

                for (let i = 0; gridSettings.gridColumns.length > i; i++) {

                    var column = lodash.filter(this.columns, x => x.dataIndex == gridSettings.gridColumns[i].dataIndex);

                    // console.log('test: '+gridSettings.gridColumns[i].title, column[0]);
                    if (column) {
                        this.state.gridColumns.push(column[0]);
                    }
                }

                return this.setState({ pageSize: gridSettings.pageSize, tableLoading: false });
            }
            this.setState({ gridColumns: this.columns, tableLoading: false });
        } catch (err) {
            this.setState({ gridColumns: this.columns, tableLoading: false })
            console.log('resolveUserDataSettings error', err);
        }
    }

    resolveSaveUserGridSettings = async (ID_USER, GRID_NAME, COL_ARRAY, PAGE_SIZE) => {
        try {
            var saveResponse = await saveUserGridSettings(ID_USER, GRID_NAME, COL_ARRAY, PAGE_SIZE);
            if (saveResponse && saveResponse == 'SUCCESS') {
                message.success('User settings saved');
            } else {
                message.warning('Saving of user settings failed. You can try again');
            }
            return this.setState({ loading: false });
        } catch (err) {
            message.warning('Saving of user settings failed. You can try again');
            this.setState({ loading: false });
            console.log('resolveUserDataSettings error', err);
        }
    }

    showModalTableSettings = () => {
        this.setState({
            visibleTableSettings: true,
        });
    }


    handleOkTableSettings = (e) => {
        console.log('this.props.user', this.props.user);
        this.setState({ loading: true, visibleTableSettings: false });
        if (this.props.user.userId) {
            this.resolveSaveUserGridSettings(this.props.user.userId, this.GRID_NAME, JSON.stringify(this.state.gridColumns), this.state.pageSize);
        } else {
            this.setState({ loading: false });
        }
    }

    handleCancelTableSettings = (e) => {
        console.log(e);
        this.setState({
            visibleTableSettings: false,
        });
    }

    handleClear = () => {
        alert('test');
        this.props.handleReset;
    }

    render() {

        const { elements, handleSubmit, handleReset, dataSource, form } = this.props;
        const { getFieldDecorator } = form;

        var getColCheckedStatus = (itemTitle) => {
            // return true;
            for (let i = 0; i < this.state.gridColumns.length; i++) {
                if (this.state.gridColumns[i].title === itemTitle)
                    return true;
            }
            return false;
        }

        return (
            <Form>
                <Card style={{ marginTop: '1%', marginBottom: '1%' }} bordered={true}>
                    {elements.map((item, i) => {
                        return (<Col key={item.dataIndex} span={item.col}>
                            <FormItem label={item.title}>
                                {getFieldDecorator(`${item.dataIndex}`, item.decorators)(item.element)}
                            </FormItem>
                        </Col>)
                    })}
                    <Col span={4} style={{ marginTop: 42 }}>
                        <Button onClick={() => handleReset(this.props.form)}>Clear</Button>
                        <Button style={{ marginLeft: 8 }} type="primary" onClick={() => handleSubmit("header")} htmlType="submit">Add</Button>
                    </Col>
                </Card>
                <Card
                    style={{ marginTop: '1%', marginBottom: '1%' }}
                    bordered={true}
                    actions={[<Col></Col>, <Col></Col>, <Col></Col>, <Col></Col>, <Col></Col>, <Col></Col>, <Col></Col>, <Button type="primary" shape="circle" icon="setting" onClick={this.showModalTableSettings} />]}
                >

                    <Table
                        columns={this.state.gridColumns}
                        dataSource={dataSource}
                        bordered
                        pagination={{
                            position: 'bottom',
                            pageSize: this.state.pageSize,
                            showSizeChanger: true,
                            pageSizeOptions: [
                                '5', '10', '20', '50', '100'
                            ],
                        }}
                        loading={this.state.tableLoading}
                    />

                    <Modal
                        title="Column Settings"
                        visible={this.state.visibleTableSettings}
                        onOk={this.handleOkTableSettings}
                        onCancel={this.handleCancelTableSettings}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={
                                this.columns
                            }
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.title}
                                    />
                                    <div><Switch checkedChildren={<Icon type="check" />}
                                        unCheckedChildren={<Icon type="close" />}
                                        checked={getColCheckedStatus(item.title)}
                                        onChange={(e) => {
                                            console.log(e);
                                            if (e == true) {
                                                /* let arr = [...this.state.gridColumns, item];
                                                this.setState({gridColumns:arr},()=>console.log('this.state.gridColumns',this.state.gridColumns)); */

                                                let arr = [...this.columns];
                                                let arrOfChecked = [...this.state.gridColumns, item];
                                                let newSortedColumns = [];
                                                for (let i = 0; i < arr.length; i++) {
                                                    for (let k = 0; k < arrOfChecked.length; k++) {
                                                        if (arr[i].title === arrOfChecked[k].title) {
                                                            let col = Object.assign({}, arrOfChecked[k]);
                                                            newSortedColumns.push(col);
                                                            break;
                                                        }
                                                    }
                                                }
                                                this.setState({ gridColumns: newSortedColumns }, () => console.log('this.state.gridColumns', this.state.gridColumns))
                                            } else {
                                                let gridColumns = [...this.state.gridColumns];
                                                for (let i = 0; i < gridColumns.length; i++) {

                                                    if (gridColumns[i].title === item.title) {
                                                        console.log('gridColumns compare', gridColumns[i].title, item.title);
                                                        gridColumns.splice(i, 1);
                                                        break;
                                                    }
                                                }
                                                this.setState({ gridColumns: gridColumns }, () => console.log('this.state.gridColumns', this.state.gridColumns));
                                            }
                                        }}
                                    />
                                    </div>
                                </List.Item>
                            )}
                        />
                        <Divider />
                        <Row>
                            <Col span={6}>
                                <h5>Page Size</h5>
                            </Col>
                            <Col span={6} push={15}>
                                <Select value={this.state.pageSize} onChange={(value) => { this.setState({ pageSize: value }) }}>
                                    <Option key={5}>5</Option>
                                    <Option key={10}>10</Option>
                                    <Option key={20}>20</Option>
                                    <Option key={50}>50</Option>
                                    <Option key={100}>100</Option>
                                </Select>
                            </Col>
                        </Row>

                    </Modal>
                </Card>
            </Form>
        )
    }
}

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    state = {
        editing: false,
    }

    componentDidMount() {
        if (this.props.editable) {
            document.addEventListener('click', this.handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if (this.props.editable) {
            document.removeEventListener('click', this.handleClickOutside, true);
        }
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    }

    handleClickOutside = (e) => {
        const { editing } = this.state;
        if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
            this.save();
        }
    }

    save = () => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    }

    render() {
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                editing ? (
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `${title} is required.`,
                                            }],
                                            initialValue: record[dataIndex],
                                        })(
                                            <Input
                                                ref={node => (this.input = node)}
                                                onPressEnter={this.save}
                                            />
                                        )}
                                    </FormItem>
                                ) : (
                                        <div
                                            className="editable-cell-value-wrap"
                                            style={{ paddingRight: 24 }}
                                            onClick={this.toggleEdit}
                                        >
                                            {restProps.children}
                                        </div>
                                    )
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

class TableViewComponent extends React.Component {

    constructor(props) {
        super(props);
        this.columns = [];

        this.state = {
            dataSource: [],
            count: 0,
            gridColumns: [],
            pageSize: 10,
            tableLoading: true
        };

        this.resolveUserDataSettings(this.props.user.userId, this.props.gridName);
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    }

    handleAdd = (num) => {
        const { count, dataSource } = this.state;
        for (let i = 1; num >= i; i++) {
            // alert(i);
            // var newData = {
            //     key: count + i,
            // };
            // console.log('test: ', newData);
            this.setState({
                count: count + i,
            });
            this.state.dataSource.push(
                {
                    key: count + i,
                }
            );
        }
    }

    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ dataSource: newData });
    }

    GRID_NAME = this.props.gridName;
    // columns = this.props.columns;

    resolveUserDataSettings = async (ID_USER, GRID_NAME) => {

        const { form } = this.props;
        const { getFieldDecorator } = form;

        this.props.elements.map((col) => {

            this.state.gridColumns.push(
                {
                    title: col.title,
                    dataIndex: col.dataIndex,
                    key: col.dataIndex,
                    width: col.col * 40,
                    render: (text, record, index) => (
                        getFieldDecorator(`${col.dataIndex}[${index}]`, col.decorators)(col.element)
                    )
                }
            );
            this.columns.push(
                {
                    title: col.title,
                    dataIndex: col.dataIndex,
                    key: col.dataIndex,
                    width: col.col * 40,
                    render: (text, record, index) => (
                        getFieldDecorator(`${col.dataIndex}[${index}]`, col.decorators)(col.element)
                    )
                }
            );
        });

        this.state.gridColumns.push(
            {
                title: "Action",
                key: "Action",
                fixed: 'right',
                width: 100,
                render: (text, record) => (

                    <span>
                        {/* <a
                            href="javascript:;"
                            onClick={() => this.save(record, record.key)}
                            style={{ marginRight: 8 }}
                        >
                            Add
                      </a> */}
                        {/* )} */}
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <Button type="danger" title="Delete" shape="circle" icon="delete" />
                        </Popconfirm>
                    </span>
                ),
            }
        );


        this.columns.push(
            {
                title: "Action",
                key: "Action",
                fixed: 'right',
                width: 100,
                render: (text, record) => (
                    <span>
                        {/* <a
                            href="javascript:;"
                            onClick={() => this.save(record, record.key)}
                            style={{ marginRight: 8 }}
                        >
                            Add
                      </a> */}
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <Button type="danger" title="Delete" shape="circle" icon="delete" />
                        </Popconfirm>
                    </span>
                ),
            }
        );

        try {
            var gridSettings = await getUserGridSettings(ID_USER, GRID_NAME);
            console.log('recieved user grid settings', gridSettings.gridColumns);
            if (gridSettings.gridColumns) {

                this.setState({ gridColumns: [] });

                for (let i = 0; gridSettings.gridColumns.length > i; i++) {

                    var column = lodash.filter(this.columns, x => x.dataIndex == gridSettings.gridColumns[i].dataIndex);

                    // console.log('test: '+gridSettings.gridColumns[i].title, column[0]);
                    if (column) {
                        this.state.gridColumns.push(column[0]);
                    }
                }

                this.state.dataSource.push({ key: 0 });

                return this.setState({ pageSize: gridSettings.pageSize, tableLoading: false });
            }
            this.setState({ tableLoading: false });
        } catch (err) {
            this.setState({ tableLoading: false });
            console.log('resolveUserDataSettings error', err);
        }
    }

    save(record, key) {

        console.log("RECORD: ", record);
        console.log("KEY: ", key);

        // form.validateFields((error, row) => {
        //   if (error) {
        //     return;
        //   }
        //   const newData = [...this.state.data];
        //   const index = newData.findIndex(item => key === item.key);
        //   if (index > -1) {
        //     const item = newData[index];
        //     newData.splice(index, 1, {
        //       ...item,
        //       ...row,
        //     });
        //     this.setState({ data: newData, editingKey: '' });
        //   } else {
        //     newData.push(row);
        //     this.setState({ data: newData, editingKey: '' });
        //   }
        // });
    }

    resolveSaveUserGridSettings = async (ID_USER, GRID_NAME, COL_ARRAY, PAGE_SIZE) => {
        try {
            var saveResponse = await saveUserGridSettings(ID_USER, GRID_NAME, COL_ARRAY, PAGE_SIZE);
            if (saveResponse && saveResponse == 'SUCCESS') {
                message.success('User settings saved');
            } else {
                message.warning('Saving of user settings failed. You can try again');
            }
            return this.setState({ loading: false });
        } catch (err) {
            message.warning('Saving of user settings failed. You can try again');
            this.setState({ loading: false });
            console.log('resolveUserDataSettings error', err);
        }
    }

    showModalTableSettings = () => {
        this.setState({
            visibleTableSettings: true,
        });
    }


    handleOkTableSettings = (e) => {
        console.log('this.props.user', this.props.user);
        this.setState({ loading: true, visibleTableSettings: false });
        if (this.props.user.userId) {
            this.resolveSaveUserGridSettings(this.props.user.userId, this.GRID_NAME, JSON.stringify(this.state.gridColumns), this.state.pageSize);
        } else {
            this.setState({ loading: false });
        }
    }

    handleCancelTableSettings = (e) => {
        console.log(e);
        this.setState({
            visibleTableSettings: false,
        });
    }

    render() {
        const { dataSource } = this.state;
        const { elements, handleSubmit, handleReset, form } = this.props;
        const { getFieldDecorator } = form;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.state.gridColumns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });

        var getColCheckedStatus = (itemTitle) => {
            // return true;
            for (let i = 0; i < this.state.gridColumns.length; i++) {
                if (this.state.gridColumns[i].title === itemTitle)
                    return true;
            }
            return false;
        }

        return (
            <Card style={{ marginTop: '1%', marginBottom: '1%' }}
                bordered={true}
                actions={[<Col></Col>, <Col></Col>, <Col></Col>, <Col></Col>, <Col></Col>, <Col></Col>, <Col></Col>, <Button type="primary" shape="circle" icon="setting" onClick={this.showModalTableSettings} />]}
            >
                <Table
                    footer={() => {
                        return <Dropdown
                            overlay={
                                (
                                    <Menu>
                                        <Menu.Item onClick={() => { this.handleAdd(1) }}>1 Row</Menu.Item>
                                        <Menu.Item onClick={() => { this.handleAdd(5) }}>5 Rows</Menu.Item>
                                        <Menu.Item onClick={() => { this.handleAdd(10) }}>10 Rows</Menu.Item>
                                        <Menu.Item onClick={() => { this.handleAdd(50) }}>50 Rows</Menu.Item>
                                        <Menu.Item onClick={() => { this.handleAdd(100) }}>100 Rows</Menu.Item>
                                    </Menu>
                                )
                            }>
                            <Button>
                                Add Row <Icon type="down" />
                            </Button>
                        </Dropdown>
                    }}
                    // scroll={{ x: 1500}}
                    // components={components}
                    // rowClassName={() => 'editable-row'}
                    pagination={{
                        position: 'bottom',
                        pageSize: this.state.pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: [
                            '5', '10', '20', '50', '100'
                        ],
                    }}
                    bordered
                    dataSource={dataSource}
                    columns={this.state.gridColumns}
                    loading={this.state.tableLoading}
                />

                <Modal
                    title="Column Settings"
                    visible={this.state.visibleTableSettings}
                    onOk={this.handleOkTableSettings}
                    onCancel={this.handleCancelTableSettings}
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={
                            this.columns
                        }
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item.title}
                                />
                                <div><Switch checkedChildren={<Icon type="check" />}
                                    unCheckedChildren={<Icon type="close" />}
                                    checked={getColCheckedStatus(item.title)}
                                    onChange={(e) => {
                                        console.log(e);
                                        if (e == true) {
                                            /* let arr = [...this.state.gridColumns, item];
                                            this.setState({gridColumns:arr},()=>console.log('this.state.gridColumns',this.state.gridColumns)); */

                                            let arr = [...this.columns];
                                            let arrOfChecked = [...this.state.gridColumns, item];
                                            let newSortedColumns = [];
                                            for (let i = 0; i < arr.length; i++) {
                                                for (let k = 0; k < arrOfChecked.length; k++) {
                                                    if (arr[i].title === arrOfChecked[k].title) {
                                                        let col = Object.assign({}, arrOfChecked[k]);
                                                        newSortedColumns.push(col);
                                                        break;
                                                    }
                                                }
                                            }
                                            this.setState({ gridColumns: newSortedColumns }, () => console.log('this.state.gridColumns', this.state.gridColumns))
                                        } else {
                                            let gridColumns = [...this.state.gridColumns];
                                            for (let i = 0; i < gridColumns.length; i++) {

                                                if (gridColumns[i].title === item.title) {
                                                    console.log('gridColumns compare', gridColumns[i].title, item.title);
                                                    gridColumns.splice(i, 1);
                                                    break;
                                                }
                                            }
                                            this.setState({ gridColumns: gridColumns }, () => console.log('this.state.gridColumns', this.state.gridColumns));
                                        }
                                    }}
                                />
                                </div>
                            </List.Item>
                        )}
                    />
                    <Divider />
                    <Row>
                        <Col span={6}>
                            <h5>Page Size</h5>
                        </Col>
                        <Col span={6} push={15}>
                            <Select value={this.state.pageSize} onChange={(value) => { this.setState({ pageSize: value }) }}>
                                <Option key={5}>5</Option>
                                <Option key={10}>10</Option>
                                <Option key={20}>20</Option>
                                <Option key={50}>50</Option>
                                <Option key={100}>100</Option>
                            </Select>
                        </Col>
                    </Row>
                </Modal>
            </Card>
        );
    }
}


function mapStateToProps({ fuse, auth }) {
    return {
        user: auth.user
    }
}


export const TableView = Form.create()(connect(mapStateToProps)(TableViewComponent));
export const HeaderView = Form.create()(connect(mapStateToProps)(HeaderViewComponent));
