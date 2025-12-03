import React from "react";
import { BsTable } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import Pagination from "./Pagination";

const Table = ({
  title = "Table",
  headers = [],
  data = [],
  onAddClick,
  actions = [],
  buttonTitle
}) => {
  const [page, setPage] = React.useState(1);
  return (
    <div className="col-span-12 p-4 rounded border border-stone-300 m-4 w-full">
      <div className="pb-4 flex items-center p-4 justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          <BsTable className="mr-1" size={20} />
          <span>{title}</span>
        </h3>
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-accent text-white font-medium transition-colors hover:bg-accent/80 px-3 py-1.5 rounded"
          >
            {buttonTitle}
          </button>
        )}
      </div>
      <table className="w-full table-auto">
        <TableHead headers={headers} />
        <TableBody headers={headers} data={data} actions={actions} />
      </table>
      <Pagination
        totalItems={data.length}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
};

const TableHead = ({ headers }) => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500 text-left">
        {headers.map((header) => (
          <th key={header.key} className="px-4 py-2">
            {header.label}
          </th>
        ))}
        {headers.some((h) => h.actions) && (
          <th className="px-4 py-2">Actions</th>
        )}
      </tr>
    </thead>
  );
};

const TableRow = ({ data, headers, order, actions }) => {
  return (
    <tr className={order % 2 ? "bg-stone-100 text-sm" : "text-sm"}>
      {headers.map((header) => (
        <td key={header.key} className="px-4 py-2">
          {data[header.key]}
        </td>
      ))}
      {actions.length > 0 && (
        <td className="w-8 flex items-start gap-2">
          {actions.map((ActionComponent, index) => (
            <button className="hover:bg-stone-200 transitions-colors grid place-content-center rounded text-sm size-8">
              <ActionComponent size={20} className="text-indigo-500" />{" "}
            </button>
          ))}
        </td>
      )}
    </tr>
  );
};

const TableBody = ({ data, headers, actions }) => {
  return (
    <tbody>
      {data.map((row, index) => (
        <TableRow
          key={row.id || index}
          order={index}
          data={row}
          headers={headers}
          actions={actions}
        />
      ))}
    </tbody>
  );
};

// Example delete action component
export const DeleteButton = ({ rowData }) => {
  const handleDelete = () => {
    console.log("Delete row", rowData);
  };
  return (
    <button
      onClick={handleDelete}
      className="hover:bg-stone-200 transitions-colors grid place-content-center rounded text-sm w-8 h-8"
    >
      <MdOutlineDelete size={20} className="text-indigo-500" />
    </button>
  );
};

export default Table;
