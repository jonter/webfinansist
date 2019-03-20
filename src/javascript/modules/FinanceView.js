
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
        for(const container of dateContainers){
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
        const htmlCode =  `
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

        const htmlCode =  `
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

export default FinanceView;