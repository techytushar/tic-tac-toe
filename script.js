var arr,i,j;
const human = "X";
const bot = "O";
var winCombos = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
var blocks = document.querySelectorAll(".cell");
startGame();

function startGame(){
    document.querySelector(".text").style.display = "none";
    document.querySelector("body").style.backgroundColor = "white";
    arr = [1,2,3,4,5,6,7,8,9];
    for(i=0;i<9;i++){
        blocks[i].innerText = "";
        blocks[i].style.removeProperty("background-color");
        blocks[i].addEventListener("click",turnClick); 
    }
}
//when human clicks the cell.
function turnClick(targetClick){
    if(turn(targetClick.target.id,human)){
        botturn();
    }
}

function botturn(){
    var bestSpot = minimax(arr,bot).index; 
    console.log(bestSpot);
    turn(bestSpot,bot);
}

function emptySquare(arr){
    var a = [];
    for(i=0;i<arr.length;i++){
        if(typeof(arr[i])==="number"){
            a.push(arr[i]);
        }
    }
    return a;
}

//the minimax algorithm
function minimax(newBoard,player){
    var availableSpots = emptySquare(newBoard);
    //base cases
    if(checkWin(newBoard,human)!=-1){
        return {score:-10};
    }
    else if(checkWin(newBoard,bot)!=-1){
        return {score:10};
    }
    else if(availableSpots.length===0){
        return {score:0};
    }
    var moves = [];
    for(var k=0;k<availableSpots.length;k++){
        var move = {};
        move.index = newBoard[availableSpots[k]-1];
        newBoard[availableSpots[k]-1] = player;
        
        if(player===bot){
            var result = minimax(newBoard,human);
            move.score = result.score;
        }
        else{
            var result = minimax(newBoard,bot);
            move.score = result.score;
        }

        newBoard[availableSpots[k]-1] =  move.index;
        moves.push(move);
    }

    var bestScore,bestMove;
    if(player===bot){
        bestScore = -10000;
        for(var k=0;k<moves.length;k++){
            if(moves[k].score>bestScore){
                bestScore = moves[k].score;
                bestMove = k;
            }
        }
    }
    else{
        bestScore = 10000;
        for(var k=0;k<moves.length;k++){
            if(moves[k].score<bestScore){
                bestScore = moves[k].score;
                bestMove = k;
            }
        }
    }
    return moves[bestMove];
}

//will be used to take turns by human as well as bot. 
function turn(target,player){
    if(typeof(arr[target-1])==="number"){
        arr[target-1] = player;
        document.getElementById(target).innerText=player;
        var res = checkWin(arr,player);
        if(res!=-1){
            gameOver(player,res);
            return;
        }
        if(checkDraw(arr)){
            gameOver("draw",-1);
            return;
        }
        return true;
    }
    return false;
}

function checkWin(arr,player){
    var a=[];
    for(i=0;i<arr.length;i++){
        if(arr[i]==player){
            a.push(i+1);
        }
    }
    for(i=0;i<8;i++){
        for(j=0;j<3;j++){
            if(a.indexOf(winCombos[i][j])==-1){
                break;
            }
        }
        if(j==3){
            return i;
        }
    }
    return -1;
}

function checkDraw(arr){
    if(emptySquare(arr).length!=0){
        return false;
    }
    return true;
}

function gameOver(player,i){
    if(i!=-1){
        for(var j=0;j<3;j++){
            document.getElementById(winCombos[i][j]).style.backgroundColor = "yellow";
        }
    }
    for(i=0;i<9;i++){
        blocks[i].removeEventListener("click",turnClick); 
    }
    if(player=="X"){
        document.querySelector(".text").style.display = "block";
        document.querySelector("body").style.backgroundColor = "green";    
        document.querySelector(".text").innerText="You Win :)";
    }
    else if(player=="O"){
        document.querySelector(".text").style.display = "block";
        document.querySelector("body").style.backgroundColor = "rgb(255, 77, 77)";    
        document.querySelector(".text").innerText="You Loser!";
    }
    else{
        document.querySelector(".text").style.display = "block";
        document.querySelector("body").style.backgroundColor = "gray";    
        document.querySelector(".text").innerText="Its a Tie :| ";
    }
}