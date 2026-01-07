import './SimpleTable.css';

type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
};

type SimpleTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
};

function SimpleTable<T extends { id: string | number }>({
  columns,
  data,
  emptyMessage = 'No data available',
}: SimpleTableProps<T>) {
  if (!data.length) {
    return <div className="sb-table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="sb-table-wrapper">
      <table className="sb-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} style={col.width ? { width: col.width } : undefined}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SimpleTable;


