import { RecoilRoot } from "recoil";
import "./App.css";
import Chat from "./Components/Chat";
import Header from "./Components/Header";

function App() {
  return (
    <>
      <RecoilRoot>
        <Header />
        <Chat />
      </RecoilRoot>
    </>
  );
}

export default App;
