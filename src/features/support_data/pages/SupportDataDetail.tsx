import { useState } from "react";
import { useParams } from "react-router-dom";
import userMale from "../../../assets/images/user_male.png";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import DriverDetails from "./supportDataDetailPartials/DriverDetails.tsx";
import { FaPhone, FaPhoneAlt, FaVideo, FaPaperclip, FaSmile, FaPaperPlane } from "react-icons/fa";

export default function SupportDataDetail() {
	const { id } = useParams<{ id: string }>();
	const [activeTab, setActiveTab] = useState("message");

	const messages = [
		{ id: 1, text: "No honestly I'm thinking of a career pivot", sender: "driver"},
		{ id: 2, text: "This is the main chat template", sender: "driver"},
		{ id: 3, text: "Oh?", sender: "user", createdAt: "Nov 30, 2023, 9:41 AM" },
		{ id: 4, text: "Cool", sender: "user" },
		{ id: 5, text: "How does it work?", sender: "user" },
		{ id: 6, text: "Simple", sender: "driver" },
		{ id: 7, text: "You just edit any text ... bubbles you don’t want to use", sender: "driver" },
		{ id: 8, text: "Boom", sender: "driver" },
		{ id: 9, text: "Hmmm", sender: "user" },
		{ id: 10, text: "I think I get it", sender: "user" },
		{ id: 11, text: "Will head to Help Center if I have more questions tho", sender: "user" },
	];

	// Mock data (replace with API response)
	const complaint = {
		complaint: "Open",
		status: "Open",
		issueTitle: "Inability to Connect with driver",
		issueDate: "August 12th, 2025",
		language: "English",
	};


	return (
	    <DashboardLayout>
		    <div className="row g-3">
		        {/* Left Sidebar - Complaint Details */}
		        <div className="col-md-4">
		        	<DriverDetails />
		        </div>

		        {/* Right Panel - Chat / Issue Details */}
		        <div className="col-md-8">
			        <div className="card border-0 shadow-sm rounded h-100 d-flex flex-column">
			            <div className="card-body d-flex flex-column">
				            
				            {/* Complaint Header */}
				            <div className="d-flex align-items-center mb-1">Title</div>
				            <h5 className="fw-bold mb-2">{complaint.issueTitle}</h5>
				            <p className="small text-muted mb-2">
				                <span className="fw-semibold">Issue Date:</span> {complaint.issueDate} &nbsp; | &nbsp;
				                <span className="fw-semibold">Language:</span> {complaint.language} &nbsp; | &nbsp;
				                <span className="fw-semibold">Status:</span> 
				                <span className="badge bg-success-subtle text-success ms-1">{complaint.status}</span>
				            </p>				            

					        <div className="">
					            {/* Profile Tabs */}
					            <ul className="nav nav-tabs mb-3">
					                <li key='message' className="nav-item">
				                        <button type="button" onClick={() => setActiveTab('message')}
				                            className={`nav-link fw-semibold d-inline-flex align-items-center gap-2 border-0 border-bottom
				                            ${activeTab==='message' ? "border-primary text-primary active" : "border-transparent text-dark"}`}
				                        >
				                            <span>Message</span>
				                        </button>
				                    </li>
				                    <li key='internal-comment' className="nav-item">
				                        <button type="button" onClick={() => setActiveTab('internal-comment')}
				                            className={`nav-link fw-semibold d-inline-flex align-items-center gap-2 border-0 border-bottom
				                            ${activeTab==='internal-comment' ? "border-primary text-primary active" : "border-transparent text-dark"}`}
				                        >
				                            <span>Internal Comment</span>
				                        </button>
				                    </li>
					            </ul>

					            {/* Message Tab Content */}
					            {activeTab === "message" && (
					            	<>
						            	<div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ backgroundColor: "#fff6f4" }}>
									     	{/* Left: Status */}
									      	<span className="fw-semibold text-dark">Active 20m ago</span>

									      	{/* Right: Action Icons */}
									      	<div className="d-flex gap-3">
										        <button className="btn btn-sm border-0 text-danger">
									          		<FaPhoneAlt size={18} />
									        	</button>
									        	<button className="btn btn-sm border-0 text-danger">
									          		<FaVideo size={20} />
									        	</button>
									      	</div>
									    </div>
									    <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: "400px" }}>
											{messages.map((msg) => (
											    <div key={msg.id}>
											      	{/* Timestamp (only if created_at exists) */}
											      	{msg.createdAt && (
											        	<div className="text-center my-3">
											          		<small className="text-muted">
											            		{new Date(msg.createdAt).toLocaleString("en-US", {month:"short", day:"2-digit", year:"numeric", hour:"numeric", minute:"2-digit", hour12:true,})}
											          		</small>
											        	</div>
											      	)}

											      	{/* Chat bubble */}
											      	<div className={`d-flex mb-2 ${msg.sender === "driver" ? "justify-content-end" : "justify-content-start"}`}>
											        	<div className={`p-2 rounded ${msg.sender === "driver" ? "bg-primary text-white" : "bg-primary-subtle text-primary"}`} style={{ maxWidth: "70%" }}>
											        		{msg.text}
											        	</div>
											      	</div>
											    </div>
											))}
										</div>
							        </>
					            )}

					            {/* Internal Comment Tab Content */}
					            {activeTab === "internal-comment" && (
					            	<div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: "400px" }}>
						                <p className="mb-2 col-sm-12 text-center text-danger py-5">No comments yet...</p>
						            </div>
					            )}
					        </div>

				            {/* Chat Section */}
				            {activeTab === "message" && (
					            <div className="d-flex align-items-center border-top pt-2">
				            		{/* Input Area */}
					                <input type="text" placeholder="Enter your message" className="form-control border-0 shadow-none" />
					                <button className="btn btn-light"><FaPaperclip /></button>
					                <button className="btn btn-light"><FaSmile /></button>
					                <button className="btn btn-primary"><FaPaperPlane /></button>
					            </div>
					        )}
			            </div>
			        </div>
		        </div>
		    </div>
	    </DashboardLayout>
  	);
}
