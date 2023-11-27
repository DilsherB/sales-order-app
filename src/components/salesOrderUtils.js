export const updateArray = (index, key, value) => {
    return function (prevState) {
      const updatedItemsArray = [...prevState];
      updatedItemsArray[index][key] = value;
      return updatedItemsArray;
    };
  }

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const addCommas = (number) => {
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

export const addRow = (currentItemsArray) => {
  const newId = currentItemsArray.length + 1;
  const newItem = {
    id: newId,
    itemId: "",
    itemName: "",
    itemFraction: "",
    qty: "",
    freeGoods: "",
    itemPrice: "",
    yourPrice: "",
    isPriceDiff: "",
    discount: "",
    amount: "",
  };

  return [...currentItemsArray, newItem];
};