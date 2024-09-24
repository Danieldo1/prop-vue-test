
import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DataTable = ({ data }) => {
    const [tableWidth, setTableWidth] = useState(0);
    const tableRef = useRef(null);
  
    const getHeaders = (data) => {
      if (!data || data.length === 0) return [];
      return Object.keys(data[0]).filter(header => header.trim() !== "");
    };
  
    useEffect(() => {
      if (tableRef.current) {
        setTableWidth(tableRef.current.offsetWidth);
      }
    }, [data]);
  
    if (!data || data.length === 0) {
      return <p>Нет данных для отображения.</p>;
    }
  
  
    return (
        <div className="border rounded-md relative" style={{ height: '400px' }}>
      <div className="overflow-x-auto overflow-y-hidden absolute top-0 left-0 right-0 bg-white z-10">
        <Table style={{ width: `${tableWidth}px` }}>
          <TableHeader className='text-center'>
            <TableRow>
              {getHeaders(data).map((header, index) => (
                <TableHead key={index} className="bg-white">
                  {header || `Column ${index + 1}`}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
      </div>
      <div className="overflow-auto h-full pt-12">
        <Table ref={tableRef}>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                {getHeaders(data).map((header, cellIndex) => (
                  <TableCell key={cellIndex} >
                    {row[header] !== undefined && row[header] !== null 
                      ? row[header].toString() 
                      : 'N/A'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    );
  };
  
  export default DataTable;