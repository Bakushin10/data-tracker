//client/components/Add.js
import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, Dropdown, Button } from 'antd';
var querystring = require('querystring');
import 'antd/dist/antd.css';


const WarningOn = styled.p`
  color: #FF1493;
`
const WarningOff = styled.p`
  color: #ADFF2F;
`

class Add extends React.Component {
    constructor() {
        super();

        this.state = {
            stockName: '',
            course: '',
            major: '',
            year: '',
            messageFromServer: '',
            selectedStock: '',
            data : []
        }
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onClickGetAPI = this.onClickGetAPI(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.insertNewExpense = this.insertNewExpense.bind(this);
        this.changeStock = this.changeStock.bind(this);
    }

    componentDidMount() {
        this.setState({
            month: this.props.selectedMonth
        });
        this.setState({
            year: this.props.selectedYear
        });
    }

    handleSelectChange(e) {
        if (e.target.name == 'month') {
            this.setState({
                month: e.target.value
            });
        }
        if (e.target.name == 'year') {
            this.setState({
                year: e.target.value
            });
        }
    }

    onClick(e) {
        this.insertNewExpense(this);
    }

    onClickGetAPI(e) {
        console.log("im clicking")
        //this.getAPI(this);
    }

    insertNewExpense(e) {
        axios.post('/insert',
            querystring.stringify({
                stockName: e.state.stockName,
                course: e.state.course,
                major: e.state.major,
                month: e.state.month,
                year: e.state.year
            }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            e.setState({
                messageFromServer: response.data
            });
        });
    }

    getAPI(e) {
        console.log(e.target.value);
        console.log("clicked");
        fetch('http://localhost:8000/data/', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
           body: JSON.stringify({company: "this.state.selectedStock"})
        }).then(res => res.json()).then(res => {
            console.log(res);
            console.log(JSON.stringify(res));
        }).catch(err => {
            console.log(err);
        })
    }

    handleTextChange(e) {
        console.log(e.target.value);
        if (e.target.name == "stockName")
            this.setState({ stockName: e.target.value })

        if (e.target.name == "course")
            this.setState({ course: e.target.value })

        if (e.target.name == "major")
            this.setState({ major: e.target.value })
    }

    changeStock(e, stock) {
        console.log(stock)
        this.setState({ selectedStock: stock });
    }

    render() {

        const menu = (
            <Menu>
              <Menu.Item>
                <div onClick={e => this.changeStock(e, 'AAPL')} align="center">
                  Apple
                </div>
              </Menu.Item>
              <Menu.Item>
                <div onClick={e => this.changeStock(e, 'FB')} align="center">
                  Facebook
                </div>
              </Menu.Item>
              <Menu.Item>
                <div onClick={e => this.changeStock(e, 'BAC')} align="center">
                  Bank of America
                </div>
              </Menu.Item>
              <Menu.Item>
                <div onClick={e => this.changeStock(e, 'MSFT')} align="center">
                  Microsoft
                </div>
              </Menu.Item>
              <Menu.Item>
                <div onClick={e => this.changeStock(e, 'AMZN')} align="center">
                  Amazon
                </div>
              </Menu.Item>
              <Menu.Item>
                <div onClick={e => this.changeStock(e, 'T')} align="center">
                AT&T
                </div>
              </Menu.Item>
            </Menu>
          );

        let profWarning, courseWarning, majorWarning, allFieldEntered;
        let submitButton, getAPIButton;
        const checkListForWarning =
            [
                this.state.stockName,
                this.state.course,
                this.state.major
            ]
        const allFieldChecked = !checkListForWarning.includes('');
        getAPIButton = <Button onClick={this.getAPI}>get API</Button>

        if (this.state.stockName) {
            profWarning = (<WarningOff>text</WarningOff>);
        } else {
            profWarning = (<WarningOn>Text required</WarningOn>);
        }

        if (this.state.course) {
            courseWarning = (<WarningOff>text</WarningOff>);
        } else {
            courseWarning = (<WarningOn>Text required</WarningOn>);
        }

        if (this.state.major) {
            majorWarning = (<WarningOff>text</WarningOff>);
        } else {
            majorWarning = (<WarningOn>Text required</WarningOn>);
        }

        if (allFieldChecked) {
            submitButton = <Button bsStyle="success" bsSize="small"
                onClick={this.onClick}>Add New Expense</Button>
        } else {
            submitButton = (<button disabled='false'>submit</button>);
        }

        //if(this.state.messageFromServer == ''){
        return (
            <div className='button-center'>
                <div>
                    {profWarning}
                    <input ref={this.state.stockName.value} onChange={this.handleTextChange}
                        type="text" name="stockName" value={this.state.stockName} placeholder="prof name " />
                </div>

                <div>
                </div>

                <div>
                    {courseWarning}
                    <input ref={this.state.course.value} onChange={this.handleTextChange}
                        type="text" name="course" value={this.state.course} placeholder="course " />
                </div>

                {/* <div>
                    {majorWarning}
                    <input ref={this.state.major.value} onChange={this.handleTextChange}
                        type="text" name="major" value={this.state.major} placeholder="major " />
                </div> */}

                {/* {submitButton} */}
                {getAPIButton}
            </div>

        )
        //}
    }
}
export default Add;