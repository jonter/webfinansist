//TODO: webpack

const FinanceView = (function(){
    const DOMelements ={
        changeTypeButton:       document.querySelector(".js--button-change"),
        addItemButton:          document.querySelector(".js--button-add"),
        inputTitleItem:         document.querySelector(".js--input-description"),
        inputValueItem:         document.querySelector(".js--input-value"),
        totalIncomeValue:       document.querySelector(".js--total-income-value"),
        totalExpenseValue:      document.querySelector(".js--total-expense-value"),
        totalProfitValue:       document.querySelector(".js--total-profit-value"),
        totalProfitText:        document.querySelector(".js--total-profit-text"),
        dataContainer:          document.querySelector(".js--data-container"),
        datetimeTitle:          document.querySelector(".js--current-datatime")
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
    
    function addItem(newItem, type){
        let listElement, htmlCode, dateContainer;
        
        if(!newItem){
            warnForInput();
            return null;
        }
        
        const dateFormated = formatDate(newItem.dateCreation);
        dateContainer = findDateContainer(dateFormated);
        
        if(!dateContainer){
            const containerHTML = createNewDateContainer(dateFormated);
            DOMelements.dataContainer.insertAdjacentHTML("afterbegin", containerHTML);
            dateContainer = findDateContainer(dateFormated);
        }
        
        if(type==="income"){ 
            listElement = dateContainer.children[1].firstElementChild;
            htmlCode =  createIncomeItem(newItem);
        }else{
            listElement = dateContainer.children[2].firstElementChild;
            htmlCode = createExpenseItem(newItem);
        }
        
        listElement.insertAdjacentHTML("afterbegin", htmlCode);
        clearInput();
    }
    
    function formatDate(date){
        return date.toLocaleDateString('en-US', {
            month : 'short',
            day : 'numeric',
            year : 'numeric'
        });
    }
    
    function findDateContainer(date){
        const dateContainers = Array.from(document.querySelectorAll(".js--datetime-container"));
        for(container of dateContainers){
            if(container.dataset.date === date){
                return container;
            }
        }
        return null;
    }
    
    function createNewDateContainer(date){
        let dateText = (date === formatDate(new Date()))
            ? "Today"
            : date;
        
        const containerHTML =   `
                                    <div class="datetime-container js--datetime-container clearfix" data-date = "${date}">
                                        <h3 class="datetime-title">${dateText}</h3>
                                        <div class="income-container">
                                            <ul class="income-data-list js--income-list">
                                            </ul>
                                        </div>

                                        <div class="expense-container clearfix ">
                                            <ul class="expense-data-list js--expense-list">
                                            </ul>
                                        </div>
                                    </div>
                                `;
        return containerHTML;
    }
    
    function createIncomeItem(item){
        htmlCode =  `
                        <li class="income-item" id="item-${item.id}">
                            <p class="item-description">${item.description}</p>
                            <button class="delete-item-button">
                                <i class="far fa-times-circle js--delete-item-button"></i>
                            </button>
                            <p class="item-value">+ ${item.value.toFixed(2)} </p>
                        </li>
                    `;
        return htmlCode;
    }
    
    function createExpenseItem(item){
        let percentageHtml = item.percentage+"%";

        if (percentageHtml === -1) {
            percentageHtml = "&mdash;"; 
        }

        htmlCode =  `
                        <li class="expense-item" id="item-${item.id}">
                            <p class="item-description">${item.description}</p>
                            <button class="delete-item-button">
                                <i class="far fa-times-circle js--delete-item-button"></i>
                            </button>
                            <div class="item-percentage">${percentageHtml}</div>
                            <p class="item-value">- ${item.value.toFixed(2)}</p>
                        </li>
                    `;
        return htmlCode;
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
        if(newData){
            updateIncomeAndExpense(newData);      
            updateProfit(newData);
            updateItemsPercentage(newData.allItems.expense);
        }
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
    
    function updateProfit(newData){
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
                }
            }
        }
    }
    
    function deleteItem(idItem, type){
        let element;
        
        if (type === "income"){
            element = document.querySelector(`.income-container #${idItem}`);
        }else{
            element = document.querySelector(`.expense-container #${idItem}`);
        }
        const dateContainer = element.parentNode.parentNode.parentNode;
        element.parentNode.removeChild(element);  
        
        if(!checkForItems(dateContainer)){
            dateContainer.parentNode.removeChild(dateContainer);
        }
    }
    
    function checkForItems(dateContainer){
        const incomeList = dateContainer.children[1].firstElementChild;
        const expenseList = dateContainer.children[2].firstElementChild;
        
        if(incomeList.children.length<1 && expenseList.children.length<1){
            return false;
        }
        return true;      
    }
    
    function displayDate(){
        const currentDate = new Date();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        const monthNumber = currentDate.getMonth();
        const year  = currentDate.getFullYear();
        
        DOMelements.datetimeTitle.textContent = months[monthNumber-1]+" "+year;
    }
    
    function displayLoadedData(loadedData){
        if(loadedData){
            
            updateIncomeAndExpense(loadedData);      
            updateProfit(loadedData);
            
            displayAllItems(loadedData.allItems);
            updateItemsPercentage(loadedData.allItems.expense);
            
        }
    }
    
    function displayAllItems(items){
        const incomeItems = items.income;
        const expenseItems = items.expense;
        
        incomeItems.forEach(function(item){
            addItem(item, "income");
        });
        expenseItems.forEach(function(item){
            addItem(item, "expense");
        });
    }
    
    return{
        DOMelements,
        changeType,
        getUserInput,
        addItem,
        updateData,
        deleteItem,
        displayDate,
        displayLoadedData
    }
    
    
})();


