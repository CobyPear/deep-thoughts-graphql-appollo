import React from 'react';
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { QUERY_THOUGHT } from '../utils/queries'
import ReactionList from '../components/ReactionList'

const SingleThought = props => {
  const { id: thoughtId } = useParams()

  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId }
  })

  const thought = data?.thought || {}


  if (loading) {
    return <div className="spinner-border" role='status'></div>
  }
  // console.log(thought)

  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <Link to={`/profile/${thought.username}`}>
            <span style={{ fontWeight: 700 }} className="text-light">
              {thought.username}
            </span>{' '}
          </Link>
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>

      {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
    </div>
  );
};

export default SingleThought;
