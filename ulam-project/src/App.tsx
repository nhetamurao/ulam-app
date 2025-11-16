import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import RegionDetail from "./pages/RegionDetail";
import ProvinceDetail from "./pages/ProvinceDetail";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ShopFormPage from "./pages/ShopFormPage";
import HiddenGemDetailsPage from "./pages/HiddenGemDetailsPage";
import { AuthProvider } from "./context/AuthContext";
import ProfilePage from "./pages/ProfilePage";
import DiscoverPage from "./pages/DiscoverPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-green-50 flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Discover */}
            <Route path="/discover" element={<DiscoverPage />} />

            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Gems */}
            <Route path="/gems/new" element={<ShopFormPage />} />
            <Route path="/gems/:id" element={<HiddenGemDetailsPage />} />
            <Route path="/gems/:id/edit" element={<ShopFormPage />} />

            {/* Region / Province */}
            <Route path="/region/:regionId" element={<RegionDetail />} />
            <Route path="/province/:provinceId" element={<ProvinceDetail />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
