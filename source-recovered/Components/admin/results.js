import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import "./results.css";

function Results() {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  const [currentExamId, setCurrentExamId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [testData, setTestData] = useState({
    examName: "",
    examType: "",
    subject: "",
    course: "",
    examDate: "",
    totalMarks: "",
  });

  const fetchCourses = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://amplemindtechnologies.com/api/courses/",
      );
      if (res.data.success) {
        setCourses(res.data.courses || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, []);

  const fetchTests = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://amplemindtechnologies.com/api/tests/",
      );
      if (res.data.success) {
        setTests(res.data.tests || []);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchTests();
  }, [fetchCourses, fetchTests]);

  // Combined Unique Courses Options List
  const courseOptions = useMemo(() => {
    const defaultList = [
      "Java Full Stack",
      "Python Full Stack",
      "MERN Stack",
      "React Development",
      "Data Analytics",
      "UI/UX Design",
    ];
    const fetchedList = courses
      .map((c) => (typeof c === "object" ? c.name || c.title : c))
      .filter(Boolean);

    return Array.from(new Set([...fetchedList, ...defaultList]));
  }, [courses]);

  const handleChange = (e) => {
    setTestData({
      ...testData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setTestData({
      examName: "",
      examType: "",
      subject: "",
      course: "",
      examDate: "",
      totalMarks: "",
    });
  };

  const createExam = async () => {
    try {
      if (
        !testData.examName ||
        !testData.examType ||
        !testData.subject ||
        !testData.course ||
        !testData.examDate ||
        !testData.totalMarks
      ) {
        alert("Please fill all required fields.");
        return;
      }
      setLoading(true);
      const res = await axios.post(
        "https://amplemindtechnologies.com/api/tests/",
        testData,
      );
      if (res.data.success) {
        setCurrentExamId(res.data.test._id);
        setShowForm(false);
        fetchStudentsForExam(res.data.test._id, testData.course);
        fetchTests();
        alert("Exam Created Successfully");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to create exam");
    } finally {
      setLoading(false);
    }
  };

  // Modernized Function to Fetch Students and Populate Existing Marks
  const fetchStudentsForExam = async (examId, courseName) => {
    try {
      // 1. Fetch Students in Course
      const studentRes = await axios.get(
        "https://amplemindtechnologies.com/api/results/course-students",
        {
          params: { course: courseName },
        },
      );

      // 2. Fetch Already Saved Results for this Exam
      let existingResultsMap = {};
      if (examId) {
        try {
          const resRes = await axios.get(
            `https://amplemindtechnologies.com/api/results/exam/${examId}`,
          );
          if (resRes.data.success && Array.isArray(resRes.data.results)) {
            resRes.data.results.forEach((r) => {
              const sId = r.studentId?._id || r.studentId;
              existingResultsMap[sId] = r;
            });
          }
        } catch (e) {
          console.log("No previous results found for exam, starting fresh.");
        }
      }

      if (studentRes.data.success) {
        const data = studentRes.data.students.map((student) => {
          const savedResult = existingResultsMap[student._id];

          return {
            _id: student._id,
            studentId: student._id,
            rollNumber: student.rollNumber || "N/A",
            studentName: student.name,
            email: student.email,
            course: student.course,
            batch: student.batch || "",
            obtainedMarks: savedResult ? String(savedResult.obtainedMarks) : "",
            percentage: savedResult ? savedResult.percentage : 0,
            grade: savedResult ? savedResult.grade : "-",
            remarks: savedResult ? savedResult.remarks || "" : "",
            absent: savedResult ? Boolean(savedResult.isAbsent) : false,
          };
        });
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchExamResults = async (examId) => {
    try {
      const res = await axios.get(
        `https://amplemindtechnologies.com/api/results/exam/${examId}`,
      );
      if (res.data.success) {
        setResults(res.data.results || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to load results");
    }
  };

  const deleteExam = async (id) => {
    if (!window.confirm("Delete this exam and all associated records?")) return;
    try {
      const res = await axios.delete(
        `https://amplemindtechnologies.com/api/tests/${id}`,
      );
      if (res.data.success) {
        alert("Exam Deleted Successfully");
        fetchTests();
        setShowResults(false);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const handleStudentChange = (id, field, value) => {
    const updated = students.map((student) => {
      if (student._id !== id) return student;
      const item = { ...student, [field]: value };

      if (field === "absent" && value === true) {
        item.obtainedMarks = "0";
        item.percentage = 0;
        item.grade = "Absent";
      }

      if (field === "absent" && value === false) {
        item.obtainedMarks = "";
        item.percentage = 0;
        item.grade = "-";
      }

      const marks = parseFloat(item.obtainedMarks || 0);
      const total = parseFloat(testData.totalMarks || 0);

      if (total > 0 && !item.absent) {
        const per = Number(((marks / total) * 100).toFixed(2));
        item.percentage = per;

        if (per >= 90) item.grade = "A+";
        else if (per >= 80) item.grade = "A";
        else if (per >= 70) item.grade = "B+";
        else if (per >= 60) item.grade = "B";
        else if (per >= 50) item.grade = "C";
        else if (per >= 40) item.grade = "D";
        else item.grade = "F";
      }

      return item;
    });

    setStudents(updated);
  };

  const saveResults = async () => {
    try {
      if (!currentExamId) {
        alert("Please create or select an exam.");
        return;
      }

      const payload = {
        results: students.map((student) => ({
          studentId: student.studentId,
          rollNumber: student.rollNumber,
          studentName: student.studentName,
          email: student.email,
          course: student.course,
          batch: student.batch,
          examId: currentExamId,
          examName: testData.examName,
          examType: testData.examType,
          subject: testData.subject,
          examDate: testData.examDate,
          totalMarks: Number(testData.totalMarks),
          obtainedMarks: Number(student.obtainedMarks || 0),
          remarks: student.remarks,
          isAbsent: student.absent,
        })),
      };

      const res = await axios.post(
        "https://amplemindtechnologies.com/api/results/bulk-save",
        payload,
      );

      if (res.data.success) {
        alert("Results Saved Successfully");
        fetchExamResults(currentExamId);
        fetchTests();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Save Failed");
    }
  };

  const deleteResult = async (id) => {
    if (!window.confirm("Delete this result record?")) return;

    try {
      const res = await axios.delete(
        `https://amplemindtechnologies.com/api/results/${id}`,
      );

      if (res.data.success) {
        alert("Result Deleted Successfully");
        fetchExamResults(currentExamId);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  // Fixed Edit Function: Fetches students along with their existing saved scores
  const editResult = (result) => {
    const examId = result.examId?._id || result.examId;
    setCurrentExamId(examId);

    const courseTitle =
      typeof result.course === "object" ? result.course.title : result.course;

    setTestData({
      examName: result.examName,
      examType: result.examType,
      subject: result.subject,
      course: courseTitle,
      examDate: result.examDate,
      totalMarks: result.totalMarks,
    });

    fetchStudentsForExam(examId, courseTitle);
    setShowResults(false);
  };

  const filteredTests = tests.filter(
    (test) =>
      (test.examName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(
        typeof test.course === "object" ? test.course.title : test.course || "",
      )
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (test.subject || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="rm-container">
      {/* Top Header */}
      <div className="rm-header">
        <div className="rm-header-info">
          <span className="rm-badge">ACADEMIC CONTROL PANEL</span>
          <h1 className="rm-title">Exam & Results Management</h1>
          <p className="rm-subtitle">
            Schedule examinations, evaluate student performance and manage
            published results.
          </p>
        </div>

        <div className="rm-header-actions">
          <button
            className={`rm-btn ${showForm ? "rm-btn-secondary" : "rm-btn-primary"}`}
            onClick={() => {
              if (showForm) resetForm();
              setShowForm(!showForm);
            }}
          >
            {showForm ? "✕ Cancel" : "+ Create Exam"}
          </button>
        </div>
      </div>

      {/* Exam Registration Form */}
      {showForm && (
        <div className="rm-card rm-form-card">
          <div className="rm-card-header">
            <h2>Create Examination</h2>
            <p className="rm-card-subtitle">
              Set exam configuration and scheduling details
            </p>
          </div>

          <div className="rm-form-grid">
            <div className="rm-field">
              <label>Exam Name *</label>
              <input
                type="text"
                name="examName"
                className="rm-input"
                placeholder="e.g. Mid-Term Assessment"
                value={testData.examName}
                onChange={handleChange}
              />
            </div>

            <div className="rm-field">
              <label>Exam Type *</label>
              <select
                name="examType"
                className="rm-select"
                value={testData.examType}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="Weekly Test">Weekly Test</option>
                <option value="Monthly Test">Monthly Test</option>
                <option value="Assignment">Assignment</option>
                <option value="Practical">Practical</option>
                <option value="Mock Test">Mock Test</option>
                <option value="Final Exam">Final Exam</option>
              </select>
            </div>

            <div className="rm-field">
              <label>Subject *</label>
              <input
                type="text"
                name="subject"
                className="rm-input"
                placeholder="e.g. Data Structures"
                value={testData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="rm-field">
              <label>Course *</label>
              <select
                name="course"
                className="rm-select"
                value={testData.course}
                onChange={handleChange}
              >
                <option value="">Select Target Course</option>
                {courseOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="rm-field">
              <label>Exam Date *</label>
              <input
                type="date"
                name="examDate"
                className="rm-input"
                value={testData.examDate}
                onChange={handleChange}
              />
            </div>

            <div className="rm-field">
              <label>Total Marks *</label>
              <input
                type="number"
                name="totalMarks"
                className="rm-input"
                placeholder="e.g. 100"
                value={testData.totalMarks}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="rm-form-actions">
            <button
              className="rm-btn rm-btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button
              className="rm-btn rm-btn-success"
              onClick={createExam}
              disabled={loading}
            >
              {loading ? "Creating..." : "Save & Proceed"}
            </button>
          </div>
        </div>
      )}

      {/* Previous Exams Repository */}
      {showHistory && (
        <div className="rm-card rm-table-card">
          <div className="rm-table-header">
            <div>
              <h3>Scheduled Examinations</h3>
              <p className="rm-card-subtitle">
                Manage created examinations and mark entries
              </p>
            </div>

            <div className="rm-header-tools">
              <input
                type="text"
                className="rm-search-input"
                placeholder="Filter exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <span className="rm-info-chip">{filteredTests.length} Exams</span>
            </div>
          </div>

          <div className="rm-table-wrapper">
            <table className="rm-table">
              <thead>
                <tr>
                  <th>Exam Title</th>
                  <th>Subject</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Max Marks</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="rm-empty-td">
                      No examinations found in repository.
                    </td>
                  </tr>
                ) : (
                  filteredTests.map((test) => (
                    <tr key={test._id}>
                      <td>
                        <strong className="rm-student-name">
                          {test.examName}
                        </strong>
                        <div className="rm-subtext">{test.examType}</div>
                      </td>

                      <td>{test.subject}</td>

                      <td>
                        <span className="rm-course-pill">
                          {typeof test.course === "object"
                            ? test.course.title
                            : test.course}
                        </span>
                      </td>

                      <td>{new Date(test.examDate).toLocaleDateString()}</td>

                      <td>
                        <strong>{test.totalMarks}</strong>
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <div className="rm-btn-group">
                          <button
                            className="rm-btn rm-btn-success rm-btn-sm"
                            onClick={() => {
                              setCurrentExamId(test._id);

                              const courseTitle =
                                typeof test.course === "object"
                                  ? test.course.title
                                  : test.course;

                              setTestData({
                                examName: test.examName,
                                examType: test.examType,
                                subject: test.subject,
                                course: courseTitle,
                                examDate: test.examDate,
                                totalMarks: test.totalMarks,
                              });

                              fetchStudentsForExam(test._id, courseTitle);
                              setShowResults(false);
                            }}
                          >
                            Marks Entry
                          </button>

                          <button
                            className="rm-btn rm-btn-info rm-btn-sm"
                            onClick={() => {
                              setCurrentExamId(test._id);
                              fetchExamResults(test._id);
                            }}
                          >
                            View Results
                          </button>

                          <button
                            className="rm-btn rm-btn-danger rm-btn-sm"
                            onClick={() => deleteExam(test._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Marks Entry Sheet */}
      {students.length > 0 && (
        <div className="rm-card rm-table-card rm-highlight-card">
          <div className="rm-table-header">
            <div>
              <h3>Student Gradebook Entry Sheet</h3>
              <p className="rm-card-subtitle">
                <strong>Exam :</strong> {testData.examName} |{" "}
                <strong>Course :</strong> {testData.course} |{" "}
                <strong>Max Marks :</strong> {testData.totalMarks}
              </p>
            </div>

            <span className="rm-info-chip">{students.length} Students</span>
          </div>

          <div className="rm-table-wrapper">
            <table className="rm-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Info</th>
                  <th>Obtained Marks</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Remarks</th>
                  <th style={{ textAlign: "center" }}>Absent</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className={student.absent ? "rm-row-absent" : ""}
                  >
                    <td>
                      <span className="rm-roll-tag">{student.rollNumber}</span>
                    </td>

                    <td>
                      <div className="rm-student-cell">
                        <span className="rm-student-name">
                          {student.studentName}
                        </span>
                        <span className="rm-student-email">
                          {student.email}
                        </span>
                      </div>
                    </td>

                    <td>
                      <input
                        type="number"
                        className="rm-input rm-input-table"
                        min="0"
                        max={testData.totalMarks}
                        value={student.obtainedMarks}
                        disabled={student.absent}
                        placeholder="0"
                        onChange={(e) =>
                          handleStudentChange(
                            student._id,
                            "obtainedMarks",
                            e.target.value,
                          )
                        }
                      />
                    </td>

                    <td>
                      <span className="rm-percentage-text">
                        {student.percentage}%
                      </span>
                    </td>

                    <td>
                      <span
                        className={`rm-grade-badge ${
                          student.grade === "A+" || student.grade === "A"
                            ? "rm-grade-a"
                            : student.grade === "F" ||
                                student.grade === "Absent"
                              ? "rm-grade-f"
                              : "rm-grade-pass"
                        }`}
                      >
                        {student.grade}
                      </span>
                    </td>

                    <td>
                      <input
                        type="text"
                        className="rm-input rm-input-table rm-remarks-input"
                        placeholder="Add remarks..."
                        value={student.remarks}
                        onChange={(e) =>
                          handleStudentChange(
                            student._id,
                            "remarks",
                            e.target.value,
                          )
                        }
                      />
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        className="rm-checkbox"
                        checked={student.absent}
                        onChange={(e) =>
                          handleStudentChange(
                            student._id,
                            "absent",
                            e.target.checked,
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rm-table-footer">
            <button
              className="rm-btn rm-btn-secondary"
              onClick={() => setStudents([])}
            >
              Cancel
            </button>

            <button className="rm-btn rm-btn-success" onClick={saveResults}>
              Save & Publish Results
            </button>
          </div>
        </div>
      )}

      {/* Published Results */}
      {showResults && (
        <div className="rm-card rm-table-card">
          <div className="rm-table-header">
            <div>
              <h3>Published Result Records</h3>
              <p className="rm-card-subtitle">
                Official grade sheet for selected evaluation
              </p>
            </div>

            <button
              className="rm-btn rm-btn-secondary"
              onClick={() => setShowResults(false)}
            >
              Close View
            </button>
          </div>

          <div className="rm-table-wrapper">
            <table className="rm-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="rm-empty-td">
                      No published results found for this exam.
                    </td>
                  </tr>
                ) : (
                  results.map((result) => (
                    <tr key={result._id}>
                      <td>
                        <span className="rm-roll-tag">{result.rollNumber}</span>
                      </td>

                      <td>
                        <strong className="rm-student-name">
                          {result.studentName}
                        </strong>
                      </td>

                      <td>
                        {typeof result.course === "object"
                          ? result.course.title
                          : result.course}
                      </td>

                      <td>
                        <strong>
                          {result.obtainedMarks}/{result.totalMarks}
                        </strong>
                      </td>

                      <td>{result.percentage}%</td>

                      <td>
                        <span className="rm-grade-badge rm-grade-pass">
                          {result.grade}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`rm-status-pill ${result.isAbsent ? "absent" : "present"}`}
                        >
                          {result.isAbsent ? "Absent" : "Present"}
                        </span>
                      </td>

                      <td>{result.remarks || "-"}</td>

                      <td style={{ textAlign: "right" }}>
                        <div className="rm-btn-group">
                          <button
                            className="rm-btn rm-btn-sm rm-btn-secondary"
                            onClick={() => editResult(result)}
                          >
                            Edit
                          </button>

                          <button
                            className="rm-btn rm-btn-sm rm-btn-danger"
                            onClick={() => deleteResult(result._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;
