import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages.tsx/Signup'
import { Signin } from './pages.tsx/Signin'
import { Blog } from './pages.tsx/Blog'
import { Blogs } from "./pages.tsx/Blogs";
import { Publish } from './pages.tsx/Publish';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/publish" element={<Publish />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App