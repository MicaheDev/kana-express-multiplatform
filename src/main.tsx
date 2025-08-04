import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Learn from './pages/Learn/Learn';
import Practice from './pages/Practice/Practice';
import LearnDetail from './pages/Learn/LearnDetail';
import "./App.css";
import Home from "./pages/Home";
import Profile from "./pages/Profile/Profile";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <>
                <main id="main" className="bg-background dark:bg-dark-background w-screen overflow-hidden">
                    <Routes>
                        <Route index path="/" element={<Home />} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/learn/:kana" element={<LearnDetail />} />
                        <Route path="/practice" element={<Practice />} />
                        <Route path="/profile" element={<Profile />} />

                    </Routes>
                </main>
            </>
        </BrowserRouter>
    </React.StrictMode>,
);
