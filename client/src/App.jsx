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
import TestRoute from "./TestRoute";
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Sidebar></Sidebar>
        <Header></Header>
        <Routes>
          <Route path="profile" element={<Profile/>}></Route>
          <Route path="campaigns" element={<Campaigns/>}></Route>
          <Route path="/campaigns/:campaignId" element={<Campaign/>}></Route>

          <Route path="mycampaigns" element={<MyCampaigns/>}></Route>
        </Routes>
      </div>
    </Provider>
  );
}

export default App;