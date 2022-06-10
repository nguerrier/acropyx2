import React, { useEffect, useState } from "react";
import FastAPIClient from "../../client";
import config from "../../config";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import jwtDecode from "jwt-decode";
import * as moment from "moment";
import PilotTable from "../../components/PilotTable";
//import Button from "../../components/Button/Button";
import { NotLoggedIn } from "./NotLoggedIn";
import Loader from "../../components/Loader";
//import PopupModal from "../../components/Modal/PopupModal";

const client = new FastAPIClient(config);

const ProfileView = ({ pilots }) => {
	return (
		<>
			<PilotTable
				pilots={pilots}
				
				showUpdate={true}
			/>
			
		</>
	);
};

const PilotDashboard = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(true);
//	const [error, setError] = useState({ label: "", url: "", source: "" });
/*
	const [recipeForm, setRecipeForm] = useState({
		label: "",
		url: "https://",
		source: "",
	});
*/

//	const [showForm, setShowForm] = useState(false);
	const [pilots, setPilots] = useState([]);

//	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(true);

	useEffect(() => {
		fetchPilots();
	}, []);

	const fetchPilots = () => {
		client.getPilots().then((data) => {
			setRefreshing(false);
			setPilots(data);
		});
	};

	useEffect(() => {
		const tokenString = localStorage.getItem("token");
		if (tokenString) {
			const token = JSON.parse(tokenString);
			const decodedAccessToken = jwtDecode(token.access_token);
			if (moment.unix(decodedAccessToken.exp).toDate() > new Date()) {
				setIsLoggedIn(true);
			}
		}
	}, []);

	if (refreshing) return !isLoggedIn ? <NotLoggedIn /> : <Loader />;

	return (
		<>
			<section
				className="flex flex-col bg-black text-center"
				style={{ minHeight: "100vh" }}
			>
				<DashboardHeader />
				<div className="container px-5 pt-6 text-center mx-auto lg:px-20">
					<h1 className="mb-12 text-3xl font-medium text-white">
						Pilots
					</h1>

{/*
					<button
						className="my-5 text-white bg-teal-500 p-3 rounded"
						onClick={() => {
							setShowForm(!showForm);
						}}
					>
						Create Recipe
					</button>
*/}
					<div className="mainViewport text-white">
						{pilots.length && (
							<ProfileView
								pilots={pilots}
								fetchPilotss={fetchPilots}
							/>
						)}
					</div>
				</div>

				<Footer />
			</section>
		</>
	);
};

export default PilotDashboard;
