import React from 'react';
import items from '../data/items';
import Totals from './Totals';

const ItemTable = ({ itemsArray, setItemsArray }) => {
  const updateArray = (index, field, value) => {
    const updatedItemsArray = [...itemsArray];
    updatedItemsArray[index][field] = value;
    return updatedItemsArray;
  };
  // Function to handle input changes for item name and price.
  const showCode = (itemCode, index) => {
    items.forEach((key) => {
      if (key.code === itemCode.toUpperCase()) {
        const updatedItemsArray = [...itemsArray];
        updatedItemsArray[index].itemName = key.name;
        updatedItemsArray[index].itemFraction = key.fraction;
        updatedItemsArray[index].itemPrice = key.price;
        setItemsArray(updatedItemsArray);
      }
    });
  };
  return (
    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th colSpan={6}><h2>Item Data</h2></th>
        </tr>
        <tr>
          <th>ItemCode</th>
          <th>Pack</th>
          <th>Quantity</th>
          <th>Free Goods</th>
          <th>Unit Price</th>
          <th>%Disc.</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {itemsArray.map((item, index) => (
          <tr key={item.id}>
            <td>
              <input type='text' onBlur={(e) => showCode(e.target.value, index)} value={item.itemId} onChange={(e) => setItemsArray(updateArray(index, 'itemId', e.target.value))} required />
            </td>
            <td>
              <input type='text' style={{ color: 'blue' }} value={item.itemFraction} readOnly />
            </td>
            <td>
              <input type='number' value={item.qty} onChange={(e) => setItemsArray(updateArray(index, 'qty', e.target.value))} required />
            </td>
            <td>
              <input type='number' value={item.freeGoods} onChange={(e) => setItemsArray(updateArray(index, 'freeGoods', e.target.value))} />
            </td>
            <td>
              <input type='number' value={item.itemPrice} onChange={(e) => setItemsArray(updateArray(index, 'itemPrice', e.target.value))} />
            </td>
            <td>
              <input type='number' value={item.discount} onChange={(e) => setItemsArray(updateArray(index, 'discount', e.target.value))} />
            </td>
            <td>
              <input type='number' value={item.amount} readOnly />
            </td>
          </tr>
        ))}
        <Totals />
      </tbody>
    </table>
  );
};

export default ItemTable;
