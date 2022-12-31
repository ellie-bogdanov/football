import "./Tables.css";

function Tables(props) {

    return(
        <div>
            <table>
                <tr>
                    <th>Points</th>
                    <th>Goals Delta</th>
                    <th>Name</th>
                </tr>
                {
                    props.teams.map((item) => {
                        return(
                            <tr>
                                <td>
                                    {item.points}
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                                    {item.name}
                                </td>
                            </tr>
                        )
                    })
                }




            </table>
        </div>
    )

}

export default Tables;