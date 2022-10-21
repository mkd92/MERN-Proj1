import { Routes, Route } from "react-router-dom";

import UserList from "./features/users/UserList";

import NotesList from "./features/notes/NotesList";

import Welcome from "./features/auth/Welcome";

import DashLayout from "./components/DashLayout";

import Login from "./features/auth/Login";

import Public from "./components/Public";

import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="notes">
            <Route index element={<NotesList />} />
          </Route>
          <Route path="users">
            <Route index element={<UserList />} />
          </Route>
        </Route>
        {/*end Dash*/}
      </Route>
    </Routes>
  );
}

export default App;
