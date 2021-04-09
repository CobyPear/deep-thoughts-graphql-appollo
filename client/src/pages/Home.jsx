import React from 'react';
import { useQuery } from '@apollo/react-hooks'
import { QUERY_THOUGHTS } from '../utils/queries'

import ThoughtList from '../components/ThoughtList'

const Home = () => {
  const { loading, data } = useQuery(QUERY_THOUGHTS)
  const thoughts = data?.thoughts || []
  // console.log(thoughts)

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
          {
            loading ? (
            <div className="spinner-border" role='status'>
              {/* <span class="sr-only">Loading...</span> */}
            </div>
            ) : (
              <ThoughtList thoughts={thoughts} title="Thinking of..." />
            )
          }
        </div>
      </div>
    </main>
  );
};

export default Home;
