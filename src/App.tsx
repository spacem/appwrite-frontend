import React, { useState } from 'react';
import { account, ID } from './lib/appwrite';


// Import the User type from Appwrite if available
// If not, you can use 'any' as a fallback, but it's better to use the correct type
// import type { Models } from 'appwrite';
// type UserType = Models.User<{}>;
type UserType = any; // Replace 'any' with the correct type if available

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  async function login(email: string, password: string) {
    await account.createEmailPasswordSession(email, password);
    setLoggedInUser(await account.get());
  }

  return (
    <div>
      <p>
        {loggedInUser ? `Logged in as ${loggedInUser.name ?? ''}` : 'Not logged in'}
      </p>

      <form>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />

        <button type="button" onClick={() => login(email, password)}>
          Login
        </button>

        <button
          type="button"
          onClick={async () => {
            await account.create(ID.unique(), email, password, name);
            login(email, password);
          }}
        >
          Register
        </button>

        <button
          type="button"
          onClick={async () => {
            await account.deleteSession('current');
            setLoggedInUser(null);
          }}
        >
          Logout
        </button>
      </form>
    </div>
  );
};

export default App;
