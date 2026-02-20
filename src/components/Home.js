import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const loadDemoData = () => {
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '50px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{fontSize: '48px', marginBottom: '10px', color: '#667eea'}}>GShop</h1>
        <p style={{fontSize: '24px', color: '#666', marginBottom: '20px'}}>Trade Skills, Not Money</p>
        
        <p style={{color: '#555', marginBottom: '30px', lineHeight: '1.6'}}>
          Join your community in a moneyless exchange of skills and services. 
          Earn credits by helping others, spend credits to get help.
        </p>
        
        <div style={{display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px'}}>
          <Link to="/register" style={{
            padding: '15px 30px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>Get Started</Link>
          
          
          <Link to="/login" style={{
            padding: '15px 30px',
            background: '#f0f0f0',
            color: '#333',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>Login</Link>
        </div>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          background: '#f0f8ff', 
          borderRadius: '12px',
          border: '2px solid #667eea'
        }}>
          <p style={{fontWeight: 'bold', marginBottom: '10px'}}>Want to try it first?</p>
          <button onClick={loadDemoData} style={{
            padding: '12px 24px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            Load Demo Data
          </button>
          <p style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
            Creates sample users and services so you can explore immediately.
          </p>
        </div>
        
        <div style={{display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '40px'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '40px', marginBottom: '10px'}}>🎯</div>
            <h3 style={{marginBottom: '5px'}}>Share Skills</h3>
            <p style={{color: '#666', fontSize: '14px'}}>Offer what you're good at</p>
          </div>
          
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '40px', marginBottom: '10px'}}>🤝</div>
            <h3 style={{marginBottom: '5px'}}>Help Others</h3>
            <p style={{color: '#666', fontSize: '14px'}}>Build community</p>
          </div>
          
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '40px', marginBottom: '10px'}}>⭐</div>
            <h3 style={{marginBottom: '5px'}}>Earn Credits</h3>
            <p style={{color: '#666', fontSize: '14px'}}>Get help when needed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
