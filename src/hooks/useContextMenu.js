import { useCallback, useEffect, useState } from "react";

/**
 * Hook: useContextMenu
 * State: loc (loction of the mouse-pointer)
 * State: showContextMenu - Flag to show/hide context menu
 * useEffect: on Every Render
 */
const useContextMenu = (callback) => {
    /*======= State ======= */
    const [loc, setLoc] = useState({x: 0, y: 0});
    const [showContextMenu, setShowContextMenu] = useState(false);

    /*======= UseEffect (LifeCycle Methods) ======= */
    useEffect(() => {
        document.addEventListener('click', handleClick);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    });

    /*======= Handler Methods ======= */
    // Get the mouse pointer location - update State & send target element to callback
    const handleContextMenu = useCallback((e) => {
        e.preventDefault();        
        setLoc({x: e.clientX, y: e.clientY});
        callback(e.target);
        setShowContextMenu(true);
    }, [loc]);

    // hide contextmenu if active
    const handleClick = useCallback(() => (showContextMenu && setShowContextMenu(false)), [showContextMenu]);

    return {loc, showContextMenu};
};

export default useContextMenu;