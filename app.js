// Storage Controller using module pattern
const StorageCtrl = (function () {
  return {
    storeItem: function (item) {
      let items = [];
      //check if any items in local storage
      if (localStorage.getItem("items") === null) {
        items = [];
        //push new item
        items.push(item);
        //set local storage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));

        //push new item
        items.push(item);

        //reset local storage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();

//Item Controller
const ItemCtrl = (function () {
  //Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  return {
    getItems: function () {
      return data.items;
    },
    getItemById: function (id) {
      for (let item of data.items) {
        if (item.id === id) {
          return item;
        }
      }
    },
    addItem: function (name, calories) {
      let id;
      // Create Id
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(id, name, calories);

      //Add to items array
      data.items.push(newItem);

      return newItem;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function (item) {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;

      //Loop through to add calories
      data.items.forEach((item) => {
        total += item.calories;
      });

      //set total calories in ds
      data.totalCalories = total;

      return data.totalCalories;
    },
    updatedItem: function (name, calories) {
      calories = parseInt(calories);

      let found;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function (id) {
      //Get ids
      const ids = data.items.map(function (item) {
        return item.id;
      });

      const index = ids.indexOf(id);

      // Remove Item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: `#item-list`,
    listItems: `#item-list li`,
    addBtn: `.add-btn`,
    updateBtn: `.update-btn`,
    deleteBtn: `.delete-btn`,
    backBtn: `.back-btn`,
    clearBtn: `.clear-btn`,
    itemNameInput: `#item-name`,
    itemCaloriesInput: `#item-calories`,
    totalCalories: `.total-calories`,
  };

  return {
    populateItemList: function (items) {
      let html = ``;

      items.forEach((item) => {
        html += `<li id="item-${item.id}" class="collection-item">
                <strong>${item.name}:</strong> <span> ${item.calories} Calories</span>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                </li>`;
      });

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getSelectors: function () {
      return UISelectors;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      //Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      //Create li element
      const li = document.createElement("li");
      //Add Class
      li.className = `collection-item`;
      //Add Id
      li.id = `item-${item.id}`;
      //Add Html
      li.innerHTML = `<strong>${item.name}:</strong> <span> ${item.calories} Calories</span>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

      //Insert Item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        ItemCtrl.getCurrentItem().calories;
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      //turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        listItem.remove();
      });
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    updateItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute(`id`);

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}:</strong> <span> ${item.calories} Calories</span>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
  };
})();

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Load Event Listeners
  const loadEvenListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable submit on Enter
    document.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    //Update Item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    //Back Event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    //Delete Item Event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    //clear items event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  // Add item submit
  const itemAddSubmit = function (e) {
    // Get form input form UI Controller
    const input = UICtrl.getItemInput();

    // check for name and calorie input
    if (input.name !== "" && input.calories !== "") {
      //Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Add item to UI List
      UICtrl.addListItem(newItem);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total Calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Store in local storage
      StorageCtrl.storeItem(newItem);

      //Clear fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  };

  //Item Edit Click
  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      // Get list item id (item-0, item-1 etc)
      const listId = e.target.parentNode.parentNode.id;

      // Break id into array
      const listIdArray = listId.split("-")[1];

      // Get the actual id
      const id = parseInt(listIdArray);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      //Set Current Item
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add item to form
      UICtrl.addItemToForm();

      //show Edit State
      UICtrl.showEditState();
    }
    e.preventDefault();
  };

  const itemUpdateSubmit = function (e) {
    //Get form input values after update
    const input = UICtrl.getItemInput();

    const updatedItem = ItemCtrl.updatedItem(input.name, input.calories);

    //Update UI
    UICtrl.updateItem(updatedItem);

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    //Clear Edit State
    UICtrl.clearEditState();

    e.preventDefault();
  };

  //Delete button event
  const itemDeleteSubmit = function (e) {
    //Get current Item
    const currentItem = ItemCtrl.getCurrentItem();

    //Delete From Data Structure
    ItemCtrl.deleteItem(currentItem.id);

    //Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    //Clear Edit State
    UICtrl.clearEditState();

    e.preventDefault();
  };

  const clearAllItemsClick = function (e) {
    // Delete All Items from Data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from ui
    UICtrl.removeItems();

    // Clear from local storage
    StorageCtrl.clearItemsFromStorage();

    //Hide Ul
    UICtrl.hideList();

    e.preventDefault();
  };

  // Public methods
  return {
    init: function () {
      // Clear Edit state / set initial state
      UICtrl.clearEditState();

      //fetch Items from data structure
      const items = ItemCtrl.getItems();

      // check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // populate item list
        UICtrl.populateItemList(items);
      }

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total Calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Load Event Listeners
      loadEvenListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
