// Trust score: the more a user verifies about themselves, the more stars they earn.
// Score is 0-100; stars are 1.0-5.0 in half-star steps (everyone starts with 1 star).

function computeTrust(user) {
  const docs = user.trustDocs || [];
  const hasDoc = (type) => docs.some(d => d.docType === type && d.status !== 'rejected');

  const checklist = [
    {
      key: 'account',
      label: 'Account created',
      points: 10,
      done: true,
      action: null
    },
    {
      key: 'photo',
      label: 'Profile photo',
      points: 10,
      done: !!user.profileImage,
      action: 'profile'
    },
    {
      key: 'phone',
      label: 'Phone number verified',
      points: 15,
      done: !!user.phoneVerified,
      action: 'phone'
    },
    {
      key: 'id',
      label: 'ID verified',
      points: 25,
      done: !!user.verified,
      action: 'id'
    },
    {
      key: 'address',
      label: 'Proof of address',
      points: 15,
      done: hasDoc('address'),
      action: 'address'
    },
    {
      key: 'qualification',
      label: 'Qualification / certificate',
      points: 10,
      done: hasDoc('qualification'),
      action: 'qualification'
    },
    {
      key: 'experience',
      label: 'Work experience added',
      points: 10,
      done: (user.workExperience || []).length > 0,
      action: 'experience'
    },
    {
      key: 'firstJob',
      label: 'First job completed',
      points: 5,
      done: (user.communityStats?.jobsCompleted || 0) > 0,
      action: null
    }
  ];

  const score = checklist.reduce((sum, item) => sum + (item.done ? item.points : 0), 0);
  // 1 star floor; 100 points = 5 stars; half-star resolution
  const stars = Math.max(1, Math.round((score / 100) * 5 * 2) / 2);

  const levels = [
    { min: 90, name: 'Gold Trusted' },
    { min: 65, name: 'Verified Pro' },
    { min: 40, name: 'Trusted Neighbour' },
    { min: 0, name: 'New Member' }
  ];
  const level = levels.find(l => score >= l.min).name;

  return { score, stars, level, checklist };
}

module.exports = { computeTrust };
