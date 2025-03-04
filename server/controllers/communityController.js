const Community = require('../models/Community');

exports.createCommunity = async (req, res) => {
  try {
    const { name, hairType } = req.body;
    const community = new Community({ name, hairType, members: [] });
    await community.save();
    res.status(201).json(community);
  } catch (error) {
    console.error('Error creating community:', error);
    res.status(500).json({ message: 'Failed to create community' });
  }
};

exports.getCommunities = async (req, res) => {
  try {
    const { hairType } = req.query;
    let communities;
    if (hairType) {
      communities = await Community.find({ hairType });
    } else {
      communities = await Community.find();
    }
    res.json(communities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ message: 'Failed to fetch communities' });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.userId;
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ message: 'Community not found' });
    if (!community.members.includes(userId)) {
      community.members.push(userId);
      await community.save();
    }
    res.json({ message: 'Joined community successfully', community });
  } catch (error) {
    console.error('Error joining community:', error);
    res.status(500).json({ message: 'Failed to join community' });
  }
};
