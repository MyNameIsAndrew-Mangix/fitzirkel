import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from '@nextui-org/react';

const HeaderNav: React.FC = () => {
    return (
        <nav>
            <FontAwesomeIcon icon={faHouse} />
            <Input type="text"></Input>
            <h1>hi</h1>
        </nav>
    );
};

export default HeaderNav;
