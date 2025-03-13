// controllers/messageController.js
const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.userId;
    if (!receiverId || !content) {
      return res.status(400).json({ message: "Receiver and content are required" });
    }
    const newMessage = new Message({ sender: senderId, receiver: receiverId, content });
    await newMessage.save();
    res.status(201).json({ message: "Message sent", newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get conversation messages between current user and another user
exports.getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.userId;
    if (!otherUserId) {
      return res.status(400).json({ message: "otherUserId is required" });
    }
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get contacts (users that current user has conversed with)
exports.getContacts = async (req, res) => {
    try {
      const currentUserId = req.userId;
  
      // Find all messages where the current user is either sender or receiver
      const messages = await Message.find({
        $or: [{ sender: currentUserId }, { receiver: currentUserId }]
      });
  
      if (!messages.length) {
        return res.status(200).json({ contacts: [] }); // No messages yet
      }
  
      // Collect unique user IDs (excluding the current user)
      const contactIdsSet = new Set();
      messages.forEach(msg => {
        if (msg.sender.toString() !== currentUserId) {
          contactIdsSet.add(msg.sender.toString());
        }
        if (msg.receiver.toString() !== currentUserId) {
          contactIdsSet.add(msg.receiver.toString());
        }
      });
      const contactIds = Array.from(contactIdsSet);
  
      // Retrieve contact user details from the database
      const contacts = await User.find({ _id: { $in: contactIds } })
        .select("_id username email profilePicture");
  
      res.status(200).json({ contacts });
    } catch (error) {
      console.error("Error retrieving contacts:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  
