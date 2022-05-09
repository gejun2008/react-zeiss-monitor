import React, { useState, useMemo, useRef, useCallback, useContext, useEffect } from 'react';

import axios from 'axios';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Optional theme CSS

import MachineIdRenderer from '../../components/UI/Cell/MachineIdRenderer';
import { Context } from "../../store/store";

const dateFormatter = (params) => {
    const dateValue = params.value;
    const date = dateValue.slice(0, -1);
    const dateData = date.split('T');
    return dateData[0] + " " + dateData[1];
};


export default function Machines() {
    const gridRef = useRef();
    const [rowData, setRowData] = useState();
    const { store, dispatch } = useContext(Context);
    const { updateEvent } = store;

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'ID', field: 'id', width: 300, cellRenderer: MachineIdRenderer

        },
        {
            headerName: 'Status', field: 'status', width: 120,
            cellStyle: (params) => {
                switch (params.value) {
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
        },
        { headerName: 'Machine Type', field: 'machine_type', width: 120 },
        { headerName: 'Longitude', field: 'longitude', width: 180 },
        { headerName: 'Latitude', field: 'latitude', width: 180 },
        { headerName: 'Last Maintenance', field: 'last_maintenance', width: 120, valueFormatter: dateFormatter },
        { headerName: 'Install Date', field: 'install_date', width: 120 },
        { headerName: 'Floor', field: 'floor', width: 100 }
    ])
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            filter: true,
            sortable: true,
            resizable: true,
        };
    }, []);

    useEffect(() => {
        gridRef?.current?.api?.forEachNode(node => {
            const nodeData = node.data;
            if (nodeData.id === updateEvent.machine_id) {
                const newNodeData = Object.assign({}, nodeData, { status: updateEvent.status });
                node.setData(newNodeData)
            }
        })
    }, [updateEvent]);


    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
    }, []);

    const onGridReady = useCallback(() => {
        axios.get(`http://codingcase.zeiss.services/api/v1/machines`)
            .then(res => {
                const rowData = res.data.data;
                setRowData(rowData);
                setTimeout(() => {
                    gridRef.current.api.sizeColumnsToFit();
                })
            })
    }, []);

    return (

        <div style={{flex: '1 1 auto'}}>
            <input
                type="text"
                id="filter-text-box"
                style={{ width: '100%' }}
                placeholder="Filter..."
                onInput={onFilterTextBoxChanged}
            />

            <div style={{ height: '90%', width: '100%', marginTop: 15 }}
                className="ag-theme-alpine">
                <AgGridReact
                    // properties
                    ref={gridRef}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    defaultColDef={defaultColDef}
                    cacheQuickFilter={true}

                    // events
                    onGridReady={onGridReady}>
                </AgGridReact>
            </div>
        </div>
    );
}

