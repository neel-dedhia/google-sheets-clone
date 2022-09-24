import { useCallback, useEffect, useState } from "react";

const useContextMenu = (callback) => {
    const [loc, setLoc] = useState({x: 0, y: 0});
    const [showContextMenu, setShowContextMenu] = useState(false);

    const handleContextMenu = useCallback((e) => {
        e.preventDefault();        
        // console.log(e);
        setLoc({x: e.clientX, y: e.clientY});
        callback(e.target);
        setShowContextMenu(true);
    }, [loc]);

    const handleClick = useCallback(() => (showContextMenu && setShowContextMenu(false)), [showContextMenu]);

    useEffect(() => {
        document.addEventListener('click', handleClick);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    });

    return {loc, showContextMenu};
};

export default useContextMenu;