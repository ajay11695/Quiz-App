import { Link } from "react-router-dom"

function Hedaer(){
    return (
        <header className="flex between align-center">
            <Link to='/' className="font-30 font-700" style={{fontStyle:"italic"}}>QUIZ LAND?</Link>
            <nav className="flex">
                <li className="font-20 font-600" style={{color:"black"}}>Profile</li>
                <li className="font-20 font-600" style={{color:"black"}}>Contact</li>
            </nav>
        </header>
    )
}

export default Hedaer