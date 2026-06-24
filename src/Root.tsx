import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app/App.tsx";
import AdminPage from "./app/pages/AdminPage.tsx";

export function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
