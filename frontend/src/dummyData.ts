import { User } from './models/user';

export const dummyUsers: User[] = [
    {
        _id: '1',
        profilePicture:
            'https://static01.nyt.com/images/2016/09/28/us/28xp-pepefrog/28xp-pepefrog-articleInline.jpg?quality=75&auto=webp&disable=upscale',
        username: 'john_doe',
        headline:
            'Web Developer, prime shitposter, etc etc Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        twitter: '@john_doe',
        email: 'john.doe@example.com',
    },
    {
        _id: '2',
        profilePicture: '',
        username: 'jane_smith',
        headline: 'UX Designer',
        twitter: '@jane_smith',
        email: 'jane.smith@example.com',
    },
    // Add more dummy users as needed
];
