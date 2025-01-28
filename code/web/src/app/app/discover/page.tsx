import React from "react";
import ProfileCard from "@/components/ProfileCard";

const DiscoverPage = () => {
  const profiles = [
    {
      name: "Sam",
      age: 30,
      image: "/sample-profile.jpg",
      bio: "Supply Chain Manager at Chemical. Loves hiking and craft beer.",
    },
    {
      name: "Jessica",
      age: 27,
      image: "/sample-profile-2.jpg",
      bio: "Dog mom. Coffee enthusiast. Looking for meaningful connections.",
    },
  ];

  return (
    <div className="space-y-6">
      {profiles.map((profile, idx) => (
        <ProfileCard key={idx} {...profile} />
      ))}
    </div>
  );
};

export default DiscoverPage;
