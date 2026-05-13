import { useEffect, useState, useRef } from 'react';
import { fetchProductReviews, submitReview, deleteReview } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// ─── Star Display ──────────────────────────────────────────────
function StarDisplay({ rating, size = 16, color = "#f59e0b" }) {
  return (
    <span className="rv-stars-display" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          className={n <= Math.round(rating) ? 'rv-star filled' : 'rv-star'}
          style={{ color: n <= Math.round(rating) ? color : '#d0d0d0' }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

// ─── Interactive Star Selector ─────────────────────────────────
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="rv-star-picker" role="radiogroup" aria-label="Select a rating">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`rv-pick-star ${n <= (hovered || value) ? 'active' : ''}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`Rate ${n} star${n !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── Format Date ───────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

// ─── Review Card (Carousel Version) ───────────────────────────
function ReviewCard({ review, isAdmin, onDelete, onShowMore, onShowMedia }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete review by "${review.name}"? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      await onDelete(review._id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="rv-card-new" onClick={onShowMore} style={{ cursor: 'pointer' }}>
      <div className="rv-card-top">
        <StarDisplay rating={review.rating} size={14} />
        <span className="rv-date-new">{formatDate(review.createdAt)}</span>
      </div>

      <div className="rv-user-info">
        <div className="rv-avatar-new">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.name || 'user'}&mouth=smile,twinkle&eyes=default,happy&eyebrows=default,defaultNatural`}
            alt={review.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="rv-user-details">
          <div className="rv-name-row">
            <span className="rv-reviewer-name-new">{review.name}</span>
            <span className="rv-verified-badge">Verified</span>
          </div>
        </div>
        {isAdmin && (
          <button className="rv-delete-btn-new" onClick={handleDelete} disabled={deleting}>
            {deleting ? '...' : '🗑'}
          </button>
        )}
      </div>

      <div className="rv-card-body">
        {review.title && <h4 className="rv-review-title">{review.title}</h4>}
        <p className="rv-comment-new">{review.comment}</p>
        
        {review.media && review.media.length > 0 && (
          <div className={`rv-media-grid ${review.media.length > 1 ? 'multiple' : ''}`}>
            {review.media.map((item, idx) => (
              <div 
                key={idx} 
                className="rv-media-item"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowMedia(item);
                }}
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt={`Review ${idx}`} className="rv-review-img" />
                ) : (
                  <div className="rv-video-placeholder">
                    <video src={item.url} className="rv-review-video" />
                    <div className="rv-play-icon">▶</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

// ─── Review Row (Modal Version) ───────────────────────────────
function ReviewRow({ review, isAdmin, onDelete, onShowMedia }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete review by "${review.name}"? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      await onDelete(review._id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="rv-row">
      <div className="rv-row-top">
        <StarDisplay rating={review.rating} size={14} />
        <span className="rv-date-row">{formatDate(review.createdAt)}</span>
      </div>

      <div className="rv-row-user">
        <div className="rv-avatar-new">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.name || 'user'}&mouth=smile,twinkle&eyes=default,happy&eyebrows=default,defaultNatural`}
            alt={review.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="rv-row-meta">
          <span className="rv-reviewer-name-new">{review.name}</span>
          <span className="rv-verified-badge">Verified</span>
        </div>
        {isAdmin && (
          <button className="rv-delete-btn-row" onClick={handleDelete} disabled={deleting}>
            {deleting ? '...' : '🗑'}
          </button>
        )}
      </div>

      <div className="rv-row-body">
        {review.title && <h4 className="rv-review-title">{review.title}</h4>}
        <p className="rv-comment-row">{review.comment}</p>
        
        {review.media && review.media.length > 0 && (
          <div className={`rv-media-grid ${review.media.length > 1 ? 'multiple' : ''}`}>
            {review.media.map((item, idx) => (
              <div 
                key={idx} 
                className="rv-media-item"
                onClick={() => onShowMedia(item)}
                style={{ cursor: 'zoom-in' }}
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt={`Review ${idx}`} className="rv-review-img" />
                ) : (
                  <div className="rv-video-placeholder">
                    <video src={item.url} className="rv-review-video" />
                    <div className="rv-play-icon">▶</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Rating Bar ───────────────────────────────────────────────
function RatingBar({ star, count, total }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="rv-bar-row">
      <div className="rv-bar-stars">
        {[1, 2, 3, 4, 5].map(n => (
          <span key={n} className={`rv-bar-star ${n <= star ? 'filled' : ''}`}>★</span>
        ))}
      </div>
      <div className="rv-bar-bg">
        <div className="rv-bar-fill" style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="rv-bar-count">{count}</span>
    </div>
  );
}

// ─── Review Section ────────────────────────────────────────────
export default function ReviewSection({ productId }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  const [stats, setStats] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [formVisible, setFormVisible] = useState(false);

  // All Reviews Modal State
  const [allReviewsVisible, setAllReviewsVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [sortBy, setSortBy] = useState('highest'); // highest, lowest, newest

  const carouselRef = useRef(null);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchProductReviews(productId);
      if (data.success) {
        setReviews(data.reviews);
        calculateStats(data.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (revs) => {
    const newStats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    revs.forEach(r => {
      newStats[r.rating] = (newStats[r.rating] || 0) + 1;
      sum += r.rating;
    });
    setStats(newStats);
    setAvgRating(revs.length > 0 ? sum / revs.length : 0);
  };

  useEffect(() => {
    if (productId) loadReviews();
  }, [productId]);

  const handleCommentChange = (e) => {
    const val = e.target.value;
    if (val.length <= 100) {
      setComment(val);
    } else {
      setComment(val.substring(0, 100));
    }
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newMediaFiles = [...mediaFiles];
    
    for (const file of files) {
      if (newMediaFiles.length >= 2) {
        setErrorMsg('You can only upload a maximum of 2 files.');
        break;
      }

      // Check type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setErrorMsg('Please upload only images or videos.');
        continue;
      }

      // Check size (45MB)
      if (file.size > 45 * 1024 * 1024) {
        setErrorMsg('Each file must be less than 45MB.');
        continue;
      }

      newMediaFiles.push(file);
    }

    setMediaFiles(newMediaFiles);
    e.target.value = null; // Reset input to allow re-selection of same file
  };

  const removeFile = (index) => {
    const newMediaFiles = [...mediaFiles];
    newMediaFiles.splice(index, 1);
    setMediaFiles(newMediaFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) { setErrorMsg('Please enter your name.'); return; }
    if (rating < 1) { setErrorMsg('Please select a rating.'); return; }
    if (!comment.trim()) { setErrorMsg('Please write a comment.'); return; }

    try {
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('rating', rating);
      formData.append('comment', comment.trim());
      
      mediaFiles.forEach(file => {
        formData.append('media', file);
      });

      const data = await submitReview(productId, formData);
      if (data.success) {
        const updatedReviews = [data.review, ...reviews];
        setReviews(updatedReviews);
        calculateStats(updatedReviews);
        setName(''); setRating(0); setComment(''); setMediaFiles([]);
        setSubmitStatus('success');
        setFormVisible(false);
        setTimeout(() => setSubmitStatus(null), 4000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Your session has expired. Please log in again to delete reviews.');
      return;
    }

    try {
      await deleteReview(productId, reviewId);
      const updated = reviews.filter(r => r._id !== reviewId);
      setReviews(updated);
      calculateStats(updated);
    } catch (err) {
      console.error('Delete review error:', err);
      alert(err.message || 'Delete failed.');
    }
  };

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const getSortedReviews = () => {
    let sorted = [...reviews];
    if (sortBy === 'highest') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      sorted.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return sorted;
  };

  return (
    <section className="rv-new-section">
      <div className="rv-header-container">
        <div className="rv-badge-plant">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
          Customer Reviews
        </div>
        <h2 className="rv-new-heading">Real Feedback from <span className="rv-text-green">Organic</span> Growth</h2>
        <div className="rv-subtitle-wrap">
          <div className="rv-line-leaf"></div>
          <p className="rv-subtitle-new">Pure experiences shared by our community</p>
          <div className="rv-line-leaf"></div>
        </div>
      </div>

      {/* ── Carousel ── */}
      <div className="rv-carousel-container">
        {reviews.length > 0 && (
          <button className="rv-arrow left" onClick={() => scroll('left')}>❮</button>
        )}
        <div className="rv-carousel" ref={carouselRef}>
          {reviews.map(r => (
            <ReviewCard
              key={r._id}
              review={r}
              isAdmin={isAdmin}
              onDelete={handleDelete}
              onShowMore={() => setAllReviewsVisible(true)}
              onShowMedia={setSelectedMedia}
            />
          ))}
          {reviews.length === 0 && !loading && (
            <div className="rv-no-reviews">No reviews yet.</div>
          )}
        </div>
        {reviews.length > 0 && (
          <button className="rv-arrow right" onClick={() => scroll('right')}>❯</button>
        )}
      </div>

      <div className="rv-read-more-wrap">
        <button className="rv-read-more-btn" onClick={() => setAllReviewsVisible(true)}>Read More Reviews</button>
      </div>

      <hr className="rv-hr" />

      {/* ── Summary & Breakdown ── */}
      <div className="rv-summary-new">
        <div className="rv-summary-left">
          <div className="rv-avg-row">
            <div className="rv-stars-and-rating">
              <StarDisplay rating={avgRating} size={28} />
              <span className="rv-avg-text">{avgRating.toFixed(2)} out of 5</span>
            </div>
          </div>
          <div className="rv-based-on">
            Based on {reviews.length} reviews
            <span className="rv-verified-check">✓</span>
          </div>
        </div>

        <div className="rv-summary-mid">
          {[5, 4, 3, 2, 1].map(s => (
            <RatingBar key={s} star={s} count={stats[s]} total={reviews.length} />
          ))}
        </div>

        <div className="rv-summary-right-new">
          <button className="rv-write-btn-new" onClick={() => setFormVisible(true)}>Write a review</button>
        </div>
      </div>

      {/* ── All Reviews Modal ── */}
      {allReviewsVisible && (
        <div className="rv-modal-overlay">
          <div className="rv-all-reviews-modal">
            <div className="rv-all-header">
              <div className="rv-sort-group">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rv-sort-select">
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
              <button type="button" className="rv-close-modal-large" onClick={() => setAllReviewsVisible(false)}>×</button>
            </div>

            <div className="rv-all-list">
              {getSortedReviews().map(r => (
                <ReviewRow 
                  key={r._id} 
                  review={r} 
                  isAdmin={isAdmin} 
                  onDelete={handleDelete} 
                  onShowMedia={setSelectedMedia}
                />
              ))}
              {reviews.length === 0 && <p className="rv-empty-list">No reviews to show.</p>}
            </div>
          </div>
        </div>
      )}

      {/* ── Submission Form Modal ── */}
      {formVisible && (
        <div className="rv-modal-overlay">
          <form className="rv-modal-form" onSubmit={handleSubmit}>
            <div className="rv-modal-header">
              <h3>Write a Review</h3>
              <button type="button" className="rv-close-modal" onClick={() => setFormVisible(false)}>×</button>
            </div>

            <div className="rv-input-group">
              <label>Name</label>
              <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="rv-star-selector-wrap">
              <label>Rating:</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            <div className="rv-input-group">
              <div className="rv-label-row">
                <label>Comment</label>
                <span className={`rv-word-count ${comment.length >= 100 ? 'limit' : ''}`}>
                  {comment.length}/100 letters
                </span>
              </div>
              <textarea
                placeholder="Your Review"
                value={comment}
                onChange={handleCommentChange}
                rows={4}
              ></textarea>
            </div>

            <div className="rv-input-group">
              <label>Photos / Videos (Max 2 • Max 45MB each)</label>
              <div className="rv-upload-area">
                <div className="rv-upload-flex">
                  {mediaFiles.map((file, idx) => (
                    <div key={idx} className="rv-preview-item">
                      <div className="rv-preview-thumb">
                        {file.type.startsWith('image/') ? (
                          <img src={URL.createObjectURL(file)} alt="Preview" />
                        ) : (
                          <div className="rv-video-icon">🎥</div>
                        )}
                      </div>
                      <button type="button" className="rv-remove-file" onClick={() => removeFile(idx)}>×</button>
                    </div>
                  ))}

                  {mediaFiles.length < 2 && (
                    <div className="rv-file-input-wrapper">
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        onChange={handleFileChange}
                        className="rv-file-input-hidden"
                        id="rv-file-upload"
                      />
                      <label htmlFor="rv-file-upload" className="rv-file-label-btn">
                        <span>+</span>
                        <p>Add Media</p>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {errorMsg && <p className="rv-form-error">{errorMsg}</p>}

            <div className="rv-modal-actions">
              <button type="button" className="rv-modal-cancel" onClick={() => setFormVisible(false)}>Cancel</button>
              <button type="submit" className="rv-modal-submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {submitStatus === 'success' && <div className="rv-toast-success">Review submitted successfully!</div>}

      {/* ── Lightbox Overlay ── */}
      {selectedMedia && (
        <div className="rv-lightbox-overlay" onClick={() => setSelectedMedia(null)}>
          <button className="rv-lightbox-close" onClick={() => setSelectedMedia(null)}>×</button>
          <div className="rv-lightbox-content" onClick={e => e.stopPropagation()}>
            {selectedMedia.type === 'image' ? (
              <img src={selectedMedia.url} alt="Full Review" />
            ) : (
              <video src={selectedMedia.url} controls autoPlay />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
