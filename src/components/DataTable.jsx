
import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";

const DataTable = ({ data, onDataChange }) => {
    const [tableWidth, setTableWidth] = useState(0);
    const tableRef = useRef(null);

    useEffect(() => {
      if (tableRef.current) {
        setTableWidth(tableRef.current.offsetWidth);
      }
    }, [data]);

    const handleCellChange = (rowIndex, header, value) => {
        const newData = [...data];
        newData[rowIndex][header] = value;
        onDataChange(newData);
      };
  
    const getHeaders = (data) => {
      if (!data || data.length === 0) return [];
      return Object.keys(data[0]).filter(header => header.trim() !== "");
    };
  
  
    if (!data || data.length === 0) {
      return <p>Нет данных для отображения.</p>;
    }
  
  
    return (
        <div className="border rounded-md relative" style={{ height: '400px' }}>
      <div className="overflow-x-auto overflow-y-hidden absolute top-0 left-0 right-0 bg-white z-10">
        <Table style={{ width: `${tableWidth}px` }}>
          <TableHeader>
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
              <TableRow key={rowIndex}>
                {getHeaders(data).map((header, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Input
                    
                      value={row[header] !== undefined && row[header] !== null ? row[header].toString() : ''}
                      onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                    />
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