import "./Landing.css"
import {ListElement} from "../../components/List/ListElement/ListElement.jsx";
import {useNavigate} from "react-router-dom";

export function Landing({roleHandle}){

    const navigate = useNavigate();
    const landingData = [
        {title: "Direktor"},
        {title: "Knjigovodja"},
        {title: "Magacioner"},
        {title: "Poslovodja"},
        {title: "Tehnicar"}
    ]

    return(
        <div className="landing">
            <span className="landing-title">
                Dobrodosli!
            </span>
            <hr className="divider" />
            <ListElement isEditable={false} screenState={"users"} listElementData={landingData[0]} onClickFunc={() => {
                roleHandle("direktor");
                navigate("/login")
            }}/>
            <ListElement isEditable={false} screenState={"users"} listElementData={landingData[1]} onClickFunc={() => {
                roleHandle("knjigovodja");
                navigate("/login")
            }}/>
            <ListElement isEditable={false} screenState={"users"} listElementData={landingData[2]} onClickFunc={() => {
                roleHandle("magacioner");
                navigate("/login")
            }}/>
            <ListElement isEditable={false} screenState={"users"} listElementData={landingData[3]} onClickFunc={() => {
                roleHandle("poslovodja");
                navigate("/login")
            }}/>
            <ListElement isEditable={false} screenState={"users"} listElementData={landingData[4]} onClickFunc={() => {
                roleHandle("tehnicar");
                navigate("/login")
            }}/>
        </div>
    )
}