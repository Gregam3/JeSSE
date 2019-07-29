import React, { Component } from "react";
import "./App.css";
import { Button } from "react-bootstrap";
import Gauge from "react-radial-gauge";
import ComparisonEngine from "./ComparisonEngine";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AceEditor from "react-ace";
import "brace/theme/solarized_dark";
import "brace/mode/javascript";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class App extends Component {
	state = {
		code: {
			this: "",
			that: ""
		},
		similarity: 0
	};

	constructor(props) {
		super(props);
		this.updateCode = this.updateCode.bind(this);
	}

	render() {
		return (
			<div className="App">
				<h1
					className="col-xs-12"
					style={{ textAlign: "center", color: "white" }}
				>
					Compare JavaScript
				</h1>
				<div className="col-xs-12 center">
					<div className="col-xs-12">
						<Gauge
							currentValue={this.state.similarity}
							needleColor="red"
							needleWidth="12"
							needleSharp="true"
							progressColor="#3d8cd0"
						/>
					</div>
					<div className="col-xs-12">
						<Button onClick={() => this.getSimilarityValue()}>Compare</Button>
					</div>
				</div>
				<div className="col-xs-12">
					<br />
				</div>
				<div className="col-xs-6">
					<AceEditor
						mode={"javascript"}
						theme={"solarized_dark"}
						onChange={v => this.updateCode(v, "this")}
						value={this.state.code.this}
						fontSize={18}
						width={window.innerWidth * 0.48}
						height={window.innerHeight * 0.6}
						showPrintMargin={false}
					/>
				</div>
				<div className="col-xs-6">
					<AceEditor
						mode={"javascript"}
						theme={"solarized_dark"}
						onChange={v => this.updateCode(v, "that")}
						value={this.state.code.that}
						fontSize={18}
						width={window.innerWidth * 0.48}
						height={window.innerHeight * 0.6}
						showPrintMargin={false}
					/>
				</div>
				<ToastContainer style={{ width: "40%", fontSize: "25pt" }} />
			</div>
		);
	}

	updateCode(newValue, key) {
		console.log(newValue);
		let code = this.state.code;

		code[key] = newValue;

		this.setState({ code });
	}

	getSimilarityValue = async () => {
		let similarity = 0;

		try {
			let similarity = (
				100 -
				(ComparisonEngine.getSimiliarity(
					this.state.code.this,
					this.state.code.that
				) +
					ComparisonEngine.getSimiliarity(
						this.state.code.that,
						this.state.code.this
					)) *
					100
			).toFixed();

			similarity = similarity > 0 ? similarity : 0;

			while (this.state.similarity != similarity) {
				if (this.state.similarity > similarity)
					this.setState({
						similarity: this.state.similarity - 1
					});
				else
					this.setState({
						similarity: this.state.similarity + 1
					});
				await sleep(10);
			}
		} catch (err) {
			console.log(err);
			toast.error("Syntax Error at:" + JSON.stringify(err), {
				position: toast.POSITION.TOP_LEFT
			});
		}
	};
}

export default App;
