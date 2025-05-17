const Gig = require('../models/Gig');
const User = require('../models/User');

// Suggest gigs for artisans
exports.getArtisanSuggestions = async (userId) => {
  const artisan = await User.findById(userId);
  
  if (!artisan.preferences.skills || artisan.preferences.skills.length === 0) {
    // Return most popular gigs in location as fallback
    return Gig.find({ 
        location: artisan.preferences.location, 
        status: 'open' 
    }).sort({ views: -1 }).limit(10);
  }


  // Base query: Match skills + location
  const query = {
    'skillsRequired': { $in: artisan.preferences.skills },
    'location': artisan.preferences.location,
    'status': 'open'
  };

  // Boost gigs similar to past applications
  const appliedGigIds = artisan.activityHistory
    .filter(a => a.type === 'gig_applied')
    .map(a => a.gigId);

  const similarGigs = await Gig.find({ 
    _id: { $in: appliedGigIds } 
  }).select('skillsRequired');

  const similarSkills = [...new Set(
    similarGigs.flatMap(g => g.skillsRequired)
  )];

  if (similarSkills.length > 0) {
    query['skillsRequired']['$in'].push(...similarSkills);
  }

  return Gig.find(query).limit(10);
};

// Suggest artisans for clients
exports.getClientSuggestions = async (userId) => {
  const client = await User.findById(userId);
  
  return User.aggregate([
    {
      $match: {
        role: 'artisan',
        'preferences.location': client.preferences.location,
        'rating.average': { $gte: 4 }, // Minimum 4★ rating
      }
    },
    {
        $project: {
            name: 1,
            rating: 1,
            skills: 1,
            responseRate: {
                $cond: {
                    if: { $gt: [{ $size: '$activityHistory' }, 0] },
                    then: {
                        $avg: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$activityHistory",
                                        as: "act",
                                        cond: { $eq: ["$$act.type", "message_response"] }
                                    }
                                },
                                as: "res",
                                in: {
                                    $divide: [
                                        { $subtract: ["$$res.responseTimestamp", "$$res.sentTimestamp"] },
                                        1000 * 60 // convert ms to minutes
                                    ]
                                }
                            }
                        }
                    },
                    else: null
                }
            }
        }
    },
    { $sort: { 'rating.average': -1, responseRate: -1 } },
    { $limit: 10 }
  ]);
};