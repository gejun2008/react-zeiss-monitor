import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom'
import { Context } from "../../store/store";

import './Machine.css';

const MachineDetailSummary = (props) => {
    const machine = props.summary;

    return (
        <div className="col-1 summary-detail">
            <h3>Summary</h3>
            <div>
                <label>Id:</label>
                <span>{machine?.id}</span>
            </div>
            <div>
                <label>Status:</label>
                <span>{machine?.status}</span>
            </div>
            <div>
                <label>Machine Type:</label>
                <span>{machine?.machine_type}</span>
            </div>
            <div>
                <label>Longitude:</label>
                <span>{machine?.longitude}</span>
            </div>
            <div>
                <label>Latitude:</label>
                <span>{machine?.latitude}</span>
            </div>
            <div>
                <label>Last Maintenance:</label>
                <span>{machine?.last_maintenance}</span>
            </div>
            <div>
                <label>Install Date:</label>
                <span>{machine?.install_date}</span>
            </div>
            <div>
                <label>Floor:</label>
                <span>{machine?.floor}</span>
            </div>
        </div>
    )
}

const MachineDetailEvents = (props) => {
    const events = props.eventsData;

    const colorStatus = (status) => {
        switch (status) {
            case 'idle':
            case 'repaired':
                return { 'color': 'blue', 'fontWeight': 'bold' }
            case 'running':
                return { 'color': 'green', 'fontWeight': 'bold' }
            case 'finished':
                return { 'color': 'orange', 'fontWeight': 'bold' }
            case 'errored':
                return { 'color': 'red', 'fontWeight': 'bold' }
        }
        return null
    }

    return (
        <div className="col-1">
            <h3>10 Latest Event</h3>
            <ul>
                {events?.map((l, i) => (
                    <li key={i}>
                        <div>
                            <label>Timestamp:</label>
                            <span>{l.timestamp}</span>
                        </div>
                        <div>
                            <label>Status:</label>
                            <span style={colorStatus(l.status)}>
                                {l.status}
                            </span>
                        </div>
                    </li>
                ))}

            </ul>
        </div >
    )
}

const ShowSpin = (props) => {
    const loadData = props.loadData;

    if (loadData) {
        return ''
    } else {
        return (
            <div className='spin-in-center'>
                <Spin />
            </div>
        )
    }

}

export default function Machine() {
    const [machine, setMachine] = useState();
    const { store, dispatch } = useContext(Context);
    const { updateEvent } = store;
    const { id } = useParams();

    useEffect(() => {
        if (updateEvent.machine_id !== id && machine) {
            return;
        }
        axios.get('http://codingcase.zeiss.services/api/v1/machines/' + id)
            .then(res => {
                console.log(res.data);
                const machineData = res.data.data;
                machineData?.events.sort((a, b) => {
                    const a_date = new Date(a.timestamp).getTime();
                    const b_date = new Date(b.timestamp).getTime();
                    return b_date - a_date;
                });

                machineData.events = machineData.events.splice(0, 10);
                setMachine(machineData)
            })
        console.log('update event');
    }, [updateEvent])


    return (
        <div>
            <h2>Machine Detail</h2>
            <div className="machine-detail">
                <ShowSpin
                    loadData={machine} />
                <MachineDetailSummary
                    summary={machine}
                />
                <MachineDetailEvents
                    eventsData={machine?.events}
                />

            </div >

        </div >
    )
}
