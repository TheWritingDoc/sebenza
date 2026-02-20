import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="hero">
      <h1>Trade Skills. No Money Needed.</h1>
      <p>Join GShop - where unemployed and underemployed people exchange skills using credits instead of cash.</p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <Link to="/register" className="btn btn-primary" style={{ fontSize: '18px', padding: '15px 30px' }}>
          Get Started
        </Link>
        <Link to="/login" className="btn btn-secondary" style={{ fontSize: '18px', padding: '15px 30px' }}>
          Login
        </Link>
      </div>
      
      <div className="card" style={{ marginTop: '50px', maxWidth: '800px', margin: '50px auto' }}>
        <h2>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginTop: '30px' }}>
          <div>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📝</div>
            <h3>1. Register</h3>
            <p>Sign up with your skills and location</p>
          </div>
          
          <div>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎁</div>
            <h3>2. Get Credits</h3>
            <p>Receive 10 starter credits to begin</p>
          </div>
          
          <div>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</div>
            <h3>3. Find Services</h3>
            <p>Discover nearby service providers</p>
          </div>
          
          <div>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤝</div>
            <h3>4. Trade Skills</h3>
            <p>Exchange services using credits</p>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto 50px' }}>
        <h2>Popular Categories</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          {['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning', 'Gardening', 'Cooking', 'Tutoring', 'Computer Repair', 'Sewing'].map(cat => (
            <span key={cat} className="category-tag" style={{ fontSize: '14px', padding: '8px 16px' }}>{cat}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
