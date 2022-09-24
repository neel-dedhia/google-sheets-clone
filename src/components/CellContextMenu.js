import useContextMenu from '../hooks/useContextMenu';

const CellContextMenu = () => {
    const {loc, showContextMenu} = useContextMenu();

    if(!showContextMenu) return (<></>);
    return (
        <ul 
            className="cell-context-menu"
            style={{
                top: `${loc.y}px`,
                left: `${loc.x}px`,
            }}
        > 
            <li>Add Row</li>
            <li>Add Column</li>
        </ul>
    )
};

export default CellContextMenu;