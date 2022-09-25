import { useEffect, useState } from "react";

const Cell = ({cellIndex, headerCell, isActive, isSelected, updateSheetData, value}) => {
    const [cellValue, setCellValue] = useState(value);
    const cellStyles = {};    

    useEffect(() => setCellValue(value), [value]);

    const updateCellValue = (e) => {
        setCellValue(e.target.value)
        updateSheetData(e.target.value);
    };

    const handleColumnSorting = (e) => {
        console.log('');
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
                ? value
                : <input type="text" value={cellValue} onChange={updateCellValue} disabled={!isActive}/>
            }
            {/* <button classname="sort-column-btn" onClick={handleColumnSorting}></button> */}
        </div>
    );
}

export default Cell;