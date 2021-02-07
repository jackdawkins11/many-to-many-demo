import React, { useEffect, useState } from "react"
import { render } from "react-dom"
import { Dialog } from "./Dialog"

function App({}) {
  const [dialogStep, setDialogStep] = useState(0)
  return (
    <div
      style={{
        top: 0,
        left: 0,
        position: "fixed",
        width: "100%",
        height: "100%",
        opacity: "75%",
        backgroundColor: "f4f4f4",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ListArea />
      <Dialog step={dialogStep} next={() => setDialogStep(n => n + 1)} />
    </div>
  )
}

function ListArea({}) {
  //We display two tables from the database
  const [table1, setTable1] = useState(null)
  const [table2, setTable2] = useState(null)

  useEffect(() => {
    //This runs once after the first render
    //Load table1 and table2
    ;[
      { url: "/rdb-api/products", setTable: setTable1 },
      { url: "/rdb-api/purchases", setTable: setTable2 },
    ].map(({ url, setTable }) => {
      fetch(url)
        .then((r) => r.json())
        .then((t1) => {
          setTable(
            t1.map((elem) => {
              return { id: elem.id, name: elem.name }
            })
          )
        })
    })
  }, [])

  //Function to add row to one of the tables
  const addCol = (name, col) => {
    const { url, update } =
      col == 0
        ? { url: "rdb-api/products", update: setTable1 }
        : { url: "rdb-api/purchases", update: setTable2 }
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name }),
    })
      .then((r) => {
        if (r.ok) {
          return r.json()
        } else {
          throw new Error("Could not add to table")
        }
      })
      .then((el) => {
        update((t1) => [...t1, { id: el.id, name: el.name }])
      })
  }

  //relationData stores what is needed to display a many-to-many relationship
  //on the UI. It looks like:
  /*
    {
      colIdx: 1 or 2     //the table which contains 'selectedId'
      selectedId: int    //the id of the selected element
      associatedIds: [int, int...]     //the ids associated with selectedId in the many-to-many relationship
    }
  */
  //If it is null, don't display any relationships
  const [relationData, setRelationData] = useState(null)

  //This function can change the many-to-many relationship in the DB
  //as well as change what is displayed on the ui
  //colIdx: the table the id came from
  //id: id of the element which was clicked
  const onClick = (colIdx, id) => {
    if (
      relationData == null ||
      (colIdx == relationData.colIdx && id != relationData.selectedId)
    ) {
      //This is the first click or a click to change selectedId
      const { url, otherName } =
        colIdx == 0
          ? { url: "rdb-api/products", otherName: "purchases" }
          : { url: "rdb-api/purchases", otherName: "products" }
      fetch(url)
        .then((r) => r.json())
        .then((r) => {
          setRelationData({
            colIdx: colIdx,
            selectedId: id,
            associatedIds: r
              .find((el) => el.id == id)
              [otherName].map((el) => el.id),
          })
        })
    } else if (colIdx == relationData.colIdx && id == relationData.selectedId) {
      //Click on the previously clicked
      setRelationData(null)
    } else if (colIdx != relationData.colIdx) {
      //Click on other side
      if (relationData.associatedIds.includes(id)) {
        //Click on item already in the relationship
        //In this case, remove it from relationship
        const url =
          relationData.colIdx == 0
            ? `rdb-api/delete/${relationData.selectedId}/${id}`
            : `rdb-api/delete/${id}/${relationData.selectedId}`
        fetch(url, { method: "POST" }).then((r) => {
          if (r.ok) {
            setRelationData((rd) => {
              return {
                colIdx: rd.colIdx,
                selectedId: rd.selectedId,
                associatedIds: rd.associatedIds.filter((cId) => cId != id),
              }
            })
          }
        })
      } else {
        //Click on item not in the relationship
        //Add it to the relationship
        const url =
          relationData.colIdx == 0
            ? `rdb-api/add/${relationData.selectedId}/${id}`
            : `rdb-api/add/${id}/${relationData.selectedId}`
        fetch(url, { method: "POST" }).then((r) => {
          if (r.ok) {
            setRelationData((rd) => {
              return {
                colIdx: rd.colIdx,
                selectedId: rd.selectedId,
                associatedIds: [...rd.associatedIds, id]
              }
            })
          }
        })
      }
    }
  }

  if (table1 == null || table2 == null) {
    return <div>Loading...</div>
  }

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {[table1, table2].map((table, idx) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "400px",
            padding: "15px",
            alignItems: "center",
          }}
        >
          <NewItemForm addItem={(name) => addCol(name, idx)} />
          {table.map((item, idx2) => (
            <ItemDisplay
              item={item}
              isLeft={idx == 0}
              isSelected={
                relationData != null &&
                ((relationData.colIdx == idx && relationData.selectedId == item.id) ||
                  (relationData.colIdx != idx &&
                    relationData.associatedIds.includes(item.id)))
              }
              onClick={() => onClick(idx, item.id)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function NewItemForm({ addItem }) {
  const [name, setName] = useState("")
  return (
    <div style={{ display: "flex", flexDirection: "row", width: "300px" }}>
      <input
        value={name}
        onChange={(ev) => setName(ev.target.value)}
        placeholder={"New item"}
        style={{ flex: "1 1 auto", border: "1px solid #ced4da" }}
      />
      <div
        style={{
          padding: "10px",
          backgroundColor: "#28a745",
          color: "white",
          cursor: "pointer",
        }}
        onClick={() => {
          addItem(name)
          setName("")
        }}
      >
        Add Item
      </div>
    </div>
  )
}

function ItemDisplay({ item, isLeft, isSelected, onClick }) {
  const [inHover, setHover] = useState(false)
  const margin = isSelected
    ? isLeft
      ? "10px 0px 10px 120px"
      : "10px 120px 10px 0px"
    : "10px 0px"
  const backgroundColor = isSelected ? (isLeft ? "blue" : "red") : "white"
  return (
    <div
      style={{
        display: "flex",
        borderRadius: ".3rem",
        backgroundColor: backgroundColor,
        margin: margin,
        padding: "15px",
        boxShadow: inHover ? "0 0 1em #aaa" : "0 0 1em #ccc",
        width: "250px",
      }}
      onMouseEnter={(e) => {
        setHover(true)
      }}
      onMouseLeave={(e) => {
        setHover(false)
      }}
      onClick={onClick}
    >
      <div style={{ padding: "10px" }}>{item.id}</div>
      <div style={{ padding: "10px" }}>{item.name}</div>
    </div>
  )
}

render(<App />, document.getElementById("root"))
