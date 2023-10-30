import Search from "@mui/icons-material/Search"

const SearchBar = (props) => {
    return (
        <div className={"input-group rounded " + props.className} style={props.style}>
            <input type="search" className="form-control rounded" placeholder={props.placeholder} aria-label="Search" aria-describedby="search-addon" onChange={props.onChange} style={props.inputStyle}/>
            <span className="input-group-text border-0" id="search-addon">
                <Search style={{'display': "flex"}}></Search>
            </span>
        </div>
    )
}

export default SearchBar