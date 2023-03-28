import { Provider } from "react-redux";
import "./app.css"
import store from "./Redux/store";
import Header from "./Pages/Header";
import Sidebar from "./Pages/Sidebar";
import { Routes, Route } from "react-router-dom";
import Profile from "./Pages/Profile";
import MyCampaigns from "./Pages/MyCampaigns/MyCampaigns";
import Campaigns from "./Pages/Campaigns/Campaigns";
import Campaign from "./Pages/Campaigns/Campaign";
import About from "./Pages/About/About";
import Preloader from "./Pages/common/Preloader";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Sidebar></Sidebar>
        <Header></Header>
        <Routes>
          <Route loader={<Preloader/>} path="profile" element={<Profile/>}></Route>
          <Route loader={<Preloader/>} path="campaigns" element={<Campaigns/>}></Route>
          <Route loader={<Preloader/>} path="/campaigns/:campaignId" element={<Campaign/>}></Route>

          <Route loader={<Preloader/>} path="mycampaigns" element={<MyCampaigns/>}></Route>

          <Route loader={<Preloader/>} path="about" element={<About/>}></Route>
        </Routes>
      </div>
    </Provider>
  );
}

export default App;