import { useEffect, useRef, useState } from "react";
import Cell from "./Cell";
import CellContextMenu from "./CellContextMenu";
import Row from "./Row";

const ContextMenuOptions = {
    sortAZ: {
        name: 'Sort A to Z',
        onSelect: () => {console.log('sort a to z');}
    },
    sortZA: {
        name: 'Sort Z to A',
        onSelect: () => {console.log('sort z to a');}
    },
    colLeft: {
        name: 'Add column to Left',
        onSelect: () => {console.log('add col left');}
    },
    colRight: {
        name: 'Add column to Right',
        onSelect: () => {console.log('add col right');}
    },
    rowAbove: {
        name: 'Add row to Above',
        onSelect: () => {console.log('add row above');}
    },
    rowBelow: {
        name: 'Add row to Below',
        onSelect: () => {console.log('add row below');}
    },
};

const Sheets = ({rowsCount, colsCount}) => {
    const [rows, setRows] = useState(rowsCount);
    const [cols, setCols] = useState(colsCount);
    const [activeCell, setActiveCell] = useState({row: 0, col: 0});
    const [contextMenuList, setContextMenuList] = useState([]);

    let SheetData = useRef([]);
    
    useEffect(() => {
        ContextMenuOptions.rowAbove.onSelect = (targetCell) => {
            const r = targetCell.row;
            const c = targetCell.col;
            console.log(SheetData.current);
            
            const newRow = Array(cols).fill('0');
            SheetData.current.splice(r, 0, newRow);
            console.log(r, c, SheetData.current);
            
            setRows(rows+1);
            // setActiveCell({row: r, col: c});
        }

        SheetData.current = [...Array(rows)].map((_, i) => Array(cols).fill(''));
        console.log(SheetData.current);

        setContextMenuList([]);
    }, []);

    const getColumnName = (i) => String.fromCharCode(parseInt(i)+64);

    const _activateCell = (cell) => {
        let cellRowIndex = parseInt(cell.parentElement.dataset.rowIndex);
        let cellColIndex = parseInt(cell.dataset.cellIndex);
            
        setActiveCell({row: cellRowIndex, col: cellColIndex});
    }

    const handleClick = (e) => {
        let cell = e.target.closest('.cell');
        if(!!cell){
           _activateCell(cell);
        }
    }

    const createContextMenuList = (targetEle) => {
       let cell = targetEle.closest('.cell');
       if(!!cell){
            _activateCell(cell);
       }
    }

    useEffect(() => {
        let cellRowIndex = activeCell.row;
        let cellColIndex = activeCell.col;
        let newMenuList = [];

        if(!(cellRowIndex === 0 && cellColIndex === 0)){
            if(cellRowIndex === 0){
                newMenuList.push(ContextMenuOptions.sortAZ);
                newMenuList.push(ContextMenuOptions.sortZA);
            } else{
                newMenuList.push(ContextMenuOptions.rowAbove);
                newMenuList.push(ContextMenuOptions.rowBelow);
            }
            
            if(cellColIndex !== 0){
                newMenuList.push(ContextMenuOptions.colLeft);
                newMenuList.push(ContextMenuOptions.colRight);
            }

            setContextMenuList(newMenuList);
        }
    }, [activeCell]);

    const updateSheetData = (newValue) => {
        console.log(SheetData, activeCell, newValue);
        SheetData.current[activeCell.row][activeCell.col] = newValue;
    }

    return(
        <div className="sheet-wrapper" onClick={handleClick}>
            <CellContextMenu createMenuList={createContextMenuList} menuList={contextMenuList} activeCell={activeCell} />

            <Row key={0} headerRow={true} index={0}>
            {
                [...Array(cols)].map((_, i) => (
                    <Cell 
                        key={i+1}
                        cellIndex={i+1}
                        value={getColumnName(i+1)}
                        headerCell={true}
                        enableSorting={true}
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
                                value={SheetData.length > 0 ? SheetData.current[rowI][colI] : ''}
                                isActive={(activeCell.row === rowI+1 && activeCell.col === colI+1)}
                                updateSheetData={updateSheetData}
                            />
                        ))}
                    </Row>
                ))
            }
        </div>
    );
};

export default Sheets;