const FinanceModel = (function(){
    
    const currentState = {
        inputType: "income"
    }
    
    let data ={
        totalValues:{
            income:0,
            expense:{
                value:0,
                percentage:0
            },
            profit:0
        },
        
        allItems:{
            income:  [],
            expense: []
        }  
    }
    
    const Income = function (id, description, value, date = new Date()){
        this.id = id;
        this.description = description;
        this.value = value;
        this.dateCreation = new Date(date);
    }
    
    const Expense = function (id, description, value, date = new Date()){
        this.id = id;
        this.description = description;
        this.value = value;
        this.dateCreation = new Date(date);
        
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
        
        if(currentState.inputType === "income"){
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
        if(currentState.inputType === "income")
            currentState.inputType = "expense";
        else 
            currentState.inputType = "income";
    }
    
    function updateData(){
        
        calculateTotals();
        calculateTotalPercentage();
        updatePercentageItems();
               
        return data;
    }
    
    function calculateTotals(){
        data.totalValues.income = 0;
        data.totalValues.expense.value = 0;
        
        data.allItems.income.forEach(function(element){
            data.totalValues.income += element.value;
        });
        
        data.allItems.expense.forEach(function(element){
            data.totalValues.expense.value += element.value;
        });
        
        data.totalValues.profit = data.totalValues.income - data.totalValues.expense.value;
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
    
    
    function deleteItem(id,type){
        
        data.allItems[type].forEach(function(element,index){
            if(element.id == id){
                data.allItems[type].splice(index,1);
                return;
            }
        });
    }
    
    function saveData(){
        localStorage.setItem("incomes", JSON.stringify(data.allItems.income));
        localStorage.setItem("expenses", JSON.stringify(data.allItems.expense));
    }
    
    function loadData(){
        const incomeItems = JSON.parse(localStorage.getItem("incomes"));
        const expenseItems = JSON.parse(localStorage.getItem("expenses"));
        
        
        if(incomeItems){
            incomeItems.forEach(function(item){
                const incomeItem = new Income(item.id, item.description, item.value, item.dateCreation);
                data.allItems.income.push(incomeItem);
            });
        }
        
        if(expenseItems){
            expenseItems.forEach(function(item){
                const expenseItem = new Expense(item.id, item.description, item.value, item.dateCreation);
                data.allItems.expense.push(expenseItem);
            });
        }
    }
    
    return{
        currentState,
        changeType,
        addItem,
        updateData,
        deleteItem,
        getData,
        saveData,
        loadData
    }
    
    
})();



const FinanceController = (function(){
     
    const DOMelements = FinanceView.DOMelements;
    
    function initialization(){ 
        setupListeners();
        
        FinanceModel.loadData();
        FinanceModel.updateData();
        
        const loadedData = FinanceModel.getData();
        
        FinanceView.displayLoadedData(loadedData);
        FinanceView.displayDate();
    }
    
    function setupListeners(){
        DOMelements.changeTypeButton.addEventListener('click',()=>{
            FinanceModel.changeType();
            const currentInputType = FinanceModel.currentState.inputType;
            FinanceView.changeType(currentInputType);  
        });
        
        DOMelements.addItemButton.addEventListener('click', addItem);
        
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });
        
        DOMelements.dataContainer.addEventListener('click', deleteItem)
        
    }
    
    function addItem (){
        const userInput = FinanceView.getUserInput();
        const addedItem = FinanceModel.addItem(userInput.description, userInput.value);
        FinanceView.addItem(addedItem.item, addedItem.type);
        
        const newData = FinanceModel.updateData();  
        FinanceView.updateData(newData);
        
        FinanceModel.saveData();
    }
    
    
    
    
    function deleteItem(event){
        //find item and its id where button was pressed
        const item = event.target.parentNode.parentNode;
        const itemID = item.id;
        
        if(itemID){
            
            const id = itemID.split('-')[1];
            const type = item.classList[0].split('-')[0];
            
            
            FinanceModel.deleteItem(id,type);
            
            FinanceView.deleteItem(itemID, type);
            
            const data = FinanceModel.updateData();
            FinanceView.updateData(data);            
        }
        FinanceModel.saveData();
    }
    
    return  {
        initialization   
    }
     
})();


FinanceController.initialization();


























