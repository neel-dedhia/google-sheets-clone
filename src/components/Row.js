import Cell from "./Cell";

const Row = ({index, children}) => {
    return(
        <div className="row" data-row-index={index}>
            <Cell key={0} cellIndex={0} headerCell={true} value={index>0 && index} />
            {children}
        </div>
    );
};

export default Row;