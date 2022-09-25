import { useEffect, useReducer } from "react";
import SheetInitialState from "../SheetInitialState";
import Cell from "./Cell";
import CellContextMenu from "./CellContextMenu";
import Row from "./Row";
import ContextMenuOptions from '../ContextMenuOptions';


const SheetReducer = (state, action) => {
    // console.log('Action', action);
    let copySheetData = [];
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
            return state;
        case 'CreateMenuList':
            return {
                ...state,
                contextMenuList: action.menuList
            };
        case 'AddRow':            
            copySheetData = JSON.parse(JSON.stringify(state.sheetData));
            copySheetData.splice(action.row, 0, Array(state.totalCols).fill(''));

            return {
                ...state,
                sheetData: copySheetData,
                totalRows: state.totalRows + 1
            };
        case 'AddCol':
            copySheetData = JSON.parse(JSON.stringify(state.sheetData));
            copySheetData.forEach((row) => row.splice(action.col, 0, ''));

            return {
                ...state,
                sheetData: copySheetData,
                totalCols: state.totalCols + 1
            };
        case 'SortColumn':
            copySheetData = [];
            // filter rows having value in atleast 1 column
            for(let rI=1; rI<state.sheetData.length; rI++){
                state.sheetData[rI].some(v => (v !== '')) && copySheetData.push(state.sheetData[rI]);
            }
            
            // Sort filtered rows
            copySheetData.sort((a,b) => {
                let aVal = a[action.col];
                let bVal = b[action.col];

                //though string a truly number is therefore worthy and shall be parsed to Integer!
                if(!isNaN(aVal)){
                    aVal = parseInt(aVal);
                }
                
                if(!isNaN(bVal)){
                    bVal = parseInt(bVal);
                }

                if(aVal === bVal) return 0;

                switch(action.sortType){
                    case 'ASC':
                        return (aVal < bVal) ? -1 : 1;
                    case 'DESC':
                        return (aVal > bVal) ? -1 : 1;
                    default: 
                        return 0;
                }
            });

            // Add remaing empty rows from sheetData into sorted Sheet
            let extraRowslength = state.sheetData.length - copySheetData.length - 1;
            let emptyCells = Array(state.totalCols).fill('');   //add header column array
            copySheetData.splice(0, 0, [...emptyCells]);
            
            while(!!extraRowslength--){
                copySheetData.push([...emptyCells]);                
            }
            // console.log(copySheetData);

            return {
                ...state,
                sheetData: copySheetData
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

    const addRowAbove = () => {
        dispatch({type: 'AddRow', row: activeCell.row, col: activeCell.col});
    };
    
    const addRowBelow = () => {
        dispatch({type: 'AddRow', row: activeCell.row+1, col: activeCell.col});
    };

    const addColLeft = () => {
        dispatch({type: 'AddCol', row: activeCell.row, col: activeCell.col});
    };

    const addColRight = () => {
        dispatch({type: 'AddCol', row: activeCell.row, col: activeCell.col+1});
    };

    const colSortAZ = () => {
        dispatch({type: 'SortColumn', sortType: 'ASC', row:activeCell.row, col: activeCell.col})
    };

    const colSortZA = () => {
        dispatch({type: 'SortColumn', sortType: 'DESC', row:activeCell.row, col: activeCell.col})
    };
    
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
                ContextMenuOptions.sortAZ.onSelect = colSortAZ;
                newMenuList.push(ContextMenuOptions.sortAZ);
                
                ContextMenuOptions.sortZA.onSelect = colSortZA;
                newMenuList.push(ContextMenuOptions.sortZA);
            } else{
                ContextMenuOptions.rowAbove.onSelect = addRowAbove;
                newMenuList.push(ContextMenuOptions.rowAbove);

                ContextMenuOptions.rowBelow.onSelect = addRowBelow;
                newMenuList.push(ContextMenuOptions.rowBelow);
            }
            
            if(cellColIndex !== 0){
                ContextMenuOptions.colLeft.onSelect = addColLeft;
                newMenuList.push(ContextMenuOptions.colLeft);

                ContextMenuOptions.colRight.onSelect = addColRight;
                newMenuList.push(ContextMenuOptions.colRight);
            }
            
            dispatch({type: 'CreateMenuList', menuList: newMenuList});
        }
    }, [activeCell]);

    const updateCellInSheetData = (newValue) => dispatch({
        type: 'UpdateCellValue', 
        row: activeCell.row, 
        col: activeCell.col, 
        value: newValue
    });

    const getDataFromCellRange = (startIndex, endIndex) => {
        let cellData = [];
        let charNumsRe = /\D+|\d+/g;
        let [sC, sR] = startIndex.match(charNumsRe);
        let [eC, eR] = endIndex.match(charNumsRe);
        
        [sC, eC] = [sC.charCodeAt(0) - 64, eC.charCodeAt(0) - 64];
        [sR, eR] = [parseInt(sR), parseInt(eR)];

        let [rowIterator, colIterator] = [Math.abs(sR - eR)+1, Math.abs(sC - eC)+1];
        
        // console.group();
        // console.log(startIndex.match(charNumsRe), endIndex.match(charNumsRe));

        // console.log('rc-is', [sR, sC], [eR, eC]);
        
        while(!!rowIterator){
            let cI = colIterator;
            let [startCol, endCol] = [sC, eC];
            while(!!cI){
                // console.log('in-loop: ', sR, startCol, sheetData[sR][startCol]);
                cellData.push(sheetData[sR][startCol]);
                startCol += (startCol <= endCol) ? 1 : -1;
                cI--;
            }
            
            sR += (sR <= eR) ? 1 : -1;
            rowIterator--;
        }

        // console.log('res: ', cellData);

        // console.groupEnd();

        return cellData;
    }

    const RowsBuilder = (r, rI) => {
        const headerRowProps = (rI === 0) ? {headerRow: true} : {};        

        return(
            <Row key={rI} index={rI} {...headerRowProps}>
                {
                    sheetData[rI].map((cValue, cI) => {
                        let cellProps = {};
                        if(rI === 0 && cI === 0){
                            cellProps = {headerCell: true, sheetValue: ''}
                        } else if(rI === 0){
                            cellProps = {headerCell: true, sheetValue: getColumnName(cI)}
                        } else if(cI === 0){
                            cellProps = {headerCell: true, sheetValue: rI}
                        } else{
                            cellProps = {
                                sheetValue: sheetData[rI][cI], 
                                isActive: (activeCell.row === rI && activeCell.col === cI),
                                updateCellInSheetData: updateCellInSheetData,
                                getDataFromCellRange: getDataFromCellRange
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

    const handleKeyUp = (e) => {
        if(e.key === 'Enter' || e.keyCode === 13){
            if(activeCell.row !== sheetData.length-1){
                dispatch({type: 'ActivateCell', row: activeCell.row+1, col: activeCell.col});
            }
        } 
        // else{
            // Experiment keypress focus input and start editing
            // console.log(e.key);
            // document
            //     .querySelector(`.row[data-row-index='${activeCell.row}'] .cell[data-cell-index='${activeCell.col}'] input`)
            //     .focus();
        // }
    }

    return(
        <div className="sheet-wrapper" onClick={handleClick} onKeyUp={handleKeyUp}>
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