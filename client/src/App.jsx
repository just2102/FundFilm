import { Provider } from "react-redux";
import "./app.css"
import store from "./Redux/store";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Profile from "./Components/Profile";
import MyCampaigns from "./Components/MyCampaigns";
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Sidebar></Sidebar>
        <Header></Header>
        <Routes>
          <Route path="profile" element={<Profile/>}></Route>
          <Route path="mycampaigns" element={<MyCampaigns/>}></Route>

        </Routes>
      </div>
    </Provider>
  );
}

export default App;