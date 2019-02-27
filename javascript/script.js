//TODO: add a possibility to delete an item

const FinanceView = (function(){
    const DOMelements ={
        changeTypeButton:       document.querySelector(".js--button-change"),
        addItemButton:          document.querySelector(".js--button-add"),
        inputTitleItem:         document.querySelector(".js--input-description"),
        inputValueItem:         document.querySelector(".js--input-value"),
        incomeContainer:        document.querySelector(".js--income-list"),
        expenseContainer:       document.querySelector(".js--expense-list"),
        totalIncomeValue:       document.querySelector(".js--total-income-value"),
        totalExpenseValue:      document.querySelector(".js--total-expense-value"),
        totalProfitValue:       document.querySelector(".js--total-profit-value"),
        totalProfitText:        document.querySelector(".js--total-profit-text")
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
        
        if(newItem.type==="income"){ //refactor that
            listElement = DOMelements.incomeContainer;
            htmlCode =  `
                            <li class="income-item" id="item-${newItem.item.id}">
                                <p class="item-description">${newItem.item.description}</p>
                                <button class="delete-item-button"><i class="far fa-times-circle"></i></button>
                                <p class="item-value">+ ${newItem.item.value.toFixed(2)} </p>
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
                                <p class="item-value">- ${newItem.item.value.toFixed(2)} </p>
                            </li>
                        `;
        }
        
        
        listElement.insertAdjacentHTML("afterbegin", htmlCode);
        clearInput();
    }
        
    function warnForInput(){
        alert("check your input fields: they could be empty or the value you have entered could be very high");
    }
    
    function clearInput(){
        DOMelements.inputValueItem.value = "";
        DOMelements.inputTitleItem.value = "";
        DOMelements.inputTitleItem.focus();   
    }
    
    function updateData(newData){
        updateIncomeAndExpense(newData);
              
        profitUpdate(newData);
        
        updateItemsPercentage(newData.allItems.expense);
        //stopped here...
    }
    
    function updateIncomeAndExpense(newData){
        DOMelements.totalIncomeValue.textContent = newData.totalValues.income.toFixed(2);
        const expense = newData.totalValues.expense.value;
        const expensePersentage = newData.totalValues.expense.percentage;
        
        let htmlExpenseText;
        
        if(expensePersentage > 0){
            htmlExpenseText = `${expense.toFixed(2)} <span class="total-percentage js--total-expense-percentage">${expensePersentage}%</span>`;
        }else{
            htmlExpenseText = `${expense.toFixed(2)} <span class="total-percentage js--total-expense-percentage">&mdash;</span>`;
        }
        DOMelements.totalExpenseValue.innerHTML = htmlExpenseText;
    }
    
    function profitUpdate(newData){
        const profit = newData.totalValues.profit;
        let profitText = "profit";
        
        if(profit === 0 ){
            DOMelements.totalProfitValue.innerHTML = "&mdash;"
        }else if (profit > 0){
            DOMelements.totalProfitValue.textContent = "+ "+newData.totalValues.profit.toFixed(2);
        }else{
            profitText = "loss";
            const profitAbsoulute = Math.abs(profit);
            DOMelements.totalProfitValue.textContent = "- "+profitAbsoulute.toFixed(2);
        }  
        DOMelements.totalProfitText.textContent = profitText;
    }
    
    function updateItemsPercentage(expenseArray){
        const itemPercentageArray = document.querySelectorAll(".item-percentage");
        
        for(let i = 0; i < expenseArray.length; i++){
            const idStringItem = itemPercentageArray[i].parentNode.id;
            const idItem = parseFloat(idStringItem.split("-")[1]);
            
            for (let j = 0; j < expenseArray.length; j++){
                
                if(expenseArray[j].id === idItem){
                    if(expenseArray[j].percentage < 1){
                        itemPercentageArray[i].innerHTML = "&mdash;";
                    }else{
                        itemPercentageArray[i].textContent = expenseArray[j].percentage+"%";
                    }
                        return;
                }
            }
        }
    }
    
    
    
    return{
        DOMelements,
        changeType,
        getUserInput,
        addItem,
        updateData
    }
    
    
})();


const FinanceModel = (function(){
    
    const currentState = {
        inputType: "income"
    }
    
    const data ={
        totalValues:{
            income:0,
            expense:{
                value:0,
                percentage:0
            },
            profit:0
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
        
        if(!description || !value || value > 100000000 || value < -100000000){
            return null;
        }
        
        const itemsArray = data.allItems[currentState.inputType];
        let id=0;
        if(itemsArray.length>0){
            const lastItem = itemsArray[itemsArray.length-1];
            id = lastItem.id+1;
        }
        
        let newItem;
        const numValue = parseFloat(value);
        const moduleValue = Math.abs(numValue);
        if(currentState.inputType==="income"){
            newItem = new Income(id, description, moduleValue);
        }else{  
            newItem = new Expense(id, description, moduleValue);
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
    
    function updateData(addedItem){
        
        if(addedItem.type==="income"){
            data.totalValues.income+=addedItem.item.value;
        }else{
            data.totalValues.expense.value+=addedItem.item.value;
        }
        calculateTotalPercentage();
        updatePercentageItems();
        
        data.totalValues.profit = data.totalValues.income - data.totalValues.expense.value;
        
        return data;
    }
    
    function calculateTotalPercentage(){
        if(data.totalValues.income - data.totalValues.expense.value > 0){
            data.totalValues.expense.percentage = Math.round(data.totalValues.expense.value / data.totalValues.income *100);
        }else{
            data.totalValues.expense.percentage = -1;
        }
    }
    
    function updatePercentageItems(){
        data.allItems.expense.forEach(function(element){
            element.calculatePercentage(data.totalValues.income); 
        });
    }
    
    function getData (){
        return data;
    }
    
    return{
        currentState,
        changeType,
        addItem,
        updateData,
        getData
    }
    
    
})();



const FinanceController = (function(){
    
    
    const DOMelements = FinanceView.DOMelements;
    
    
    
    
    
    function initialization(){
        
        setupListeners();
        setDefaults();
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
        });
    }
    
    function addItem (){
        const userInput = FinanceView.getUserInput();
        const addedItem = FinanceModel.addItem(userInput.description,userInput.value);
        FinanceView.addItem(addedItem);
        
        const newData = FinanceModel.updateData(addedItem);  
        FinanceView.updateData(newData);
    }
    
    function setDefaults(){
        FinanceView.updateData(FinanceModel.getData());
    }
    
    return  {
        
        initialization
                
    }
    
    
})();


FinanceController.initialization();


























