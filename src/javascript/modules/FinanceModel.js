
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

export default FinanceModel;