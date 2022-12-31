import './App.css';
import React from "react";
import axios, {get} from "axios";
import {BrowserRouter , Routes , Route ,NavLink} from "react-router-dom";
import Tables from "./Tables";
import GeneralStatistics from "./GeneralStatistics";
import ResultsHistory from "./ResultsHistory";
import TopScorers from "./TopScorers";

class App extends React.Component {

  state = {
    option  :  "none" ,
    leagues : [] ,
    leagueId : [],
    currentLeagueId : 0,
    teams: []

  }
  arrName = []
  arrId = []
  tempTeams = []


  calcPoints = () => {
    
    axios.get("https://app.seker.live/fm1/history/" + this.state.currentLeagueId).
    then((response) => {
      console.log(Object.keys(response))
      
      response.data.forEach(item => {
        
        const homeTeam = item.homeTeam.name
        const awayTeam = item.awayTeam.name
        if(this.checkForWinner(item.goals) === "home") {
          
          let tempTeams = this.state.teams
          for(let i = 0; i < this.tempTeams.length; i++) {
            if(this.tempTeams[i].name === homeTeam) {
              tempTeams[i] = {name : tempTeams[i].name, points : tempTeams[i].points + 3}
              
              break
            }
          }
          this.setState({
            teams : tempTeams
          })
        }
        else if(this.checkForWinner(item.goals) === "away") {
          let tempTeams = this.state.teams
          for(let i = 0; i < this.tempTeams.length; i++) {
            if(this.tempTeams[i].name === awayTeam) {
              tempTeams[i] = {name : tempTeams[i].name, points : tempTeams[i].points + 3}
              break
            }
          }
          this.setState({
            teams : tempTeams
          })
        }
        else {
          let tempTeams = this.state.teams
          for(let i = 0; i < this.tempTeams.length; i++) {
            if(this.tempTeams[i].name === homeTeam) {
              tempTeams[i] = {name : tempTeams[i].name, points : tempTeams[i].points + 1}
              break
            }
            if(this.tempTeams[i].name === awayTeam) {
              tempTeams[i] = {name : tempTeams[i].name, points : tempTeams[i].points + 1}
              break
            }
          }
          this.setState({
            teams : tempTeams
          })
        }
      })
    })
  }

  checkForWinner = (goals) => {
    let homeCounter = 0
    let awayCounter = 0
    goals.forEach(goal => {
      if(goal.home) {
        homeCounter++
      }
      else {
        awayCounter++
      }
    });
    if(homeCounter > awayCounter) {
      return "home"
    }
    else if(awayCounter > homeCounter) {
      return "away"
    }
    return "tie"
  }

  leagueChanged = (event) => {
    let index = this.state.leagues.indexOf(event.target.value)
    this.setState({
      option : event.target.value,
      currentLeagueId : this.state.leagueId[index]
    }, () => {
      this.getTeams()
      this.calcPoints()
    })
  }

  componentDidMount() {
    this.getLeagues();
  }

  getLeagues = () => {
    axios.get("https://app.seker.live/fm1/leagues").
    then((response)  => {
      response.data.map((item) => {
        return(
            this.arrName.push(item.name),
            this.arrId.push(item.id)
        )
      })
      this.setState({
        leagues : this.arrName,
        leagueId : this.arrId
      })
    })
  }

  getTeams = () => {
    if (this.state.option === "none") {
      return
    }
    axios.get("https://app.seker.live/fm1/teams/" + this.state.currentLeagueId).
    then((response) => {
      this.tempTeams = []
      response.data.map((item) => {
        return (
            this.tempTeams.push({name : item.name, points: 0})
        )
      })
      this.setState({
        teams: this.tempTeams
      })
    })
  }





  render() {
    return (
        <div className="App">
          <div> Information about soccer leagues:</div>
          Which league would you like?
          <select value={this.state.option} onChange={this.leagueChanged}>{this.state.option}
            <option value={"none"}>None</option>
            {
              this.state.leagues.map((item) => {
                return (
                    <option value={item}>{item}</option>
                )
              })
            }
          </select>
          <BrowserRouter>
            <div>
              <NavLink  style={{margin : "10px"}} to={"./Tables"}>Tables</NavLink>
              <NavLink  style={{margin : "10px"}} to={"./GeneralStatistics"}>General statistics</NavLink>
              <NavLink  style={{margin : "10px"}} to={"./ResultsHistory"}>Results history</NavLink>
              <NavLink  style={{margin : "10px"}} to={"./TopScorers"}>Top scorers</NavLink>
            </div>
            <Routes>
              <Route path={"/Tables"} element = {<Tables teams={this.state.teams}/>}></Route>
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