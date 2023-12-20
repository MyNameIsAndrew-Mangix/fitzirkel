import Header from './components/Header';
import './components/MiniProfile';
import MiniProfile from './components/MiniProfile';
import { dummyUsers } from './dummyData';
import { createContext, useContext } from 'react';

const userContext = createContext(dummyUsers[0]);
function App() {
    return (
        <>
            <Header />
            <MiniProfile user={dummyUsers[0]} />
        </>
    );
}

export default App;
