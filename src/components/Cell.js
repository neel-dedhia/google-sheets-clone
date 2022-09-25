import { useEffect, useState } from "react";

/**
 * Component: Cell
 * State: cellValue,
 * useEffects: sheetValue(propUpdate), cellValue(stateUpdate)
*/
const Cell = ({cellIndex, getDataFromCellRange, headerCell, isActive, isSelected, updateCellInSheetData, sheetValue}) => {
    /*======= State ======= */
    const [cellValue, setCellValue] = useState(sheetValue);

    /*======= Variables ======= */
    const cellStyles = {};
    
    /*======= Methods ======= */
    // Parses Value into Expression result if detected
    const parseValue = (str) => {
        if(typeof str === 'string' && str.charAt(0) === '=') {
            let expression = isExpression(str);
            if(expression !== null){
                let expRes = evaluateExpression(expression);
                return (expRes);
            }
        };
        
        return str;
    }

    // Returns matches array otherwise null
    const isExpression = (str) => (/^=([A-Z]*)[(]([A-Z]\d):([A-Z]\d)[)]/g.exec(str));

    // Evaluate Expression and return result otherwise #Error if any value or expKW is invalid
    // TODO(usecase): Subtraction, Multiplication
    const evaluateExpression = ([_, expKW, startIndex, endIndex]) => {
        switch(expKW){
            case 'SUM': 
                let valuesArr = getDataFromCellRange(startIndex, endIndex);
                let sum = 0;
                for(let i=0; i<valuesArr.length; i++){
                   if(isExpression(valuesArr[i])) return '#Error';
                   
                   //thou string a truly number is therefore worthy and shall be parsed to Integer!
                   if(!isNaN(valuesArr[i])){ valuesArr[i] = parseInt(valuesArr[i]);}
                   sum += valuesArr[i];
                }
                return sum;
            default:
                console.log(expKW, startIndex, endIndex);
                return '#Error';
        }
    }

    /*======= UseEffect (LifeCycle Methods) ======= */
    useEffect(() => {        
        setCellValue(parseValue(sheetValue));
    }, [sheetValue]);

    useEffect(() => {
        let valueParsed = parseValue(cellValue);
        if(cellValue !== valueParsed){
            setCellValue(valueParsed)
        }    
    }, [cellValue]);

    /*======= Handler Methods ======= */
    const handleChange = (e) => {
        setCellValue(e.target.value);
        updateCellInSheetData(e.target.value);
    };

    // Apply Styles based on Cell State
    if(isActive){ cellStyles.borderColor = 'blue';}
    if(isSelected){cellStyles.borderStyle = 'dashed';}

    return (
        <div className={`cell${!!headerCell ? ' header-cell' : ''}`} data-cell-index={cellIndex} style={cellStyles}>
            { headerCell
                ? sheetValue
                : <input type="text" value={cellValue} onChange={handleChange} disabled={!isActive}/>
            }
        </div>
    );
}

export default Cell;