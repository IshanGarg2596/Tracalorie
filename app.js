// Storage Controller
/* add to storage,  delete from storage, update in storage*/

//Item Controller
/* Contains add item function, delete item, update item*/
const ItemCtrl = (function () {
  //Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //Data Structure / State
  const data = {
    items: [
      {
        id: 0,
        name: "steak",
        calories: 1200,
      },
      {
        id: 1,
        name: "salad",
        calories: 120,
      },
      {
        id: 2,
        name: "soup",
        calories: 150,
      },
    ],
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
  };
})();

// UI Controller
/* remove item from UI, add item to UI, update item in UI, edit button in UI*/
const UICtrl = (function () {
  const UISelectors = {
    itemList: `#item-list`,
    addBtn: `.add-btn`,
    updateBtn: `.update-btn`,
    deleteBtn: `.delete-btn`,
    backBtn: `.back-btn`,
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
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    clearEditState: function () {
      this.clearInput();
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
  };
})();

// App Controller
/* event listeners, call to add item , remove item, update, count total calories, clear all - items by iteratively calling remove items */
const App = (function (ItemCtrl, UICtrl) {
  // Load Event Listeners
  const loadEvenListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Edit icon click
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemUpdateSubmit);
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

      //Clear fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  };

  //Update Item submit
  const itemUpdateSubmit = function (e) {
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
})(ItemCtrl, UICtrl);

App.init();
