import React, { Component } from 'react';
import logo from '../holo-logo.svg';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import cmd from 'node-cmd'
import './Home.css';

import { makeData, Logo, Tips } from "../utils/utils";
import { advancedExpandTableHOC } from "./systemTable";
import { manageAllApps } from "../utils/app-cmd";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

type Props = {
};

const AdvancedExpandReactTable = advancedExpandTableHOC(ReactTable);

export default class Home extends Component {

  constructor(props) {
    super(props);
    // this.getAllApps();
    this.state = {
      apps: '',
      data: makeData()
    };
    // updateState()
  }
  componentDidMount() {
    let self = this;
    cmd.get(
      `hcadmin`,
      function(err, data, stderr) {
        if (!err) {
          console.log('/.holochain contains these files :\n\n', data)
          self.setState({
            apps: manageAllApps(data)
          });
          console.log("Apps state: ", self.state)
        } else {
          console.log('error', err)
        }

      }
    );
  }
  
  render() {
    const { data } = this.state;
    return (
      <div>
      <div  className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to HCAdmin-GUI</h2>
        </div>
        <AdvancedExpandReactTable
          data={data}
          columns={columns}
          defaultPageSize={20}
          className="-striped -highlight"
          SubComponent={({ row, nestingPath, toggleRowSubComponent }) => {
            return (
              <div style={{ padding: "20px" }}>
                <button
                  onClick={e => toggleRowSubComponent({ nestingPath }, e)}
                >
                  Bridged-Apps {row.appName} {row.authorName}
                </button>
              </div>
            );
          }}
        />
      </div>
      </div>
    );
  }
}


/*Data*/
const columns = [{
      Header: 'App',
      columns: [{
        Header: 'App Name',
        accessor: 'appName'
      }, {
        Header: 'DNA',
        id: 'authorName',
        accessor: d => d.authorName
      }]
    }, {
      Header: 'Stats',
      columns: [{
        Header: 'CPU %',
        accessor: 'progress',
        Cell: row => (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#dadada',
              borderRadius: '2px'
            }}
          >
            <div
              style={{
                width: `${row.value}%`,
                height: '100%',
                backgroundColor: row.value > 66 ? '#85cc00'
                  : row.value > 33 ? '#ffbf00'
                  : '#ff2e00',
                borderRadius: '2px',
                transition: 'all .2s ease-out'
              }}
            />
          </div>
        )
      }, {
        Header: 'Status',
        accessor: 'status',
        Cell: row => (
          <span>
            <span style={{
              color: row.value === 'installed' ? '#57d500'
                : row.value === 'uninstalled' ? '#ff2e00'
                : '#ffbf00',
              transition: 'all .3s ease'
            }}>
            </span> {
              row.value === 'installed' ? `Installed`
              : row.value === 'uninstalled' ? `Uninstalled`
              : 'Bridging'
            }
          </span>
        )
      }]
    }];
