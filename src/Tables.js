import "./Tables.css";
import axios from "axios";
import React from "react";
import SelectBox from "./SelectBox";

class Tables extends React.Component {

    state = {
        playerNames: [],
        teams: [],
        currentTeamGames:[],
        currentLeagueId: 0

    }
    tempTeams = []
    arrPlayerNames = []


    getTeams = (currentLeagueId) => {
        axios.get("https://app.seker.live/fm1/teams/" + currentLeagueId)
            .then((response) => {
                this.tempTeams = []
                response.data.map((item) => {

                    axios.get("https://app.seker.live/fm1/history/" + currentLeagueId + "/" + item.id)
                        .then((response) => {
                            let tempPoints = 0
                            let delta = 0
                            response.data.forEach(game => {
                                let goalsScored = 0
                                let goalsConceded = 0
                                let home

                                if (game.homeTeam.id === item.id) {
                                    home = true
                                } else {
                                    home = false
                                }
                                game.goals.forEach(goal => {
                                    if (goal.home === home) {
                                        goalsScored++
                                        delta++
                                    } else {
                                        goalsConceded++
                                        delta--
                                    }
                                })

                                if (goalsScored > goalsConceded) {
                                    tempPoints += 3
                                } else if (goalsScored === goalsConceded) {
                                    tempPoints++
                                }
                            })
                            this.tempTeams.push({
                                name: item.name,
                                id: item.id,
                                points: tempPoints,
                                goalsDelta: delta
                            })
                            this.tempTeams  = this.tempTeams.sort((a, b) => {
                                if (a.points > b.points){
                                    return -1
                                }
                                if (a.points === b.points){
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
                            this.setState({
                                teams: this.tempTeams,
                                currentLeagueId: currentLeagueId
                            })
                        })
                })
            })
    }




        playerNameList = (id) => {
            let name
            this.arrPlayerNames = []
            axios.get("https://app.seker.live/fm1/squad/" + this.state.currentLeagueId + "/" + id)
                .then((response) => {
                    response.data.forEach(player => {
                        name = player.firstName + " " + player.lastName
                        this.arrPlayerNames.push(name)
                    })
                    this.setState({
                        playerNames: this.arrPlayerNames
                    })
                })

        }

        gamesHistory = (id) => {
            let homeTeam, awayTeam, homeGoals, awayGoals
            let tempTeamGames = []
            axios.get("https://app.seker.live/fm1/history/" + this.state.currentLeagueId + "/" + id)
                .then((response) => {
                    response.data.forEach(game => {
                        homeGoals = 0;
                        awayGoals = 0;
                        homeTeam = game.homeTeam.name;
                        awayTeam = game.awayTeam.name;
                        game.goals.forEach(goal => {
                            if (goal.home) {
                                homeGoals++
                            } else {
                                awayGoals++
                            }
                        })
                        tempTeamGames.push(homeTeam + " " + homeGoals + " - " + awayGoals + " " + awayTeam)
                    })
                    this.setState({
                        currentTeamGames: tempTeamGames
                    })

                })
        }

        showDetails = (id) => {
            this.playerNameList(id)
            this.gamesHistory(id)
        }


    render() {
        return (
            <div>
                <SelectBox responseClick={this.getTeams.bind(this)}/>
                <br/>
                {
                    (this.state.teams.length > 0) &&
                    <table>
                        <tr>
                            <th>Points</th>
                            <th>Name</th>
                        </tr>
                        {
                            this.state.teams.map((team) => {
                                return (
                                    <tr onClick={() => {
                                    this.showDetails(team.id)
                                }}>
                                        <td>
                                            {team.points}
                                        </td>
                                        <td>
                                            {team.name}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </table>

                }

                {
                    (this.state.playerNames.length > 0) &&
                    <ul>
                        {
                            this.state.playerNames.map((player) => {
                                return(
                                    <li>
                                        {player}
                                    </li>
                                )
                            })
                        }
                    </ul>
                }

                {
                    (this.state.playerNames.length > 0) &&
                    <ul>
                        {
                            this.state.currentTeamGames.map((game) => {
                                return(
                                    <li>
                                        {game}
                                    </li>
                                )
                            })
                        }
                    </ul>
                }


            </div>
        )
    }
}

export default Tables;