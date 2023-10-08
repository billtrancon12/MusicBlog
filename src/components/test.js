import { Input } from "rsuite"

export default function Test(){

    function handleChange(e){
        console.log(e.target.files[0])
    }
    return(
        <Input 
            type="file" 
            accept='.png, .jpeg, .jpg' 
            style={{"margin": "18px 20px", "width": "fit-content", "height": "80%", "fontSize": "15px"}} 
            placeholder='Enter your topic here'
            onChange={(e) => handleChange(e)}>    
        </Input>
    )
}