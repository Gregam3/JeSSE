import React, { Component } from "react";
import "./App.css";
import { Button, Modal } from "react-bootstrap";
import Gauge from "react-radial-gauge";
import { getSimiliarity } from "./ComparisonEngine";
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
					JavaScript Comparison
				</h1>
				<div className="col-xs-12 center">
					<div className="col-xs-12">
						<Gauge
							currentValue={this.state.similarity}
							needleColor="red"
							needleWidth="12"
							needleSharp="true"
							progressColor="#ff0000"
						/>
					</div>
					<div className="col-xs-12">
						<Button
							onClick={() => this.getSimilarityValue()}
							variant="danger"
							style={{ fontSize: 25 }}
						>
							Compare
						</Button>
						<Button
							onClick={() => this.setState({ showInnerWorkingsModal: true })}
							variant="danger"
							style={{ fontSize: 25 }}
						>
							�
						</Button>
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
						placeholder="//Enter JavaScript here"
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
						placeholder="//and also here"
					/>
				</div>
				<ToastContainer style={{ width: "40%", fontSize: "25pt" }} />
				{this.innerWorkingsModal()}
			</div>
		);
	}

	updateCode(newValue, key) {
		let code = this.state.code;

		code[key] = newValue;

		this.setState({ code });
	}

	getSimilarityValue = async () => {
		if (this.state.code.this.length < 1 || this.state.code.that.length < 1) {
			toast.error("Both inputs must be populated.", {
				position: toast.POSITION.TOP_LEFT
			});
		} else {
			try {
				let similarity = (
					100 -
					(getSimiliarity(this.state.code.this, this.state.code.that) +
						getSimiliarity(this.state.code.that, this.state.code.this)) *
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
		}
	};

	innerWorkingsModal() {
		return (
			<Modal
				animation={false}
				show={this.state.showInnerWorkingsModal}
				size="lg"
			>
				<Modal.Header>
					<Modal.Title>Basic Details</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					The system
					<ul>
						<li>Ignores Identifier names</li>
						<li>Ignores White spaces</li>
						<li>Ignores Comments</li>
						<li>Ignores Code Order</li>
						<li>Ignores Literal Values (type information kept)</li>
						<li>Ignores Any positional Information</li>
						<li>
							Uses bilateral comparison, meaning the right and left side are
							weighted evenly
						</li>
					</ul>
					Limitations with current version:
					<ul>
						<li>
							Array content is not adequately weighted or interally assessed (no
							function inlining)
						</li>
						<li>
							Functions declared as variables (i.e.{" "}
							<code>const fun = () =></code>) do not have their contents
							analysed{" "}
						</li>
					</ul>
					More detais found in the accompanying{" "}
					<a href="https://github.com//Gregam3/Thesis/raw/master/thesis.pdf">
						paper
					</a>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => this.setState({ showInnerWorkingsModal: false })}
					>
						{" "}
						Close{" "}
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

export default App;
