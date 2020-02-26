import React, { Component } from "react";
const axios = require("axios");

export default class Main extends Component {
  state = {
    device: {},
    effects: [],
    isOn: false,
    url: "/api/v1/UEZNXaWRJhxwLVJuzM0RofjUZ4E6rrLY",
    currentBrightness: 0
  };

  connectToNano = () => {
    axios.get(`${this.state.url}/state`).then(deviceState => {
      this.setState({
        device: deviceState.data,
        isOn: deviceState.data.on.value,
        currentBrightness: deviceState.data.brightness.value
      });
    });
  };

  connect = () => {
    this.connectToNano();
  };

  turnNano = () => {
    const body = {
      on: {
        value: !this.state.isOn
      }
    };
    axios
      .put(`${this.state.url}/state`, body)
      .then(res => this.connectToNano())
      .catch(err => console.log(err));
  };

  changeBright = value => {
    const body = {
      brightness: {
        value,
        duration: 30
      }
    };
    axios
      .put(`${this.state.url}/state`, body)
      .then(res => this.connectToNano())
      .catch(err => console.log(err));
  };

  getEffects = () => {
    axios.get(`${this.state.url}/effects/effectsList`).then(effects => {
      this.setState({
        effects: effects.data
      });
    });
  };

  hideEffects = () => {
    this.setState({
      effects: []
    });
  };

  nextEffect = effect => {
    const body = { select: effect };
    axios
      .put(`${this.state.url}/effects`, body)
      .then(res => this.hideEffects())
      .catch(err => console.log(err));
  };

  componentDidMount() {
    this.connectToNano();
  }

  handleBrightnessChange = e => {
    e.preventDefault();
    this.changeBright(+e.target.value);
    this.setState({ currentBrightness: +e.target.value });
    // console.log(typeof e.target.value);
  };

  // componentDidUpdate(prevProps, prevState) {
  //   console.log(prevState.device);
  //   if (prevState.device.brightness) {
  //     if (
  //       prevState.device.brightness.value !== this.state.device.brightness.value
  //     ) {
  //       this.connectToNano();
  //     }
  //   }
  // }

  render() {
    return (
      <div>
        {this.state.device.on ? (
          <p className="text-success">Connected</p>
        ) : (
          <p className="text-danger">Not Connected</p>
        )}
        <button onClick={this.connect} className="btn btn-sm btn-outline-info">
          Connect
        </button>
        {this.state.isOn === true ? (
          <button
            onClick={this.turnNano}
            className="btn btn-sm btn-danger mx-2"
          >
            "Off"
          </button>
        ) : (
          <button
            onClick={this.turnNano}
            className="btn btn-sm btn-success mx-2"
          >
            "On"
          </button>
        )}

        <p className="mt-2">
          {this.state.device.brightness ? (
            <span className="mx-2">
              Brightness: {this.state.device.brightness.value}
            </span>
          ) : (
            <span className="mx-2"> </span>
          )}
        </p>
        <p>
          <button
            onClick={() => this.changeBright(10)}
            className="btn btn-sm btn-info"
          >
            Min
          </button>
          <button
            onClick={() => this.changeBright(50)}
            className="btn btn-sm btn-info mx-2"
          >
            50%
          </button>
          <button
            onClick={() => this.changeBright(90)}
            className="btn btn-sm btn-info"
          >
            Max
          </button>
        </p>
        <div className="row d-flex justify-content-center">
          <div className="col-4">
            <label htmlFor="changeBrightness">Change Brightness</label>
            <input
              type="range"
              className="custom-range"
              min="1"
              max="100"
              step="1"
              onChange={this.handleBrightnessChange}
              value={this.state.currentBrightness}
            />
          </div>
        </div>

        <p>
          {this.state.effects.length !== 0 ? (
            <button
              onClick={this.hideEffects}
              className="btn btn-sm btn-warning ml-2"
            >
              Hide
            </button>
          ) : (
            <button onClick={this.getEffects} className="btn btn-sm btn-info">
              Effects
            </button>
          )}
        </p>
        <div className="row d-flex justify-content-center">
          <div className="col-4">
            {this.state.effects.length !== 0 ? (
              <div className="list-group">
                {this.state.effects.map((effect, i) => (
                  <button
                    key={i}
                    type="button"
                    className="list-group-item list-group-item-action"
                    onClick={() => this.nextEffect(effect)}
                  >
                    {effect}
                  </button>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}

// Make my own API to connect throw it!
