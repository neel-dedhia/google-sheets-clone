import { useEffect, useState } from "react";

const Cell = ({cellIndex, getDataFromCellRange, headerCell, isActive, isSelected, updateCellInSheetData, sheetValue}) => {
    const [cellValue, setCellValue] = useState(sheetValue);
    const cellStyles = {};

    useEffect(() => {        
        setCellValue(parseValue(sheetValue));
    }, [sheetValue]);

    useEffect(() => {
        let valueParsed = parseValue(cellValue);
        if(cellValue != valueParsed){
            setCellValue(valueParsed)
        }    
    }, [cellValue]);

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

    const updateCellValue = (e) => {
        setCellValue(e.target.value);
        updateCellInSheetData(e.target.value);
    };

    // Returns matches array otherwise null
    const isExpression = (str) => (/^=([A-Z]*)[(]([A-Z]\d):([A-Z]\d)[)]/g.exec(str));

    const evaluateExpression = ([_, expKW, startIndex, endIndex]) => {
        switch(expKW){
            case 'SUM': 
                let valuesArr = getDataFromCellRange(startIndex, endIndex);
                let sum = 0;
                for(let i=0; i<valuesArr.length; i++){
                   if(isExpression(valuesArr[i])) return '#Error';
                   sum += valuesArr[i];
                }
                return sum;
            default:
                console.log(expKW, startIndex, endIndex);
                return '#Error';
        }
    }

    if(isActive){
        cellStyles.borderColor = 'blue';
    }

    if(isSelected){
        cellStyles.borderStyle = 'dashed';
    }

    return (
        <div className={`cell${!!headerCell ? ' header-cell' : ''}`} data-cell-index={cellIndex} style={cellStyles}>
            { headerCell
                ? sheetValue
                : <input type="text" value={cellValue} onChange={updateCellValue} disabled={!isActive}/>
            }
        </div>
    );
}

export default Cell;