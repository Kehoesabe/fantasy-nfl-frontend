import React, { useState, useEffect } from 'react';
import { ChevronRight, TrendingUp, TrendingDown, Clock, Users, Trophy, Plus, Search } from 'lucide-react';

const FantasyNFLApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [myTeam, setMyTeam] = useState([1, 4, 6]); // Player IDs
  const [players, setPlayers] = useState([]);
  const [playerStats, setPlayerStats] = useState({});
  const [loading, setLoading] = useState(true);

  const API_BASE = 'https://fantasy-nfl-app.vercel.app';

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (myTeam.length > 0) {
      fetchMyTeamStats();
    }
  }, [myTeam]);

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/players`);
      const data = await response.json();
      setPlayers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching players:', error);
      setLoading(false);
    }
  };

  const fetchMyTeamStats = async () => {
    for (const playerId of myTeam) {
      try {
        const response = await fetch(`${API_BASE}/api/player/${playerId}/stats`);
        const data = await response.json();
        setPlayerStats(prev => ({
          ...prev,
          [playerId]: data
        }));
      } catch (error) {
        console.error(`Error fetching stats for player ${playerId}:`, error);
      }
    }
  };

  const addPlayerToTeam = (playerId) => {
    if (myTeam.length < 3 && !myTeam.includes(playerId)) {
      setMyTeam([...myTeam, playerId]);
    }
  };

  const removePlayerFromTeam = (playerId) => {
    setMyTeam(myTeam.filter(id => id !== playerId));
  };

  const getPlayerById = (id) => players.find(p => p.id === id);

  const totalFantasyPoints = myTeam.reduce((total, playerId) => {
    return total + (playerStats[playerId]?.stats?.points || 0);
  }, 0);

  const HomeScreen = () => (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Fantasy NFL</h1>
        <p className="text-gray-600">Real-time player updates with AI insights</p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 mb-6 text-white">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">My Team</h2>
          <Trophy className="h-5 w-5" />
        </div>
        <div className="text-3xl font-bold mb-1">{totalFantasyPoints.toFixed(1)}</div>
        <div className="text-blue-100">Total Fantasy Points</div>
        <div className="flex items-center mt-2">
          <Users className="h-4 w-4 mr-1" />
          <span className="text-sm">{myTeam.length}/3 players</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Latest Updates</h3>
        {myTeam.map(playerId => {
          const player = getPlayerById(playerId);
          const stats = playerStats[playerId];
          
          if (!player || !stats) return null;
          
          return (
            <div key={playerId} className="bg-white rounded-lg border p-4 mb-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{player.name}</h4>
                  <span className="text-sm text-gray-500">{player.position} • {player.team}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{stats.stats.points}</div>
                  <div className="text-xs text-gray-500">pts</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{stats.story}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Updated {new Date(stats.stats.lastUpdate).toLocaleTimeString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => setActiveTab('team')}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
        >
          <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-blue-700">Manage Team</span>
        </button>
        <button 
          onClick={() => setActiveTab('players')}
          className="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
        >
          <Search className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-green-700">Find Players</span>
        </button>
      </div>
    </div>
  );

  const MyTeamScreen = () => (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Team</h1>
        <span className="text-sm text-gray-500">{myTeam.length}/3 players</span>
      </div>

      {myTeam.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No players yet</h3>
          <p className="text-gray-500 mb-4">Add up to 3 players to track their performance</p>
          <button 
            onClick={() => setActiveTab('players')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Browse Players
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myTeam.map(playerId => {
            const player = getPlayerById(playerId);
            const stats = playerStats[playerId];
            
            if (!player) return null;
            
            return (
              <div key={playerId} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{player.name}</h3>
                      <p className="text-sm text-gray-500">{player.position} • {player.team}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removePlayerFromTeam(playerId)}
                    className="text-red-600 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
                
                {stats && (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">Fantasy Points</span>
                      <span className="text-lg font-bold text-blue-600">{stats.stats.points}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{stats.story}</p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const PlayersScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredPlayers = players.filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">All Players</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading players...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPlayers.map(player => (
              <div key={player.id} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{player.name}</h3>
                      <p className="text-sm text-gray-500">{player.position} • {player.team}</p>
                    </div>
                  </div>
                  
                  {myTeam.includes(player.id) ? (
                    <span className="text-green-600 text-sm font-medium">On Team</span>
                  ) : myTeam.length >= 3 ? (
                    <span className="text-gray-400 text-sm">Team Full</span>
                  ) : (
                    <button 
                      onClick={() => addPlayerToTeam(player.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg ${activeTab === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
        >
          <TrendingUp className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('team')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg ${activeTab === 'team' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
        >
          <Users className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">My Team</span>
        </button>
        <button 
          onClick={() => setActiveTab('players')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg ${activeTab === 'players' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
        >
          <Search className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Players</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
      {activeTab === 'home' && <HomeScreen />}
      {activeTab === 'team' && <MyTeamScreen />}
      {activeTab === 'players' && <PlayersScreen />}
      <BottomNav />
    </div>
  );
};

export default FantasyNFLApp;
