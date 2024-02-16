import mongoose from 'mongoose';

export const CourseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
});
export const Course = mongoose.model('Course', CourseSchema);

export const StudentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  familyName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
});
export const Student = mongoose.model('Student', StudentSchema);

export const ResultSchema = new mongoose.Schema({
  studentName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  courseName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  score: { type: String, required: true },
});
export const Result = mongoose.model('Result', ResultSchema);
