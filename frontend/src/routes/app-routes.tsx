import { HomePage } from "@/pages/home-page"
import { Route, Routes } from "react-router-dom"

export function AppRoutes() {
  return (
    <div className="bg-background min-h-screen flex justify-center items-center">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}
