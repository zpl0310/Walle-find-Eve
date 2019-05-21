'use strict';

const express = require('express');
const bodyParser =  require("body-parser");
const cors = require('cors');
let app = express();
app.use(bodyParser.json());
app.use(cors());
//save the board
let board = [];
//save start point and end point
let s_row = null, s_col = null, e_row = null, e_col = null;
//four directions
const deltaX = [-1, 0 , 1, 0];
const deltaY = [0, 1, 0, -1];
//port number
const port = 3000;

//test endpoint
app.get('/',function(req,res) {
    res.send('Hello world');
});

//reset the board, called each time before test
app.post('/reset', function(req, res) {
    board = [];
    s_row = null;
    s_col = null;
    e_row = null;
    e_col = null;
    res.status(201).send('Reseted');
});

//initiate board
app.post('/api/maps', function (req, res) { 
    const data = req.body;
    if (!data.row || !data.col || data.row < 0 || data.col < 0) {
        res.status(400).end('Invalid Input');
    } else {
        for (let i = 0; i < data.row; i++) {
            board.push(new Array(data.col));
        }  
        res.status(201).json(data);
    }
})

//set start point
app.post('/api/paths/start', function (req, res) {
    const data = req.body;
    // if (typeof data.i == undefined || typeof data.j == undefined
    //     || !isInside(data.i, data.j)) {
    //         res.status(400).end('Invalid Input');
    //         return;
    // }
    s_row = data.i;
    s_col = data.j;
    res.status(201).json(data);
});

//set end point
app.post('/api/paths/goal', function (req,res) {
    const data = req.body;
    // if (typeof data.i == undefined || typeof data.j == undefined
    //     || !isInside(data.i, data.j)) {
    //         res.status(400).end('Invalid Input');
    //         return;
    // }
    e_row = data.i;
    e_col = data.j;
    res.status(201).json(data);
});

//put obstacles on board
app.post('/api/costs', function (req, res) {
    const data = req.body;
    data.costs.forEach((point, ind) => {
        if (isInside(point.i, point.j) &&
            (point.i != s_row || point.j != s_col) &&
            (point.i != e_row || point.j != e_col)) {
            board[point.i][point.j] = point.value;
        }
    });
    res.status(201).json(data);
}); 

//get path
app.get('/api/paths', function (req,res) {
    let direction = [];
    const steps = bfs(direction);
    let path=[];
    if (!isInside(s_row,s_col) || !isInside(e_row,e_col)) {
        res.status(400).end('Invalid Input');
        return;
    }
    if (steps === -1) {
        console.log('no valid path found');
    } else {
        let x = s_row, y = s_col;
        while (x !== e_row || y !== e_col) {
            let cur = {};
            cur["i"] = x;
            cur["j"] = y;
            path.push(cur);
            const d = direction[x][y];
            x -= deltaX[d];
            y -= deltaY[d];
        }
        let cur = {};
        cur["i"] = e_row;
        cur["j"] = e_col;
        path.push(cur);
    }
    const data = {
        "steps": steps,
        "path": path,
    }
    res.json(data);
});

//helper function to check is a point is inside the board
function isInside(x, y) {
    return x != null && y != null &&
    x >= 0 && y >= 0 && x < board.length && y < board[0].length;
}

//helper function to get minimum steps needed and also record the path
//if no such path exist, return -1
function bfs(direction) {
    const m = board.length;
    const n = board[0].length;

    
    for (let i = 0; i < m; i++) {
        let arow = new Array(n);
        arow.fill(-1, 0, n);
        direction[i] = arow;
    }

    let queue = [];
    let step = 1;
    queue.push([e_row,e_col]);
    while (queue.length !== 0) {
        let size = queue.length;
        for (let i = 0; i < size; i++) {
            let head = queue.shift();
            let x = head[0];
            let y = head[1];
            if (x === s_row && y === s_col) return step;
            for (let j = 0; j < 4; j++) {
                let nextX = x + deltaX[j];
                let nextY = y + deltaY[j];
                if (nextX < 0 || nextX >= m || nextY < 0 || nextY >= n) continue;
                if (direction[nextX][nextY]!==-1 ||
                    board[nextX][nextY]) continue;
                direction[nextX][nextY] = j;
                queue.push([nextX,nextY]);
            }
        }
        step++;
    }
    return -1;
}

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app is running on PORT:",port);
})
