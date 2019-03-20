// styles import
import '../css/style.css'

//modules import
import FinanceView from './modules/FinanceView';
import FinanceModel from './modules/FinanceModel';

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


























