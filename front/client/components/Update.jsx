import React from 'react';
import { Menu, Dropdown, Button, Input, InputNumber, Card, Col, Row, List, Select} from 'antd';
const { TextArea } = Input;
import 'antd/dist/antd.css';
import InfiniteScroll from 'react-infinite-scroller';

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
        }

        this.selectCompany = this.selectCompany.bind(this);
        //this.sqlOnChange = this.sqlOnChange.bind(this);
        this.onChangeTextArea = this.onChangeTextArea.bind(this);
        this.onChangeNickName = this.onChangeNickName.bind(this);
        this.postToRetrieveStockInfo = this.postToRetrieveStockInfo.bind(this);
        this.postSaveCommnad = this.postSaveCommnad.bind(this);
        this.onChanegPeriod = this.onChanegPeriod.bind(this);
        this.getFavoriteCommands = this.getFavoriteCommands.bind(this);
        this.onClickSelectCommand = this.onClickSelectCommand.bind(this);
        this.getFavoriteCommandsList = this.getFavoriteCommandsList.bind(this);
        this.selectCompanies = this.selectCompanies.bind(this);
        this.onChangeSelectCompanies = this.onChangeSelectCompanies.bind(this);
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
        this.setState({name : command.name})
        this.setState({selectedCompany : command.company})
        this.setState({sql : command.sql})
        this.setState({period : command.previous_period})
    }
    
    onChangeSelectCompanies(value){
        this.setState({companies : value})
        console.log(this.state.companies);
    }
    
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
            <Select.Option value="MSFT">Micro soft</Select.Option>
            <Select.Option value="AMZN">Amazon</Select.Option>
            <Select.Option value="T">AT&T</Select.Option>
            <Select.Option value="TSLA">TESLA</Select.Option>
          </Select>
        )
      }

    getFavoriteCommands(){
        return(
            <div>{
                this.state.favoriteCommandList.map( command =>(
                    <Row type="flex">
                    <Col span={1}></Col>
                    <Col>
                        <Card
                            title= {command.name}
                            style={{ width: 300 }}
                            onClick={e => this.onClickSelectCommand(e, command)}
                        >
                            <p>sql : {command.sql} </p>
                            <p>company : {command.company}</p>
                            <p>previous period : {command.previous_period} </p>
                        </Card>
                    </Col>
                </Row>
                ))
                }
            </div>
        )
    }

    getFavoriteCommandsList(){
        return(
            <div>{
                // <InfiniteScroll
                //     initialLoad={false}
                //     pageStart={0}
                //     loadMore={true}
                //     //hasMore={!this.state.loading && this.state.hasMore}
                //     useWindow={false}
                // >
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
                // </InfiniteScroll>
                }</div>
        )
    }

    componentDidMount(){
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
            )
        }).then(res => res.json()).then(res => {
            console.log(res);
            console.log(JSON.stringify(res));
        }).catch(err => {
            console.log("save not saved");
            console.log(err);
        })
    }

    postToRetrieveStockInfo(e) {
        console.log(e.target.value);
        console.log("clicked");
        console.log(this.state.selectedCompany)
        console.log(this.state.sql)
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
                   period : this.state.period
                }
            )
        }).then(res => res.json()).then(res => {
            console.log(res);
            console.log(JSON.stringify(res));
        }).catch(err => {
            console.log(err);
        })
    }

    render(){

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
                    {/* <Row>
                        <Col span={1}></Col>
                        <Dropdown overlay = {menu} title="Data Source">
                            <Button> select  </Button>
                        </Dropdown>
                    </Row> */}
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
                </Row>

                <div style={{ margin: '24px 0' }} />
                <Row>
                    <Col span={1}></Col>
                    <Col span={2}>
                        <Button type="primary" onClick={this.postToRetrieveStockInfo} >submit</Button>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={2}>
                        <Button type="primary" onClick={this.postSaveCommnad}>save the command</Button>
                    </Col>
                </Row>

                <div style={{ margin: '24px 0' }} />
                {/* <div>
                    {  this.getFavoriteCommands()}
                </div> */}
                <div>
                    {  this.getFavoriteCommandsList()}
                </div>
            </div>
        </div>
        )
    }
}