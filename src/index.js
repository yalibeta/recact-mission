import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
const _ = require('lodash');


function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key = {i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(i){
        return _.range(i*16, (i+1)*16).map(j=> this.renderSquare(j))
    }

    render() {
        const board = _.range(16).map(i=>(
            <div key={i} className="board-row">
                {this.renderRow(i)}
            </div>
        ));
        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(256).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        // for(let i=0; i<256; i++){
        //     const squares = current.squares.slice();
        //     squares[i] = this.state.xIsNext ? "X" : "O";
        //     if(current.squares[i]==null && calculateWinner(squares)===this.state.xIsNext ? "X" : "O"){
        //         console.log(i);
        //     }
        // }
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function* combinations() {
    yield* rows();
    yield* cols();
    yield* LTRdiagonals();
    yield* RTLdiagonals();
}

function* rows(){
    for(let i=0; i<16;i++){
        for(let j=0; j<13; j++){
            const curr = i*16+j;
            yield [curr, curr+1, curr+2, curr+3]
        }
    }
}

function* cols(){
    for(let i=0; i<13;i++){
        for(let j=0; j<16; j++){
            const curr = i*16+j;
            yield [curr, curr+16, curr+32, curr+48]
        }
    }
}

function* LTRdiagonals(){
    for(let i=0; i<13;i++){
        for(let j=0; j<13; j++){
            const curr = i*16+j;
            yield [curr, curr+17, curr+34, curr+51]
        }
    }
}

function* RTLdiagonals(){
    for(let i=0; i<13;i++){
        for(let j=3; j<16; j++){
            const curr = i*16+j;
            yield [curr, curr+15, curr+30, curr+45]
        }
    }
}

function calculateWinner(squares) {
    let a,b,c,d;
    for(let comb of combinations()) {
        [a, b, c, d] = comb;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
            return squares[a];
        }
    }
    return null;
}
registerServiceWorker();
