import React, { useEffect, useState } from 'react';
import CustomerInfo from './CustomerInfo';
import ItemTable from './ItemTable';
import Totals from './Totals';

const SalesOrder = () => {
  const [itemsArray, setItemsArray] = useState([
    { id: 1, itemId: '', itemName: '', itemFraction: '', qty: '', freeGoods: '', itemPrice: '', discount: '', amount: '' },
  ]);

  useEffect(() => {
    const updatedItemsArray = itemsArray.map((item) => ({
      ...item,
      amount: item.qty * (item.itemPrice - ((item.itemPrice * item.discount) / 100)),
    }));

    setItemsArray(updatedItemsArray);
  }, [itemsArray]);

  // const showCode = (itemCode, index) => {
  //   items.forEach((key) => {
  //     if (key.code === itemCode.toUpperCase()) {
  //       const updatedItemsArray = [...itemsArray];
  //       updatedItemsArray[index].itemName = key.name;
  //       updatedItemsArray[index].itemFraction = key.fraction;
  //       updatedItemsArray[index].itemPrice = key.price;
  //       setItemsArray(updatedItemsArray);
  //     }
  //   });
  // };

  // const showName = () => {
  //   let customerCode = document.querySelector('#customerCode').value;
  //   customers.forEach((key) => {
  //     if (key.code === customerCode) {
  //       setName(key.name);
  //     }
  //   });
  // };

  const addRow = () => {
    const newId = itemsArray.length + 1;
    setItemsArray([...itemsArray, { id: newId, itemId: '', itemName: '', itemFraction: '', qty: '', freeGoods: '', itemPrice: '', discount: '', amount: '' }]);
  };

  const totalAmount = itemsArray.reduce((total, item) => total + item.amount, 0);

  return (
    <div className='container-fluid'>
      <form style={{ padding: '1rem' }}>
        <CustomerInfo />
        <ItemTable itemsArray={itemsArray} setItemsArray={setItemsArray} />
        <Totals totalAmount={totalAmount} />
        <button onClick={addRow} className='btn btn-primary btn-block'>Add Row</button>
      </form>
    </div>
  );
};

export default SalesOrder;
