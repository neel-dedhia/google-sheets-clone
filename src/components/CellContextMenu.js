import useContextMenu from '../hooks/useContextMenu';

/**
 * Component: CellContextMenu
 */
const CellContextMenu = ({activeCell, createMenuList, menuList}) => {
    const {loc, showContextMenu} = useContextMenu(createMenuList);

    if(!showContextMenu || menuList.length === 0) return (<></>);
    
    return (
        <ul 
            className="context-menu-list"
            style={{
                top: `${loc.y}px`,
                left: `${loc.x}px`,
            }}
        > 
        {
            menuList.map((item, i) => (
                <li key={i} className="context-menu-item">
                    <button type="button" className="context-menu-option"  onClick={() => item.onSelect(activeCell)}>{item.name}</button>
                </li>
            ))
        }
        </ul>
    )
};

export default CellContextMenu;