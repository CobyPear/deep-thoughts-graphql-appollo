import React from 'react';
import { useQuery } from '@apollo/react-hooks'
import { QUERY_THOUGHTS } from '../utils/queries'

import ThoughtList from '../components/ThoughtList'

const Home = () => {
  const { loading, data } = useQuery(QUERY_THOUGHTS)

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
          <ThoughtList thoughts={data.thoughts} title="Thinking of..." />
        </div>
      </div>
    </main>
  );
};

export default Home;
