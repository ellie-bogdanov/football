import SelectBox from "./SelectBox";
import React from "react";
import App from "./App";
import axios from "axios";
class GeneralStatistics extends React.Component{
    state = {
        firstHalf : 0 ,
        secondHalf : 0 ,
        firstGoal: 0,
        lateGoal: 0,
        roundMostGoal : 0,
        roundLeastGoal : 0 ,
        numberRounds : 0

    }
    getData = ((leagueId) => {
        axios.get("https://app.seker.live/fm1/history/" +  leagueId).then(
            (response) =>{
                this.latestGoal(response.data)
                this.firstGoal(response.data)
                this.countGoalHalf(response.data)
                this.turnoverOfGoals(response.data)
            }
        )


    })
    turnoverOfGoals = (data) => {
        let roundMost = [data[0].goals.length, data[0].round];
        let roundLeast = [data[0].goals.length, data[0].round];
        let numRound = data[data.length - 1].round

        data.forEach(game => {
            if(game.goals.length > roundMost[0]) {
                roundMost = [game.goals.length, game.round]
            }
            if(game.goals.length < roundLeast[0]) {
                roundLeast = [game.goals.length, game.round]
            }
        })

        this.setState({
            numberRounds: numRound,
            roundMostGoal : roundMost,
            roundLeastGoal : roundLeast ,

        })
    }


    countGoalHalf = (data) =>{
        let firstMinute = 45
        let countGoalsFirst = 0
        let countGoalsSecond = 0
        data.map((history) =>{
            history.goals.map((goal) =>{
                if (goal.minute <= firstMinute){
                    if (goal.home){
                        countGoalsFirst++
                    }
                } else {
                    countGoalsSecond++
                }
            })
        })
        this.setState({
            firstHalf : countGoalsFirst ,
            secondHalf : countGoalsSecond

        })

    }

    latestGoal = (data) => {
            let latest = data[0].goals[0].minute
            data.forEach(game => {
                game.goals.forEach(goal => {
                    if(goal.minute > latest) {
                        latest = goal.minute 
                    }
                })
            });
            this.setState({
                lateGoal : latest
            })
        }
    firstGoal = (data) => {
        let first = this.state.lateGoal
        data.map((history) =>{
            history.goals.map((goal) =>{
                if (goal.minute < first){
                    first = goal.minute
                }
            })
        })
        this.setState({
            firstGoal : first
        })

    }



    render() {
        return(
            <div>
                <SelectBox responseClick={this.getData.bind(this)}/>
                <div> Late goal:</div>
                {this.state.lateGoal}
                <div> First goal:</div>
                {this.state.firstGoal}
                <div> First half : {this.state.firstHalf}</div>
                <div> Second half : {this.state.secondHalf}</div>

                <div> The cycle with the most goals : {this.state.roundMostGoal[1]} with {this.state.roundMostGoal[0]} goals</div>
                <div> The cycle with the fewest goals : {this.state.roundLeastGoal[1]} with {this.state.roundLeastGoal[0]} goals</div>
            </div>

        )

    }
}
export default GeneralStatistics;