import React from "react";

function TracksComponent(props) {
    return <React.Fragment>
        <h3>Recorded Tracks</h3>
        <table>
            <tr>
                <th>Id</th>
                <th>Record start</th>
                <th>Record stop</th>
            </tr>
            {props.tracks.map(track => (
                <tr>
                    <td onClick={function getTrackId() {
                        console.log(track.id)
                        props.getPointsForTrack(track.id)
                    }}>{track.id}</td>
                    <td>{track.start_record}</td>
                    <td>{track.stop_record}</td>
                </tr>
            ))}
        </table>
    </React.Fragment>;
}

export default TracksComponent;
