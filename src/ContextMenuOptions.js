const ContextMenuOptions= {
    sortAZ: {
        name: 'Sort A to Z',
        onSelect: () => {console.log('sort a to z');}
    },
    sortZA: {
        name: 'Sort Z to A',
        onSelect: () => {console.log('sort z to a');}
    },
    colLeft: {
        name: 'Add column to Left',
        onSelect: () => {console.log('add col left');}
    },
    colRight: {
        name: 'Add column to Right',
        onSelect: () => {console.log('add col right');}
    },
    rowAbove: {
        name: 'Add row to Above',
        onSelect: () => {console.log('add row above');}
    },
    rowBelow: {
        name: 'Add row to Below',
        onSelect: () => {console.log('add row below');}
    },
};

export default ContextMenuOptions;