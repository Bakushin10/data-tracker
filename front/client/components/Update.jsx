import React from 'react';
import { Menu, Dropdown, Button, Input, InputNumber, Col, Row, List, Select, Upload, Icon, message} from 'antd';
const { TextArea } = Input;
import 'antd/dist/antd.css';
import InfiniteScroll from 'react-infinite-scroller';


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

export default class ShowImage extends React.Component {

    constructor(){
        super();
        this.state = {
            visible: false,
            selectedCompany: 'AAPL',
            sql : "",
            period : 10,
            response : [],
            commandNickname : "",
            favoriteCommandList : [],
            companies : [],
            csvFile : [],
            commandToDelete : ""
        }

        this.selectCompany = this.selectCompany.bind(this);
        //this.sqlOnChange = this.sqlOnChange.bind(this);
        this.onChangeTextArea = this.onChangeTextArea.bind(this);
        this.onChangeNickName = this.onChangeNickName.bind(this);
        this.postToRetrieveStockInfo = this.postToRetrieveStockInfo.bind(this);
        this.postSaveCommnad = this.postSaveCommnad.bind(this);
        this.onChanegPeriod = this.onChanegPeriod.bind(this);
        //this.getFavoriteCommands = this.getFavoriteCommands.bind(this);
        this.onClickSelectCommand = this.onClickSelectCommand.bind(this);
        this.getFavoriteCommandsList = this.getFavoriteCommandsList.bind(this);
        this.selectCompanies = this.selectCompanies.bind(this);
        this.onChangeSelectCompanies = this.onChangeSelectCompanies.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.deleteSaveCommnad = this.deleteSaveCommnad.bind(this);
        this.fetchSavedCommand = this.fetchSavedCommand.bind(this);
    }

    beforeUpload(file) {
        const isJpgOrPng = file.type === 'text/csv';
        if (!isJpgOrPng) {
          message.error('You can only upload csv file!');
          return;
        }
        const reader = new FileReader();    
        reader.onload = e => {
            console.log(e.target.result);
            this.setState({ csvFile : e.target.result})
        };
        reader.readAsText(file);
    
        // Prevent upload
        message.success('csv file uploaded!');
        // this.setState({ csvFile : reader})
        return isJpgOrPng;
      }

    selectCompany(e, stockSource) {
        this.setState({ selectedCompany : stockSource})
    }
    
    onChangeTextArea(e) {
        this.setState({ sql: e.target.value });
    }

    onChangeNickName(e) {
        this.setState({ commandNickname: e.target.value });
    }

    onChanegPeriod(e){
        console.log(e)
        this.setState({ period : e })
    }

    onClickSelectCommand(e, command){
        console.log(command.company)
        this.setState({name : command.name})
        this.setState({selectedCompany : null})
        this.setState({sql : command.sql})
        this.setState({period : command.previous_period})
        this.setState({companies : command.company})
        this.setState({commandToDelete : command.name})
    }
    
    onChangeSelectCompanies(value){
        this.setState({companies : value})
        console.log(this.state.companies);
    }

