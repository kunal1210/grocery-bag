import React, { useState, useEffect, useTransition } from "react";
import List from "./List";
import Alert from "./Alert";

function App() {
  const getlocalstorage = () => {
    const data = localStorage.getItem("list");
    if (data) {
      return JSON.parse(data);
    } else {
      return [];
    }
  };
  const [name, setName] = useState("");
  const [list, setList] = useState(getlocalstorage);
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  const editeItem = (id) => {
    const specificItem = list.find((item) => item.id == id);
    setEditID(id);
    setIsEditing(true);
    setName(specificItem.title);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      // show alert
      showAlert(true, "danger", "Please Enter Something.");
    } else if (name && isEditing) {
      // deal with editmode
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setAlert(true, "success", "item is updated.");
      setEditID(null);
      setIsEditing(false);
      setName("");
    } else {
      //show alert
      showAlert(true, "success", `${name} just added to the list`);
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };
  const clearList = () => {
    showAlert(true, "danger", "list is cleared.");
    setList([]);
    setName("");
    setEditID(null);
    setIsEditing(false);
  };
  const removeItem = (id) => {
    showAlert(true, "danger", `item is removed`);
    setList(list.filter((item) => item.id != id));
    setName("");
  };
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);
  return (
    <>
      <section className="section-center">
        <form className="grocery-form" onSubmit={handleSubmit}>
          {alert.show && (
            <Alert list={list} {...alert} removeAlert={showAlert} />
          )}
          <h3>Grocery Bag</h3>
          <div className="form-control">
            <input
              type="text"
              className="grocery"
              placeholder="e.g eggs"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="submit-btn">
              {isEditing ? "Edit" : "Submit"}
            </button>
          </div>
        </form>
        {list.length > 0 && (
          <div className="grocery-contaienr">
            <List items={list} removeItem={removeItem} editeItem={editeItem} />
            <button className="clear-btn" onClick={clearList}>
              Clear List
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export default App;
