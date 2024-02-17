import asyncHandler from 'express-async-handler';
import { Course, Result, Student } from './models';

export const getStudents = asyncHandler(async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json({ data: students });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
export const getCourses = asyncHandler(async (req, res) => {
  try {
    const courses = await Course.find({});
    const newCourses = await Promise.all(
      courses.map(async course => {
        const res = {
          courseName: course.courseName,
          studentsAssigned: await Result.countDocuments({
            courseName: course._id,
          }),
        };
        return res;
      }),
    );
    res.status(200).json({ data: newCourses });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
export const getResults = asyncHandler(async (req, res) => {
  try {
    const results = await Result.find({})
      .populate('studentName', ['firstName', 'familyName'])
      .populate('courseName', ['courseName']);

    const newresult = results.map((result: any) => {
      const res = {
        studentName: `${result.studentName.firstName} ${result.studentName.familyName}`,
        courseName: result.courseName.courseName,
        score: result.score,
      };

      return res;
    });
    res.status(200).json({ data: newresult });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export const postStudent = asyncHandler(async (req, res) => {
  try {
    const student = new Student(req.body);
    const error = student.validateSync();
    if (error != null) {
      res.status(500).json({ message: error.message });
      return;
    }
    await student.save();
    res.status(201).json({ data: student });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
export const postCourse = asyncHandler(async (req, res) => {
  try {
    const course = new Course(req.body);
    const error = course.validateSync();
    if (error != null) {
      res.status(400).json({ message: error.message });
      return;
    }
    await course.save();
    res.status(201).json({ data: course });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
export const postResult = asyncHandler(async (req, res) => {
  try {
    const result = new Result(req.body);
    const error = result.validateSync();
    if (error != null) {
      res.status(400).json({ message: error.message });
      return;
    }
    await result.save();
    res.status(201).json({ data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
