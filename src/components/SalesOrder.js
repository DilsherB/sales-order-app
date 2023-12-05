import React, { useEffect, useRef, useState } from "react";
import customers from "../data/customers";
import items from "../data/items";
import ShowItems from "./ShowItems";
import * as XLSX from "xlsx";
import arixlogo from "./images/arixlogo.jpg";
import dunilogo from "./images/dunilogo.png";
import srlogo from "./images/srlogo.jpg";
import rclogo from "./images/rclogo.jpg";
import salesmen from "../data/salesmen";
import {
  getCurrentDate,
  updateArray,
  addCommas,
  addRow,
} from "./salesOrderUtils";

const SalesOrder = () => {
  const initialState = "";
  const [name, setName] = useState(initialState);
  const [customerId, setCustomerId] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [po, setPo] = useState("");
  const [rem, setRem] = useState("");
  const [smName, setSmName] = useState("");
  const [smCode, setSmCode] = useState("");
  const [itemsArray, setItemsArray] = useState([
    {
      id: 1,
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
    },
  ]);

  const handleAddRow = () => {
    setItemsArray((prevItemsArray) => addRow(prevItemsArray));
  };

  const showCode = (itemCode, index) => {
    items.forEach((item) => {
      if (item.code.toUpperCase() === itemCode.toUpperCase()) {
        const updatedItemsArray = [...itemsArray];
        updatedItemsArray[index].itemName = item.name;
        updatedItemsArray[index].itemFraction = item.fraction;
        updatedItemsArray[index].itemPrice = item.price;
        setItemsArray(updatedItemsArray);
      }
    });
  };

  const showName = () => {
    let customerCode = document.querySelector("#customerCode").value;
    customers.forEach((customer) => {
      if (customer.code === customerCode) {
        setName(customer.name);
      }
    });
  };

  const showSmName = () => {
    let salesmanCode = document.querySelector("#smCode").value;
    salesmen.forEach((salesman) => {
      if (salesman.code.toUpperCase() === salesmanCode.toUpperCase()) {
        setSmName(salesman.name);
      }
    });
  };

  const prevItemsArray = useRef(itemsArray); // useRef to track the previous state of itemsArray
  useEffect(() => {
    const updatedItemsArray = itemsArray.map((item) => ({
      ...item,

      amount: item.yourPrice
        ? item.qty * (item.yourPrice - (item.yourPrice * item.discount) / 100)
        : item.qty * (item.itemPrice - (item.itemPrice * item.discount) / 100),
    }));

    if (
      updatedItemsArray.length !== prevItemsArray.current.length ||
      updatedItemsArray.some(
        (item, index) =>
          JSON.stringify(item) !== JSON.stringify(prevItemsArray.current[index])
      )
    ) {
      setItemsArray(updatedItemsArray);
      prevItemsArray.current = updatedItemsArray; // Update the reference to the current state
    }
  }, [itemsArray]);

  const priceDiff = () => {
    const updatedItemsArray = itemsArray.map((item) => ({
      ...item,
      isPriceDiff:
        item.yourPrice > item.itemPrice
          ? "**"
          : item.yourPrice < item.itemPrice
          ? "*"
          : "",
    }));
    setItemsArray(updatedItemsArray);
  };

  const handleItemSelect = (selectedItem) => {
    setItemsArray((prevItemsArray) => {
      const updatedItemsArray = prevItemsArray.map((item, index) => {
        if (index === prevItemsArray.length - 1) {
          return {
            ...item,
            itemId: selectedItem.code,
            itemFraction: selectedItem.fraction,
            itemName: selectedItem.name,
            itemPrice: selectedItem.price,
          };
        } else {
          return item;
        }
      });
      return addRow(updatedItemsArray);
    });
  };

  const totalAmount = itemsArray.reduce(
    (total, item) => total + item.amount,
    0
  );

  useEffect(() => {
    setCurrentDate(getCurrentDate);
  }, []);

  const resetState = () => {
    setName(initialState);
    setCustomerId("");
    setCurrentDate("");
    setDeliveryDate("");
    setSmName("");
    setSmCode("");
    setPo("");
    setRem("");
    setItemsArray([
      {
        id: 1,
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
      },
    ]);
  };

  const itemNotFound = (itemId) => {
    return !items.some(
      (item) => item.code.toUpperCase() === itemId.toUpperCase()
    );
  };

  const exportToExcel = () => {
    if (!smName || !customerId) {
      alert("Please enter Salesman Code and Customer Code");
      return;
    }

    const lastRow = itemsArray[itemsArray.length - 1];
    if (
      itemsArray
        .slice(0, -1)
        .some((item) => itemNotFound(item.itemId) || !item.itemId) &&
      !lastRow.itemId
    ) {
      alert("Please enter valid Item Code(s) circled in Red.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet([
      {
        "Order Date": currentDate,
        "Delivery Date": deliveryDate,
        "P.O.": po,
        "Salesman Name": smName,
        "Salesman Code": smCode,
        "Customer Code": customerId,
        "Customer Name": name,
        Remarks: rem,
      },
      ...itemsArray.map((item) => ({
        "Item Code": item.itemId,
        Pack: item.itemFraction,
        Quantity: item.qty,
        "Free Goods": item.freeGoods,
        "Unit Price": item.itemPrice,
        "Your Price": item.yourPrice,
        "Price Diff": item.isPriceDiff,
        Discount: item.discount,
      })),
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Order");
    XLSX.writeFile(wb, "sales_order.xlsx");
    resetState();
  };

  const handleDeleteRow = (index) => {
    setItemsArray((prevItemsArray) => {
      const updatedItemsArray = [...prevItemsArray];
      updatedItemsArray.splice(index, 1);
      return updatedItemsArray;
    });
  };

  const [activeComponent, setActiveComponent] = useState(null);

  const handleShowComponent = (component) => {
    setActiveComponent((prev) => (prev === component ? null : component));
  };

  const showArix = activeComponent === "arix";
  const handleShowArix = () => handleShowComponent("arix");

  const showDuni = activeComponent === "duni";
  const handleShowDuni = () => handleShowComponent("duni");

  const silkRoute = activeComponent === "silkRoute";
  const handleShowSilkRoute = () => handleShowComponent("silkRoute");

  const royalCotton = activeComponent === "royalCotton";
  const handleShowRoyalCotton = () => handleShowComponent("royalCotton");

  return (
    <div className="container-fluid">
      <form style={{ padding: "1rem" }}>
        <div className="header">
          <h1>Alowaid Trading Est.</h1>
          <h2>Sales Order</h2>
          <hr />
        </div>
        <div className="d-flex">
          <div className="col-6 oneUnit">
            <h3 className="flexBtw">
              <div>Order Date</div> : <div>تاريخ الطلب</div>
            </h3>
            <input type="date" value={currentDate} readOnly disabled />
          </div>
          <div className="col-6 oneUnit">
            <h3 className="flexBtw">
              <div>Del۔ Date</div> : <div>تاريخ التوصيل</div>
            </h3>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>
        </div>
        <div className="d-flex">
          <div className="col-6 oneUnit">
            <h3 className="flexBtw">
              <div>SM Code</div> : <div>مندوب کود</div>
            </h3>
            <input
              type="text"
              id="smCode"
              onChange={(e) => setSmCode(e.target.value)}
              value={smCode}
              onBlur={showSmName}
              required
            />
          </div>
          <div className="col-6 oneUnit">
            <h3 className="flexBtw">
              <div>Salesman Name</div> : <div>مندوب</div>
            </h3>
            <input
              type="text"
              // onChange={(e) => setSmName(e.target.value)}
              value={smName}
              readOnly
              disabled
            />
          </div>
        </div>
        <div className="d-flex">
          <div className="col-6 oneUnit">
            <h3 className="flexBtw">
              <div>P.O.</div> : <div>طلب الشراء</div>
            </h3>
            <input
              type="text"
              value={po}
              onChange={(e) => setPo(e.target.value)}
            />
          </div>
          <div className="col-6 oneUnit">
            <h3 className="flexBtw">
              <div>Cust. Code</div> : <div>كود العميل</div>
            </h3>
            <input
              type="text"
              id="customerCode"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              onBlur={showName}
              required
            />
          </div>
        </div>
        <h3 style={{ padding: "1rem" }}>
          Customer Name: <i style={{ color: "blue" }}>{name}</i>
        </h3>
        <div className="oneUnit">
          <h3 className="flexBtw">
            <div>Remarks</div> : <div>ملاحظات</div>
          </h3>
          <input
            type="text"
            value={rem}
            onChange={(e) => setRem(e.target.value)}
          />
        </div>
        <table className="table table-info table-striped">
          <thead>
            <tr>
              <th colSpan={6}>
                <h2>Item Data</h2>
              </th>
            </tr>
            <tr>
              <th>
                كود الصنف <br />
                ItemCode
              </th>
              <th>
                التعبئة <br />
                Pack
              </th>
              <th>
                الكمية <br />
                Quantity
              </th>
              <th>
                بضاعة مجانية <br />
                Free Goodsا
              </th>
              <th hidden>
                السعر <br />
                Unit Price
              </th>
              <th>
                السعر <br />
                Your Price
              </th>
              <th hidden>
                * <br />
                Price Diff
              </th>
              <th>
                %الخصم <br />
                Disc.{" "}
              </th>
              <th
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  maxWidth: "max-content",
                }}
              >
                خذف لائن <br />
                Delete Row
              </th>
              <th hidden>Amount</th>
            </tr>
          </thead>
          <tbody>
            {itemsArray.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="text"
                    id="itemCode"
                    onBlur={(e) => showCode(e.target.value, index)}
                    value={item.itemId}
                    onChange={(e) =>
                      setItemsArray(
                        updateArray(index, "itemId", e.target.value)
                      )
                    }
                    className={itemNotFound(item.itemId) ? "error-border" : ""}
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    style={{ color: "blue" }}
                    value={item.itemFraction}
                    readOnly
                    disabled
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      setItemsArray(updateArray(index, "qty", e.target.value))
                    }
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.freeGoods}
                    onChange={(e) =>
                      setItemsArray(
                        updateArray(index, "freeGoods", e.target.value)
                      )
                    }
                  />
                </td>
                <td hidden>
                  <input
                    type="number"
                    id="itemPrice"
                    value={item.itemPrice}
                    onChange={(e) =>
                      setItemsArray(
                        updateArray(index, "itemPrice", e.target.value)
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.yourPrice}
                    onChange={(e) =>
                      setItemsArray(
                        updateArray(index, "yourPrice", e.target.value)
                      )
                    }
                    onBlur={priceDiff}
                  />
                </td>
                <td hidden>
                  <input
                    type="text"
                    style={{ color: "blue" }}
                    value={item.isPriceDiff}
                    readOnly
                  />
                </td>
                <td className="d-flex w-100 align-items-center justify-content-between">
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) =>
                      setItemsArray(
                        updateArray(index, "discount", e.target.value)
                      )
                    }
                  />
                </td>
                <td style={{ maxWidth: "max-content" }}>
                  <p
                    className="btn btn-danger"
                    style={{ margin: "1rem 0 0 0" }}
                    onClick={() => handleDeleteRow(index)}
                  ></p>
                </td>
                <td hidden>
                  <input type="number" value={item.amount} readOnly />
                </td>
              </tr>
            ))}
            <tr>
              <th colSpan={2}>
                المجموع <br />
                Total
              </th>
              <th colSpan={2}>
                الضريبة <br />
                VAT
              </th>
              <th colSpan={3}>
                المجموع الصافي <br />
                Net
              </th>
            </tr>
            <tr>
              <td colSpan={2}>{addCommas(parseFloat(totalAmount))}</td>
              <td colSpan={2}>{addCommas(totalAmount * 0.15)}</td>
              <td colSpan={3}>
                {addCommas(parseFloat(totalAmount + totalAmount * 0.15))}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex justify-content-between">
          <button onClick={handleAddRow} className="btn btn-success col-5">
            اضافہ لائن <br />
            Add Row
          </button>
          <button onClick={exportToExcel} className="btn btn-success col-5">
            تحويل الى اكسل <br /> Export to Excel
          </button>
        </div>
      </form>
      <h1 className="text-center mt-5">Items information وصف الصنف</h1>
      <div className="container-fluid d-flex justify-content-around mb-2">
        <img src={arixlogo} alt="ARIX" onClick={handleShowArix} />
        <img src={dunilogo} alt="DUNI" onClick={handleShowDuni} />
        <img src={srlogo} alt="Silk Route" onClick={handleShowSilkRoute} />
        <img src={rclogo} alt="Royal Cotton" onClick={handleShowRoyalCotton} />
      </div>
      {showArix && <ShowItems dept={"ax"} onItemClick={handleItemSelect} />}
      {showDuni && <ShowItems dept={"dn"} onItemClick={handleItemSelect} />}
      {silkRoute && <ShowItems dept={"sr"} onItemClick={handleItemSelect} />}
      {royalCotton && <ShowItems dept={"rc"} onItemClick={handleItemSelect} />}
      <div
        className="d-flex justify-content-center border p-3 bg-primary text-white"
        style={{ width: "93vw", borderRadius: "5px", fontSize: "2rem" }}
      >
        Developed with &#10084; by Dilsher Balouch &copy;
      </div>
    </div>
  );
};

export default SalesOrder;
