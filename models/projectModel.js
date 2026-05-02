const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project must have a title'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Project must have a description'],
      trim: true,
    },

    category: {
      type: String,
      required: [true, 'Project must have a category'],
      trim: true,
    },

    skillsRequired: [String],

    budget: {
      type: Number,
      required: [true, 'Project must have a budget'],
      min: [1, 'Budget must be greater than 0'],
    },

    deadline: {
      type: Date,
      required: [true, 'Project must have a deadline'],
      validate: {
        function(val){
            return val > Date.now()
        },
        message: 'Deadline Must be in the future' 
      }
    },

    client: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Project must belong to a client'],
    },

    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open',
    },
  },
  { timestamps: true }
);

projectSchema.pre(/^find/, function () {
  this.populate({
    path: 'client',
    select: 'name email',
  });
});



module.exports = mongoose.model('Project', projectSchema);