import React from "react";
import axios from "axios";
import SelectBox from "./SelectBox";

class TopScorers extends React.Component {

    state = {
        players : [],
        topScorers : []
    }



    getPlayers(currentLeagueId) {

        axios.get("https://app.seker.live/fm1/history/" + currentLeagueId).then
        ((response) => {
            let tempPlayers = []
            response.data.forEach(game => {
                game.goals.forEach(goal => {
                    const player = {id : goal.scorer.id, firstName : goal.scorer.firstName, lastName: goal.scorer.lastName, goals : 1}
                    
                    let isInArr = false
                    for(let i = 0; i < tempPlayers.length; i++) {
                        if(tempPlayers[i].id === player.id) {
                            isInArr = true
                            tempPlayers[i] = {id : tempPlayers[i].id, firstName : tempPlayers[i].firstName, lastName : tempPlayers[i].lastName, goals : tempPlayers[i].goals + 1}
                            break
                        }
                    }
                    if(!isInArr) {
                        tempPlayers.push(player)
                    }
                })
            })
            this.setState({
                players : tempPlayers
            }, () => {
                this.findTopScorers()
            })
        })
    }

    findTopScorers() {
        let tempPlayers = this.state.players
        tempPlayers.sort((a, b) => {
            if(a.goals > b.goals) {
                return -1
            }
            else {
                return 1
            }
        })
        this.setState({
            players : tempPlayers
        })
        

    }

    render() {
        return(
            <div>
                <SelectBox responseClick={this.getPlayers.bind(this)}/>
                {
                (this.state.players.length >= 3) &&
                <ul>    
                    <li>
                        {this.state.players[0].firstName + " " + this.state.players[0].lastName + " - " + this.state.players[0].goals + " goals"}
                    </li>   
                    <li>
                        {this.state.players[1].firstName + " " + this.state.players[1].lastName + " - " + this.state.players[1].goals + " goals"}
                    </li>   
                    <li>
                        {this.state.players[2].firstName + " " + this.state.players[2].lastName + " - " + this.state.players[2].goals + " goals"}
                    </li>   
                </ul>
                }
            </div>
        )
        
    }
}

export default TopScorers