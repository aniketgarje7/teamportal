import 'bootstrap/dist/css/bootstrap.min.css';
import {Table,Offcanvas} from 'react-bootstrap'
import { useState,useEffect } from 'react';
// import AiOutlineSearch from 'react-icons'
import './app.css'
function App() {
 const [data,setData] = useState([]);
 const [games,setGames] = useState([])
 const [show, setShow] = useState(false);
 const [input,setInput] = useState(null)
const [pageNumber,setPageNumber] = useState(0);
 const handleClose = () => setShow(false);
 const handleShow = () => setShow(true);
 useEffect(()=>{
   fetch('https://www.balldontlie.io/api/v1/teams')
   .then((data)=>data.json())
   .then((res)=>setData(res.data))
   .catch((e)=>console.log(e.message));

   fetch(' https://www.balldontlie.io/api/v1/games')
   .then((data)=>data.json())
   .then((res)=>setGames(res.data))
   .catch((e)=>console.log(e))
 },[])
 console.log(games)
 const [currentGame,setCurrentGame] = useState({})
 
 const handleOnClick = (id,name)=>{
  handleShow();
  let temp = {}
  let flag = true;
  for(let single of games){
     if(single.home_team.id===id){
      temp={...single}
      flag = false;
      break;
     }
  }
  if(flag){
    temp = {TeamName:name,session:'No Games'}
  }
  
  setCurrentGame({...temp})
 }
 const dataPage = []
 const page = ()=>{
  
   if(data.length>0){
    const inputData= input!==null?[...data.filter((single)=>single.name.toLowerCase().includes(input.toLowerCase()))]:[...data]
     console.log(inputData)
    for(let i=0;i<inputData.length;i+=7){
        const chunk = inputData.slice(i,i+7)
        dataPage.push(chunk)
     }
     console.log(dataPage)
   }

 }
 page()
 
  return (
    <div className="App">
      <div>
        <h1 data-cy='heading-page'>NBA Teams</h1>
      </div>
    <div className='inputDiv'>
      {/* <AiOutlineSearch/> */}
      <input onChange={(e)=>setInput(e.target.value)} placeholder='Search Team Name' id='i'/>
    </div>
    <Table striped>
      <thead>
        <tr>
          <th>Team Name</th>
          <th>City</th>
          <th>Abbrevation</th>
          <th>Conference</th>
          <th>Division</th>
        </tr>
      </thead>
      {dataPage.length>0 && <tbody>
       {dataPage[pageNumber].map((single)=>
       <tr onClick={()=>handleOnClick(single.id,single.name)} style={{cursor:'pointer'}}>
        <td>{single.name}</td>
        <td>{single.city}</td>
        <td>{single.abbreviation}</td>
        <td>{single.conference}</td>
        <td>{single.division}</td>
       </tr>
       )}
      </tbody>}
      </Table>
    
      <Offcanvas show={show} onHide={handleClose} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{currentGame.home_team!==undefined?currentGame.home_team.name:currentGame.TeamName}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            {currentGame.home_team!==undefined?
            <>
            
            <Table>
              <tr>
                <td>Team Full Name</td>
                <td>{currentGame.home_team.full_name}</td>
              </tr>
              <tr>
                <td>Total Games in 2021</td>
                <td>88</td>
              </tr>
            </Table>
            </>:<span>{currentGame.session}</span>
            }
          </div>
          <div>{currentGame!==undefined && currentGame.date!==undefined &&
         <>
         <Table>
          <thead>
            <tr><th>Random Game Details:</th></tr>
            <tr >
              <th >Date</th>
              <th >{currentGame.date.substring(0,10)}</th>
            </tr>
            <tr>
              <th >Home Team</th>
              <th>{currentGame.home_team.name}</th>
            </tr>
            <tr>
              <th>Home Team Score</th>
              <th>{currentGame.home_team_score}</th>
            </tr>
             <tr>
              <th>Visitor Team</th>
              <th>{currentGame.visitor_team.name}</th>
             </tr>
             <tr>
              <th>Visitor Team Score</th>
              <th>{currentGame.visitor_team_score}</th>
             </tr>
          </thead>
         </Table>
         </>
          }</div>
        </Offcanvas.Body>
      </Offcanvas>
      <div style={{display:'flex',justifyContent:'center'}}>
      <span onClick={()=>setPageNumber(pageNumber-1)} className='prev'
      style={{display:pageNumber!==0?'block':'none',cursor:'pointer'}}>⏮️</span>
      <span>{pageNumber+1}</span>
      <span onClick={()=>setPageNumber(pageNumber+1)} 
      style={{display:pageNumber+1<dataPage.length?'block':'none',cursor:'pointer'}}>⏩</span>
      </div>
    </div>
  );
}

export default App;
