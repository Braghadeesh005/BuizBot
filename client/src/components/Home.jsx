import React, { useState, useEffect }  from 'react';
import { Link , NavLink} from 'react-router-dom';
import { logout } from '../api/auth';
import axios from 'axios';
import './Home.css'

function Home() {


  const handleLogout = () => {
    logout().then(() => {
      window.location.href = '/login';
    });
  };




  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    // Fetch businesses data from the API
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/fetch-businesses`);
        if (response.data && response.data.length > 0) {
          setBusinesses(response.data);
        } else {
          // Set temporary data if no data is returned from the server
          setBusinesses([
            {
              business_id: '0000',
              business_name: 'Temporary Business',
              business_type: 'Placeholder',
              script: '<script>/* Placeholder Script */</script>',
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        // Set temporary data if the server is not reachable
        setBusinesses([
          {
            business_id: '0000',
            business_name: 'Temporary Business',
            business_type: 'Placeholder',
            script: '<script>/* Placeholder Script */</script>',
          }
        ]);
      }
    };

    fetchBusinesses();
  }, []);



  return (
  <>
    <div className='Home-nav'>
      <h1 className='heading2'>Buiz.ai</h1>
      <div className='sub-nav'>
      <button><Link to="/profile">Go to Profile</Link></button>
      <button onClick={handleLogout}>Logout</button>
      </div>
    </div>

    
      <h1 className='heading ml-20'>Business Dashboard</h1>
      
     
      <div className="business-cards">
        {businesses.map((business) => (
          <div className="business-card" key={business.business_id}>
            <h2>{business.business_name}</h2>
            <p><strong>Type:</strong> {business.business_type}</p>
            <p><strong>ID:</strong> {business.business_id}</p>
            <p><strong>Embeddings:</strong> {business.script}</p>
          </div>
        ))}
      </div>

     <div>
      <button><NavLink to="/create-bot" className="generate-chatbot-link">
        Generate New Chatbot
      </NavLink></button>
      </div>
    

  </>
  );
}

export default Home;