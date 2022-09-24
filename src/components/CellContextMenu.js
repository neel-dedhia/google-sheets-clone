import useContextMenu from '../hooks/useContextMenu';

const CellContextMenu = ({createMenuList, menuList}) => {
    const {loc, showContextMenu} = useContextMenu(createMenuList);

    if(!showContextMenu) return (<></>);
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
                    <button type="button" className="context-menu-option"  onClick={item.onSelect}>{item.name}</button>
                </li>
            ))
        }
        </ul>
    )
};

export default CellContextMenu;