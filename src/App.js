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
    option  :  "none" ,
    leagues : [] ,
    leagueId : [],
    currentLeagueId : 0,
    teams: [],
    teamsId : []

  }
  arrName = []
  arrId = []
  tempTeams = []
  arrTeamId = []


  componentDidMount() {
    this.getLeagues();
  }

  getLeagues = () => {
    axios.get("https://app.seker.live/fm1/leagues").
    then((response) => {
      response.data.map((item) => {
        return (
            this.arrName.push(item.name),
                this.arrId.push(item.id)
        )
      })
      this.setState({
        leagues: this.arrName,
        leagueId: this.arrId
      })
    })
  }

  leagueChanged = (event) => {
    let index = this.state.leagues.indexOf(event.target.value)
    this.setState({
      option : event.target.value,
      currentLeagueId : this.state.leagueId[index]
    }, () => {
      this.getTeams()

    })

  }

  getTeams = () => {
    if (this.state.option === "none") {
      return
    }
    axios.get("https://app.seker.live/fm1/teams/" + this.state.currentLeagueId).
    then((response) => {
      this.tempTeams = []
      this.arrTeamId = []
      response.data.map((item) => {
        return (
            this.tempTeams.push({name : item.name, points: 0, goalsDelta: 0}),
            this.arrTeamId.push(item.id)
        )
      })
      this.setState({
        teams: this.tempTeams,
        teamsId: this.arrTeamId
      }, () => {
        
        this.calcPoints()
      })
    })
  }

  calcPoints = () => {
    axios.get("https://app.seker.live/fm1/history/" + this.state.currentLeagueId).
    then((response) => {
      response.data.forEach(item => {
        const homeTeam = item.homeTeam.name
        const awayTeam = item.awayTeam.name

        if(this.checkForWinner(item.goals) === "home") {
          let tempTeams = this.state.teams
          for(let i = 0; i < this.tempTeams.length; i++) {
            if(this.tempTeams[i].name === homeTeam) {
              tempTeams[i] = {name : tempTeams[i].name, points : tempTeams[i].points + 3, goalsDelta : tempTeams[i].goalsDelta}
              break
            }
          }
          this.setState({
            teams : tempTeams
          }, () => {
            this.calcGoalsDelta()
          })
        }

        else if(this.checkForWinner(item.goals) === "away") {
          let tempTeams = this.state.teams
          for(let i = 0; i < this.tempTeams.length; i++) {
            if(this.tempTeams[i].name === awayTeam) {
              tempTeams[i] = {name : tempTeams[i].name, points : tempTeams[i].points + 3, goalsDelta : tempTeams[i].goalsDelta}
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
              tempTeams[i] = {name : tempTeams[i].name, points : tempTeams[i].points + 1, goalsDelta : tempTeams[i].goalsDelta}
              break
            }
            if(this.tempTeams[i].name === awayTeam) {
              tempTeams[i] = {name : tempTeams[i].name, points : tempTeams[i].points + 1, goalsDelta : tempTeams[i].goalsDelta}
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

  calcGoalsDelta = () => {
    let goalsScored, goalsConceded, home, goalsDelta
    let tempTeams = this.state.teams

    for (let i = 0; i < this.state.teamsId.length; i++) {
      axios.get("https://app.seker.live/fm1/history/" + this.state.currentLeagueId + "/" + this.state.teamsId[i])
          .then((response) => {
            response.data.forEach(item => {
              goalsScored = 0
              goalsConceded = 0
              if (item.homeTeam.id === this.state.teamsId[i]) {
                home = true
              }else {
                home = false
              }
              item.goals.forEach(goal => {
                if (goal.home === home) {
                  goalsScored++
                } else {
                  goalsConceded++
                }
              })
              goalsDelta = goalsScored - goalsConceded
              tempTeams[i] = {name : tempTeams[i].name, points : tempTeams[i].points, goalsDelta : goalsDelta}

            })
            this.setState({
              teams: tempTeams
            }, () => {
              this.sortTeams()
            })
          })
    }

  }

  sortTeams() {
    let tempTeams = this.state.teams
    tempTeams  = tempTeams.sort((a, b) =>{
      if (a.points > b.points){
          return -1
      }
      if (a.points  === b.points){
          if (a.goalsDelta > b.goalsDelta){
              return -1
          }
          if (a.goalsDelta === b.goalsDelta){
              if (a.name < b.name){
                  return  -1
              }
          }
      }
  })
  this.setState ({
      teams: tempTeams
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
              <Route path={"/Tables"} element = {<Tables teams={this.state.teams} teamsId={this.state.teamsId} leagueId={this.state.leagueId} checkForWinner={this.checkForWinner}/>}></Route>
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