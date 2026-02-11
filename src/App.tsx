import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import ProtectedRoute from './components/core/ProtectedRoute'
import Signup from './components/pages/signUp'
import Signin from './components/pages/signIn'
import { Home } from './components/pages/Home'
import { SharedBrain } from './components/pages/SharedBrain'

function App() {
  return (
    <BrowserRouter>

      <Toaster />
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/share/:shareId' element={<SharedBrain />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
