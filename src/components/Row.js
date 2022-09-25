const Row = ({index, children}) => {
    return(
        <div className="row" data-row-index={index}>
            {children}
        </div>
    );
};

export default Row;