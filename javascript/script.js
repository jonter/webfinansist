//TODO: update total data, recalculate percentages when click add-button

const FinanceView = (function(){
    const DOMelements ={
        changeTypeButton:   document.querySelector(".js--button-change"),
        addItemButton:      document.querySelector(".js--button-add"),
        inputTitleItem:     document.querySelector(".js--input-description"),
        inputValueItem:     document.querySelector(".js--input-value"),
        incomeContainer:    document.querySelector(".js--income-list"),
        expenseContainer:   document.querySelector(".js--expense-list")
    }
    
    function changeType(currentInputType){
        
        if(currentInputType==="income"){
            const elements = document.querySelectorAll(".expense-color");
            
            for(let i=0; i < elements.length; i++){
                elements[i].classList.remove("expense-color");
                elements[i].classList.add("income-color");
            }
            
            const icon = document.querySelector(".fa-minus");
            icon.classList.remove("fa-minus");
            icon.classList.add("fa-plus");
            
        }else{
            const elements = document.querySelectorAll(".income-color");
            
            for(let i=0; i < elements.length; i++ ){
                elements[i].classList.remove("income-color");
                elements[i].classList.add("expense-color");
            }
            
            const icon = document.querySelector(".fa-plus");
            icon.classList.remove("fa-plus");
            icon.classList.add("fa-minus");
        }
        
    }
    
    function getUserInput(){
        return {
            value : DOMelements.inputValueItem.value,
            description : DOMelements.inputTitleItem.value
        }
    }
    
    function addItem(newItem){
        
        let listElement, htmlCode;
        
        if(!newItem){
            warnForInput();
            return null;
        }
        
        if(newItem.type==="income"){
            listElement = DOMelements.incomeContainer;
            htmlCode =  `
                            <li class="income-item" id="item-${newItem.item.id}">
                                <p class="item-description">${newItem.item.description}</p>
                                <button class="delete-item-button"><i class="far fa-times-circle"></i></button>
                                <p class="item-value">+ ${newItem.item.value} </p>
                            </li>
                        `;
        }else{
            listElement = DOMelements.expenseContainer;
            let percentageHtml = newItem.item.percentage;
            
            if (percentageHtml === -1) {
                percentageHtml = "&mdash;"; 
            }
            
            htmlCode =  `
                            <li class="expense-item" id="item-${newItem.item.id}">
                                <p class="item-description">${newItem.item.description}</p>
                                <button class="delete-item-button"><i class="far fa-times-circle"></i></button>
                                <div class="item-percentage">${percentageHtml}</div>
                                <p class="item-value">- ${newItem.item.value} </p>
                            </li>
                        `;
        }
        
        
        listElement.insertAdjacentHTML("afterbegin", htmlCode);
        clearInput();
    }
        
    function warnForInput(){
        alert("you should enter description and value to add new item");
    }
    
    function clearInput(){
        DOMelements.inputValueItem.value = "";
        DOMelements.inputTitleItem.value = "";
        DOMelements.inputTitleItem.focus();   
    }
    
    return{
        DOMelements,
        changeType,
        getUserInput,
        addItem
    }
    
    
})();


const FinanceModel = (function(){
    
    const currentState = {
        inputType: "income"
    }
    
    const data ={
        totalValues:{
            income:0,
            expense:0,
            profit:{
                value:0,
                percentage:0
            }
        },
        
        allItems:{
            income:[],
            expense:[]
        }  
    }
    
    const Income = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    const Expense = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
        
        this.calculatePercentage = function (totalIncome){
            if(totalIncome - this.value > 0){
                this.percentage = Math.round(this.value / totalIncome *100);
            }else{
                this.percentage = -1;
            }
        }
    }
    
    function addItem(description, value){
        
        if(!description || !value){
            return null;
        }
        
        const itemsArray = data.allItems[currentState.inputType];
        let id=0;
        if(itemsArray.length>0){
            const lastItem = itemsArray[itemsArray.length-1];
            id = lastItem.id+1;
        }
        
        let newItem;
        if(currentState.inputType==="income"){
            newItem = new Income(id, description, parseFloat(value));
        }else{
            newItem = new Expense(id, description, parseFloat(value));
            newItem.calculatePercentage(data.totalValues.profit.value);
        }
        
        data.allItems[currentState.inputType].push(newItem);
        
        return {
            item: newItem,
            type: currentState.inputType
        };
        
    }
    
    
    function changeType(){
        if(currentState.inputType==="income")
            currentState.inputType="expense";
        else 
            currentState.inputType="income";
    }
    
    return{
        currentState,
        changeType,
        addItem
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
        
        DOMelements.addItemButton.addEventListener('click',addItem);
        document.addEventListener('keypress',function(event){
            if (event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        })
    }
    
    function addItem (){
        const userInput = FinanceView.getUserInput();
        const addedItem = FinanceModel.addItem(userInput.description,userInput.value);

        FinanceView.addItem(addedItem);
    }
    
    return  {
        
        initialization
                
    }
    
    
})();


FinanceController.initialization();


























