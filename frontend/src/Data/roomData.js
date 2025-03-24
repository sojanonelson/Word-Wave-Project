export const roomData = {
    title: "AI and ML",
    code: "ML-2024-ABC",
    host: {
      name: "Sarah Chen",
      image:
        "https://pyxis.nymag.com/v1/imgs/da7/eff/4bddc9b8157b45946fa166f785334a6cb4-taylor-swift.1x.rsquare.w1400.jpg",
    },
    currentUser: {
      name: "Sarah Chen",
      isHost: true,
    },
    members: [
      {
        id: 1,
        name: "Sarah Chen",
        image:
          "https://pyxis.nymag.com/v1/imgs/da7/eff/4bddc9b8157b45946fa166f785334a6cb4-taylor-swift.1x.rsquare.w1400.jpg",
        isHost: true,
        isOnline: true,
      },
      {
        id: 2,
        name: "John Smith",
        image: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?fm=jpg",
        isOnline: true,
      },
      {
        id: 3,
        name: "Maria Garcia",
        image:
          "https://www.catholicsingles.com/wp-content/uploads/2020/06/blog-header-3.png",
        isOnline: false,
      },
      {
        id: 4,
        name: "Alex Johnson",
        image:
          "https://i.pinimg.com/736x/59/37/5f/59375f2046d3b594d59039e8ffbf485a.jpg",
        isOnline: true,
      },
    ],
    memberMessages: [
      {
        id: 1,
        sender: "John Smith",
        content: "Hey everyone! Ready to study?",
        timestamp: "10:30 AM",
      },
      {
        id: 2,
        sender: "Maria Garcia",
        content: "Yes, let's focus on chapter 5 today",
        timestamp: "10:31 AM",
      },
      {
        id: 3,
        sender: "Sarah Chen",
        content:
          "Great idea! We can use the AI to help us understand complex concepts.",
        timestamp: "10:32 AM",
      },
    ],
  };