import React, { Component } from "react";
import { AppContext } from "./libs/contextLib";
import MCCUserToken from "./contracts/MCCUserToken.json";
import FidelityToken from "./contracts/FidelityToken.json";
import getWeb3 from "./getWeb3";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import "./App.css";
import Routes from "./Routes";

class App extends Component {
  state = { accounts: null, contractFTK: null, contractMUT: null, usersCount: 0, web3: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the smart contracts FTK and MUT
      const networkId = await web3.eth.net.getId();
      const deployedNetworkFTK = FidelityToken.networks[networkId];
      const contractFTK = new web3.eth.Contract(
        FidelityToken.abi,
        deployedNetworkFTK && deployedNetworkFTK.address,
      );
      const deployedNetworkMUT = MCCUserToken.networks[networkId];
      const contractMUT = new web3.eth.Contract(
        MCCUserToken.abi,
        deployedNetworkMUT && deployedNetworkMUT.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ accounts, contractMUT, contractFTK, web3 }, this.loadUsersCount);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  loadUsersCount = async () => {
    const { accounts, contractMUT } = this.state;

    // Get the value from the contract to prove it worked.
    const usersCount = await contractMUT.methods.balanceOf(accounts[0]).call();

    this.setState({ usersCount });
  };

  render() {
    const { accounts, contractFTK, contractMUT, usersCount, web3 } = this.state;

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold text-muted">
              MCC (My Commerçant Connecté)
          </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              <span className="App-demo">DEMO pour la certification ALYRA</span>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ accounts, contractFTK, contractMUT, usersCount, web3 }}>
          <Routes />
        </AppContext.Provider>
      </div>
    );
  }
}

export default App;

