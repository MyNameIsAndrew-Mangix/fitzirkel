import { User as UserModel } from '../models/user';
import HeaderNav from './HeaderNav';

interface HeaderProps {
    user: UserModel;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
    return (
        <header>
            <HeaderNav user={user}></HeaderNav>
        </header>
    );
};

export default Header;
