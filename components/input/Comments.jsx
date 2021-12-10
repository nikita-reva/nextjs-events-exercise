import { useContext, useEffect, useState } from 'react';

import CommentList from './CommentList';
import NewComment from './NewComment';
import classes from './Comments.module.css';
import NotificationContext from '../../store/notification-context';

function Comments(props) {
  const { eventId } = props;

  const [showComments, setShowComments] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const notificationCtx = useContext(NotificationContext);

  useEffect(() => {
    if (showComments) {
      setCommentsLoading(true);
      fetch(`/api/comments/${eventId}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }

          return response.json().then((data) => {
            throw new Error(data.message || 'Something went wrong');
          });
        })
        .then((data) => {
          setComments(data.comments);
          setCommentsLoading(false);
        })
        .catch((error) =>
          notificationCtx.showNotification({
            title: 'Error...',
            message: error.message || 'Something went wrong',
            status: 'error',
          })
        );
    }
  }, [showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    notificationCtx.showNotification({
      title: 'Adding comment...',
      message: 'Comment is being added',
      status: 'pending',
    });

    const reqBody = { comment: commentData };
    fetch(`/api/comments/${eventId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((data) => {
          throw new Error(data.message || 'Something went wrong');
        });
      })
      .then((data) =>
        notificationCtx.showNotification({
          title: 'Success...',
          message: 'Your comment has been added',
          status: 'success',
        })
      )
      .catch((error) =>
        notificationCtx.showNotification({
          title: 'Error...',
          message: error.message || 'Something went wrong',
          status: 'error',
        })
      );
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && commentsLoading && <p>Loading...</p>}
      {showComments && !commentsLoading && <CommentList comments={comments} />}
    </section>
  );
}

export default Comments;
