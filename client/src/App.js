import './App.css';
import Login from './componenets/Login';
import Indexpage from './componenets/Indexpage';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Register from './componenets/Register';
import Layout from './Layout';
import {UserContextProvider} from './Usercontext';
import Createpost from './componenets/Createpost';
import Single from './componenets/Single';
import Edit from './componenets/Edit';

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
