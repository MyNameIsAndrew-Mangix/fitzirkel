import React from 'react';
import { User } from '@nextui-org/react';
import { User as UserModel } from '../models/user';
import './css/miniprofile.css';

interface MiniProfileProps {
    user: UserModel;
}

const MiniProfile: React.FC<MiniProfileProps> = ({ user }) => {
    return (
        <div>
            <User
                className="mini-profile"
                classNames={{ name: 'name', description: 'desc', wrapper: 'wrapper' }}
                name={user.username}
                description={'\n' + user.headline}
                avatarProps={{ src: user.profilePicture, classNames: { img: 'profile-image' } }}
            />
        </div>
    );
};

export default MiniProfile;
