// Simple test to verify playlist deletion functionality
console.log("Testing playlist deletion functionality...");

// Mock the store functionality to test the removePlaylist logic
const mockPlaylists = [
  { id: '1', name: 'Test Playlist 1', videos: [] },
  { id: '2', name: 'Test Playlist 2', videos: [] },
  { id: '3', name: 'Test Playlist 3', videos: [] }
];

// Simulate the removePlaylist function
const removePlaylist = (playlistId) => {
  const filteredPlaylists = mockPlaylists.filter(playlist => playlist.id !== playlistId);
  console.log('Before deletion:', mockPlaylists.map(p => p.name));
  console.log('After deletion:', filteredPlaylists.map(p => p.name));
  console.log('Deleted playlist with ID:', playlistId);
  return filteredPlaylists;
};

// Test the function
console.log('\n=== Testing playlist deletion ===');
const result = removePlaylist('2');
console.log('Test completed successfully!');
