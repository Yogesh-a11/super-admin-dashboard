import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    isTrial: {
      type: Boolean,
      default: false
    },

    trialEndsAt: {
      type: Date,
      default: null
    },

    isActive: {
      type: Boolean,
      default: false
    },

    price: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    admin: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
      index: true
    },

    employeesCount: {
      type: Number,
      default: 0,
      min: 0
    },

    subscription: {
      type: subscriptionSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true 
  }
);

export default mongoose.model("Company", companySchema);
