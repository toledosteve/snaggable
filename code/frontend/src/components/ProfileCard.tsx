const ProfileCard = ({ name, age, image, bio }: any) => {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm mx-auto md:mx-0">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h2 className="text-lg font-semibold">
            {name}, {age}
          </h2>
          <p className="text-sm text-gray-600 mt-2">{bio}</p>
        </div>
        <div className="flex justify-around p-4 border-t">
          <button className="text-red-500 hover:text-red-600 text-2xl">❌</button>
          <button className="text-green-500 hover:text-green-600 text-2xl">✅</button>
        </div>
      </div>
    );
  };
  
  export default ProfileCard;
  