const SheetStateManager = (state, action) => {
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

                //thou string a truly number is therefore worthy and shall be parsed to Integer!
                if(!isNaN(aVal)){ aVal = parseInt(aVal);}
                if(!isNaN(bVal)){ bVal = parseInt(bVal); }

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
};

export default SheetStateManager;