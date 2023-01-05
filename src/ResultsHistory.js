import React from "react";
import axios from "axios";
import SelectBox from "./SelectBox";

class ResultsHistory extends React.Component {

    state = {
        startRound: 1,
        endRound: 0,
        roundListStart: [],
        roundListEnd: [],
        leagues: [],
        games : []
    }

    getRoundResults = (leagueId) => {
        
        axios.get("https://app.seker.live/fm1/history/" + leagueId)
            .then((response) => {
                this.roundList(leagueId)
                let tempGames = []
                response.data.forEach(game => {

                    const homeTeam = game.homeTeam.name
                    const awayTeam = game.awayTeam.name
                    let homeTeamGoals = 0
                    let awayTeamGoals = 0
                    game.goals.forEach(goal => {
                        if(goal.home) {
                            homeTeamGoals++
                        }
                        else {
                            awayTeamGoals++
                        }
                    })  
                    tempGames.push(`${homeTeam} ${homeTeamGoals} - ${awayTeamGoals} ${awayTeam}`)
                })
                this.setState({
                    games : tempGames
                })
            })
            
    }

    roundList = (leagueId) => {
        axios.get("https://app.seker.live/fm1/history/" + leagueId).
        then((response) => {
            let tempRoundList = []
            let lastRound = response.data[response.data.length - 1].round
            for(let i = 1; i <= lastRound; i++) {
                tempRoundList.push(i)
            }
            this.setState({
                roundListStart : tempRoundList,
                roundListEnd : tempRoundList
            })
        })

    }

    startRoundChanged = (event) => {
        this.setState({
            startRound: event.target.value
        })
    }



    render() {
        return(
            <div>
                <SelectBox responseClick={this.getRoundResults.bind(this)}/>
                Start:
                <select value={this.state.startRound} onChange={(event) => {
                    this.setState({
                        startRound : event.target.value
                    })
                }}>
                    <option value={"none"} disabled={true}>Select Start Round</option>
                    {
                        
                        this.state.roundListStart.map((item) => {
                            return (
                                <option value={item}>{item}</option>
                            )
                        })
                    }
                </select>

                <select value={this.state.startRound} onChange={(event) => {
                    this.setState({
                        endRound : event.target.value
                    })
                }}>
                    <option value={"none"} disabled={true}>Select Start Round</option>
                    {
                        this.state.roundListEnd.map((item) => {
                            return (
                                <option value={item}>{item}</option>
                            )
                        })
                    }
                </select>


            </div>
        )
    }



}

export default ResultsHistory;