import React, { useState } from "react"

function Dialog({ step, next }) {
  if (step >= steps.length) {
    return <div></div>
  }
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(.5,.5,.5,.5)",
      }}
    >
      <DialogStep
        next={next}
        innerJSX={steps[step]}
        buttonText={step + 1 == steps.length ? "Ok" : "Next"}
      />
    </div>
  )
}

function DialogStep({ next, innerJSX, buttonText }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "5%",
        padding: "50px",
        width: "500px",
        boxShadow: "0 0 1em #a5a5a5",
        fontSize: "14px",
        fontWeight: "bolder",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {innerJSX}
      <button
        onClick={next}
        style={{
          borderRadius: "20px",
          padding: "5px 15px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        {buttonText}
      </button>
    </div>
  )
}

const steps = [
  <div>
    <p>
      This demonstrates a simple relational database with two tables that have a
      many-to-many relationship. In the database, this is stored with three
      tables: The two tables below and a join table. The join table has two
      columns: one for the id of each of the below tables.
    </p>
    <p>
      Let's call the tables below table A and table B and the join table C. If
      we wanted to find all of the rows in table B associated with one row in
      table A, the SQL would look like:
      <p style={{ backgroundColor: "grey", padding: "5px", margin: "5px" }}>
        select B.* from A inner join C on A.id = C.A_id inner join B on B.id =
        C.B_id where A.id = 10
      </p>
      If we wanted to find all of the rows in table B associated with multiple
      rows in table A, we would execute:
      <p style={{ backgroundColor: "gray", padding: "5px", margin: "5px" }}>
        {
          "select B.* from A inner join C on A.id = C.A_id inner join B on B.id = C.B_id where A.id > 5 and A.id < 10"
        }
      </p>
    </p>
  </div>,
  <div>
    <ul>
      <li>Use the input area to add elements</li>
      <li>
        Click on a element in one of the tables to select it. This will show all
        elements which it has a relation with.
      </li>
      <li>
        After you have selected an element, click on elements in the other table
        to add or remove the relationship between them.
      </li>
    </ul>
    <p>All changes are persisted on the server</p>
  </div>,
]

export { Dialog }
