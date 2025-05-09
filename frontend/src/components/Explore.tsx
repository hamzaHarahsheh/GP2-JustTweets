import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Users, Image as ImageIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';

// Mock data types
interface Trend {
    id: string;
    hashtag: string;
    tweetCount: number;
    category: string;
}

interface SuggestedUser {
    id: string;
    username: string;
    name: string;
    avatar: string;
    bio: string;
}

interface TopTweet {
    id: string;
    username: string;
    content: string;
    likes: number;
    retweets: number;
    timestamp: string;
    media?: string;
}

// Mock data
const mockTrends: Trend[] = [
    { id: '1', hashtag: 'ReactJS', tweetCount: 12500, category: 'Technology' },
    { id: '2', hashtag: 'OpenAI', tweetCount: 8900, category: 'Technology' },
    { id: '3', hashtag: 'WebDev', tweetCount: 5600, category: 'Technology' },
    { id: '4', hashtag: 'AI', tweetCount: 23400, category: 'Technology' },
    { id: '5', hashtag: 'Coding', tweetCount: 12300, category: 'Technology' },
];

const mockSuggestedUsers: SuggestedUser[] = [
    {
        id: '1',
        username: 'johndoe',
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        bio: 'Software Engineer | React Enthusiast',
    },
    {
        id: '2',
        username: 'janedoe',
        name: 'Jane Doe',
        avatar: 'https://i.pravatar.cc/150?img=2',
        bio: 'UI/UX Designer | Creative Mind',
    },
    {
        id: '3',
        username: 'techguru',
        name: 'Tech Guru',
        avatar: 'https://i.pravatar.cc/150?img=3',
        bio: 'Tech Blogger | AI Researcher',
    },
];

const mockTopTweets: TopTweet[] = [
    {
        id: '1',
        username: 'johndoe',
        content: 'Just launched my new React project! Check it out 🚀 #ReactJS #WebDev',
        likes: 1234,
        retweets: 567,
        timestamp: '2h',
        media: 'https://picsum.photos/400/300',
    },
    {
        id: '2',
        username: 'janedoe',
        content: 'The future of AI is here! Amazing developments in the field 🤖 #AI #Technology',
        likes: 890,
        retweets: 234,
        timestamp: '3h',
    },
    {
        id: '3',
        username: 'techguru',
        content: 'New blog post about the latest web development trends. Link in bio! #WebDev #Coding',
        likes: 567,
        retweets: 123,
        timestamp: '4h',
    },
];

const categories = ['All', 'Technology', 'Sports', 'Entertainment', 'News'];

const Explore: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.trim().length > 0) {
                setIsSearching(true);
                try {
                    const results = await userService.searchUsers(searchQuery);
                    setSearchResults(results);
                } catch (error) {
                    console.error('Failed to search users:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        };

        const debounceTimer = setTimeout(searchUsers, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleFollow = async (userId: string) => {
        try {
            if (followingUsers.has(userId)) {
                const res: any = await userService.unfollowUser(userId);
                setFollowingUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(userId);
                    return newSet;
                });
                if (res && typeof res.followersCount === 'number') {
                    setSearchResults(prev => prev.map(u => u.id === userId ? { ...u, followers: res.followersCount } : u));
                }
            } else {
                const res: any = await userService.followUser(userId);
                setFollowingUsers(prev => new Set(prev).add(userId));
                if (res && typeof res.followersCount === 'number') {
                    setSearchResults(prev => prev.map(u => u.id === userId ? { ...u, followers: res.followersCount } : u));
                }
            }
        } catch (error) {
            console.error('Failed to follow/unfollow user:', error);
        }
    };

    const filteredTrends = mockTrends.filter(
        trend => activeCategory === 'All' || trend.category === activeCategory
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Search Bar */}
            <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>

            {/* Search Results */}
            {searchQuery && (
                <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-4">Search Results</h2>
                    {isSearching ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="space-y-4">
                            {searchResults.map((result) => (
                                <div key={result.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={result.profilePicture?.data 
                                                ? `data:${result.profilePicture.type};base64,${result.profilePicture.data}`
                                                : `https://i.pravatar.cc/150?u=${result.username}`}
                                            alt={result.username}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <div className="font-semibold">{result.username}</div>
                                            <div className="text-sm text-gray-500">@{result.username}</div>
                                            {result.bio && (
                                                <div className="text-sm text-gray-600 mt-1">{result.bio}</div>
                                            )}
                                        </div>
                                    </div>
                                    {result.id !== user?.id && (
                                        <button
                                            onClick={() => handleFollow(result.id)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                                                ${followingUsers.has(result.id)
                                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                                }`}
                                        >
                                            {followingUsers.has(result.id) ? 'Following' : 'Follow'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            No users found
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Categories */}
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                    ${activeCategory === category
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Trending Topics */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                            <h2 className="text-xl font-bold">Trending Topics</h2>
                        </div>
                        <div className="space-y-4">
                            {filteredTrends.map((trend) => (
                                <div
                                    key={trend.id}
                                    className="p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => navigate(`/search?q=${trend.hashtag}`)}
                                >
                                    <div className="font-semibold text-blue-500">#{trend.hashtag}</div>
                                    <div className="text-sm text-gray-500">{trend.tweetCount.toLocaleString()} tweets</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Tweets */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-4">Top Tweets</h2>
                        <div className="space-y-6">
                            {mockTopTweets.map((tweet) => (
                                <div key={tweet.id} className="border-b border-gray-100 pb-6 last:border-0">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src={`https://i.pravatar.cc/150?u=${tweet.username}`}
                                            alt={tweet.username}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold">{tweet.username}</span>
                                                <span className="text-gray-500">· {tweet.timestamp}</span>
                                            </div>
                                            <p className="mt-1">{tweet.content}</p>
                                            {tweet.media && (
                                                <img
                                                    src={tweet.media}
                                                    alt="Tweet media"
                                                    className="mt-3 rounded-lg max-h-64 object-cover"
                                                />
                                            )}
                                            <div className="flex items-center space-x-6 mt-3 text-gray-500">
                                                <button className="flex items-center space-x-1 hover:text-blue-500">
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    <span>{tweet.likes}</span>
                                                </button>
                                                <button className="flex items-center space-x-1 hover:text-green-500">
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                    </svg>
                                                    <span>{tweet.retweets}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Suggested Users */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <Users className="h-5 w-5 text-blue-500 mr-2" />
                            <h2 className="text-xl font-bold">Suggested Users</h2>
                        </div>
                        <div className="space-y-4">
                            {mockSuggestedUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <div className="font-semibold">{user.name}</div>
                                            <div className="text-sm text-gray-500">@{user.username}</div>
                                        </div>
                                    </div>
                                    <button className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
                                        Follow
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Media Gallery */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <ImageIcon className="h-5 w-5 text-blue-500 mr-2" />
                            <h2 className="text-xl font-bold">Media Gallery</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {mockTopTweets
                                .filter((tweet) => tweet.media)
                                .map((tweet) => (
                                    <img
                                        key={tweet.id}
                                        src={tweet.media}
                                        alt="Tweet media"
                                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explore; 