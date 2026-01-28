"use client"
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import LoadingPage from '../components/Loading';
import AuthContext from '../context/AuthContext';
import PrivateRoute from '../middleware/PrivateRoute';


function Page() {
  const HOST = process.env.NEXT_PUBLIC_HOST;

  const { user: admin , users: allUsers } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => { 
    const storedUsers = allUsers;
    if (storedUsers) {
      setUsers(storedUsers);
    }
  }, [allUsers]);


  if (!admin) {
    return <LoadingPage/>; // Show a loading state while fetching user data
  }
  const handleDelete = async (e) => {
    try {
      const response = await fetch(`${HOST}/deleteUser/${e}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // ✅ Parse JSON manually
      const data = await response.json();
      console.log("Response data:", data);

      if (response.status === 200) {
        const { users } = data;
        setUsers(users);
      } else {
        console.error("Failed to delete:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('Urole');

    try {
      const response = await axios.post(`${HOST}/addUser/`, {
        username,
        password,
        email,
        role,
      });
      
      console.log("Response:", response);
      const { users } = response.data;
      if (response.status === 201) {
        setUsers(users);
      }
      else {
        const data = await response.json();
        console.error("Failed to Add user:", data);
      }
    } catch (error) {
      console.log("Error registering in:", error);
      alert("Not able to register user.");
    }
  }


  const handleModify = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('Urole');

    try {
      const response = await axios.post(`${HOST}/modifyUser/`, {
        username,
        password,
        email,
        role,
      });
      const { users } = response.data;
      if (response.status === 200) {
        setUsers(users);
      }
      else {
        const data = await response.json();
        console.error("Failed to Add user:", data);
      }
    } catch (error) {
      console.log("Error registering in:", error);
      alert("Not able to register user.");
    }
  }


  return (
    <div className="text-black p-8">
      <PrivateRoute>
        <h1 className="text-5xl font-extrabold mb-8">Admin Dashboard</h1>
        <h2 className="text-3xl font-semibold mb-6">Welcome, {admin?.username}!</h2>

        {/* Admin’s User Info */}
        <div className="mb-10">
          {users != null && Array.isArray(users) && users.map((user, index) => (
            user.username === admin?.username && (
              <div key={index} className=" rounded-xl border-b-3 border-r-3 border p-4 mb-4 shadow-md">
                <h3 className="text-2xl font-semibold mb-2">Your Info</h3>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.Urole}</p>
              </div>
            )
          ))}
        </div>

        {/* All Users */}
        <div className="mb-8">
          <p className="text-xl font-medium mb-4">Total Users: {users ? users.length : 'Loading...'}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(users) && users.map((user, index) => (
              <div key={index} className="rounded-lg p-4 border-b-3 border-r-3 border shadow-lg">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.Urole}</p>
                <button
                  className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  onClick={() => handleDelete(user.userid)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="text-lg mt-6 mb-10">You are successfully logged in. Enjoy exploring the application!</p>

        {/* Forms Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add User Form */}
          <form onSubmit={handleAdd} className=" rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Add User</h2>
            <input type="text" name="username" placeholder="Username" className="w-full border-2 border-gray-300  text-black rounded p-2 mb-3" />
            <input type="email" name="email" placeholder="Email" className="w-full border-2 border-gray-300  text-black rounded p-2 mb-3" />
            <input type="password" name="password" placeholder="Password" className="w-full border-2 border-gray-300  text-black rounded p-2 mb-3" />
            <select name="Urole" className="w-full border-2 border-gray-300  text-black rounded p-2 mb-4">
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-black p-2 w-full rounded">Add User</button>
          </form>

          {/* Modify User Form */}
          <form onSubmit={handleModify} className=" rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Modify User</h2>
            <input type="text" name="username" placeholder="Username" className="w-full border-2 border-gray-300  text-black rounded p-2 mb-3" />
            <input type="email" name="email" placeholder="Email" className="w-full border-2 border-gray-300  text-black rounded p-2 mb-3" />
            <input type="password" name="password" placeholder="Password" className="w-full border-2 border-gray-300  text-black rounded p-2 mb-3" />
            <select name="Urole" className="w-full border-2 border-gray-300  text-black rounded p-2 mb-4">
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-black p-2 w-full rounded">Modify User</button>
          </form>
        </div>
      </PrivateRoute>
    </div>

  )
}

export default Page