    handleChange(info){
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
              imageUrl,
              loading: false,
            }),
          );
        }
      };
    
    selectCompanies(){
        return(
          <Select 
            mode="multiple" 
            placeholder="select the company"
            onChange={this.onChangeSelectCompanies}
            style={{ width: 160 }}
          >
            <Select.Option value="AAPL">Apple</Select.Option>
            <Select.Option value="FB">Facebook</Select.Option>
            <Select.Option value="BAC">Bank of America</Select.Option>
            <Select.Option value="MSFT">Microsoft</Select.Option>
            <Select.Option value="AMZN">Amazon</Select.Option>
            <Select.Option value="T">AT&T</Select.Option>
            <Select.Option value="TSLA">TESLA</Select.Option>
          </Select>
        )
      }

    getFavoriteCommandsList(){
        return(
            <div>{
                <List
                    dataSource={this.state.favoriteCommandList}
                    renderItem={item => (
                        <Row type="flex">
                            <Col span={1}></Col>
                            <Col span={9}>
                                <List.Item key={ item.id }>
                                <List.Item.Meta
                                    title={ item.name }
                                    description={ item.sql }
                                    onClick={e => this.onClickSelectCommand(e, item)}
                                />
                                    <div>
                                        <p>company : { item.company }</p>
                                        <p>previous period : { item.previous_period } </p>
                                    </div>
                                </List.Item>
                            </Col>
                        </Row>
                        )}
                >
                </List>
                }
            </div>
        )
    }

    getDeleteSaveCommnad(){
        if (this.state.commandToDelete != ""){
            return(
                <Button type="danger" onClick = {this.deleteSaveCommnad}>Delete</Button>
            )
        }else{
            return(
                <Button type="danger" disabled = "true">Delete</Button>
            )
        }
    }

    componentDidMount(){
        this.fetchSavedCommand()
    }

    fetchSavedCommand(){
        fetch('http://localhost:8000/data/', {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        }).then(res => res.json()).then(res => {
            this.setState({favoriteCommandList : res})
            //this.getFavoriteCommands()
        }).catch(err => {
            console.log("data not fetched!");
            console.log(err);
        })
    }

    deleteSaveCommnad(){
        fetch('http://localhost:8000/data/delete', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(
               {
                   name : this.state.commandToDelete,
                }
            ),
        }).then(res => res.json()).then(res => {
            this.fetchSavedCommand()
            message.success('Favorite command loaded!');
            this.setState({commandToDelete : ""})
        }).catch(err => {
            message.error('something went wrong');
            console.log("save not saved");
            console.log(err);
        })
    }

    postSaveCommnad(){
        fetch('http://localhost:8000/data/save', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(
               {
                   name : this.state.commandNickname,
                   company: this.state.companies,
                   sql : this.state.sql,
                   previous_period : this.state.period
                }
            ),
        }).then(res => res.json()).then(res => {
            this.fetchSavedCommand()
            message.success('Favorite command saved!')
        }).catch(err => {
            message.error('something went wrong. Favorite command not saved!')
            console.log(err);
        })
    }

    postToRetrieveStockInfo(e, saveCSV) {
        fetch('http://localhost:8000/data/', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
           body: JSON.stringify(
               {
                   company: this.state.companies,
                   sql : this.state.sql,
                   period : this.state.period,
                   csvFile : this.state.csvFile,
                   saveCSV : saveCSV
                }
            )
        }).then(res => res.json()).then(res => {
            message.success('Data retrieved!')
        }).catch(err => {
            message.error('Please check your sql!')
        })
    }

    render(){
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
        const { imageUrl } = this.state;
        const menu = (
            <Menu>
              <Menu.Item>
                <div onClick={e => this.selectCompany(e, 'AAPL')} align="center">
                  Apple
                </div>
              </Menu.Item>
              <Menu.Item>
                <div onClick={e => this.selectCompany(e, 'FB')} align="center">
                  Facebook
                </div>
              </Menu.Item>
              <Menu.Item>
                <div onClick={e => this.selectCompany(e, 'BAC')} align="center">
                  Bank of America
                </div>
              </Menu.Item>
              <Menu.Item>
                <div onClick={e => this.selectCompany(e, 'MSFT')} align="center">
                  Microsoft
                </div>
              </Menu.Item>
              <Menu.Item>
                <div onClick={e => this.selectCompany(e, 'AMZN')} align="center">
                  Amazon
                </div>
              </Menu.Item>
              <Menu.Item>
                <div onClick={e => this.selectCompany(e, 'T')} align="center">
                AT&T
                </div>
              </Menu.Item>
              <Menu.Item>
                <div onClick={e => this.selectCompany(e, 'TSLA')} align="center">
                TESLA
                </div>
              </Menu.Item>
            </Menu>
          );

        return(
            <div>
                <div>
                    <Row>
                        <Col span={1}></Col>
                        <Col span={10}>
                            select companies to see the stock
                            {this.selectCompanies()}
                        </Col>
                    </Row>
                    <div style={{ margin: '24px 0' }} />
                    <Row>
                        <Col span={1}></Col>
                        <Col span={10}>
                            nickname 
                            <TextArea
                                type="text"
                                value={this.state.commandNickname}
                                placeholder="Enter Reply"
                                autoSize={{ minRows: 1, maxRows: 1 }}
                                onChange={this.onChangeNickName}
                            />
                        </Col>
                    </Row>
                    
                    <div style={{ margin: '24px 0' }} />
                    <Row>
                        <Col span={1}></Col>
                        <Col span={4}>
                        previous day
                        <InputNumber min={1} max={10000} defaultValue={10} onChange={this.onChanegPeriod} />
                        </Col>
                    </Row>

                    <div style={{ margin: '24px 0' }} />
                    <Row>
                        <Col span={1}></Col>
                        <Col span={10}>
                        sql
                        <TextArea
                            type="text"
                            value={this.state.sql}
                            placeholder="Enter sql to execute"
                            autoSize={{ minRows: 5, maxRows: 6}}
                            onChange={this.onChangeTextArea}
                        />
                        </Col>
                    </Row>
                
                <div style={{ margin: '24px 0' }} />
                <Row>
                    <Row>
                        <Col span={1}></Col>
                        <Col>
                            nickname : { this.state.name }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={1}></Col>
                        <Col>
                            company : { this.state.companies }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={1}></Col>
                        <Col>
                            sql : { this.state.sql }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={1}></Col>
                        <Col>
                        period : { this.state.period }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={1}></Col>
                        <Col>
                        csvfile : { this.state.csvFile }
                        </Col>
                    </Row>
                </Row>

                <div style={{ margin: '24px 0' }} />
                <Row>
                    <Col span={1}></Col>
                    <Col span={2}>
                        <Button type="primary" onClick={(e) => this.postToRetrieveStockInfo(e, false)} >submit</Button>
                    </Col>
                    
                    <Col span={1}></Col>
                    <Col span={4}>
                        <Button type="primary" onClick={this.postSaveCommnad}>save the command</Button>
                    </Col>
                    
                    <Col span={1}></Col>
                    <Col span={4}>
                        <Button type="primary" onClick={(e) => this.postToRetrieveStockInfo(e, true)}>download csv</Button>
                    </Col>
                </Row>

                <div style={{ margin: '24px 0' }} />
                <Row>
                    <Col span={1}></Col>
                        <Col span={2}>
                            <Upload
                                name="avatar"
                                accept=".txt, .csv"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload = {this.beforeUpload}
                                onChange={this.handleChange}
                            >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </Col>
                </Row>

                <div style={{ margin: '24px 0' }} />
                {/* <div>
                    {  this.getFavoriteCommands()}
                </div> */}
                <Row>
                    <Col span={1}></Col>
                    <Col span={2}>
                        {this.getDeleteSaveCommnad()}
                    </Col>
                    <Col span={8}>
                        {this.state.commandToDelete}
                    </Col>
                </Row>
                <div>
                    {this.getFavoriteCommandsList()}
                </div>
            </div>
        </div>
        )
    }
}