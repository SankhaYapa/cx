import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import "./editAdverticement.scss";
import uploadFirebase from "../../utils/uploadFirebase";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditAdverticement = () => {
  const navigate = useNavigate();
  const { adverticementId } = useParams();

  // Move useState calls to the top of the component
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    scheduleDate: "",
    scheduleTime: "",
    video: "",
  });
  const [advertisement, setAdvertisement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAdvertisementDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/adverticements/${adverticementId}`
        );
        setAdvertisement(response.data);
        setLoading(false);
        // Set the initial formData state with existing advertisement data
        setFormData({
          title: response.data.title,
          // Convert the fetched date to "YYYY-MM-DD" format
          scheduleDate: response.data.scheduleDate
            ? new Date(response.data.scheduleDate).toISOString().split("T")[0]
            : "",
          scheduleTime: response.data.scheduleTime
            ? new Date(response.data.scheduleTime).toISOString().split("T")[0]
            : "",
          video: response.data.video,
        });
        console.log("Fetched date:", response.data);
        console.log("Formatted date:", formData.scheduleDate);
      } catch (error) {
        console.error("Error fetching advertisement details", error);
      }
    };

    fetchAdvertisementDetails();
  }, [adverticementId]);

  // Add conditional rendering for when data is loading or not available
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!advertisement) {
    return <div>No advertisement data found.</div>;
  }

  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = "Title is required";
    }

    if (!formData.scheduleDate) {
      newErrors.scheduleDate = "Schedule Date is required";
    }
    if (!formData.scheduleTime) {
      newErrors.scheduleTime = "Schedule Time is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Form validation failed, do not proceed with submission
    }

    try {
      const url = await uploadFirebase(file);
      await axios.put(
        `http://localhost:8800/api/adverticements/${adverticementId}`,
        {
          ...formData,
          video: url,
          userId: currentUser._id,
        }
      );
      navigate("/adverticement");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Advertisement</h1>
        </div>
        <div className="bottom">
          <div className="left">
            {file ? (
              <video width="320" height="240" controls>
                <source src={formData.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src="https://icon-library.com/images/upload_video_162306_9899.png"
                alt=""
              />
            )}
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label htmlFor="file">
                  Video: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              <div className="formInput">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <span className="error">{errors.title}</span>}
              </div>
              <div className="formInput">
                <label>Schedule Date</label>
                <input
                  type="date"
                  name="scheduleDate"
                  placeholder=""
                  value={formData.scheduleDate}
                  onChange={handleChange}
                />
                {errors.scheduleDate && (
                  <span className="error">{errors.scheduleDate}</span>
                )}
              </div>
              <div className="formInput">
                <label>Schedule Time</label>
                <input
                  type="date"
                  name="scheduleTime"
                  placeholder=""
                  default={formData.scheduleTime}
                  value={formData.scheduleTime}
                  onChange={handleChange}
                />
                {errors.scheduleTime && (
                  <span className="error">{errors.scheduleTime}</span>
                )}
              </div>

              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAdverticement;