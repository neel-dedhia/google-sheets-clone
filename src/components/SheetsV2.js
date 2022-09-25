import { useEffect, useReducer } from "react";
import SheetInitialState from "../SheetInitialState";
import Cell from "./Cell";
import CellContextMenu from "./CellContextMenu";
import Row from "./Row";
import ContextMenuOptions from '../ContextMenuOptions';
import SheetStateManager from "../SheetStateReducer";


/** 
 * Component: Sheets
 * State: SheetInitialState
 * useEffects: activeCell & FirstRender
*/
const Sheets = ({rowsCount, colsCount}) => {
    /*======= State ======= */
    const [state, dispatch] = useReducer(SheetStateManager, SheetInitialState);

    /*======= Vairables ======= */
    const activeCell = state.activeCell;
    const sheetData = state.sheetData;    

    /*======= Methods ======= */
    // Context Menu Options Handlers
    const addRowAbove = () => dispatch({type: 'AddRow', row: activeCell.row, col: activeCell.col});
    const addRowBelow = () => dispatch({type: 'AddRow', row: activeCell.row+1, col: activeCell.col});
    const addColLeft = () => dispatch({type: 'AddCol', row: activeCell.row, col: activeCell.col});
    const addColRight = () => dispatch({type: 'AddCol', row: activeCell.row, col: activeCell.col+1});
    const colSortAZ = () => dispatch({type: 'SortColumn', sortType: 'ASC', row:activeCell.row, col: activeCell.col});
    const colSortZA = () => dispatch({type: 'SortColumn', sortType: 'DESC', row:activeCell.row, col: activeCell.col});
    
    // Get Alphabetic Column Name (TODO(usecase, refactor-functionality): handle naming after Z Column)
    const getColumnName = (i) => String.fromCharCode(parseInt(i)+64);

    // Get dom-cell's location from the target's cell & row data attributes and set it as active cell
    const _activateCell = (cell) => {
        let cellRowIndex = parseInt(cell.parentElement.dataset.rowIndex);
        let cellColIndex = parseInt(cell.dataset.cellIndex);
        dispatch({type: 'ActivateCell', row: cellRowIndex, col: cellColIndex});
    }

    // Target Element will be received by useContextMenu in CellContextMenu
    const activateCellForContextMenu = (targetEle) => {
        let cell = targetEle.closest('.cell');
        if(!!cell){
             _activateCell(cell);
        }
    }

    // Triggered on Cell Value Change. TODO(optimize): implement debouncing 
    const updateCellInSheetData = (newValue) => dispatch({
        type: 'UpdateCellValue', 
        row: activeCell.row, 
        col: activeCell.col, 
        value: newValue
    });

    /*
        Filter 1D array containing values from the 2D cell-range(eg A5:B8)
        Abbreviations:
        sC => Start Cell Column
        sR => Start Cell Row
        eC => End Cell Column
        eR => End Cell Row
    */
    const getDataFromCellRange = (startIndex, endIndex) => {
        let cellData = [];
        
        //regex to seprate alphabets & digits
        let charNumsRe = /\D+|\d+/g;    
        let [sC, sR] = startIndex.match(charNumsRe);
        let [eC, eR] = endIndex.match(charNumsRe);
        
        // Get Numeric index of column & parse numeric string Row into int
        [sC, eC] = [sC.charCodeAt(0) - 64, eC.charCodeAt(0) - 64];
        [sR, eR] = [parseInt(sR), parseInt(eR)];

        // Get row & column distance
        let [rowIterator, colIterator] = [Math.abs(sR - eR)+1, Math.abs(sC - eC)+1];
        
        /* 
        console.group();
        console.log(startIndex.match(charNumsRe), endIndex.match(charNumsRe));
        console.log('rc-is', [sR, sC], [eR, eC]);
        */
        
        while(!!rowIterator){
            let cI = colIterator;                   //initalize column count
            let [startCol, endCol] = [sC, eC];      //initalize col indexes
            
            while(!!cI){
                // console.log('in-loop: ', sR, startCol, sheetData[sR][startCol]);

                cellData.push(sheetData[sR][startCol]);
                
                startCol += (startCol <= endCol) ? 1 : -1;      //Upate Column towards endCol directionin the direction towards end col index
                cI--;
            }
            
            sR += (sR <= eR) ? 1 : -1;      //Update Row in the direction towards end row index
            rowIterator--;
        }

        /*
        console.log('res: ', cellData);
        console.groupEnd();
        */

        return cellData;
    }


    /*======= UseEffects (LifeCycle Methods) ======= */
    // Initalize SheetData Maxtix on Component Mount
    // Inspect(Warning): add colsCount & rowsCount in dependency
    useEffect(() => dispatch({
        type: 'InitializeSheetData', 
        data: [...Array(rowsCount)].map((_, i) => Array(colsCount).fill(''))}
    ), []);    

    // Prepare Context Menu List based on active cell.
    // Inspect(Warning): add context-menu-methods in dependency
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

    /*======= Handler Methods ======= */
    // Detect Cell Click & Activate Cell
    const handleClick = (e) => {
        let cell = e.target.closest('.cell');
        if(!!cell){
           _activateCell(cell);
        }
    }

    /*
     Detect key Press on cell: Apply Shortcuts in traversing cells based on specific key
    - Enter -> Next Cell Below
    - TODO(usecase) Tab -> Next Cell to Right
    - TODO(usecase) Arrow -> To Cell in the Arrow Direction
    - TODO(usecase) PrintableKeys -> Edit Cell Value with overridding existing value.
    */
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

    /*======= Component Helper Methods ======= */
    // Builds List of Rows with Cells Components
    const RowsBuilder = (r, rI) => {
        const headerRowProps = (rI === 0) ? {headerRow: true} : {};        

        return(
            <Row key={rI} index={rI} {...headerRowProps}>
                {
                    sheetData[rI].map((_, cI) => {
                        let cellProps = {};
                        if(rI === 0 && cI === 0){       //first cell of first row & col [0,0]
                            cellProps = {headerCell: true, sheetValue: ''}
                        } else if(rI === 0){            //All Cells in first row [0, 1..n]
                            cellProps = {headerCell: true, sheetValue: getColumnName(cI)}
                        } else if(cI === 0){            //First Cell in every row [1..n, 0]
                            cellProps = {headerCell: true, sheetValue: rI}
                        } else{                         //All Other Cells [1..n, 1..n]
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

    return(
        <div className="sheet-wrapper" onClick={handleClick} onKeyUp={handleKeyUp}>
            <CellContextMenu createMenuList={activateCellForContextMenu} menuList={state.contextMenuList} />
            { (sheetData.length > 0) && sheetData.map(RowsBuilder) }
        </div>
    );
};

export default Sheets;