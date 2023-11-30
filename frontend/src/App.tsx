import Header from './components/Header';
import './components/MiniProfile';
import MiniProfile from './components/MiniProfile';
import { dummyUsers } from './dummyData';

function App() {
    return (
        <>
            <Header />
            <MiniProfile user={dummyUsers[0]} />
        </>
    );
}

export default App;
