
export default function TableHeader({columnsData}: {columnsData: string[]}) {

    const columns = columnsData.map((column) => (
        <th key={column}>{column}</th>
    ))
  return (
    <thead className="sticky-sm-top">
      <tr>
        {columns}
      </tr>
    </thead>
  )
}