const inputSlider=document.querySelector("[data-lengthSlider]")
const lengthDisplay=document.querySelector("[data-lengthNumber]")

const passwordDisplay=document.querySelector("[data-passwordDisplay]")
const copyBtn=document.querySelector(".data-copy")
const copyMsg=document.querySelector("[data-copyMsg]")
const uppercaseCheck=document.querySelector("#uppercase")
const lowercaseCheck=document.querySelector("#lowercase")
const numbersCheck=document.querySelector("#numbers")
const symbolsCheck=document.querySelector("#symbols")
const indicator=document.querySelector("[data-Indicator]")
const generateBtn=document.querySelector("[generatePassword]")
const allCheckBox=document.querySelectorAll("input[type=checkbox]")
const symbols="~`!@#$%^&*()<>;:,.?/{}[]_";

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
setIndicator("#ccc");

//set passwordLength
function handleSlider(){
    // let value=inputSlider.value;
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=inputSlider.value;
    // inputSlider.oninput=function(){
    //     lengthDisplay.innerText=this.value;
    // }
    const min = inputSlider.min;
    const max = inputSlider.max;
    console.log(max);
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}
inputSlider.addEventListener('input',(text)=>{
    passwordLength=text.target.value;
    handleSlider();
})

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min+1)+min); 
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,122));
}
function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,90));
}
function generateSymbol(){
    const ranNum=getRndInteger(0,symbols.length-1);
    // console.log(ranNum)
    // console.log(symbols.charAt[ranNum])
    return symbols.charAt(ranNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper&&hasLower&&(hasNum||hasSym)&&inputSlider.value>=8){
        setIndicator("#0f0")
    }else if((hasLower||hasUpper)&&(hasNum||hasSym)&&inputSlider.value>=6){
        setIndicator("#ff0")
    }else{
        setIndicator("#f00")
    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active")
    },2000);
}
function handleCheckboxChange(){
    checkCount=0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked){
            checkCount++;
        }
    });
    //special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider(); 
    }

}

allCheckBox.forEach((checkBox)=>{
    checkBox.addEventListener('change',handleCheckboxChange);
})
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

function shufflePassword(arr){
    //Fisher Yates Method ->shuffle the elements of array
    for(let i=arr.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
    let str="";
    arr.forEach((ele)=>(str+=ele));
    return str;
}

generateBtn.addEventListener('click',()=>{
    if(checkCount<=0) return ;
    if(passwordLength<=checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    console.log("Starting")
    password="";
    //putting necessary conditions
    // if(uppercaseCheck.checked){
    //     password+=generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowercase();

    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }
    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    //compulsory adding
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
        
    }
    console.log("Compu done")
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length-1);
        // console.log(randIndex)
        password+=funcArr[randIndex](); 
    }
    console.log("reamu  done")

    //shuffle the password
    password=shufflePassword(Array.from(password));
    console.log("UI")

    passwordDisplay.value=password;
    calcStrength()
})

 