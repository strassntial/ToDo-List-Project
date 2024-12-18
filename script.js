const itemform = document.getElementById('item-form');
const iteminput = document.getElementById('item-input');
const itemlist = document.getElementById('item-list');
const validateinput = document.getElementById('input-invalid');
const clearall = document.getElementById('items-clear');
const filter = document.getElementById('filter');
const formBtn = itemform.querySelector('button');
let isEditMode = false;

// Listeners

// Submit Form
itemform.addEventListener('submit',function submit(e){
    e.preventDefault();
    let newitem = iteminput.value;

    // Validate Input
    if (newitem == ''){
        validateinput.innerText="Please add an item";
        return
    } else {
        validateinput.innerText="";
    }
    
    // Edit Mode
    if(isEditMode){
           const itemToEdit =  itemlist.querySelector('.edit-mode');
           removeItemFromStorage(itemToEdit);
           itemToEdit.remove();
            formBtn.classList.replace('btn-primary','btn-dark');
            formBtn.innerHTML = "<i class='bi bi-plus'></i>Add Item";
           isEditMode = false;
        } else if (checkIfItemExists(newitem)){
            validateinput.innerText = 'This Item Is Already Exist';
            return

        }else {
            validateinput.innerText = '';
        }
    
    addItemToDom(newitem);
    addItemToStorage(newitem);

    iteminput.value='';
    checkUI();
})

// onclick Items
itemlist.addEventListener('click' , function onclick(e){
    
    if( e.target.classList.contains('bi') ){
       removeItem(e.target);
    } else {
        setItemToEdit(e.target);
    }
    checkUI();
})

// Filtering
filter.addEventListener('input', function(e){
    const text = e.target.value.toLowerCase();
   const items = itemlist.querySelectorAll('li');
   items.forEach(function(item){
    const itemName =item.innerText.toLowerCase();
    if(itemName.indexOf(text) !== -1){
        item.style.display= 'flex';
    } else{
        item.style.display= 'none';
    }
   })

})

//  Clear All Items
clearall.addEventListener('click',function clearall(e){
    itemlist.innerHTML='';
    localStorage.removeItem('items');

    checkUI();
})

//  Display Items When Page Loaded
document.addEventListener('DOMContentLoaded' , function(){
    const storagearray = getItemsFromStorage();

    storagearray.forEach(function(item){
        addItemToDom(item);
    })

    checkUI();
})

// Functions 

//  Add Item To Dom
function addItemToDom(item){
    const li = document.createElement('li');
    li.classList.add('list-item');
    li.textContent =item;

    const icon = document.createElement('i');
    icon.className = 'bi bi-x fs-5 text-danger';

    li.appendChild(icon);
    itemlist.appendChild(li);
}

// Add Item To Storage
function addItemToStorage(item){
    const storagearray = getItemsFromStorage();
    
    storagearray.push(item);
    localStorage.setItem('items',JSON.stringify(storagearray));
    
}

// Remove Item From Storage
function removeItemFromStorage(item){
    let storagearray = getItemsFromStorage();

    storagearray = storagearray.filter(function (items){
       return items != item.innerText
    }) 

    localStorage.setItem('items',JSON.stringify(storagearray));
}

// Remove Item
function removeItem(item){
    item.parentElement.remove();
    removeItemFromStorage(item.parentElement);
}

//Get Items From Storage
function getItemsFromStorage(){
    let storagearray;

    if (localStorage.getItem('items') === null) {
        storagearray = [];
    } else {
        storagearray = JSON.parse(localStorage.getItem('items'));
    }

    return storagearray;
}

// Check If Item Exists
function checkIfItemExists(item){
    const storagearray = getItemsFromStorage();
    return storagearray.includes(item);
}

// Update Items
function setItemToEdit(item){
    isEditMode = true;
    itemlist.querySelectorAll('li').forEach(function(item){
        item.classList.remove('edit-mode');
    })
   item.classList.add('edit-mode');
   iteminput.value = item.textContent;
    formBtn.innerHTML = "<i class='bi bi-pencil-fill'></i> Update Item";
    formBtn.classList.replace('btn-dark', 'btn-primary');
}

// Check UI
function checkUI(){
    const items = itemlist.querySelectorAll('li');
    if (items.length == 0){
        clearall.parentElement.classList.add('d-none');
        filter.classList.add('d-none');
    } else {
        clearall.parentElement.classList.remove('d-none');
        filter.classList.remove('d-none');
    }
}


