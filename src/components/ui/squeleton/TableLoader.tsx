import { Placeholder } from "react-bootstrap";

export default function TableLoader({lengthTr, lengthTd}: {lengthTr: number, lengthTd: number}) {
  return (
    <>
    {Array.from({ length: lengthTr }).map((_: unknown, indexTr: number) => (
      <tr key={indexTr}>
        {Array.from({ length: lengthTd }).map((_: unknown, indexTd: number) => (
        <td key={indexTd} className='text-center'>
          <Placeholder  animation='glow'>
            <Placeholder
              xs={12}
              className='bg-secondary rounded-1'
              style={{ height: '25px' }}
            />
          </Placeholder>
        </td>
        ))}
      </tr>
    ))}
  </>
  );
}