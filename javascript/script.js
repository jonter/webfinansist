//TODO: Add data when click add-button

const FinanceView = (function(){
    const DOMelements ={
        changeTypeButton:   document.querySelector(".js--button-change"),
        addItemButton:      document.querySelector(".js--button-add"),
        inputTitleItem:     document.querySelector(".js--input-description"),
        inputValueItem:     document.querySelector(".js--input-value") 
    }
    
    
    function changeType(currentInputType){
        
        if(currentInputType==="income"){
            const elements = document.querySelectorAll(".expense-color");
            
            for(let i=0;i<elements.length;i++ ){//fa-plus
                elements[i].classList.remove("expense-color");
                elements[i].classList.add("income-color");
            }
            
            const icon = document.querySelector(".fa-minus");
            icon.classList.remove("fa-minus");
            icon.classList.add("fa-plus");
            
        }else{
            const elements = document.querySelectorAll(".income-color");
            
            for(let i=0; i<elements.length; i++ ){
                elements[i].classList.remove("income-color");
                elements[i].classList.add("expense-color");
                console.log('===expense');
            }
            
            const icon = document.querySelector(".fa-plus");
            icon.classList.remove("fa-plus");
            icon.classList.add("fa-minus");
        }
        
    }
    
    return{
        DOMelements,
        changeType
    }
    
    
})();


const FinanceModel = (function(){
    
    const currentState = {
        inputType: "income"
    }
    
    
    function changeType(){
        if(currentState.inputType==="income")
            currentState.inputType="expense";
        else 
            currentState.inputType="income";
    }
    
    return{
        currentState,
        changeType
    }
    
    
})();



const FinanceController = (function(){
    
    
    const DOMelements = FinanceView.DOMelements;
    
    
    
    
    
    function initialization(){
        
        setupListeners();
    }
    
    function setupListeners(){
        DOMelements.changeTypeButton.addEventListener('click',()=>{
            FinanceModel.changeType();
            const currentInputType = FinanceModel.currentState.inputType;
            FinanceView.changeType(currentInputType);  
        });
    }
    
    return  {
        
        initialization
                
    }
    
    
})();


FinanceController.initialization();


























