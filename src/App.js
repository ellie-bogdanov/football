import './App.css';
import React from "react";
import axios from "axios";
import {BrowserRouter , Routes , Route ,NavLink} from "react-router-dom";
import Tables from "./Tables";
import GeneralStatistics from "./GeneralStatistics";
import ResultsHistory from "./ResultsHistory";
import TopScorers from "./TopScorers";

class App extends React.Component {

  state = {

  }


  render() {
    return (
        <div className="App">
          <BrowserRouter>
            <div>
              <NavLink  style={{margin : "10px"}} to={"./Tables"}>Tables</NavLink>
              <NavLink  style={{margin : "10px"}} to={"./GeneralStatistics"}>General statistics</NavLink>
              <NavLink  style={{margin : "10px"}} to={"./ResultsHistory"}>Results history</NavLink>
              <NavLink  style={{margin : "10px"}} to={"./TopScorers"}>Top scorers</NavLink>
            </div>
            <Routes>
              <Route path={"/Tables"} element = {<Tables/>}></Route>
              <Route path={"/GeneralStatistics"} element = {<GeneralStatistics/>}></Route>
              <Route path={"/ResultsHistory"} element = {<ResultsHistory/>}></Route>
              <Route path={"/TopScorers"} element = {<TopScorers/>}></Route>
            </Routes>
          </BrowserRouter>
        </div>
    );
  }



}


export default App;