import React from "react";

function TracksComponent(props) {
    return (
        <React.Fragment>
            <h3>Recorded Tracks</h3>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Record start</th>
                        <th>Record stop</th>
                    </tr>
                </thead>
                <tbody>
                    {props.tracks.map((track) => (
                        <tr
                            key={track.id}
                            className="track-row"
                            onClick={function getTrackId() {
                                console.log(track.id);
                                props.getPointsForTrack(track.id);
                            }}
                        >
                            <td>{track.id}</td>
                            <td>{track.start_record}</td>
                            <td>{track.stop_record}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </React.Fragment>
    );
}

export default TracksComponent;
