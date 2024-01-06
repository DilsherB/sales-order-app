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
        updatedItemsArray[index].itemPrice = item.SalesPrice;
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
      isPriceDiff: (item.yourPrice - item.itemPrice).toFixed(2),
        // item.yourPrice > item.itemPrice
        //   ? "**"
        //   : item.yourPrice < item.itemPrice
        //   ? "*"
        //   : "",
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
            itemPrice: selectedItem.SalesPrice,
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
      const ele = document.getElementById("message");
      ele.innerHTML = "Please enter Salesman Code and Customer Code";
      setTimeout(() => {
        ele.innerHTML = "";
      }, 5000);
      return;
    }

    const lastRow = itemsArray[itemsArray.length - 1];
    if (
      itemsArray
        .slice(0, -1)
        .some((item) => itemNotFound(item.itemId) || !item.itemId) &&
      !lastRow.itemId
    ) {
      const ele = document.getElementById("message");
      ele.innerHTML = "Please enter valid Item Code(s) circled in Red.";
      setTimeout(() => {
        ele.innerHTML = "";
      }, 5000);
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            id="message"
            style={{
              color: "red",
              width: "max-content",
              fontSize: "2rem",
              backgroundColor: "aqua",
              padding: "0.1rem 2rem",
              borderRadius: "0.5rem",
            }}
          ></p>
        </div>
        <table className="table table-info table-striped">
          <thead>
            <tr>
              <th colSpan={6} style={{ padding: "0", margin: "0" }}>
                <h2>Item Data</h2>
              </th>
            </tr>
            <tr>
              <th style={{ padding: "0", margin: "0" }}>
                كود الصنف <br />
                ItemCode
              </th>
              <th style={{ padding: "0", margin: "0" }}>
                التعبئة <br />
                Pack
              </th>
              <th style={{ padding: "0", margin: "0" }}>
                الكمية <br />
                Quantity
              </th>
              <th style={{ padding: "0", margin: "0" }}>
                بضاعة مجانية <br />
                Free Goodsا
              </th>
              <th hidden style={{ padding: "0", margin: "0" }}>
                السعر <br />
                Unit Price
              </th>
              <th style={{ padding: "0", margin: "0" }}>
                السعر <br />
                Your Price
              </th>
              <th hidden style={{ padding: "0", margin: "0" }}>
                * <br />
                Price Diff
              </th>
              <th style={{ padding: "0", margin: "0" }}>
                %الخصم <br />
                Disc.{" "}
              </th>
              <th
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  maxWidth: "max-content",
                  padding: "0",
                  margin: "0",
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
                <td style={{ padding: "0", margin: "0" }}>
                  <input
                    style={{ width: "fit-content" }}
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
                <td style={{ padding: "0", margin: "0" }}>
                  <input
                    type="text"
                    style={{ color: "blue" }}
                    value={item.itemFraction}
                    readOnly
                    disabled
                  />
                </td>
                <td style={{ padding: "0", margin: "0" }}>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      setItemsArray(updateArray(index, "qty", e.target.value))
                    }
                    required
                  />
                </td>
                <td style={{ padding: "0", margin: "0" }}>
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
                <td hidden style={{ padding: "0", margin: "0" }}>
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
                <td style={{ padding: "0", margin: "0" }}>
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
                <td hidden style={{ padding: "0", margin: "0" }}>
                  <input
                    type="text"
                    style={{ color: "blue" }}
                    value={item.isPriceDiff}
                    readOnly
                  />
                </td>
                <td
                  className="d-flex w-100 align-items-center justify-content-between"
                  style={{ padding: "0", margin: "0" }}
                >
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
                <td
                  style={{ maxWidth: "max-content", padding: "0", margin: "0" }}
                >
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
            تحويل الى اكسل Excel
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
        style={{ borderRadius: "5px", fontSize: "2rem" }}
      >
        Developed with &#10084; by Dilsher Balouch &copy;
      </div>
    </div>
  );
};

export default SalesOrder;
