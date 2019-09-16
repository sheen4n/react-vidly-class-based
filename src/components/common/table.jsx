import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

const Table = ({ columns, sortColumn, onSort, data }) => {
  return (
    <table className="table">
      <TableHeader
        sortColumn={sortColumn}
        onSort={onSort}
        columns={columns}
      ></TableHeader>
      <TableBody data={data} columns={columns}></TableBody>
    </table>
  );
};

export default Table;
