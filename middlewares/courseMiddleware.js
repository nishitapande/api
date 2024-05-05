const Course = require("../models/courseSchema");

exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCourse = async (req, res, next) => {
  const {
    name,
    instructor,
    description,
    enrollmentStatus,
    thumbnail,
    duration,
    schedule,
    location,
    prerequisities,
    syllabus,
    students,
  } = req.body;

  const newCourse = await Course.create({
    name,
    instructor,
    description,
    enrollmentStatus,
    thumbnail,
    duration,
    schedule,
    location,
    prerequisities,
    syllabus,
    students,
  });
  res.status(200).json(newCourse);
};
