import { useState } from "react";
import Cell from "./Cell";
import CellContextMenu from "./CellContextMenu";
import Row from "./Row";

const Sheets = ({rowsCount, colsCount}) => {
    const [rows, setRows] = useState(rowsCount);
    const [cols, setCols] = useState(colsCount);
    const [activeCell, setActiveCell] = useState({row: -1, col: -1});    

    const getColumnName = (i) => String.fromCharCode(parseInt(i)+64);

    const handleClick = (e) => {
        let cell = e.target.closest('.cell');
        let cellRowIndex = parseInt(cell.parentElement.dataset.rowIndex);
        let cellColIndex = parseInt(cell.dataset.cellIndex);
        
        setActiveCell({row: cellRowIndex, col: cellColIndex});
    }

    return(
        <div className="sheet-wrapper" onClick={handleClick}>
            <CellContextMenu />

            <Row key={0} headerRow={true} index={-1}>
            {
                [...Array(cols)].map((_, i) => (
                    <Cell 
                        key={i+1}
                        cellIndex={i+1}
                        value={getColumnName(i+1)}
                        headerCell={true}
                    />
                ))
            }
            </Row>

            {
                [...Array(rows)].map((_, rowI) => (
                    <Row index={rowI+1} key={rowI+1}>
                        {[...Array(cols)].map((_, colI) => (
                            <Cell 
                                key={colI+1}
                                cellIndex={colI+1}
                                value=""
                                isActive={(activeCell.row === rowI+1 && activeCell.col === colI+1)}
                            />
                        ))}
                    </Row>
                ))
            }
        </div>
    );
};

export default Sheets;