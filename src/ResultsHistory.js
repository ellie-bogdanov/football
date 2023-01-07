import React from "react";
import axios from "axios";
import SelectBox from "./SelectBox";

class ResultsHistory extends React.Component {

    state = {
        startRound: 1,
        endRound: 0,
        roundList: [],
        games : [],
        gamesToShow : []
    }

    getRoundResults = (leagueId) => {
        this.setState({
            gamesToShow : []
        })
        axios.get("https://app.seker.live/fm1/history/" + leagueId)
            .then((response) => {
                let tempRoundList = []
                let lastRound = response.data[response.data.length - 1].round
                for(let i = 1; i <= lastRound; i++) {
                    tempRoundList.push(i)
                }
                this.setState({
                    roundList : tempRoundList,
                    startRound : tempRoundList[0],
                    endRound : tempRoundList[tempRoundList.length - 1]
                })
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
                    tempGames.push({results : `${homeTeam} ${homeTeamGoals} - ${awayTeamGoals} ${awayTeam}`, round : game.round})
                })
                this.setState({
                    games : tempGames
                })
            })
            
    }



    changeStartRound(event) {
        const number = event.target.value * 1
        if(number >= 1 && number <= this.state.roundList.length && number <= this.state.endRound) {
            this.setState({
                startRound : number
            })
        }
    }

    changeEndRound(event) {
        const number = event.target.value * 1
        if(number >= this.state.startRound && number >= 1 && number <= this.state.roundList.length){
            this.setState({
                endRound : number
            })
        }
    }



    showRelevantGames() {
        let tempGames = []
        this.state.games.forEach((game) => {
            if(game.round >= this.state.startRound && game.round <= this.state.endRound) {
                tempGames.push(game.results)
            }
        })
        this.setState({
            gamesToShow : tempGames
        })

    }

    render() {
        return(
            <div>
                <SelectBox responseClick={this.getRoundResults.bind(this)}/>
                
                {
                    (this.state.roundList.length >= 1) &&
                    <div>
                        Start Round:
                        <input type="number" value={this.state.startRound} onChange={this.changeStartRound.bind(this)}/>
                        Last Round:
                        <input type="number" value={this.state.endRound} onChange={this.changeEndRound.bind(this)}/>
                        <button onClick={this.showRelevantGames.bind(this)}>Enter</button>
                    </div>
                }

                

                <ul>
                    {
                        this.state.gamesToShow.map((game) => {
                            return(
                                <li>{game}</li>
                            )
                        })
                    }
                </ul>


                


            </div>
        )
    }



}

export default ResultsHistory;