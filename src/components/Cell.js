import { useRef, useState } from "react";

const Cell = ({cellIndex, headerCell, isActive, isSelected, value}) => {
    const [cellValue, setCellValue] = useState(value);
    const cellStyles = {};
    const ipRef = useRef(null);

    const updateCellValue = (e) => setCellValue(e.target.value);

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
                : <input ref={ipRef} type="text" value={cellValue} onChange={updateCellValue} disabled={!isActive}/>
            }
        </div>
    );
}

export default Cell;