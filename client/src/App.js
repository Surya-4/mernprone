import './App.css';
import Login from './components/Login';
import Indexpage from './components/Indexpage';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Register from './components/Register';
import Layout from './Layout';
import {UserContextProvider} from './Usercontext';
import Createpost from './components/Createpost';
import Single from './components/Single';
import Edit from './components/Edit';

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Indexpage />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={'/create'} element={<Createpost/>}/>
          <Route path={'/post/:id'} element={<Single/>}/>
          <Route path={'/edit/:id'} element={<Edit/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
