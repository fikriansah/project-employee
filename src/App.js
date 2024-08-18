import Login from "./components/Login.js";
import Register from "./components/Register.js";
import Dashboard from "./components/Dashboard.js";
import Home from "./components/Home.js";
import EntryData from "./components/EntryData.js";
import Navbar from "./components/Navbar.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegisterAdmin from "./components/RegisterAdmin.js";
import AddWork from "./components/WorkExperience.js";
import AddEducation from "./components/EducationExperience.js";
import AddCourse from "./components/CourseExperience.js";
import DetailUser from "./components/DetailUser.js";
import EditEntryData from "./components/EditEntryData.js";
import EditWork from "./components/EditWorkExperience.js";
import EditEducation from "./components/EditEducationExperience.js";
import EditCourse from "./components/EditCourseExperience.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/admin" element={<RegisterAdmin />} />
        <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
        <Route path="/dashboard/user/:id" element={<><Navbar /><DetailUser /></>} />
        <Route path="/dashboard/user/edit/:id" element={<><Navbar /><EditEntryData /></>} />
        <Route path="/dashboard/user/edit/work/:id" element={<><Navbar /><EditWork /></>} />
        <Route path="/dashboard/user/edit/education/:id" element={<><Navbar /><EditEducation /></>} />
        <Route path="/dashboard/user/edit/course/:id" element={<><Navbar /><EditCourse /></>} />
        <Route path="/home" element={<><Navbar /><Home /></>} />
        <Route path="/entry-data/:id" element={<><Navbar /><EntryData /></>} />
        <Route path="/entry-data/work/:id" element={<><Navbar /><AddWork /></>} />
        <Route path="/entry-data/education/:id" element={<><Navbar /><AddEducation /></>} />
        <Route path="/entry-data/course/:id" element={<><Navbar /><AddCourse /></>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
