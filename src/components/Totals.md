import React from 'react';

const Totals = ({ totalAmount }) => {
  const addCommas = (number) => {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  return (
    <tr>
      <td colSpan={2}>{addCommas(parseFloat(totalAmount))}</td>
      <td colSpan={2}>{addCommas(totalAmount * 0.15)}</td>
      <td colSpan={2}>{addCommas(parseFloat(totalAmount + (totalAmount * 0.15)))}</td>
    </tr>
  );
};

export default Totals;
