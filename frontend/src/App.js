
import React, { Component,Fragment } from 'react';
import './App.css';
import axios from 'axios';
const URL = 'http://localhost:3000/';

class App extends Component {
  constructor(props) {
    super(props);   
    this.state = {
      board: [],
      message: ''
    }
  }

  reset = () => {
    this.setState ({
      board: [],
      message: ''
    })
  }

  initBoard = () => {
    this.reset();
    const row = Math.floor(8*Math.random()+1);
    const col = Math.floor(8*Math.random()+1);
    const s_i = Math.floor(row*Math.random());
    const s_j = Math.floor(col*Math.random());
    const e_i = Math.floor(row*Math.random());
    const e_j = Math.floor(col*Math.random());
    let obstacles = [];
    console.log(row,col,s_i,s_j,e_i,e_j);
    let board = [];
    for (let r = 0; r < row; r++) {
      let arow = [];
      for (let c = 0; c < col; c++) { 
        arow.push(null) 
      }
      board.push(arow);
    }

    for (let i = 0; i < 5; i++) {
      const o_i = Math.floor(row*Math.random());
      const o_j = Math.floor(col*Math.random());
      board[o_i][o_j] = 3;
      let ob = {
        "i": o_i,
        "j": o_j,
        "value": 10.0,
      }
      obstacles.push(ob);
    }

    board[s_i][s_j] = 1;
    board[e_i][e_j] = 2;

    this.setState ({
      board,
    })

    fetch(URL+'reset', {
                method: 'POST',
                headers : { 
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({'a':1}),
            })
          .then((res) => console.log(res))
          .then((data) =>  console.log(data))
          .catch((err)=>console.log(err))
    
    fetch(URL+'api/maps', {
            method: 'POST',
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              'row': row,
              'col': col,
            })
        })
      .then((res) => res.json())
      .then((data) =>  console.log(data))
      .catch((err)=>console.log(err))
    
    fetch(URL+'api/paths/start', {
            method: 'POST',
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              'i': s_i,
              'j': s_j,
            })
        })
      .then((res) => res.json())
      .then((data) =>  console.log(data))
      .catch((err)=>console.log(err))
    
    fetch(URL+'api/paths/goal', {
            method: 'POST',
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              'i': e_i,
              'j': e_j,
            })
        })
      .then((res) => res.json())
      .then((data) =>  console.log(data))
      .catch((err)=>console.log(err))
      
    fetch(URL+'api/costs', {
            method: 'POST',
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              'costs': obstacles,
            })
        })
      //.then((res) => res.json())
      .then((data) =>  console.log(data))
      .catch((err)=>console.log(err))
  };

  findPath = () => {
    axios.get(URL + 'api/paths')
    .then(response => { 
        //console.log(response);
        if (response.data.error) {
            console.log(response.data.error)
        }
        let board = this.state.board;
        let message = response.data.steps;      
        const path = response.data.path;
        console.log(path);
        if (path) {
          for (let index in path) {
            board[path[index].i][path[index].j] = 1;
          }
        }

        this.setState({
            board,
            message,
        });
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });
  }


  render() { 
    let displayMessage = <p></p>;
    if (this.state.message === -1){
      displayMessage = <p className = "message">Wall-E can not find Eve</p>;
    }
    else if (this.state.message) {
      displayMessage = (
        <p className = "message">
          Wall-E find Eve in {this.state.message} steps!
          </p>
      )}
    return (
      <Fragment> 
      <div className = "button">
        <button onClick = {this.initBoard}>Radom Board</button>
        <button onClick = {this.findPath}>Find Path</button>
      </div>
      <div>
        <table>
          <thead>
          </thead>
          <tbody>
            {this.state.board.map((row, i) => 
              (<Row key={i} row={row} play={this.play} />))
              }
          </tbody>
        </table>
      </div>
      {displayMessage}
      </Fragment> 
    );
  }
}

  const Row = ({ row, play }) => {
    return (
      <tr>
        {row.map((cell, i) => 
          <Cell key={i} value={cell} columnIndex={i} play={play} />)
        }
      </tr>
    );
  };
  
  const Cell = ({ value, columnIndex, play }) => {
    let color = 'white';
    if (value === 1) {
      color = 'walle';
    } else if (value === 2) {
      color = 'ave';
    } else if (value === 3) {
      color = 'stone';
    }    
    return (
      <td>
        <div className="cell">
          <div className={color}></div>
        </div>
      </td>
    );
  };

 
export default App;
