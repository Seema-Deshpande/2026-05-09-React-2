import { useEffect, useState } from 'react';
import { fetchCommentsForThread } from '../../services/commentService';
import CommentList from '../../components/Comment/CommentList';
import CommentForm from '../../components/Comment/CommentForm';
import ThreadCard from '../../components/ThreadList/ThreadCard';
import { Container, Card } from 'react-bootstrap';
import './ThreadPage.css';

export default function ThreadPage({ thread, goBack }) {
  const [threadComments, setThreadComments] = useState([]);

  useEffect(() => {
    fetchCommentsForThread(thread._id).then(setThreadComments);
  }, [thread._id]);

  function upvote(commentId) {
    const newComments = threadComments.map(comment => {
      const alreadyUpvoted = comment.upvotedBy.includes('currentUserId');
      if (alreadyUpvoted) {
        const newCommemnt = {
          ...comment,
          upvotedBy: comment.upvotedBy.filter(id => id !== 'currentUserId'),
          votecount: comment.voteCount - 1,
        };
        return newCommemnt;
      }
      if (comment._id === commentId) {
        return {
          ...comment,
          upvotedBy: [...comment.upvotedBy, 'currentUserId'],
          voteCount: comment.voteCount + 1,
        };
      }
      return comment;
    });
    setThreadComments(newComments);
  }

  return (
    <Container className="thread-container">
      <ThreadCard thread={thread} goBack={goBack} />
      <CommentForm />
      <CommentList comments={threadComments} upvote={upvote} />
    </Container>
  );
}
