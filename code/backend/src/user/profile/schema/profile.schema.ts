import { Schema, Document, model, Types } from 'mongoose';

export interface UserProfile extends Document {
  user: Types.ObjectId; 
  aboutMe: string;

  vitals: {
    dob: { day: number; month: string; year: number };
    height: number;
    exercise: string;
    pets: { value: string; visibility: string };
    children: { value: string; visibility: string };
    familyPlans: { value: string; visibility: string };
    zodiac: { value: string; visibility: string };
    location: { lat: number; lon: number } | null;
  };

  culturalInfo: {
    tribalStatus: string;
    nameOfTribe: string;
    traditionalSkills: string[];
    language: { value: string[]; visibility: string };
    clan: { value: string; visibility: string };
    advocacy: { value: string[]; visibility: string };
    beliefs: { value: string[]; visibility: string };
  };

  virtues: {
    jobTitle: { value: string; visibility: string };
    education: { value: string; visibility: string };
    politics: { value: string; visibility: string };
    intentions: { value: string; visibility: string };
    relationshipType: { value: string[]; visibility: string };
  };

  vices: {
    smoking: { value: string; visibility: string };
    drinking: { value: string; visibility: string };
    marijuana: { value: string; visibility: string };
  };

  identity: {
    gender: string;
    showGender: boolean;
    interestedIn: string[];
  };

  photos: string[];
  prompts: { question: string; answer: string }[];
}

export const UserProfileSchema = new Schema<UserProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    aboutMe: { type: String, default: '' },

    vitals: {
      dob: {
        day: { type: Number, required: true },
        month: { type: String, required: true },
        year: { type: Number, required: true },
      },
      height: { type: Number, required: true },
      exercise: { type: String, default: '' },
      pets: {
        value: { type: String, default: '' },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
      children: {
        value: { type: String, default: '' },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
      familyPlans: {
        value: { type: String, default: '' },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
      zodiac: {
        value: { type: String, default: '' },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
      location: {
        lat: { type: Number, default: null },
        lon: { type: Number, default: null },
      },
    },

    culturalInfo: {
      tribalStatus: { type: String, default: '' },
      nameOfTribe: { type: String, default: '' },
      traditionalSkills: { type: [String], default: [] },
      language: {
        value: { type: [String], default: [] },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
      clan: {
        value: { type: String, default: '' },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
      advocacy: {
        value: { type: [String], default: [] },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
      beliefs: {
        value: { type: [String], default: [] },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
    },

    virtues: {
      jobTitle: {
        value: { type: String, default: '' },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
      education: {
        value: { type: String, default: '' },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
      politics: {
        value: { type: String, default: '' },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
      intentions: {
        value: { type: String, default: '' },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
      relationshipType: {
        value: { type: [String], default: [] },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
    },

    vices: {
      smoking: {
        value: { type: String, default: '' },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
      drinking: {
        value: { type: String, default: '' },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
      marijuana: {
        value: { type: String, default: '' },
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
      },
    },

    identity: {
      gender: { type: String, required: true },
      showGender: { type: Boolean, default: true },
      interestedIn: { type: [String], required: true },
    },

    photos: { type: [String], default: [] },
    prompts: {
      type: [
        {
          question: { type: String, required: true },
          answer: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

UserProfileSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

UserProfileSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const UserProfileModel = model<UserProfile>('UserProfile', UserProfileSchema);
