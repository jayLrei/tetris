//DOM
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text")
const scoreDisplay = document.querySelector(".score")
const restartButton = document.querySelector(".game-text > button")
//Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

//variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingitem;

const BLOCKS = {
    square : [
        [
            [0,0],
            [0,1],
            [1,0],
            [1,1],
        ],
        [
            [0,0],
            [0,1],
            [1,0],
            [1,1],
        ],
        [
            [0,0],
            [0,1],
            [1,0],
            [1,1],
        ],
        [
            [0,0],
            [0,1],
            [1,0],
            [1,1],
        ],
    ],
    bar : [
        [
            [1,0],
            [2,0],
            [3,0],
            [4,0],
        ],
        [
            [2,-1],
            [2,0],
            [2,1],
            [2,2],
        ],
        [
            [1,0],
            [2,0],
            [3,0],
            [4,0],
        ],
        [
            [2,-1],
            [2,0],
            [2,1],
            [2,2],
        ],
    ],
    tree : [
        [
            [1,0],
            [0,1],
            [1,1],
            [2,1],
        ],
        [
            [1,0],
            [0,1],
            [1,1],
            [1,2],
        ],
        [
            [2,1],
            [0,1],
            [1,1],
            [1,2],
        ],
        [
            [2,1],
            [1,2],
            [1,2],
            [1,0],
        ],
    ],
    zee : [
        [
            [0,0],
            [1,0],
            [1,1],
            [2,1],
        ],
        [
            [0,1],
            [1,0],
            [1,1],
            [0,2],
        ],
        [
            [0,1],
            [1,1],
            [1,2],
            [2,2],
        ],
        [
            [2,0],
            [2,1],
            [1,1],
            [1,2],
        ],
    ],
    elleft : [
        [
            [0,0],
            [0,1],
            [1,1],
            [2,1],
        ],
        [
            [1,0],
            [1,1],
            [1,2],
            [0,2],
        ],
        [
            [0,1],
            [1,1],
            [2,1],
            [2,2],
        ],
        [
            [1,0],
            [2,0],
            [1,1],
            [1,2],
        ],
    ],
    elright : [
        [
            [1,0],
            [2,0],
            [1,1],
            [1,2],
        ],
        [
            [0,0],
            [0,1],
            [1,1],
            [2,1],
        ],
        [
            [0,2],
            [1,0],
            [1,1],
            [1,2],
        ],
        [
            [0,1],
            [1,1],
            [2,1],
            [2,2],
        ]
    ]
}
const movingItem = {
    type:"",
    direction:1,
    top:0,
    left:0,
};

init()

// var selector = document.querySelector('.tree','.elleft','.elright','.square','.bar','.zee');
// selector.style.color = "#"+(parseInt(Math.random()*0xffffff)).toString(16);


//Function
function init(){
    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length)
    // console.log(randomIndex);
    blockArray[randomIndex][0]

    tempMovingitem = {...movingItem};

    for(let i=0; i<20; i++) {
        prependNewLine()
    }

    generateNewBlock()
}

function prependNewLine(){
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j=0; j<10; j++){
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)
}

function renderBlocks(moveType=""){
    const {type, direction, top, left} = tempMovingitem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type,"moving");
    })

    // console.log(type, direction, top, left);


    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        //옆이나 밑으로 벗어날 때 방지
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        
        const isAvaliable = checkEmpty(target);
        if(isAvaliable){
            target.classList.add(type,"moving"); 
        } else {
            tempMovingitem = {...movingItem}
            if(moveType === 'retry'){
                clearInterval(downInterval);
                showGameoverText();
            }
            setTimeout(() => {
                renderBlocks('retry');
                if(moveType === "top"){
                    seizeBlock();
                }
                // renderBlocks();
            }, 0)
            return true;
        }
    })

    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}

function seizeBlock(){
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving"); 
        moving.classList.add("seized");
    })
    checkMatch()
    generateNewBlock()
}
function checkMatch(){
    const childNodes = playground.childNodes;

    childNodes.forEach(child => {
        let matched = false;
        child.childNodes[0].childNodes.forEach(li=>{
            if(!li.classList.contains("seized")){
                matched = false;
            }
        })
        if(matched){
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerHTML = score;
        }
    })
    generateNewBlock()
}
function generateNewBlock(){

    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top',1)
    }, duration);

    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length)

    movingItem.type = blockArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingitem = {...movingItem};
    renderBlocks()
}
function checkEmpty(target){
    if(!target || target.classList.contains("seized")){
        return false;
    }
    return true;
}
function moveBlock(moveType,amount){
    tempMovingitem[moveType] += amount;
    renderBlocks(moveType);
}
function changeDirection(){
    const direction = tempMovingitem.direction;
    direction === 3 ? tempMovingitem.direction = 0 : tempMovingitem.direction +=1;
}
function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock("top",1)
    },10)
}
function showGameoverText(){
    gameText.style.display = "flex"  
}

//event handling
document.addEventListener("keydown", e =>{
    switch(e.keycode){
        //오른쪽 키
        case 39:
            moveBlock("left",1);
            break;
        //왼쪽 키
        case 37:
            moveBlock("right",-1);
            break;
        //아래키
        case 40:
            moveBlock("top",1);
            break;
        //위키
        case 38:
            changeDirection()
            break;
        //스페이스바
        case 32 :{
            dropBlock();
            break;}

        default:
            break;
    } 
    console.log(e);
})

restartButton.addEventListener("click",()=>{
    playground.innerHTML = "";
    gameText.style.display = "none";
    init();
})