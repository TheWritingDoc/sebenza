import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const loadDemoData = () => {
    // Create demo users
    const demoUsers = [
      {
        _id: '1',
        name: 'John the Plumber',
        email: 'john@example.com',
        phone: '0712345678',
        password: 'password123',
        skills: ['Plumbing', 'Carpentry'],
        location: { lat: -26.2041, lng: 28.0473 },
        credits: 15,
        rating: 5
      },
      {
        _id: '2',
        name: 'Maria the Tutor',
        email: 'maria@example.com',
        phone: '0723456789',
        password: 'password123',
        skills: ['Tutoring', 'Cooking'],
        location: { lat: -26.2051, lng: 28.0483 },
        credits: 12,
        rating: 5
      }
    ];
    
    // Create demo services
    const demoServices = [
      {
        _id: 's1',
        providerId: '1',
        providerName: 'John the Plumber',
        title: 'Emergency Plumbing',
        description: 'Fix leaks, blocked drains, burst pipes. Available 24/7!',
        category: 'Plumbing',
        credits: 3,
        location: { lat: -26.2041, lng: 28.0473 }
      },
      {
        _id: 's2',
        providerId: '1',
        providerName: 'John the Plumber',
        title: 'Furniture Repair',
        description: 'Fix broken chairs, tables, cabinets. Quality workmanship.',
        category: 'Carpentry',
        credits: 2,
        location: { lat: -26.2041, lng: 28.0473 }
      },
      {
        _id: 's3',
        providerId: '2',
        providerName: 'Maria the Tutor',
        title: 'Math & Science Tutoring',
        description: 'Grades 8-12. I come to your home. Patient teacher.',
        category: 'Tutoring',
        credits: 2,
        location: { lat: -26.2051, lng: 28.0483 }
      },
      {
        _id: 's4',
        providerId: '2',
        providerName: 'Maria the Tutor',
        title: 'Home Cooking Lessons',
        description: 'Learn to cook healthy meals for your family. 2-hour sessions.',
        category: 'Cooking',
        credits: 2,
        location: { lat: -26.2051, lng: 28.0483 }
      }
    ];
    
    localStorage.setItem('gshop_users', JSON.stringify(demoUsers));
    localStorage.setItem('gshop_services', JSON.stringify(demoServices));
    
    alert('Demo data loaded! You can now log in with:\n\njohn@example.com / password123\nOR\nmaria@example.com / password123');
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>GShop</h1>
        <p className="tagline">Trade Skills, Not Money</p>
        <p className="description">
          Join your community in a moneyless exchange of skills and services. 
          Earn credits by helping others, spend credits to get help.
        </p>
        
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
        
        <div style={{ marginTop: '30px', padding: '20px', background: '#f0f8ff', borderRadius: '8px' }}>
          <p><strong>Want to try it first?</strong></p>
          <button onClick={loadDemoData} className="btn btn-success">
            Load Demo Data
          </button>
          <p style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
            This creates sample users and services so you can explore the app.
          </p>
        </div>
        
        <div className="features">
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <h3>Share Your Skills</h3>
            <p>Offer what you're good at</p>
          </div>
          
          <div className="feature">
            <span className="feature-icon">🤝</span>
            <h3>Help Neighbors</h3>
            <p>Build community connections</p>
          </div>
          
          <div className="feature">
            <span className="feature-icon">⭐</span>
            <h3>Earn Credits</h3>
            <p>Get help when you need it</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
