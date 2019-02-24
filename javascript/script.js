//TODO: make style changes when press changeTypeButton

const FinanceView = (function(){
    const DOMelements ={
        changeTypeButton:   document.querySelector(".js--button-change"),
        addItemButton:      document.querySelector(".js--button-add"),
        inputTitleItem:     document.querySelector(".js--input-description"),
        inputValueItem:     document.querySelector(".js--input-value"),
        
    }
    
    
    
    return{
        DOMelements
    }
    
    
})();


const FinanceModel = (function(){
    
    
    
})();



const FinanceController = (function(){
    
    
    const DOMelements = FinanceView.DOMelements;
    
    
    
    
    
    function initialization(){
        console.log("initialized");
    }
    
    return  {
        
        initialization
                
    }
    
    
})();


FinanceController.initialization();


























