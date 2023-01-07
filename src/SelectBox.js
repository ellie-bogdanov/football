import React from "react";
import axios from "axios";
import './App.css';
class SelectBox extends React.Component {

    state = {
        leagues: [],
        option  :  "none",
        currentLeagueId: -1
    }
    arrLeagues = []

    componentDidMount() {
        this.getLeagues();
    }

    getLeagues = () => {
        axios.get("https://app.seker.live/fm1/leagues")
            .then((response) => {
                response.data.map((item) => {
                    return (
                        this.arrLeagues.push({name: item.name, id: item.id})
                    )
                })
                this.setState({
                    leagues: this.arrLeagues
                })
            })
    }

    leagueChanged = (event) => {

        if (event.target.value === "none") {
            this.setState({
                option: "none"
            })
            return
        }
        this.state.leagues.forEach(league => {
            if (league.name === event.target.value) {
                this.setState({
                    option : event.target.value,
                    currentLeagueId : league.id
                })
            }
        })
    }

    render() {
        return(
            <div className="changeLeague">
                <div className="title"> Information about soccer leagues:</div>
                <div>Which league would you like?</div>
                <div className="container">
                    <div className="select-dropdown">
                        <select value={this.state.option} onChange={this.leagueChanged}>
                            {this.state.option}
                            <option value={"none"} disabled={true}>None</option>
                            {
                                this.state.leagues.map((item) => {
                                    return (
                                        <option value={item.name}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <button className="button-49"onClick={() =>
                        this.props.responseClick(this.state.currentLeagueId)}>Enter
                    </button>
                </div>

            </div>

        )
    }


}

export default SelectBox;