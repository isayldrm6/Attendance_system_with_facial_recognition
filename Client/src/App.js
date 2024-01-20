import { useState } from "react";
import HomePage from "./Compenents/HomePage/HomePage";
import LoginForm from "./Compenents/LoginForm/LoginForm";

function App() {
  const [isLoggin, setIsLoggin] = useState(false);
  return (
    <div>
      {isLoggin ? <HomePage /> : <LoginForm setIsLoggin={setIsLoggin} />}:
    </div>
  );
}

export default App;
