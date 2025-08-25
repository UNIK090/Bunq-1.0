import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Folder, MoreVertical, Edit, Trash2, Play, Search, SortAsc, SortDesc } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Playlist } from '../../types';
import toast from 'react-hot-toast';

// Utility for sorting playlists
const sortPlaylists = (playlists: Playlist[], sortKey: string, ascending: boolean) => {
  const sorted = [...playlists].sort((a, b) => {
    if (sortKey === 'name') {
      return ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortKey === 'date') {
      return ascending
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });
  return sorted;
};

const ITEMS_PER_PAGE = 6;

const Playlists: React.FC = () => {
  const navigate = useNavigate();
  const { playlists, addPlaylist, updatePlaylist, removePlaylist, setCurrentVideo } = useAppStore();

  // States for modal, editing, and form
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Playlist>>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  // States for playlist viewing
  const [showBlur, setShowBlur] = useState(false);
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [viewAllPlaylist, setViewAllPlaylist] = useState<Playlist | null>(null);

  // --- Advanced features ---
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'date'>('date');
  const [sortAscending, setSortAscending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort playlists for display
  const filteredPlaylists = playlists.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPlaylists = sortPlaylists(filteredPlaylists, sortKey, sortAscending);

  // Pagination
  const totalPages = Math.ceil(sortedPlaylists.length / ITEMS_PER_PAGE);
  const pagedPlaylists = sortedPlaylists.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers for playlist creating/editing
  const handleCreatePlaylist = () => {
    setFormData({ name: '', description: '' });
    setIsEditing(false);
    setEditingPlaylistId(null);
    setShowModal(true);
  };

  const handleEditPlaylist = (playlist: Playlist) => {
    setFormData({
      name: playlist.name,
      description: playlist.description,
    });
    setIsEditing(true);
    setEditingPlaylistId(playlist.id);
    setShowModal(true);
  };

  const handleDeletePlaylist = async (playlist: Playlist) => {
    try {
      // Custom confirmation modal could be used here instead of confirm
      if (
        window.confirm(
          `Are you sure you want to delete "${playlist.name}"? This action cannot be undone.`
        )
      ) {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 500)); // Simulate async
        removePlaylist(playlist.id);
        toast.success('Playlist deleted');
        setLoading(false);
      }
    } catch {
      toast.error('Failed to delete playlist');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name?.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }
    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 500)); // Simulate async
      if (isEditing && editingPlaylistId) {
        updatePlaylist(editingPlaylistId, formData);
        toast.success('Playlist updated successfully');
      } else {
        const newPlaylist: Playlist = {
          id: crypto.randomUUID(),
          name: formData.name,
          description: formData.description || '',
          videos: [],
          createdAt: new Date().toISOString(),
        };
        addPlaylist(newPlaylist);
        toast.success('Playlist created successfully');
      }
      setShowModal(false);
    } catch {
      toast.error('Failed to save playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchVideo = (playlist: Playlist, videoIndex: number) => {
    if (videoIndex >= 0 && videoIndex < playlist.videos.length) {
      setCurrentVideo(playlist.videos[videoIndex]);
      setShowBlur(true);
      navigate('/player');
    }
  };

  const openViewAllModal = (playlist: Playlist) => {
    setViewAllPlaylist(playlist);
    setShowViewAllModal(true);
  };

  const closeViewAllModal = () => {
    setShowViewAllModal(false);
    setViewAllPlaylist(null);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Sorting toggle
  const toggleSort = (key: 'name' | 'date') => {
    if (key === sortKey) {
      setSortAscending(!sortAscending);
    } else {
      setSortKey(key);
      setSortAscending(true);
    }
  };

  return (
    <>
      {showBlur && <div className="background-blur"></div>}

      <div className={`space-y-6 ${showBlur ? 'no-blur' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold whitespace-nowrap">My Learning Playlists</h1>
          <div className="flex gap-2 flex-wrap items-center w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex items-center w-full sm:w-auto">
              <Search className="absolute left-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search playlists..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-7 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm w-full sm:w-64"
                aria-label="Search playlists"
              />
            </div>

            {/* Sorting buttons */}
            <button
              onClick={() => toggleSort('name')}
              aria-label="Sort by name"
              className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Name {sortKey === 'name' && (sortAscending ? <SortAsc className="ml-1" /> : <SortDesc className="ml-1" />)}
            </button>
            <button
              onClick={() => toggleSort('date')}
              aria-label="Sort by creation date"
              className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Date {sortKey === 'date' && (sortAscending ? <SortAsc className="ml-1" /> : <SortDesc className="ml-1" />)}
            </button>

            {/* New playlist */}
            <button
              onClick={handleCreatePlaylist}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-70"
              aria-disabled={loading}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Playlist
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-6">
            <div className="loader border-indigo-600"></div> {/* Add your CSS spinner */}
            <p className="text-indigo-600 mt-2">Processing...</p>
          </div>
        )}

        {!loading && pagedPlaylists.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <Folder className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-xl font-medium mb-2">No playlists found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Use the search above or create a new playlist to start organizing your learning videos.
            </p>
            <button
              onClick={handleCreatePlaylist}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Create a Playlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onEdit={() => handleEditPlaylist(playlist)}
                onDelete={() => handleDeletePlaylist(playlist)}
                onWatchVideo={handleWatchVideo}
                onViewAll={() => openViewAllModal(playlist)}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
              aria-label="Previous page"
            >
              &larr;
            </button>
            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-2 rounded-md ${
                    page === currentPage
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
              aria-label="Next page"
            >
              &rarr;
            </button>
          </div>
        )}

        {/* Modals */}
        {showModal && (
          <PlaylistModal
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            onCancel={() => setShowModal(false)}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}

        {showViewAllModal && viewAllPlaylist && (
          <ViewAllVideosModal
            playlist={viewAllPlaylist}
            onClose={closeViewAllModal}
            onWatchVideo={handleWatchVideo}
          />
        )}
      </div>
    </>
  );
};

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit: () => void;
  onDelete: () => void;
  onWatchVideo: (playlist: Playlist, videoIndex: number) => void;
  onViewAll: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  onEdit,
  onDelete,
  onWatchVideo,
  onViewAll,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const thumbnails = playlist.videos.slice(0, 4).map((video) => video.thumbnail);
  const hasMoreThan4Videos = playlist.videos.length > 4;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Thumbnail grid */}
        <div className="h-40 grid grid-cols-2 grid-rows-2 gap-0.5 bg-gray-200 dark:bg-gray-700 relative">
          {thumbnails.map((thumbnail, index) => (
            <div
              key={index}
              className="overflow-hidden cursor-pointer"
              onClick={() => onWatchVideo(playlist, index)}
            >
              <img
                src={thumbnail}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
          {Array.from({ length: Math.max(0, 4 - thumbnails.length) }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="bg-gray-100 dark:bg-gray-600 flex items-center justify-center"
            >
              <Folder className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
          ))}
          {hasMoreThan4Videos && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={onViewAll}
                className="px-3 py-1.5 bg-white text-gray-800 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                View All {playlist.videos.length} Videos
              </button>
            </div>
          )}
        </div>

        {/* Playlist info */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{playlist.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {playlist.videos.length} {playlist.videos.length === 1 ? 'video' : 'videos'}
              </p>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border dark:border-gray-700">
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Playlist
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Playlist
                  </button>
                </div>
              )}
            </div>
          </div>

          {playlist.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
              {playlist.description}
            </p>
          )}

          {playlist.videos.length > 0 && (
            <button
              onClick={() => onWatchVideo(playlist, 0)}
              className="flex items-center mt-4 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-sm w-full justify-center"
            >
              <Play className="h-4 w-4 mr-1.5" />
              Watch
            </button>
          )}

          {hasMoreThan4Videos && (
            <button
              onClick={onViewAll}
              className="flex items-center mt-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm w-full justify-center"
            >
              View All Videos
            </button>
          )}
        </div>
      </div>
    </>
  );
};

interface PlaylistModalProps {
  formData: Partial<Playlist>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Playlist>>>;
  isEditing: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  loading: boolean;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({
  formData,
  setFormData,
  isEditing,
  onCancel,
  onSubmit,
  loading,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus inside modal for accessibility
  useEffect(() => {
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, input, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements ? focusableElements[0] : null;
    const lastElement = focusableElements ? focusableElements[focusableElements.length - 1] : null;

    const handleTab = (e: KeyboardEvent) => {
      if (!modalRef.current) return;
      if (e.key !== 'Tab') return;

      const activeElement = document.activeElement;
      if (e.shiftKey) {
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTab);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full"
      >
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold">
            {isEditing ? 'Edit Playlist' : 'Create New Playlist'}
          </h2>
        </div>
        <div className="p-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Playlist Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 mb-4 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            placeholder="e.g., JavaScript Fundamentals"
            disabled={loading}
          />
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description (optional)
          </label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 min-h-[100px]"
            placeholder="What is this playlist about?"
            disabled={loading}
          />
        </div>
        <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Playlist'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ViewAllVideosModalProps {
  playlist: Playlist;
  onClose: () => void;
  onWatchVideo: (playlist: Playlist, videoIndex: number) => void;
}
const ViewAllVideosModal: React.FC<ViewAllVideosModalProps> = ({
  playlist,
  onClose,
  onWatchVideo,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus for accessibility - similar to PlaylistModal

  useEffect(() => {
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, input, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements ? focusableElements[0] : null;
    const lastElement = focusableElements ? focusableElements[focusableElements.length - 1] : null;

    const handleTab = (e: KeyboardEvent) => {
      if (!modalRef.current) return;
      if (e.key !== 'Tab') return;

      const activeElement = document.activeElement;
      if (e.shiftKey) {
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTab);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold">All Videos in {playlist.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-4">
          {playlist.videos.map((video, index) => (
            <div
              key={video.id}
              className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-16 w-16 object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {video.channelTitle}
                </p>
                {video.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {video.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  onWatchVideo(playlist, index);
                  onClose();
                }}
                className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 transition-colors flex-shrink-0"
              >
                Watch
              </button>
            </div>
          ))}
        </div>
        <div className="p-4 border-t dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Playlists;
