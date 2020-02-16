import React from 'react';
import { Menu, Dropdown, Button, Input, InputNumber, Card} from 'antd';
const { TextArea } = Input;
import 'antd/dist/antd.css';

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
            favoriteCommandList : []
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

    getFavoriteCommands(res){
        return(
            <div>{
                this.state.favoriteCommandList.map( command =>(
                    <Card
                        title= {command.name}
                        style={{ width: 300 }}
                        onClick={e => this.onClickSelectCommand(e, command)}
                    >
                        <p>sql : {command.sql} </p>
                        <p>company : {command.company}</p>
                        <p>previous period : {command.previous_period} </p>
                    </Card>
                ))
                }
            </div>
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
            this.getFavoriteCommands()
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
                   company: this.state.selectedCompany,
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
                   company: this.state.selectedCompany,
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
                    <Dropdown overlay = {menu} title="Data Source">
                        <Button> select company </Button>
                    </Dropdown>
                    <Button type="primary" onClick={this.postSaveCommnad}>save the command</Button>
                    <div>
                        <div>
                            nickname : 
                            <TextArea
                                type="text"
                                value={this.state.commandNickname}
                                placeholder="Enter Reply"
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                onChange={this.onChangeNickName}
                            />
                        </div>
                    </div>
                </div>
                <div>previous day :
                    <InputNumber min={1} max={10000} defaultValue={10} onChange={this.onChanegPeriod} />
                </div>
                <div>
                    sql : 
                    <TextArea
                        type="text"
                        value={this.state.sql}
                        placeholder="Enter sql to execute"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        onChange={this.onChangeTextArea}
                    />
                </div>
                
                <div>
                    { this.state.name }
                </div>
                <div>
                    { this.state.selectedCompany }
                </div>
                <div>
                    { this.state.sql }
                </div>
                <div>
                    { this.state.period }
                </div>
                <div>
                    <Button type="primary" onClick={this.postToRetrieveStockInfo} >submit</Button>
                </div>
                <div>
                    {  this.getFavoriteCommands()}
                </div>
            </div>
        )
    }
}