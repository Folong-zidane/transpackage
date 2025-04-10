import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, User, Send, Check, ShoppingBag, ChevronDown, Clock, Video, ShoppingCart, UserCheck } from 'lucide-react';

const AffiliateFeed = ({ posts }) => {
  const [likedPosts, setLikedPosts] = useState({});
  const [newComments, setNewComments] = useState({});
  const [comments, setComments] = useState({});
  const [followedAffiliates, setFollowedAffiliates] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  
  // Gérer les likes
  const handleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };
  
  // Gérer les abonnements
  const toggleFollow = (affiliateId) => {
    setFollowedAffiliates(prev => ({
      ...prev,
      [affiliateId]: !prev[affiliateId]
    }));
  };
  
  // Gérer la visibilité des commentaires
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };
  
  // Gérer l'expansion du texte du post
  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };
  
  // Gérer les nouveaux commentaires
  const handleCommentChange = (postId, text) => {
    setNewComments(prev => ({
      ...prev,
      [postId]: text
    }));
  };
  
  // Soumettre un nouveau commentaire
  const submitComment = (postId) => {
    if (!newComments[postId]?.trim()) return;
    
    const newCommentObj = {
      id: Date.now(),
      username: 'Vous',
      text: newComments[postId],
      timestamp: new Date(),
      formattedTime: 'À l\'instant'
    };
    
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newCommentObj]
    }));
    
    // Réinitialiser le champ de saisie
    setNewComments(prev => ({
      ...prev,
      [postId]: ''
    }));
  };

  // Mettre à jour les timestamps des commentaires
  useEffect(() => {
    const interval = setInterval(() => {
      setComments(prevComments => {
        const updatedComments = { ...prevComments };
        
        // Parcourir tous les posts avec des commentaires
        Object.keys(updatedComments).forEach(postId => {
          // Mettre à jour le timestamp formaté pour chaque commentaire
          updatedComments[postId] = updatedComments[postId].map(comment => {
            if (comment.timestamp) {
              const minutesAgo = Math.floor((new Date() - new Date(comment.timestamp)) / 60000);
              let formattedTime;
              
              if (minutesAgo < 1) {
                formattedTime = 'À l\'instant';
              } else if (minutesAgo === 1) {
                formattedTime = 'Il y a 1 minute';
              } else if (minutesAgo < 60) {
                formattedTime = `Il y a ${minutesAgo} minutes`;
              } else if (minutesAgo < 120) {
                formattedTime = 'Il y a 1 heure';
              } else {
                formattedTime = `Il y a ${Math.floor(minutesAgo / 60)} heures`;
              }
              
              return { ...comment, formattedTime };
            }
            return comment;
          });
        });
        
        return updatedComments;
      });
    }, 60000); // Mettre à jour chaque minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-4 px-3">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <Clock size={25} className="mr-2 text-indigo-600" />
        Fil d'actualité
      </h2>
      
      {/* Grille de posts avec espacement augmenté */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-100 rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow text-sm">
            {/* En-tête du post - plus compact */}
            <div className="p-2 flex items-center justify-between border-b border-gray-500">
              <div className="flex items-center space-x-1.5">
                <img 
                  src={post.affiliate.avatar} 
                  alt={post.affiliate.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-50"
                />
                <div>
                  <h3 className="font-bold text-gray-900 text-xs">{post.affiliate.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock size={10} className="mr-0.5" />
                    {post.timestamp}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => toggleFollow(post.affiliate.id)}
                className={`text-xs font-medium flex items-center ${
                  followedAffiliates[post.affiliate.id] 
                    ? 'text-green-500' 
                    : 'text-indigo-500 hover:text-indigo-600'
                }`}
              >
                {followedAffiliates[post.affiliate.id] ? (
                  <>
                    <Check size={12} className="mr-0.5" />
                    Abonné
                  </>
                ) : (
                  'Suivre'
                )}
              </button>
            </div>
            
            {/* Commentaire avec voir plus */}
            <div className="px-2 py-1.5">
              <p className={`text-black text-xs ${expandedPosts[post.id] ? '' : 'line-clamp-2'}`}>
                {post.comment}
              </p>
              {post.comment.length > 100 && (
                <button 
                  onClick={() => togglePostExpansion(post.id)}
                  className="text-indigo-500 hover:text-indigo-700 text-xs flex items-center mt-0.5"
                >
                  {expandedPosts[post.id] ? 'Voir moins' : 'Voir plus...'}
                  <ChevronDown size={10} className={`ml-0.5 transition-transform ${expandedPosts[post.id] ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
            
            {/* Média - supporte image et vidéo */}
            <div className="relative">
              {post.mediaType === 'video' ? (
                <video 
                  controls 
                  className="w-full h-80 object-cover"
                >
                  <source src={post.media} type="video/mp4" />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              ) : (
                <img 
                  src={post.media} 
                  alt="Post de l'affilié"
                  className="w-full h-80 object-cover" 
                />
              )}
            </div>
            
            {/* Actions - plus compact */}
            <div className="px-2 py-1.5 flex justify-between items-center">
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center ${likedPosts[post.id] ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} text-xs`}
                >
                  <Heart size={14} className={likedPosts[post.id] ? 'fill-current' : ''} />
                  <span className="ml-0.5">{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                </button>
                
                <button 
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center text-gray-500 hover:text-gray-700 text-xs"
                >
                  <MessageCircle size={14} />
                  <span className="ml-0.5">{(comments[post.id]?.length || 0) + post.comments}</span>
                </button>
              </div>
              
              <div className="flex space-x-1">
                <a 
                  href={post.productLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-xs bg-indigo-600 text-white py-1 px-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                >
                  <ShoppingCart size={12} className="mr-0.5" />
                  Commander
                </a>
                
                <a 
                  href={`/affiliate-profile?affiliateId=${post.affiliate.id}`} 
                  className="flex items-center text-xs bg-gray-100 text-gray-700 py-1 px-2 rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                  <User size={12} className="mr-0.5" />
                  Profil
                </a>
              </div>
            </div>
            
            {/* Section commentaires - plus compact */}
            <div className="px-2 bg-gray-100 py-1.5 border-t border-gray-100 bg-gray-50">
              <h4 className="text-xs font-medium text-gray-700 mb-1">Commentaires récents</h4>
              
              {/* Affichage limité des commentaires (3 max) */}
              {(() => {
                const allComments = [
                  ...(post.recentComments || []),
                  ...(comments[post.id] || [])
                ];
                
                const displayComments = expandedComments[post.id] 
                  ? allComments 
                  : allComments.slice(0, 3);
                
                return (
                  <>
                    {displayComments.map(comment => (
                      <div key={comment.id} className="mb-1">
                        <div className="flex items-start">
                          <span className="font-medium text-xs mr-1">{comment.username}</span>
                          <p className="text-xs text-gray-700">{comment.text}</p>
                        </div>
                        <p className="text-gray-400 text-xs">{comment.formattedTime || comment.timestamp}</p>
                      </div>
                    ))}
                    
                    {allComments.length > 3 && (
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className="text-indigo-500 hover:text-indigo-700 text-xs flex items-center mt-0.5"
                      >
                        {expandedComments[post.id] ? 'Voir moins' : 'Voir plus...'}
                        <ChevronDown size={10} className={`ml-0.5 transition-transform ${expandedComments[post.id] ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </>
                );
              })()}
              
              {/* Zone de saisie de commentaire intégrée - plus compact */}
              <div className="mt-2 flex">
                <input
                  type="text"
                  value={newComments[post.id] || ''}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-l-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Ajouter un commentaire..."
                />
                <button
                  onClick={() => submitComment(post.id)}
                  disabled={!newComments[post.id]?.trim()}
                  className="bg-indigo-600 text-white px-1.5 py-1 rounded-r-lg hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center justify-center"
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AffiliateFeed;