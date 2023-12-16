import React from "react";
import items from "../data/items";

const ShowItems = ({ dept, onItemClick }) => {
  const sortedItems = items.sort((a, b) => a.code.localeCompare(b.code));
  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Fraction</th>
            {/* <th>Price</th> */}
          </tr>
        </thead>
        <tbody>
          {sortedItems.map(
            (item) =>
              item.dept.toUpperCase() === dept.toUpperCase() && (
                <tr key={item.code} onClick={() => handleItemClick(item)}>
                  <td>{item.code}</td>
                  <td style={{textAlign: "left"}}>{item.name}</td>
                  <td>{item.fraction}</td>
                  {/* <td>{item.price}</td> */}
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShowItems;
