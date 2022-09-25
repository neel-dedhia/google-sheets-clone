import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import SheetInitialState from "../SheetInitialState";
import Cell from "./Cell";
import CellContextMenu from "./CellContextMenu";
import Row from "./Row";

const ContextMenuOptions= {
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

const SheetReducer = (state, action) => {
    // console.log('Action', action);
    switch(action.type){
        case 'InitializeSheetData':
            return {
                ...state, 
                sheetData: action.data, 
                totalRows: action.data.length,
                totalCols: action.data[0].length
            };
        case 'ActivateCell': 
            return{
                ...state,
                activeCell: {
                    row: action.row,
                    col: action.col
                }
            };
        case 'UpdateCellValue':
            state.sheetData[action.row][action.col] = action.value;
            console.log(state);
            return state;
        case 'CreateMenuList':
            return {
                ...state,
                contextMenuList: action.menuList
            };
        case 'AddRow':            
            let copySheetData = JSON.parse(JSON.stringify(state.sheetData));
            copySheetData.splice(action.row, 0, Array(state.totalCols).fill(''));

            return {
                ...state,
                sheetData: copySheetData,
                totalRows: state.totalRows + 1
            };
        default: 
            console.log('default', action, state);
            return state;
    }
}

const Sheets = ({rowsCount, colsCount}) => {
    const [state, dispatch] = useReducer(SheetReducer, SheetInitialState);

    const activeCell = state.activeCell;
    const sheetData = state.sheetData;
    const contextMenuList = state.contextMenuList;

    const addRowAbove = () => {
        dispatch({type: 'AddRow', row: activeCell.row, col: activeCell.col});
    };
    
    const addRowBelow = () => {
        dispatch({type: 'AddRow', row: activeCell.row+1, col: activeCell.col});
    }
    
    
    useEffect(() => {        
        dispatch({type: 'InitializeSheetData', data: [...Array(rowsCount)].map((_, i) => Array(colsCount).fill(''))});
    }, []);

    const getColumnName = (i) => String.fromCharCode(parseInt(i)+64);

    const _activateCell = (cell) => {
        let cellRowIndex = parseInt(cell.parentElement.dataset.rowIndex);
        let cellColIndex = parseInt(cell.dataset.cellIndex);
        dispatch({type: 'ActivateCell', row: cellRowIndex, col: cellColIndex});
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
                ContextMenuOptions.rowAbove.onSelect = addRowAbove;
                newMenuList.push(ContextMenuOptions.rowAbove);

                ContextMenuOptions.rowBelow.onSelect = addRowBelow;
                newMenuList.push(ContextMenuOptions.rowBelow);
            }
            
            if(cellColIndex !== 0){
                newMenuList.push(ContextMenuOptions.colLeft);
                newMenuList.push(ContextMenuOptions.colRight);
            }
            
            dispatch({type: 'CreateMenuList', menuList: newMenuList});
        }
    }, [activeCell]);

    const updateSheetData = (newValue) => dispatch({
        type: 'UpdateCellValue', 
        row: activeCell.row, 
        col: activeCell.col, 
        value: newValue
    });

    const RowsBuilder = (r, rI) => {
        const headerRowProps = (rI === 0) ? {headerRow: true} : {};        

        return(
            <Row key={rI} index={rI} {...headerRowProps}>
                {
                    sheetData[rI].map((cValue, cI) => {
                        let cellProps = {};
                        if(rI === 0 && cI === 0){
                            cellProps = {headerCell: true, value: ''}
                        } else if(rI === 0){
                            cellProps = {headerCell: true, enableSorting: true, value: getColumnName(cI)}
                        } else if(cI === 0){
                            cellProps = {headerCell: true, value: rI}
                        } else{
                            cellProps = {
                                value: sheetData[rI][cI], 
                                isActive: (activeCell.row === rI && activeCell.col === cI),
                                updateSheetData: updateSheetData,
                            }
                        }

                        return (
                            <Cell key={cI} cellIndex={cI} {...cellProps} /> 
                        )
                    })
                }
            </Row>
        )
    }

    return(
        <div className="sheet-wrapper" onClick={handleClick}>
            <CellContextMenu createMenuList={createContextMenuList} menuList={state.contextMenuList} />

            {
                sheetData.length > 0
                &&
                sheetData.map(RowsBuilder)
            }
        </div>
    );
};

export default Sheets;